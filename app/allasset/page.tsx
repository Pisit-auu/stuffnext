"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Button, ButtonLink } from "../component/ui/Button";
import { FilterSelect, SearchField } from "../component/ui/Field";
import { PageShell, PageHeader, Toolbar } from "../component/ui/Layout";
import {
  CodeTag,
  DataTable,
  EmptyState,
  ErrorState,
  TickBar,
  type Column,
} from "../component/ui/Data";
import { ConfirmDialog } from "../component/ui/Modal";
import { IconArrowRight, IconSheet, IconTrash } from "../component/ui/icons";
import { useToast } from "../component/ui/Toast";
import { exportSheet } from "@/lib/excel";
import { errorMessage } from "@/lib/format";
import type { Asset, AssetLocation, Category } from "@/lib/types";

/** ยอดของครุภัณฑ์หนึ่งชิ้น = ยอดในคลัง + ยอดที่กระจายอยู่ตามห้อง */
type AssetRow = Asset & {
  totalAll: number;
  totalAvailable: number;
};

export default function AllAsset() {
  const { data: session } = useSession();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetLocations, setAssetLocations] = useState<AssetLocation[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState("");
  const [searchAsset, setSearchAsset] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AssetRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  const isAdmin = session?.user?.role === "admin";

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [categoryRes, assetRes, assetLocationRes] = await Promise.all([
        axios.get<Category[]>("/api/category"),
        axios.get<Asset[]>("/api/asset"),
        axios.get<AssetLocation[]>("/api/assetlocation"),
      ]);
      setCategories(categoryRes.data);
      setAssets(assetRes.data);
      setAssetLocations(assetLocationRes.data);
    } catch (err) {
      setError(errorMessage(err, "โหลดรายการครุภัณฑ์ไม่สำเร็จ"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const rows = useMemo<AssetRow[]>(() => {
    const term = searchAsset.trim().toLowerCase();
    return assets
      .filter((asset) => {
        const matchesCategory = category ? asset.category?.name === category : true;
        const matchesSearch =
          asset.name.toLowerCase().includes(term) ||
          asset.assetid.toLowerCase().includes(term);
        return matchesCategory && matchesSearch;
      })
      .map((asset) => {
        let inRoomAvailable = 0;
        let inRoomUnavailable = 0;
        assetLocations.forEach((loc) => {
          if (loc.assetId !== asset.assetid) return;
          inRoomAvailable += loc.inRoomavailableValue;
          inRoomUnavailable += loc.inRoomaunavailableValue;
        });
        return {
          ...asset,
          totalAll:
            asset.availableValue +
            asset.unavailableValue +
            inRoomAvailable +
            inRoomUnavailable,
          totalAvailable: asset.availableValue + inRoomAvailable,
        };
      });
  }, [assets, assetLocations, category, searchAsset]);

  const handleDownload = async () => {
    try {
      await exportSheet<AssetRow>({
        filename: "ครุภัณฑ์ทั้งหมด",
        sheetName: "ครุภัณฑ์",
        rows,
        columns: [
          { header: "รหัสครุภัณฑ์", width: 20, value: (a) => a.assetid },
          { header: "ชื่อครุภัณฑ์", width: 30, value: (a) => a.name },
          { header: "ประเภท", width: 20, value: (a) => a.category?.name },
          { header: "จำนวนทั้งหมด", width: 16, value: (a) => a.totalAll },
          { header: "จำนวนพร้อมใช้งาน", width: 18, value: (a) => a.totalAvailable },
        ],
      });
      toast.success(`บันทึกไฟล์ Excel แล้ว ${rows.length} รายการ`);
    } catch (err) {
      toast.error(errorMessage(err, "สร้างไฟล์ Excel ไม่สำเร็จ"));
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/asset/${pendingDelete.assetid}`);
      toast.success(`ลบ ${pendingDelete.name} ออกจากทะเบียนแล้ว`);
      setPendingDelete(null);
      await load();
    } catch (err) {
      toast.error(errorMessage(err, "ลบครุภัณฑ์ไม่สำเร็จ"));
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<AssetRow>[] = [
    {
      key: "name",
      header: "ครุภัณฑ์",
      primary: true,
      render: (a) => (
        <div className="min-w-0">
          <CodeTag>{a.assetid}</CodeTag>
          <p className="mt-1.5 font-medium leading-snug text-ink">{a.name}</p>
        </div>
      ),
    },
    {
      key: "category",
      header: "ประเภท",
      width: "12rem",
      render: (a) => <span className="text-ink-2">{a.category?.name || "—"}</span>,
    },
    {
      key: "stock",
      header: "พร้อมใช้งาน",
      width: "14rem",
      render: (a) => (
        <TickBar
          available={a.totalAvailable}
          broken={Math.max(a.totalAll - a.totalAvailable, 0)}
          label={`พร้อมใช้งาน ${a.totalAvailable} จากทั้งหมด ${a.totalAll}`}
        />
      ),
    },
    {
      key: "action",
      header: "ดำเนินการ",
      align: "right",
      width: isAdmin ? "15rem" : "11rem",
      actions: true,
      render: (a) => (
        <div className="flex flex-wrap justify-end gap-2 max-md:w-full">
          <ButtonLink
            href={`/allasset/${encodeURIComponent(a.assetid)}`}
            size="sm"
            iconAfter={<IconArrowRight size={15} />}
            className="max-md:flex-1"
          >
            รายละเอียด
          </ButtonLink>
          {isAdmin && (
            <Button
              size="sm"
              variant="danger"
              icon={<IconTrash size={15} />}
              onClick={() => setPendingDelete(a)}
              aria-label={`ลบ ${a.name}`}
            >
              ลบ
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <PageShell>
      <PageHeader
        title="ครุภัณฑ์ทั้งหมด"
        trail={[{ label: "หน้าแรก", href: "/" }, { label: "ครุภัณฑ์" }]}
        meta={
          loading
            ? "กำลังโหลด..."
            : `${rows.length.toLocaleString("th-TH")} รายการ${
                rows.length !== assets.length
                  ? ` จากทั้งหมด ${assets.length.toLocaleString("th-TH")} รายการ`
                  : ""
              }`
        }
        actions={
          <Button
            onClick={handleDownload}
            icon={<IconSheet size={16} />}
            disabled={loading || rows.length === 0}
          >
            ดาวน์โหลด Excel
          </Button>
        }
      />

      <Toolbar>
        <SearchField
          label="ค้นหาครุภัณฑ์"
          placeholder="ค้นหาชื่อ หรือรหัสครุภัณฑ์..."
          value={searchAsset}
          onChange={(e) => setSearchAsset(e.target.value)}
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
            <Button variant="primary" onClick={load}>
              ลองอีกครั้ง
            </Button>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(a) => a.assetid}
          loading={loading}
          caption="รายการครุภัณฑ์ทั้งหมดพร้อมยอดคงเหลือ"
          empty={
            assets.length === 0 ? (
              <EmptyState
                title="ยังไม่มีครุภัณฑ์ในทะเบียน"
                description="แอดมินสามารถเพิ่มครุภัณฑ์ได้ที่หน้าจัดการทะเบียน"
              />
            ) : (
              <EmptyState
                title="ไม่พบครุภัณฑ์ที่ตรงกับที่ค้นหา"
                description="ลองเปลี่ยนคำค้นหา หรือล้างตัวกรองประเภท"
                action={
                  <Button
                    onClick={() => {
                      setSearchAsset("");
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

      <ConfirmDialog
        open={pendingDelete !== null}
        busy={deleting}
        title="ลบครุภัณฑ์ออกจากทะเบียน"
        description={
          pendingDelete && (
            <>
              <p>
                ลบ <span className="font-medium text-ink">{pendingDelete.name}</span>{" "}
                (รหัส {pendingDelete.assetid}) ออกจากทะเบียนถาวร
              </p>
              <p className="mt-2 text-alert">
                ข้อมูลของชิ้นนี้ในทุกห้องและประวัติการยืมที่เกี่ยวข้องจะถูกลบไปด้วย
                และย้อนกลับไม่ได้
              </p>
            </>
          )
        }
        confirmLabel="ลบถาวร"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </PageShell>
  );
}
