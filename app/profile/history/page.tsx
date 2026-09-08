"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button, ButtonLink } from "../../component/ui/Button";
import { SearchField, TextField } from "../../component/ui/Field";
import { PageShell, PageHeader, Toolbar } from "../../component/ui/Layout";
import {
  CodeTag,
  DataTable,
  EmptyState,
  ErrorState,
  StatusChip,
  type Column,
} from "../../component/ui/Data";
import { ConfirmDialog } from "../../component/ui/Modal";
import {
  IconArrowRight,
  IconCheck,
  IconReturn,
  IconSheet,
  IconTrash,
} from "../../component/ui/icons";
import { useToast } from "../../component/ui/Toast";
import { exportSheet } from "@/lib/excel";
import { errorMessage, formatDate, formatDateForSheet, statusLabel } from "@/lib/format";
import type { AssetLocation, Borrow } from "@/lib/types";

export default function UserBorrowHistory() {
  const { data: session, status } = useSession();
  const toast = useToast();

  const [history, setHistory] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [pendingCancel, setPendingCancel] = useState<Borrow | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const load = async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<Borrow[]>(`/api/borrow/userid/${session.user.id}`);
      setHistory(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(errorMessage(err, "โหลดประวัติการยืมไม่สำเร็จ"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") load();
    if (status === "unauthenticated") setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session?.user?.id]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return history.filter((borrow) => {
      const borrowDate = new Date(borrow.createdAt).setHours(0, 0, 0, 0);
      const withinRange =
        (startDate ? borrowDate >= new Date(startDate).setHours(0, 0, 0, 0) : true) &&
        (endDate ? borrowDate <= new Date(endDate).setHours(23, 59, 59, 999) : true);
      const matchesTerm =
        !term ||
        (borrow.asset?.name ?? "").toLowerCase().includes(term) ||
        (borrow.asset?.assetid ?? "").toLowerCase().includes(term) ||
        (borrow.borrowLocation?.namelocation ?? "").toLowerCase().includes(term) ||
        (borrow.returnLocationId ?? "").toLowerCase().includes(term);
      return withinRange && matchesTerm;
    });
  }, [history, startDate, endDate, searchTerm]);

  const outstanding = useMemo(
    () => history.filter((b) => b.ReturnStatus !== "c").length,
    [history],
  );

  /** บัญชีผู้ใช้ต้องยังอยู่จริง มิฉะนั้นเซสชันนี้ใช้ทำรายการต่อไม่ได้ */
  const assertUserExists = async () => {
    try {
      const res = await axios.get(`/api/auth/signup/${session?.user?.username}`);
      if (!res.data) throw new Error("no user");
      return true;
    } catch {
      toast.error("ไม่พบบัญชีผู้ใช้นี้แล้ว ระบบจะออกจากระบบให้");
      signOut({ callbackUrl: "/login" });
      return false;
    }
  };

  /** ห้องปลายทางของการคืนต้องยังมีอยู่ ไม่งั้นของจะหายระหว่างทาง */
  const assertLocationExists = async (name: string) => {
    try {
      await axios.get(`/api/location/${name}`);
      return true;
    } catch {
      toast.error(`ไม่พบห้อง ${name} ในระบบแล้ว กรุณาแจ้งแอดมินก่อนทำรายการนี้`);
      return false;
    }
  };

  const handleReturn = async (borrow: Borrow) => {
    setBusyId(borrow.id);
    try {
      if (!(await assertUserExists())) return;
      const current = await axios.get<Borrow>(`/api/borrow/${borrow.id}`);
      if (!(await assertLocationExists(current.data.returnLocationId))) return;

      const dayReturn = new Date().toISOString();
      const response = await axios.put(`/api/borrow/${borrow.id}`, {
        id: borrow.id,
        dayReturn,
      });

      if (response.status === 200) {
        setHistory((prev) =>
          prev.map((b) => (b.id === borrow.id ? { ...b, dayReturn } : b)),
        );
        toast.success("แจ้งคืนแล้ว สถานะจะเปลี่ยนเมื่อแอดมินตรวจสอบเสร็จ");
      }
    } catch (err) {
      toast.error(errorMessage(err, "แจ้งคืนไม่สำเร็จ"));
    } finally {
      setBusyId(null);
    }
  };

  const handleCancelReturn = async (borrow: Borrow) => {
    setBusyId(borrow.id);
    try {
      if (!(await assertUserExists())) return;
      const current = await axios.get<Borrow>(`/api/borrow/${borrow.id}`);
      if (current.data.ReturnStatus === "c") {
        toast.error("แอดมินตรวจสอบการคืนแล้ว ยกเลิกไม่ได้");
        await load();
        return;
      }
      if (!(await assertLocationExists(current.data.returnLocationId))) return;

      const response = await axios.put(`/api/borrow/${borrow.id}`, {
        id: borrow.id,
        dayReturn: null,
      });

      if (response.status === 200) {
        setHistory((prev) =>
          prev.map((b) => (b.id === borrow.id ? { ...b, dayReturn: null } : b)),
        );
        toast.info("ยกเลิกการแจ้งคืนแล้ว");
      }
    } catch (err) {
      toast.error(errorMessage(err, "ยกเลิกการแจ้งคืนไม่สำเร็จ"));
    } finally {
      setBusyId(null);
    }
  };

  /** ยกเลิกรายการยืม = ย้ายของกลับห้องเดิม แล้วลบรายการทิ้ง */
  const confirmCancelBorrow = async () => {
    if (!pendingCancel) return;
    setCancelling(true);
    try {
      if (!(await assertUserExists())) return;

      const { data: borrow } = await axios.get<
        Borrow & { assetId: string; borrowLocationId: string }
      >(`/api/borrow/${pendingCancel.id}`);

      if (borrow.ReturnStatus === "c") {
        toast.error("แอดมินตรวจสอบแล้ว ยกเลิกรายการนี้ไม่ได้");
        setPendingCancel(null);
        await load();
        return;
      }
      if (!(await assertLocationExists(borrow.returnLocationId))) return;

      const currentRoom = borrow.borrowLocationId; // ห้องที่ของอยู่ตอนนี้
      const originRoom = borrow.returnLocationId; // ห้องเจ้าของเดิม

      const [originRes, currentRes] = await Promise.all([
        axios.get<AssetLocation[]>(`/api/assetlocationroom?location=${originRoom}`),
        axios.get<AssetLocation[]>(`/api/assetlocationroom?location=${currentRoom}`),
      ]);

      const inCurrentRoom = currentRes.data.find(
        (item) => item.asset.assetid === borrow.assetId,
      );
      if (!inCurrentRoom) {
        toast.error("ครุภัณฑ์ที่ยืมมาถูกย้ายไปห้องอื่นแล้ว หรือไม่มีอยู่ในห้องนี้");
        return;
      }

      const amount = Number(borrow.valueBorrow);
      const existingAtOrigin = originRes.data.find(
        (item) => item.assetId === borrow.assetId,
      );

      if (existingAtOrigin) {
        await axios.put(`/api/assetlocation/${existingAtOrigin.id}`, {
          inRoomavailableValue: existingAtOrigin.inRoomavailableValue + amount,
          inRoomaunavailableValue: existingAtOrigin.inRoomaunavailableValue,
        });
      } else {
        await axios.post("/api/assetlocation", {
          assetId: borrow.assetId,
          locationId: originRoom,
          inRoomavailableValue: 0,
          inRoomaunavailableValue: 0,
        });
        const created = (
          await axios.get<AssetLocation[]>(`/api/assetlocationroom?location=${originRoom}`)
        ).data.find((item) => item.assetId === borrow.assetId);
        if (!created) throw new Error("ไม่พบช่องเก็บของในห้องเดิม");
        await axios.put(`/api/assetlocation/${created.id}`, {
          inRoomavailableValue: amount,
          inRoomaunavailableValue: 0,
        });
      }

      await axios.put(`/api/assetlocation/${inCurrentRoom.id}`, {
        inRoomavailableValue: inCurrentRoom.inRoomavailableValue - amount,
        inRoomaunavailableValue: inCurrentRoom.inRoomaunavailableValue,
      });

      await axios.delete(`/api/borrow/${pendingCancel.id}`);

      toast.success("ยกเลิกรายการยืมและคืนของกลับห้องเดิมแล้ว");
      setPendingCancel(null);
      await load();
    } catch (err) {
      toast.error(errorMessage(err, "ยกเลิกรายการไม่สำเร็จ"));
    } finally {
      setCancelling(false);
    }
  };

  const handleDownload = async () => {
    try {
      await exportSheet<Borrow>({
        filename: `การยืมของ ${session?.user?.name || session?.user?.username || "ผู้ใช้"}`,
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

  const columns: Column<Borrow>[] = [
    {
      key: "asset",
      header: "ครุภัณฑ์",
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
          <p className="font-mono text-meta text-ink-2">จำนวน {b.valueBorrow} ชิ้น</p>
        </div>
      ),
    },
    {
      key: "route",
      header: "เส้นทาง",
      width: "16rem",
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
      key: "status",
      header: "สถานะ",
      width: "13rem",
      render: (b) => (
        <div className="flex flex-col items-start gap-1">
          {b.ReturnStatus === "c" ? (
            <StatusChip tone="stock" icon={<IconCheck size={13} />}>
              คืนเรียบร้อยแล้ว
            </StatusChip>
          ) : b.dayReturn ? (
            <StatusChip tone="tag">แจ้งคืนแล้ว รอแอดมินตรวจสอบ</StatusChip>
          ) : (
            <StatusChip tone="tag">กำลังยืมอยู่</StatusChip>
          )}
          <span className="text-meta text-ink-3">
            การยืม: {statusLabel(b.Borrowstatus)}
          </span>
        </div>
      ),
    },
    {
      key: "dates",
      header: "วันที่",
      width: "12rem",
      render: (b) => (
        <div className="text-ink-2">
          <div>ยืม {formatDate(b.createdAt)}</div>
          <div className="text-meta text-ink-3">
            {b.dayReturn ? `คืน ${formatDate(b.dayReturn)}` : "ยังไม่ได้คืน"}
          </div>
        </div>
      ),
    },
    {
      key: "note",
      header: "หมายเหตุ",
      hideOnCard: true,
      render: (b) => (
        <span className="text-ink-2">{b.note?.trim() ? b.note : "—"}</span>
      ),
    },
    {
      key: "action",
      header: "ดำเนินการ",
      align: "right",
      width: "13rem",
      actions: true,
      render: (b) => (
        <div className="flex flex-wrap justify-end gap-2 max-md:w-full">
          {b.ReturnStatus !== "c" && !b.dayReturn && (
            <Button
              size="sm"
              variant="return"
              icon={<IconReturn size={15} />}
              loading={busyId === b.id}
              onClick={() => handleReturn(b)}
              className="max-md:flex-1"
            >
              แจ้งคืน
            </Button>
          )}
          {b.ReturnStatus !== "c" && b.dayReturn && (
            <Button
              size="sm"
              loading={busyId === b.id}
              onClick={() => handleCancelReturn(b)}
              className="max-md:flex-1"
            >
              ยกเลิกการแจ้งคืน
            </Button>
          )}
          {b.Borrowstatus !== "c" && b.ReturnStatus !== "c" && (
            <Button
              size="sm"
              variant="danger"
              icon={<IconTrash size={15} />}
              onClick={() => setPendingCancel(b)}
            >
              ยกเลิกการยืม
            </Button>
          )}
          {b.ReturnStatus === "c" && (
            <span className="text-meta text-ink-3">ปิดรายการแล้ว</span>
          )}
        </div>
      ),
    },
  ];

  if (status === "unauthenticated") {
    return (
      <PageShell>
        <EmptyState
          title="ยังไม่ได้เข้าสู่ระบบ"
          description="เข้าสู่ระบบเพื่อดูรายการที่คุณยืมไว้"
          action={
            <ButtonLink href="/login" variant="primary">
              ไปหน้าเข้าสู่ระบบ
            </ButtonLink>
          }
        />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        trail={[{ label: "หน้าแรก", href: "/" }, { label: "สถานะรายการของฉัน" }]}
        code={session?.user?.username}
        title="สถานะการยืมของฉัน"
        meta={
          loading
            ? "กำลังโหลด..."
            : `${history.length.toLocaleString("th-TH")} รายการทั้งหมด · ยังไม่ปิดรายการ ${outstanding.toLocaleString("th-TH")} รายการ`
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
          label="ค้นหาครุภัณฑ์หรือห้อง"
          placeholder="ค้นหาครุภัณฑ์ หรือชื่อห้อง..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-72"
        />
        <div className="flex flex-1 flex-wrap items-end gap-2">
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
          {(startDate || endDate) && (
            <Button
              size="sm"
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="mb-0.5"
            >
              ล้างช่วงวันที่
            </Button>
          )}
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
          caption="รายการยืมของผู้ใช้ที่เข้าสู่ระบบอยู่"
          empty={
            history.length === 0 ? (
              <EmptyState
                title="ยังไม่มีรายการยืม"
                description="เลือกห้องแล้วกดยืมของ รายการจะมาแสดงที่นี่"
                action={
                  <ButtonLink href="/home" variant="primary">
                    ไปเลือกห้อง
                  </ButtonLink>
                }
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

      <ConfirmDialog
        open={pendingCancel !== null}
        busy={cancelling}
        title="ยกเลิกรายการยืม"
        description={
          pendingCancel && (
            <>
              <p>
                ยกเลิกการยืม{" "}
                <span className="font-medium text-ink">{pendingCancel.asset?.name}</span>{" "}
                จำนวน {pendingCancel.valueBorrow} ชิ้น
              </p>
              <p className="mt-2">
                ระบบจะย้ายของกลับไปที่ห้อง{" "}
                <span className="font-medium text-ink">{pendingCancel.returnLocationId}</span>{" "}
                และลบรายการนี้ออกจากประวัติถาวร
              </p>
            </>
          )
        }
        confirmLabel="ยกเลิกการยืม"
        cancelLabel="ไม่ใช่ตอนนี้"
        onConfirm={confirmCancelBorrow}
        onCancel={() => setPendingCancel(null)}
      />
    </PageShell>
  );
}
