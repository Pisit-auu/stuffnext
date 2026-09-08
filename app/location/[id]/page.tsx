"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "../../component/ui/Button";
import {
  FilterSelect,
  SearchField,
  SelectField,
  TextAreaField,
  TextField,
} from "../../component/ui/Field";
import { PageShell, PageHeader, Toolbar } from "../../component/ui/Layout";
import {
  CodeTag,
  DataTable,
  EmptyState,
  ErrorState,
  StatusChip,
  TickBar,
  type Column,
} from "../../component/ui/Data";
import { Modal } from "../../component/ui/Modal";
import { IconSheet } from "../../component/ui/icons";
import { useToast } from "../../component/ui/Toast";
import { exportSheet } from "@/lib/excel";
import { errorMessage, formatDate } from "@/lib/format";
import type {
  AssetLocation,
  Borrow,
  Category,
  Location,
  RoomAssetRow,
} from "@/lib/types";

export default function RoomPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const roomName = decodeURIComponent(id);
  const { data: session, status } = useSession();
  const toast = useToast();

  const [rows, setRows] = useState<RoomAssetRow[]>([]);
  const [thisLocation, setThisLocation] = useState<Location | null>(null);
  const [otherLocations, setOtherLocations] = useState<Location[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // สถานะของลิ้นชักยืม
  const [borrowTarget, setBorrowTarget] = useState<RoomAssetRow | null>(null);
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("1");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const signedIn = status === "authenticated";
  const userId = session?.user?.id;
  const userName = session?.user?.name?.trim() ?? "";

  /** ยอดในห้อง = ของที่อยู่ในห้อง ลบด้วยของที่ถูกยืมออกไปแล้วและยังไม่คืน */
  const loadRoomAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const [borrowRes, assetRes] = await Promise.all([
        axios.get<Borrow[]>(`/api/borrow/location/${id}`),
        axios.get<AssetLocation[]>(`/api/assetlocationroom?location=${id}`),
      ]);

      const next: RoomAssetRow[] = assetRes.data.map((item) => {
        let borrowed = 0;
        borrowRes.data.forEach((borrow) => {
          if (borrow.asset?.name === item.asset.name && borrow.ReturnStatus === "w") {
            borrowed += borrow.valueBorrow;
          }
        });
        return {
          ...item,
          borrowed,
          inRoomavailableValue: item.inRoomavailableValue - borrowed,
        };
      });

      setRows(next);
    } catch (err) {
      setError(errorMessage(err, "โหลดรายการครุภัณฑ์ในห้องนี้ไม่สำเร็จ"));
    } finally {
      setLoading(false);
    }
  };

  const loadLocations = async () => {
    try {
      const [allRes, thisRes] = await Promise.all([
        axios.get<Location[]>("/api/location"),
        axios.get<Location>(`/api/location/${roomName}`),
      ]);
      setThisLocation(thisRes.data);
      setOtherLocations(allRes.data.filter((loc) => loc.id !== thisRes.data.id));
    } catch {
      /* ห้องปลายทางจะว่างไว้ ผู้ใช้ยังดูของในห้องนี้ได้ */
    }
  };

  const loadCategories = async () => {
    try {
      const res = await axios.get<Category[]>("/api/category");
      setCategories(res.data);
    } catch {
      /* ตัวกรองไม่ใช่ข้อมูลหลักของหน้านี้ */
    }
  };

  useEffect(() => {
    loadRoomAssets();
    loadLocations();
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch =
        !term ||
        row.asset.name.toLowerCase().includes(term) ||
        row.asset.assetid.toLowerCase().includes(term);
      const matchesCategory = category ? row.asset.category?.name === category : true;
      return matchesSearch && matchesCategory;
    });
  }, [rows, search, category]);

  const openBorrow = (row: RoomAssetRow) => {
    if (!signedIn) {
      toast.info("เข้าสู่ระบบก่อนจึงจะยืมของได้");
      router.push("/login");
      return;
    }
    if (!userName) {
      toast.info("กรอกชื่อจริงในหน้าโปรไฟล์ก่อน จึงจะยืมของได้");
      router.push("/profile");
      return;
    }
    setBorrowTarget(row);
    setDestination("");
    setAmount(row.inRoomavailableValue > 0 ? "1" : "0");
    setNote("");
    setFormError("");
  };

  const submitBorrow = async () => {
    if (!borrowTarget || !thisLocation) return;

    const max = borrowTarget.inRoomavailableValue;
    const value = parseInt(amount, 10);

    if (!destination) {
      setFormError("เลือกห้องที่จะยืมไปใช้ก่อน");
      return;
    }
    if (!Number.isFinite(value) || value < 1) {
      setFormError("จำนวนที่ยืมต้องเป็นตัวเลขตั้งแต่ 1 ขึ้นไป");
      return;
    }
    if (value > max) {
      setFormError(`ห้องนี้เหลือให้ยืมได้ ${max} ชิ้น`);
      return;
    }

    setFormError("");
    setSubmitting(true);

    try {
      // ต้องรู้ก่อนว่าห้องปลายทางมีของชิ้นนี้อยู่แล้วหรือยัง
      const destinationRes = await axios.get<AssetLocation[]>(
        `/api/assetlocationroom?location=${destination}`,
      );
      const existing = destinationRes.data.find(
        (item) => item.assetId === borrowTarget.assetId,
      );

      if (existing) {
        await axios.put(`/api/assetlocation/${existing.id}`, {
          inRoomavailableValue: existing.inRoomavailableValue + value,
          inRoomaunavailableValue: existing.inRoomaunavailableValue,
        });
      } else {
        // สร้างช่องของชิ้นนี้ในห้องปลายทางก่อน แล้วค่อยเติมจำนวน
        await axios.post("/api/assetlocation", {
          assetId: borrowTarget.assetId,
          locationId: destination,
          inRoomavailableValue: 0,
          inRoomaunavailableValue: 0,
        });
        const createdRes = await axios.get<AssetLocation[]>(
          `/api/assetlocationroom?location=${destination}`,
        );
        const created = createdRes.data.find(
          (item) => item.assetId === borrowTarget.assetId,
        );
        if (!created) throw new Error("ไม่พบช่องเก็บของในห้องปลายทาง");
        await axios.put(`/api/assetlocation/${created.id}`, {
          inRoomavailableValue: value,
          inRoomaunavailableValue: 0,
        });
      }

      // หักออกจากห้องต้นทาง (ค่าที่แสดงถูกหักยอดยืมค้างไว้แล้ว จึงบวกกลับก่อน)
      await axios.put(`/api/assetlocation/${borrowTarget.id}`, {
        inRoomavailableValue:
          borrowTarget.inRoomavailableValue + borrowTarget.borrowed - value,
        inRoomaunavailableValue: borrowTarget.inRoomaunavailableValue,
      });

      await axios.post("/api/borrow", {
        userId,
        assetId: borrowTarget.assetId,
        borrowLocationId: destination,
        returnLocationId: thisLocation.namelocation,
        note,
        valueBorrow: value,
      });

      toast.success(
        `ยืม ${borrowTarget.asset.name} ${value} ชิ้น ไปที่ห้อง ${destination} แล้ว`,
      );
      setBorrowTarget(null);
      router.push("/profile/history");
    } catch (err) {
      setFormError(errorMessage(err, "ทำรายการยืมไม่สำเร็จ กรุณาลองใหม่อีกครั้ง"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = async () => {
    try {
      await exportSheet<RoomAssetRow>({
        filename: `ครุภัณฑ์ในห้อง ${roomName}`,
        sheetName: "ครุภัณฑ์ในห้อง",
        rows: filtered,
        columns: [
          { header: "รหัสครุภัณฑ์", width: 20, value: (r) => r.asset.assetid },
          { header: "ชื่อครุภัณฑ์", width: 30, value: (r) => r.asset.name },
          { header: "ประเภทครุภัณฑ์", width: 20, value: (r) => r.asset.category?.name },
          { header: "วันที่เพิ่ม", width: 18, value: (r) => r.createdAt },
          {
            header: "จำนวนใช้งานได้",
            width: 18,
            value: (r) => r.inRoomavailableValue + r.borrowed,
          },
          {
            header: "จำนวนใช้งานไม่ได้",
            width: 18,
            value: (r) => r.inRoomaunavailableValue,
          },
          { header: "พร้อมให้ยืม", width: 15, value: (r) => r.inRoomavailableValue },
        ],
      });
      toast.success(`บันทึกไฟล์ Excel แล้ว ${filtered.length} รายการ`);
    } catch (err) {
      toast.error(errorMessage(err, "สร้างไฟล์ Excel ไม่สำเร็จ"));
    }
  };

  const columns: Column<RoomAssetRow>[] = [
    {
      key: "asset",
      header: "ครุภัณฑ์",
      primary: true,
      render: (r) => (
        <div className="min-w-0">
          <CodeTag>{r.asset.assetid}</CodeTag>
          <p className="mt-1.5 font-medium leading-snug text-ink">{r.asset.name}</p>
          <p className="text-meta text-ink-3 md:hidden">{r.asset.category?.name}</p>
        </div>
      ),
    },
    {
      key: "category",
      header: "ประเภท",
      width: "11rem",
      hideOnCard: true,
      render: (r) => <span className="text-ink-2">{r.asset.category?.name || "—"}</span>,
    },
    {
      key: "added",
      header: "วันที่เพิ่ม",
      width: "9rem",
      render: (r) => <span className="text-ink-2">{formatDate(r.createdAt)}</span>,
    },
    {
      key: "available",
      header: "พร้อมให้ยืม",
      width: "13rem",
      render: (r) => (
        <TickBar
          available={r.inRoomavailableValue}
          out={r.borrowed}
          label={`พร้อมให้ยืม ${r.inRoomavailableValue} ชิ้น${
            r.borrowed ? ` · ถูกยืมออกไป ${r.borrowed} ชิ้น` : ""
          }`}
        />
      ),
    },
    {
      key: "broken",
      header: "ใช้งานไม่ได้",
      align: "right",
      width: "8rem",
      render: (r) =>
        r.inRoomaunavailableValue > 0 ? (
          <StatusChip tone="neutral">{r.inRoomaunavailableValue} ชิ้น</StatusChip>
        ) : (
          <span className="text-ink-3">—</span>
        ),
    },
    {
      key: "action",
      header: "ดำเนินการ",
      align: "right",
      width: "8rem",
      actions: true,
      render: (r) => (
        <Button
          size="sm"
          variant="borrow"
          onClick={() => openBorrow(r)}
          disabled={r.inRoomavailableValue < 1}
          className="max-md:w-full"
          aria-label={`ยืม ${r.asset.name}`}
        >
          {r.inRoomavailableValue < 1 ? "ยืมไม่ได้" : "ยืม"}
        </Button>
      ),
    },
  ];

  const max = borrowTarget?.inRoomavailableValue ?? 0;

  return (
    <PageShell>
      <PageHeader
        trail={[
          { label: "หน้าแรก", href: "/" },
          { label: "สถานที่", href: "/home" },
          { label: roomName },
        ]}
        title={`ครุภัณฑ์ในห้อง ${roomName}`}
        meta={
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>
              ผู้รับผิดชอบ{" "}
              <span className="text-ink">{thisLocation?.nameteacher || "ยังไม่ระบุ"}</span>
            </span>
            {thisLocation?.categoryroom?.name && (
              <StatusChip tone="neutral">{thisLocation.categoryroom.name}</StatusChip>
            )}
            <span>{filtered.length.toLocaleString("th-TH")} รายการ</span>
          </span>
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
          label="ค้นหาครุภัณฑ์ในห้องนี้"
          placeholder="ค้นหาชื่อ หรือรหัสครุภัณฑ์..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80"
        />
        <FilterSelect
          label="กรองตามประเภทครุภัณฑ์"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full sm:w-56"
        >
          <option value="">ทุกประเภท</option>
          {categories.map((c) => (
            <option key={c.idname} value={c.name}>
              {c.name}
            </option>
          ))}
        </FilterSelect>
      </Toolbar>

      {error ? (
        <ErrorState
          title="โหลดข้อมูลไม่สำเร็จ"
          description={error}
          action={
            <Button variant="primary" onClick={loadRoomAssets}>
              ลองอีกครั้ง
            </Button>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          rows={filtered}
          rowKey={(r) => r.id}
          loading={loading}
          caption={`ครุภัณฑ์ที่อยู่ในห้อง ${roomName}`}
          empty={
            rows.length === 0 ? (
              <EmptyState
                title="ห้องนี้ยังไม่มีครุภัณฑ์"
                description="แอดมินสามารถจัดของเข้าห้องได้ที่หน้าจัดการของในห้อง"
              />
            ) : (
              <EmptyState
                title="ไม่พบครุภัณฑ์ที่ตรงกับที่ค้นหา"
                action={
                  <Button
                    onClick={() => {
                      setSearch("");
                      setCategory("");
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

      {/* ลิ้นชักยืม */}
      <Modal
        open={borrowTarget !== null}
        onClose={() => !submitting && setBorrowTarget(null)}
        title={borrowTarget ? `ยืม ${borrowTarget.asset.name}` : ""}
        code={borrowTarget?.asset.assetid}
        footer={
          <>
            <Button variant="quiet" onClick={() => setBorrowTarget(null)} disabled={submitting}>
              ยกเลิก
            </Button>
            <Button
              variant="borrow"
              onClick={submitBorrow}
              loading={submitting}
              disabled={max < 1}
            >
              ยืนยันการยืม
            </Button>
          </>
        }
      >
        {borrowTarget && (
          <div className="space-y-4">
            <dl className="space-y-1.5 rounded border border-edge bg-sunk px-3 py-2.5 text-base">
              <div className="flex justify-between gap-3">
                <dt className="text-ink-2">ยืมจากห้อง</dt>
                <dd className="font-medium text-ink">{roomName}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-2">เหลือให้ยืมได้</dt>
                <dd className="font-mono text-stock">{max} ชิ้น</dd>
              </div>
            </dl>

            <SelectField
              label="ยืมไปใช้ที่ห้อง"
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              <option value="">เลือกห้องปลายทาง</option>
              {otherLocations.map((loc) => (
                <option key={loc.id} value={loc.namelocation}>
                  {loc.namelocation}
                  {loc.nameteacher ? ` · ${loc.nameteacher}` : ""}
                </option>
              ))}
            </SelectField>

            <TextField
              label="จำนวนที่ยืม"
              type="number"
              inputMode="numeric"
              min={1}
              max={max}
              required
              hint={`ยืมได้สูงสุด ${max} ชิ้น`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <TextAreaField
              label="หมายเหตุ"
              rows={2}
              placeholder="เช่น ใช้ในงานกีฬาสี คืนวันศุกร์"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            {formError && (
              <p role="alert" className="rounded border border-alert/40 bg-alert-soft px-3 py-2 text-base text-alert">
                {formError}
              </p>
            )}
          </div>
        )}
      </Modal>
    </PageShell>
  );
}
