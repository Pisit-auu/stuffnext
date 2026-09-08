"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../../component/ui/Button";
import { FilterSelect, SearchField, TextField } from "../../component/ui/Field";
import { PageShell, PageHeader, Toolbar } from "../../component/ui/Layout";
import {
  CodeTag,
  DataTable,
  EmptyState,
  ErrorState,
  StatusChip,
  type Column,
} from "../../component/ui/Data";
import { IconArrowRight, IconSheet } from "../../component/ui/icons";
import { useToast } from "../../component/ui/Toast";
import { exportSheet } from "@/lib/excel";
import { errorMessage, formatDate, formatDateForSheet, statusLabel } from "@/lib/format";
import type { AssetLocation, Borrow, Status } from "@/lib/types";

type BorrowRow = Borrow & { assetId?: string; borrowLocationId?: string };

export default function BorrowAllPage() {
  const toast = useToast();
  const [history, setHistory] = useState<BorrowRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [state, setState] = useState<"all" | "open" | "closed">("all");
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<BorrowRow[]>("/api/borrow/");
      setHistory(res.data);
    } catch (err) {
      setError(errorMessage(err, "โหลดประวัติการยืมไม่สำเร็จ"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return history.filter((borrow) => {
      const matchesTerm =
        !term ||
        (borrow.user?.name ?? "").toLowerCase().includes(term) ||
        (borrow.asset?.name ?? "").toLowerCase().includes(term) ||
        (borrow.asset?.assetid ?? "").toLowerCase().includes(term) ||
        (borrow.borrowLocation?.namelocation ?? "").toLowerCase().includes(term) ||
        (borrow.returnLocationId ?? "").toLowerCase().includes(term);

      const borrowDate = new Date(borrow.createdAt).setHours(0, 0, 0, 0);
      const withinRange =
        (startDate ? borrowDate >= new Date(startDate).setHours(0, 0, 0, 0) : true) &&
        (endDate ? borrowDate <= new Date(endDate).setHours(23, 59, 59, 999) : true);

      const matchesState =
        state === "all"
          ? true
          : state === "open"
            ? borrow.ReturnStatus !== "c"
            : borrow.ReturnStatus === "c";

      return matchesTerm && withinRange && matchesState;
    });
  }, [history, searchTerm, startDate, endDate, state]);

  const openCount = useMemo(
    () => history.filter((b) => b.ReturnStatus !== "c").length,
    [history],
  );
  const waitingCheck = useMemo(
    () => history.filter((b) => b.Borrowstatus !== "c").length,
    [history],
  );

  const updateBorrowStatus = async (row: BorrowRow, Borrowstatus: Status) => {
    setBusyId(row.id);
    try {
      await axios.put(`/api/borrow/${row.id}`, {
        id: row.id,
        Borrowstatus,
        ReturnStatus: row.ReturnStatus,
        dayReturn: row.dayReturn,
      });
      setHistory((prev) =>
        prev.map((b) => (b.id === row.id ? { ...b, Borrowstatus } : b)),
      );
      toast.success(
        Borrowstatus === "c"
          ? "บันทึกว่าตรวจสอบการยืมแล้ว"
          : "เปลี่ยนกลับเป็นรอตรวจสอบการยืม",
      );
    } catch (err) {
      toast.error(errorMessage(err, "อัปเดตสถานะการยืมไม่สำเร็จ"));
    } finally {
      setBusyId(null);
    }
  };

  /**
   * ยืนยันการคืน = ย้ายของกลับห้องเจ้าของเดิม
   * ถ้าเปลี่ยนกลับเป็นรอตรวจสอบ ก็ย้ายกลับไปห้องผู้ยืมตามเดิม
   */
  const updateReturnStatus = async (row: BorrowRow, ReturnStatus: Status) => {
    setBusyId(row.id);
    try {
      await axios.put(`/api/borrow/${row.id}`, {
        id: row.id,
        Borrowstatus: row.Borrowstatus,
        ReturnStatus,
        dayReturn: row.dayReturn,
      });
      setHistory((prev) =>
        prev.map((b) => (b.id === row.id ? { ...b, ReturnStatus } : b)),
      );

      const { data: borrow } = await axios.get<BorrowRow>(`/api/borrow/${row.id}`);
      const currentRoom =
        ReturnStatus === "w" ? borrow.returnLocationId : borrow.borrowLocationId!;
      const targetRoom =
        ReturnStatus === "w" ? borrow.borrowLocationId! : borrow.returnLocationId;

      const [targetRes, currentRes] = await Promise.all([
        axios.get<AssetLocation[]>(`/api/assetlocationroom?location=${targetRoom}`),
        axios.get<AssetLocation[]>(`/api/assetlocationroom?location=${currentRoom}`),
      ]);

      const inCurrentRoom = currentRes.data.find(
        (item) => item.asset.assetid === borrow.assetId,
      );
      if (!inCurrentRoom) {
        toast.error("ครุภัณฑ์ถูกย้ายไปห้องอื่นแล้ว หรือไม่มีอยู่ในห้องนั้น ยอดจึงยังไม่ถูกย้าย");
        return;
      }

      const amount = Number(borrow.valueBorrow);
      const existingAtTarget = targetRes.data.find(
        (item) => item.assetId === borrow.assetId,
      );

      if (existingAtTarget) {
        await axios.put(`/api/assetlocation/${existingAtTarget.id}`, {
          inRoomavailableValue: existingAtTarget.inRoomavailableValue + amount,
          inRoomaunavailableValue: existingAtTarget.inRoomaunavailableValue,
        });
      } else {
        await axios.post("/api/assetlocation", {
          assetId: borrow.assetId,
          locationId: targetRoom,
          inRoomavailableValue: 0,
          inRoomaunavailableValue: 0,
        });
        const created = (
          await axios.get<AssetLocation[]>(`/api/assetlocationroom?location=${targetRoom}`)
        ).data.find((item) => item.assetId === borrow.assetId);
        if (!created) throw new Error("ไม่พบช่องเก็บของในห้องปลายทาง");
        await axios.put(`/api/assetlocation/${created.id}`, {
          inRoomavailableValue: amount,
          inRoomaunavailableValue: 0,
        });
      }

      await axios.put(`/api/assetlocation/${inCurrentRoom.id}`, {
        inRoomavailableValue: inCurrentRoom.inRoomavailableValue - amount,
        inRoomaunavailableValue: inCurrentRoom.inRoomaunavailableValue,
      });

      toast.success(
        ReturnStatus === "c"
          ? `รับคืนแล้ว ของกลับไปที่ห้อง ${targetRoom}`
          : `เปลี่ยนกลับเป็นรอตรวจสอบ ของกลับไปที่ห้อง ${targetRoom}`,
      );
    } catch (err) {
      toast.error(errorMessage(err, "อัปเดตสถานะการคืนไม่สำเร็จ"));
    } finally {
      setBusyId(null);
    }
  };

  const handleDownload = async () => {
    try {
      await exportSheet<BorrowRow>({
        filename: "การยืมทั้งหมด",
        sheetName: "ประวัติการยืม",
        rows: filtered,
        columns: [
          { header: "ผู้ยืม", width: 20, value: (b) => b.user?.name },
          { header: "ครุภัณฑ์", width: 30, value: (b) => b.asset?.name },
          { header: "รหัสครุภัณฑ์", width: 18, value: (b) => b.asset?.assetid },
          { header: "จำนวนที่ยืม", width: 14, value: (b) => b.valueBorrow },
          { header: "ยืมไปที่ห้อง", width: 20, value: (b) => b.borrowLocation?.namelocation },
          { header: "ยืมจากห้อง", width: 20, value: (b) => b.returnLocationId },
          { header: "สถานะการยืม", width: 18, value: (b) => statusLabel(b.Borrowstatus) },
          { header: "สถานะการคืน", width: 18, value: (b) => statusLabel(b.ReturnStatus) },
          { header: "วันที่ยืม", width: 18, value: (b) => formatDateForSheet(b.createdAt) },
          { header: "วันที่คืน", width: 18, value: (b) => formatDateForSheet(b.dayReturn) },
          { header: "หมายเหตุ", width: 30, value: (b) => b.note },
        ],
      });
      toast.success(`บันทึกไฟล์ Excel แล้ว ${filtered.length} รายการ`);
    } catch (err) {
      toast.error(errorMessage(err, "สร้างไฟล์ Excel ไม่สำเร็จ"));
    }
  };

  const columns: Column<BorrowRow>[] = [
    {
      key: "asset",
      header: "ครุภัณฑ์ / ผู้ยืม",
      primary: true,
      render: (b) => (
        <div className="min-w-0">
          <CodeTag>{b.asset?.assetid}</CodeTag>
          <Link
            href={`/allasset/${encodeURIComponent(b.asset?.assetid ?? "")}`}
            className="mt-1.5 block font-medium leading-snug text-ink underline decoration-edge-strong underline-offset-2 hover:decoration-ink"
          >
            {b.asset?.name}
          </Link>
          <p className="text-meta text-ink-2">
            {b.user?.name || "ไม่ทราบผู้ยืม"} · {b.valueBorrow} ชิ้น
          </p>
        </div>
      ),
    },
    {
      key: "route",
      header: "เส้นทาง",
      width: "15rem",
      render: (b) => (
        <span className="inline-flex flex-wrap items-center gap-1.5 text-ink-2">
          <Link
            href={`/location/${encodeURIComponent(b.returnLocationId ?? "")}`}
            className="hover:text-ink hover:underline"
          >
            {b.returnLocationId || "—"}
          </Link>
          <IconArrowRight size={14} className="text-ink-3" />
          <Link
            href={`/location/${encodeURIComponent(b.borrowLocation?.namelocation ?? "")}`}
            className="text-ink hover:underline"
          >
            {b.borrowLocation?.namelocation || "—"}
          </Link>
        </span>
      ),
    },
    {
      key: "dates",
      header: "วันที่",
      width: "11rem",
      render: (b) => (
        <div className="text-ink-2">
          <div>ยืม {formatDate(b.createdAt)}</div>
          <div className="text-meta text-ink-3">
            {b.dayReturn ? `แจ้งคืน ${formatDate(b.dayReturn)}` : "ยังไม่ได้คืน"}
          </div>
        </div>
      ),
    },
    {
      key: "borrowStatus",
      header: "ตรวจสอบการยืม",
      width: "12rem",
      render: (b) => (
        <FilterSelect
          label={`สถานะการยืมของ ${b.asset?.name ?? ""}`}
          value={b.Borrowstatus}
          disabled={b.ReturnStatus === "c" || busyId === b.id}
          onChange={(e) => updateBorrowStatus(b, e.target.value as Status)}
          className="w-full"
        >
          <option value="w">รอตรวจสอบ</option>
          <option value="c">ตรวจสอบแล้ว</option>
        </FilterSelect>
      ),
    },
    {
      key: "returnStatus",
      header: "ตรวจสอบการคืน",
      width: "12rem",
      render: (b) => (
        <div>
          <FilterSelect
            label={`สถานะการคืนของ ${b.asset?.name ?? ""}`}
            value={b.ReturnStatus}
            disabled={!(b.dayReturn && b.Borrowstatus === "c") || busyId === b.id}
            onChange={(e) => updateReturnStatus(b, e.target.value as Status)}
            className="w-full"
          >
            <option value="w">รอตรวจสอบ</option>
            <option value="c">ตรวจสอบแล้ว</option>
          </FilterSelect>
          {!(b.dayReturn && b.Borrowstatus === "c") && (
            <p className="mt-1 text-meta text-ink-3">
              {b.Borrowstatus !== "c"
                ? "ตรวจสอบการยืมก่อน"
                : "รอผู้ยืมกดแจ้งคืน"}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "note",
      header: "หมายเหตุ",
      hideOnCard: true,
      render: (b) => <span className="text-ink-2">{b.note?.trim() ? b.note : "—"}</span>,
    },
  ];

  return (
    <PageShell>
      <PageHeader
        trail={[
          { label: "หน้าแรก", href: "/" },
          { label: "จัดการทะเบียน", href: "/admin" },
          { label: "ประวัติการยืมทั้งหมด" },
        ]}
        title="ประวัติการยืมทั้งหมด"
        meta={
          loading ? (
            "กำลังโหลด..."
          ) : (
            <span className="flex flex-wrap items-center gap-2">
              <span>{history.length.toLocaleString("th-TH")} รายการ</span>
              <StatusChip tone="tag">ยังไม่ปิด {openCount}</StatusChip>
              <StatusChip tone="neutral">รอตรวจสอบการยืม {waitingCheck}</StatusChip>
            </span>
          )
        }
        actions={
          <Button
            onClick={handleDownload}
            icon={<IconSheet size={16} />}
            disabled={loading || filtered.length === 0}
          >
            ดาวน์โหลด Excel
          </Button>
        }
      />

      <Toolbar>
        <SearchField
          label="ค้นหาผู้ยืม ครุภัณฑ์ หรือห้อง"
          placeholder="ค้นหาผู้ยืม ครุภัณฑ์ หรือห้อง..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-72"
        />
        <FilterSelect
          label="กรองตามสถานะ"
          value={state}
          onChange={(e) => setState(e.target.value as typeof state)}
          className="w-full sm:w-44"
        >
          <option value="all">ทุกสถานะ</option>
          <option value="open">ยังไม่ปิดรายการ</option>
          <option value="closed">ปิดรายการแล้ว</option>
        </FilterSelect>
        <div className="flex flex-wrap items-end gap-2">
          <TextField
            label="ยืมตั้งแต่วันที่"
            type="date"
            hint={startDate ? formatDate(startDate) : "ไม่จำกัด"}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="sm:w-44"
          />
          <TextField
            label="ถึงวันที่"
            type="date"
            hint={endDate ? formatDate(endDate) : "ไม่จำกัด"}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="sm:w-44"
          />
        </div>
      </Toolbar>

      {error ? (
        <ErrorState
          title="โหลดข้อมูลไม่สำเร็จ"
          description={error}
          action={
            <Button variant="primary" onClick={load}>
              ลองอีกครั้ง
            </Button>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          rows={filtered}
          rowKey={(b) => b.id}
          loading={loading}
          caption="รายการยืมของผู้ใช้ทุกคน"
          empty={
            history.length === 0 ? (
              <EmptyState
                title="ยังไม่มีรายการยืมในระบบ"
                description="เมื่อมีผู้ใช้ยืมของ รายการจะมาแสดงที่นี่"
              />
            ) : (
              <EmptyState
                title="ไม่พบรายการที่ตรงกับที่ค้นหา"
                action={
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setStartDate("");
                      setEndDate("");
                      setState("all");
                    }}
                  >
                    ล้างตัวกรอง
                  </Button>
                }
              />
            )
          }
        />
      )}
    </PageShell>
  );
}
