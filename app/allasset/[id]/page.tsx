"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button, ButtonLink } from "../../component/ui/Button";
import { TextField } from "../../component/ui/Field";
import { PageShell, PageHeader, SectionTitle } from "../../component/ui/Layout";
import {
  CodeTag,
  DataTable,
  EmptyState,
  ErrorState,
  Skeleton,
  StatusChip,
  TickBar,
  type Column,
} from "../../component/ui/Data";
import { IconArrowRight, IconEdit, IconImage, IconSheet } from "../../component/ui/icons";
import { useToast } from "../../component/ui/Toast";
import { exportSheet } from "@/lib/excel";
import { errorMessage, formatDate, formatNumber } from "@/lib/format";
import type { Asset, AssetLocation } from "@/lib/types";

type RoomRow = {
  id: number;
  location: string;
  createdAt: string | null;
  available: number;
  unavailable: number;
};

export default function AssetDetail() {
  const { id } = useParams() as { id: string };
  const assetId = decodeURIComponent(id);
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const toast = useToast();

  const [asset, setAsset] = useState<Asset | null>(null);
  const [rooms, setRooms] = useState<RoomRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [availableDraft, setAvailableDraft] = useState("0");
  const [unavailableDraft, setUnavailableDraft] = useState("0");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [assetRes, locationRes] = await Promise.all([
        axios.get<Asset>(`/api/asset/${assetId}`),
        axios.get<AssetLocation[]>("/api/assetlocation"),
      ]);
      setAsset(assetRes.data);
      setAvailableDraft(String(assetRes.data.availableValue));
      setUnavailableDraft(String(assetRes.data.unavailableValue));
      setRooms(
        locationRes.data
          .filter((item) => item.assetId === assetId)
          .map((item) => ({
            id: item.id,
            location: item.location.namelocation,
            createdAt: item.createdAt,
            available: item.inRoomavailableValue,
            unavailable: item.inRoomaunavailableValue,
          })),
      );
    } catch (err) {
      setError(errorMessage(err, "ไม่พบครุภัณฑ์รหัสนี้ หรือโหลดข้อมูลไม่สำเร็จ"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetId]);

  const totals = useMemo(() => {
    const roomAvailable = rooms.reduce((sum, r) => sum + r.available, 0);
    const roomUnavailable = rooms.reduce((sum, r) => sum + r.unavailable, 0);
    return {
      roomAvailable,
      roomUnavailable,
      allAvailable: (asset?.availableValue ?? 0) + roomAvailable,
      allUnavailable: (asset?.unavailableValue ?? 0) + roomUnavailable,
    };
  }, [rooms, asset]);

  const saveStock = async () => {
    if (!asset) return;
    const available = Number(availableDraft);
    const unavailable = Number(unavailableDraft);
    if (!Number.isFinite(available) || !Number.isFinite(unavailable) || available < 0 || unavailable < 0) {
      toast.error("จำนวนต้องเป็นตัวเลขที่ไม่ติดลบ");
      return;
    }
    setSaving(true);
    try {
      await axios.put(`/api/asset/${asset.assetid}`, {
        name: asset.name,
        img: asset.img,
        assetid: asset.assetid,
        categoryId: asset.categoryId,
        availableValue: available,
        unavailableValue: unavailable,
      });
      toast.success("บันทึกจำนวนในคลังแล้ว");
      setEditing(false);
      await load();
    } catch (err) {
      toast.error(errorMessage(err, "บันทึกจำนวนไม่สำเร็จ"));
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!asset) return;
    try {
      await exportSheet<RoomRow>({
        filename: `ครุภัณฑ์ ${asset.assetid} ${asset.name}`,
        sheetName: "สถานที่จัดเก็บ",
        rows: rooms,
        columns: [
          { header: "สถานที่", width: 30, value: (r) => r.location },
          { header: "วันที่เพิ่ม", width: 18, value: (r) => r.createdAt },
          { header: "พร้อมใช้งาน", width: 15, value: (r) => r.available },
          { header: "ไม่พร้อมใช้งาน", width: 18, value: (r) => r.unavailable },
        ],
      });
      toast.success("บันทึกไฟล์ Excel แล้ว");
    } catch (err) {
      toast.error(errorMessage(err, "สร้างไฟล์ Excel ไม่สำเร็จ"));
    }
  };

  const columns: Column<RoomRow>[] = [
    {
      key: "location",
      header: "สถานที่",
      primary: true,
      render: (r) => <CodeTag>{r.location}</CodeTag>,
    },
    {
      key: "createdAt",
      header: "วันที่เพิ่ม",
      width: "12rem",
      render: (r) => <span className="text-ink-2">{formatDate(r.createdAt)}</span>,
    },
    {
      key: "stock",
      header: "ในห้องนี้",
      width: "14rem",
      render: (r) => <TickBar available={r.available} broken={r.unavailable} />,
    },
    {
      key: "action",
      header: "ดำเนินการ",
      align: "right",
      width: "10rem",
      actions: true,
      render: (r) => (
        <ButtonLink
          href={`/location/${encodeURIComponent(r.location)}`}
          size="sm"
          iconAfter={<IconArrowRight size={15} />}
          className="max-md:w-full"
        >
          ไปที่ห้อง
        </ButtonLink>
      ),
    },
  ];

  if (loading) {
    return (
      <PageShell width="narrow">
        <div className="drawer-face mb-6 px-6 py-6">
          <Skeleton className="mb-3 h-4 w-40" />
          <Skeleton className="h-8 w-72" />
        </div>
        <Skeleton className="mb-6 h-56 w-full" />
        <Skeleton className="h-64 w-full" />
      </PageShell>
    );
  }

  if (error || !asset) {
    return (
      <PageShell width="narrow">
        <ErrorState
          title="ไม่พบครุภัณฑ์รหัสนี้"
          description={error ?? undefined}
          action={
            <ButtonLink href="/allasset" variant="primary">
              กลับไปหน้าครุภัณฑ์ทั้งหมด
            </ButtonLink>
          }
        />
      </PageShell>
    );
  }

  return (
    <PageShell width="narrow">
      <PageHeader
        trail={[
          { label: "หน้าแรก", href: "/" },
          { label: "ครุภัณฑ์", href: "/allasset" },
          { label: asset.assetid },
        ]}
        code={asset.assetid}
        title={asset.name}
        meta={
          <span className="flex flex-wrap items-center gap-2">
            <StatusChip tone="neutral">{asset.category?.name || "ไม่ระบุประเภท"}</StatusChip>
            <span>เพิ่มเข้าทะเบียน {formatDate(asset.createdAt)}</span>
          </span>
        }
        actions={
          <Button onClick={handleDownload} icon={<IconSheet size={16} />} disabled={rooms.length === 0}>
            ดาวน์โหลด Excel
          </Button>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-[minmax(0,15rem)_1fr]">
        {/* รูปครุภัณฑ์ติดตั้งเหมือนแผ่นป้าย */}
        <figure className="plate p-2">
          {asset.img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={asset.img}
              alt={asset.name}
              loading="lazy"
              className="aspect-[4/5] w-full bg-sunk object-cover"
            />
          ) : (
            <div className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 bg-sunk text-ink-3">
              <IconImage size={26} />
              <span className="text-meta">ไม่มีรูป</span>
            </div>
          )}
          <figcaption className="mt-2 border-t border-edge px-1 pt-2 font-mono text-[0.75rem] tracking-[0.05em] text-ink-3">
            {asset.assetid}
          </figcaption>
        </figure>

        <div className="plate p-4 sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <h2 className="text-base font-semibold text-ink">ยอดคงเหลือ</h2>
            {isAdmin && !editing && (
              <Button size="sm" icon={<IconEdit size={15} />} onClick={() => setEditing(true)}>
                แก้ไขจำนวนในคลัง
              </Button>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <section>
              <h3 className="mb-2 font-mono text-[0.75rem] uppercase tracking-[0.08em] text-ink-3">
                ในคลังกลาง
              </h3>
              {editing ? (
                <div className="space-y-3">
                  <TextField
                    label="พร้อมใช้งาน"
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={availableDraft}
                    onChange={(e) => setAvailableDraft(e.target.value)}
                  />
                  <TextField
                    label="ไม่พร้อมใช้งาน"
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={unavailableDraft}
                    onChange={(e) => setUnavailableDraft(e.target.value)}
                  />
                  <div className="flex gap-2 pt-1">
                    <Button variant="primary" size="sm" loading={saving} onClick={saveStock}>
                      บันทึก
                    </Button>
                    <Button
                      size="sm"
                      disabled={saving}
                      onClick={() => {
                        setEditing(false);
                        setAvailableDraft(String(asset.availableValue));
                        setUnavailableDraft(String(asset.unavailableValue));
                      }}
                    >
                      ยกเลิก
                    </Button>
                  </div>
                </div>
              ) : (
                <dl className="space-y-1.5 text-base">
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-ink-2">พร้อมใช้งาน</dt>
                    <dd className="font-mono text-stock">{formatNumber(asset.availableValue)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-ink-2">ไม่พร้อมใช้งาน</dt>
                    <dd className="font-mono text-ink-2">
                      {formatNumber(asset.unavailableValue)}
                    </dd>
                  </div>
                </dl>
              )}
            </section>

            <section>
              <h3 className="mb-2 font-mono text-[0.75rem] uppercase tracking-[0.08em] text-ink-3">
                กระจายอยู่ตามห้อง
              </h3>
              <dl className="space-y-1.5 text-base">
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-ink-2">พร้อมใช้งาน</dt>
                  <dd className="font-mono text-stock">{formatNumber(totals.roomAvailable)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-ink-2">ไม่พร้อมใช้งาน</dt>
                  <dd className="font-mono text-ink-2">
                    {formatNumber(totals.roomUnavailable)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-ink-2">อยู่ใน</dt>
                  <dd className="font-mono text-ink-2">{formatNumber(rooms.length)} ห้อง</dd>
                </div>
              </dl>
            </section>
          </div>

          <div className="mt-5 border-t border-edge pt-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-meta text-ink-2">รวมทั้งโรงเรียน</span>
              <TickBar
                available={totals.allAvailable}
                broken={totals.allUnavailable}
                label={`พร้อมใช้งาน ${totals.allAvailable} · ไม่พร้อมใช้งาน ${totals.allUnavailable}`}
              />
            </div>
          </div>
        </div>
      </div>

      <SectionTitle count={rooms.length}>สถานที่จัดเก็บ</SectionTitle>
      <DataTable
        columns={columns}
        rows={rooms}
        rowKey={(r) => r.id}
        caption={`ห้องที่มี ${asset.name} จัดเก็บอยู่`}
        empty={
          <EmptyState
            title="ยังไม่ได้จัดของชิ้นนี้เข้าห้องไหน"
            description="ของทั้งหมดยังอยู่ในคลังกลาง แอดมินสามารถจัดเข้าห้องได้ที่หน้าจัดการของในห้อง"
          />
        }
      />
    </PageShell>
  );
}
