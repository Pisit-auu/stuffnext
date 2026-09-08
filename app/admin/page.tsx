"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Button, ButtonLink } from "../component/ui/Button";
import { FilterSelect, SearchField } from "../component/ui/Field";
import { PageShell, PageHeader, Toolbar } from "../component/ui/Layout";
import {
  CodeTag,
  DataTable,
  EmptyState,
  TickBar,
  type Column,
} from "../component/ui/Data";
import { ConfirmDialog } from "../component/ui/Modal";
import {
  IconAsset,
  IconEdit,
  IconPlus,
  IconRoom,
  IconSheet,
  IconTag,
  IconTrash,
} from "../component/ui/icons";
import { useToast } from "../component/ui/Toast";
import { exportSheet } from "@/lib/excel";
import { errorMessage, formatDate } from "@/lib/format";
import type { Asset, Category, CategoryRoom, Location } from "@/lib/types";

type TabKey = "asset" | "category" | "location" | "categoryroom";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "asset", label: "ครุภัณฑ์", icon: <IconAsset size={16} /> },
  { key: "category", label: "ประเภทครุภัณฑ์", icon: <IconTag size={16} /> },
  { key: "location", label: "สถานที่", icon: <IconRoom size={16} /> },
  { key: "categoryroom", label: "ประเภทของสถานที่", icon: <IconTag size={16} /> },
];

type PendingDelete = {
  kind: TabKey;
  id: string;
  name: string;
  warning?: string;
};

export default function Admin() {
  const toast = useToast();
  const [tab, setTab] = useState<TabKey>("asset");

  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [categoryRooms, setCategoryRooms] = useState<CategoryRoom[]>([]);

  const [searchAsset, setSearchAsset] = useState("");
  const [assetCategory, setAssetCategory] = useState("");
  const [sort, setSort] = useState("desc");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [locationCategory, setLocationCategory] = useState("");
  const [searchCategoryRoom, setSearchCategoryRoom] = useState("");

  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAssets = async () => {
    const query = new URLSearchParams({
      category: assetCategory,
      search: searchAsset,
      sort,
    }).toString();
    const res = await axios.get<Asset[]>(`/api/asset?${query}`);
    setAssets(res.data);
  };

  const fetchCategories = async () => {
    const query = new URLSearchParams({ search: searchCategory }).toString();
    const res = await axios.get<Category[]>(`/api/category?${query}`);
    setCategories(res.data);
  };

  const fetchLocations = async () => {
    const query = new URLSearchParams({
      search: searchLocation,
      categoryroom: locationCategory || "",
    }).toString();
    const res = await axios.get<Location[]>(`/api/location?${query}`);
    setLocations(res.data);
  };

  const fetchCategoryRooms = async () => {
    const query = new URLSearchParams({ search: searchCategoryRoom }).toString();
    const res = await axios.get<CategoryRoom[]>(`/api/categoryroom?${query}`);
    setCategoryRooms(res.data);
  };

  const guard = async (fn: () => Promise<void>) => {
    try {
      await fn();
    } catch (err) {
      toast.error(errorMessage(err, "โหลดข้อมูลไม่สำเร็จ"));
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await guard(async () => {
        await Promise.all([
          fetchAssets(),
          fetchCategories(),
          fetchLocations(),
          fetchCategoryRooms(),
        ]);
      });
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    guard(fetchAssets);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchAsset, assetCategory, sort]);

  useEffect(() => {
    guard(fetchCategories);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchCategory]);

  useEffect(() => {
    guard(fetchLocations);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchLocation, locationCategory]);

  useEffect(() => {
    guard(fetchCategoryRooms);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchCategoryRoom]);

  const refreshAll = async () => {
    await guard(async () => {
      await Promise.all([
        fetchAssets(),
        fetchCategories(),
        fetchLocations(),
        fetchCategoryRooms(),
      ]);
    });
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const endpoint: Record<TabKey, string> = {
      asset: `/api/asset/${pendingDelete.id}`,
      category: `/api/category/${pendingDelete.id}`,
      location: `/api/location/${pendingDelete.id}`,
      categoryroom: `/api/categoryroom/${pendingDelete.id}`,
    };
    setDeleting(true);
    try {
      await axios.delete(endpoint[pendingDelete.kind]);
      toast.success(`ลบ ${pendingDelete.name} แล้ว`);
      setPendingDelete(null);
      await refreshAll();
    } catch (err) {
      toast.error(errorMessage(err, "ลบไม่สำเร็จ"));
    } finally {
      setDeleting(false);
    }
  };

  /* ── คอลัมน์ของแต่ละหมวด ───────────────────────────── */

  const assetColumns: Column<Asset>[] = [
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
      header: "ในคลังกลาง",
      width: "13rem",
      render: (a) => <TickBar available={a.availableValue} broken={a.unavailableValue} />,
    },
    {
      key: "created",
      header: "วันที่เพิ่ม",
      width: "9rem",
      hideOnCard: true,
      render: (a) => <span className="text-ink-2">{formatDate(a.createdAt)}</span>,
    },
    {
      key: "action",
      header: "ดำเนินการ",
      align: "right",
      width: "12rem",
      actions: true,
      render: (a) => (
        <div className="flex flex-wrap justify-end gap-2 max-md:w-full">
          <ButtonLink
            href={`/admin/editasset/${encodeURIComponent(a.assetid)}`}
            size="sm"
            icon={<IconEdit size={15} />}
            className="max-md:flex-1"
          >
            แก้ไข
          </ButtonLink>
          <Button
            size="sm"
            variant="danger"
            icon={<IconTrash size={15} />}
            aria-label={`ลบ ${a.name}`}
            onClick={() =>
              setPendingDelete({
                kind: "asset",
                id: a.assetid,
                name: a.name,
                warning: "ข้อมูลของชิ้นนี้ในทุกห้องและประวัติการยืมที่เกี่ยวข้องจะถูกลบไปด้วย",
              })
            }
          >
            ลบ
          </Button>
        </div>
      ),
    },
  ];

  const categoryColumns: Column<Category>[] = [
    {
      key: "idname",
      header: "รหัสตัวแรก",
      primary: true,
      width: "10rem",
      render: (c) => <CodeTag>{c.idname}</CodeTag>,
    },
    {
      key: "name",
      header: "ชื่อประเภท",
      render: (c) => <span className="font-medium text-ink">{c.name}</span>,
    },
    {
      key: "action",
      header: "ดำเนินการ",
      align: "right",
      width: "12rem",
      actions: true,
      render: (c) => (
        <div className="flex flex-wrap justify-end gap-2 max-md:w-full">
          <ButtonLink
            href={`/admin/editcategory/${encodeURIComponent(c.idname)}`}
            size="sm"
            icon={<IconEdit size={15} />}
            className="max-md:flex-1"
          >
            แก้ไข
          </ButtonLink>
          <Button
            size="sm"
            variant="danger"
            icon={<IconTrash size={15} />}
            aria-label={`ลบประเภท ${c.name}`}
            onClick={() =>
              setPendingDelete({
                kind: "category",
                id: c.idname,
                name: c.name,
                warning: "ครุภัณฑ์ทุกชิ้นที่อยู่ในประเภทนี้จะถูกลบไปด้วย",
              })
            }
          >
            ลบ
          </Button>
        </div>
      ),
    },
  ];

  const locationColumns: Column<Location>[] = [
    {
      key: "name",
      header: "สถานที่",
      primary: true,
      render: (l) => <CodeTag>{l.namelocation}</CodeTag>,
    },
    {
      key: "teacher",
      header: "ผู้รับผิดชอบ",
      width: "14rem",
      render: (l) => <span className="text-ink-2">{l.nameteacher || "—"}</span>,
    },
    {
      key: "category",
      header: "ประเภทห้อง",
      width: "12rem",
      render: (l) => (
        <span className="text-ink-2">{l.categoryroom?.name || "ไม่มีหมวดหมู่"}</span>
      ),
    },
    {
      key: "action",
      header: "ดำเนินการ",
      align: "right",
      width: "19rem",
      actions: true,
      render: (l) => (
        <div className="flex flex-wrap justify-end gap-2 max-md:w-full">
          <ButtonLink
            href={`/admin/manageroom/${encodeURIComponent(l.namelocation)}`}
            size="sm"
            variant="primary"
            className="max-md:flex-1"
          >
            จัดการของในห้อง
          </ButtonLink>
          <ButtonLink
            href={`/admin/editlocation/${encodeURIComponent(l.namelocation)}`}
            size="sm"
            icon={<IconEdit size={15} />}
          >
            แก้ไข
          </ButtonLink>
          <Button
            size="sm"
            variant="danger"
            icon={<IconTrash size={15} />}
            aria-label={`ลบห้อง ${l.namelocation}`}
            onClick={() =>
              setPendingDelete({
                kind: "location",
                id: l.namelocation,
                name: l.namelocation,
                warning: "ของที่บันทึกไว้ในห้องนี้และประวัติการยืมที่เกี่ยวข้องจะถูกลบไปด้วย",
              })
            }
          >
            ลบ
          </Button>
        </div>
      ),
    },
  ];

  const categoryRoomColumns: Column<CategoryRoom>[] = [
    {
      key: "id",
      header: "รหัส",
      primary: true,
      width: "8rem",
      render: (c) => <CodeTag>#{c.id}</CodeTag>,
    },
    {
      key: "name",
      header: "ชื่อประเภท",
      render: (c) => <span className="font-medium text-ink">{c.name}</span>,
    },
    {
      key: "action",
      header: "ดำเนินการ",
      align: "right",
      width: "12rem",
      actions: true,
      render: (c) => (
        <div className="flex flex-wrap justify-end gap-2 max-md:w-full">
          <ButtonLink
            href={`/admin/editcategoryroom/${c.id}`}
            size="sm"
            icon={<IconEdit size={15} />}
            className="max-md:flex-1"
          >
            แก้ไข
          </ButtonLink>
          <Button
            size="sm"
            variant="danger"
            icon={<IconTrash size={15} />}
            aria-label={`ลบประเภทห้อง ${c.name}`}
            onClick={() =>
              setPendingDelete({
                kind: "categoryroom",
                id: String(c.id),
                name: c.name,
                warning: "ห้องทั้งหมดที่อยู่ในประเภทนี้จะถูกลบไปด้วย",
              })
            }
          >
            ลบ
          </Button>
        </div>
      ),
    },
  ];

  /* ── การส่งออก Excel ต่อหมวด ───────────────────────── */

  const downloads: Record<TabKey, () => Promise<void>> = {
    asset: () =>
      exportSheet<Asset>({
        filename: "รายการครุภัณฑ์",
        sheetName: "ครุภัณฑ์",
        rows: assets,
        columns: [
          { header: "รหัสครุภัณฑ์", width: 18, value: (a) => a.assetid },
          { header: "ชื่อครุภัณฑ์", width: 30, value: (a) => a.name },
          { header: "ประเภท", width: 20, value: (a) => a.category?.name },
          { header: "จำนวนใช้งานได้", width: 18, value: (a) => a.availableValue },
          { header: "จำนวนใช้งานไม่ได้", width: 20, value: (a) => a.unavailableValue },
          { header: "วันที่เพิ่ม", width: 18, value: (a) => formatDate(a.createdAt) },
        ],
      }),
    category: () =>
      exportSheet<Category>({
        filename: "ประเภทครุภัณฑ์",
        sheetName: "ประเภทครุภัณฑ์",
        rows: categories,
        columns: [
          { header: "รหัสตัวแรก", width: 18, value: (c) => c.idname },
          { header: "ชื่อประเภท", width: 30, value: (c) => c.name },
        ],
      }),
    location: () =>
      exportSheet<Location>({
        filename: "สถานที่",
        sheetName: "สถานที่",
        rows: locations,
        columns: [
          { header: "สถานที่", width: 30, value: (l) => l.namelocation },
          { header: "ผู้รับผิดชอบ", width: 30, value: (l) => l.nameteacher },
          { header: "ประเภท", width: 24, value: (l) => l.categoryroom?.name ?? "ไม่มีหมวดหมู่" },
        ],
      }),
    categoryroom: () =>
      exportSheet<CategoryRoom>({
        filename: "ประเภทห้อง",
        sheetName: "ประเภทห้อง",
        rows: categoryRooms,
        columns: [
          { header: "รหัส", width: 10, value: (c) => c.id },
          { header: "ชื่อประเภท", width: 30, value: (c) => c.name },
        ],
      }),
  };

  const handleDownload = async () => {
    try {
      await downloads[tab]();
      toast.success("บันทึกไฟล์ Excel แล้ว");
    } catch (err) {
      toast.error(errorMessage(err, "สร้างไฟล์ Excel ไม่สำเร็จ"));
    }
  };

  const counts: Record<TabKey, number> = {
    asset: assets.length,
    category: categories.length,
    location: locations.length,
    categoryroom: categoryRooms.length,
  };

  const createHref: Record<TabKey, { href: string; label: string }> = {
    asset: { href: "/admin/createasset", label: "เพิ่มครุภัณฑ์" },
    category: { href: "/admin/createcategory", label: "เพิ่มประเภทครุภัณฑ์" },
    location: { href: "/admin/createlocation", label: "เพิ่มสถานที่" },
    categoryroom: { href: "/admin/createcategoryroom", label: "เพิ่มประเภทของสถานที่" },
  };

  const activeTab = useMemo(() => TABS.find((t) => t.key === tab)!, [tab]);

  return (
    <PageShell>
      <PageHeader
        trail={[{ label: "หน้าแรก", href: "/" }, { label: "จัดการทะเบียน" }]}
        title="จัดการทะเบียน"
        meta="เพิ่ม แก้ไข และลบครุภัณฑ์ สถานที่ และประเภทต่าง ๆ ของโรงเรียน"
        actions={
          <>
            <Button onClick={handleDownload} icon={<IconSheet size={16} />}>
              ดาวน์โหลด Excel
            </Button>
            <ButtonLink
              href={createHref[tab].href}
              variant="primary"
              icon={<IconPlus size={16} />}
            >
              {createHref[tab].label}
            </ButtonLink>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[15rem_1fr]">
        {/* หน้าลิ้นชักสี่ใบ — เลือกหมวดที่จะจัดการ */}
        <nav
          aria-label="หมวดที่จัดการ"
          className="min-w-0 lg:sticky lg:top-[calc(var(--rail-h)+1.5rem)] lg:self-start"
        >
          <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {TABS.map((t) => {
              const active = t.key === tab;
              return (
                <li key={t.key} className="shrink-0 lg:shrink">
                  <button
                    type="button"
                    onClick={() => setTab(t.key)}
                    aria-current={active ? "true" : undefined}
                    className={`flex w-full items-center gap-2 rounded border px-3 py-2.5 text-left text-base transition-colors duration-[var(--dur)] ${
                      active
                        ? "border-ink bg-ink text-plate"
                        : "border-edge bg-plate text-ink-2 shadow-plate hover:border-ink-3 hover:text-ink"
                    }`}
                  >
                    {t.icon}
                    <span className="flex-1 whitespace-nowrap">{t.label}</span>
                    <span
                      className={`font-mono text-meta ${active ? "text-plate/70" : "text-ink-3"}`}
                    >
                      {counts[t.key]}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <section aria-label={activeTab.label} className="min-w-0">
          {tab === "asset" && (
            <>
              <Toolbar>
                <SearchField
                  label="ค้นหาครุภัณฑ์"
                  placeholder="ค้นหาชื่อครุภัณฑ์..."
                  value={searchAsset}
                  onChange={(e) => setSearchAsset(e.target.value)}
                  className="w-full sm:w-64"
                />
                <FilterSelect
                  label="กรองตามประเภทครุภัณฑ์"
                  value={assetCategory}
                  onChange={(e) => setAssetCategory(e.target.value)}
                  className="w-full sm:w-48"
                >
                  <option value="">ทุกประเภท</option>
                  {categories.map((c) => (
                    <option key={c.idname} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </FilterSelect>
                <FilterSelect
                  label="เรียงลำดับ"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full sm:w-36"
                >
                  <option value="desc">ล่าสุดก่อน</option>
                  <option value="asc">เก่าสุดก่อน</option>
                </FilterSelect>
              </Toolbar>
              <DataTable
                columns={assetColumns}
                rows={assets}
                rowKey={(a) => a.assetid}
                loading={loading}
                caption="ครุภัณฑ์ทั้งหมดในทะเบียน"
                empty={
                  <EmptyState
                    title="ไม่พบครุภัณฑ์"
                    description="ลองเปลี่ยนคำค้นหา หรือเพิ่มครุภัณฑ์ใหม่เข้าทะเบียน"
                    action={
                      <ButtonLink href="/admin/createasset" variant="primary">
                        เพิ่มครุภัณฑ์
                      </ButtonLink>
                    }
                  />
                }
              />
            </>
          )}

          {tab === "category" && (
            <>
              <Toolbar>
                <SearchField
                  label="ค้นหาประเภทครุภัณฑ์"
                  placeholder="ค้นหาประเภทครุภัณฑ์..."
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="w-full sm:w-64"
                />
              </Toolbar>
              <DataTable
                columns={categoryColumns}
                rows={categories}
                rowKey={(c) => c.idname}
                loading={loading}
                caption="ประเภทของครุภัณฑ์"
                empty={
                  <EmptyState
                    title="ยังไม่มีประเภทครุภัณฑ์"
                    description="ประเภทคือรหัสตัวแรกของครุภัณฑ์ เช่น ก, ข, ค"
                    action={
                      <ButtonLink href="/admin/createcategory" variant="primary">
                        เพิ่มประเภทครุภัณฑ์
                      </ButtonLink>
                    }
                  />
                }
              />
            </>
          )}

          {tab === "location" && (
            <>
              <Toolbar>
                <SearchField
                  label="ค้นหาสถานที่"
                  placeholder="ค้นหาชื่อสถานที่..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full sm:w-64"
                />
                <FilterSelect
                  label="กรองตามประเภทของสถานที่"
                  value={locationCategory}
                  onChange={(e) => setLocationCategory(e.target.value)}
                  className="w-full sm:w-52"
                >
                  <option value="">ทุกประเภทห้อง</option>
                  {categoryRooms.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </FilterSelect>
              </Toolbar>
              <DataTable
                columns={locationColumns}
                rows={locations}
                rowKey={(l) => l.namelocation}
                loading={loading}
                caption="สถานที่ทั้งหมด"
                empty={
                  <EmptyState
                    title="ยังไม่มีสถานที่"
                    description="เพิ่มห้องก่อน แล้วจึงจัดครุภัณฑ์เข้าไปในห้องนั้น"
                    action={
                      <ButtonLink href="/admin/createlocation" variant="primary">
                        เพิ่มสถานที่
                      </ButtonLink>
                    }
                  />
                }
              />
            </>
          )}

          {tab === "categoryroom" && (
            <>
              <Toolbar>
                <SearchField
                  label="ค้นหาประเภทของสถานที่"
                  placeholder="ค้นหาประเภทของสถานที่..."
                  value={searchCategoryRoom}
                  onChange={(e) => setSearchCategoryRoom(e.target.value)}
                  className="w-full sm:w-64"
                />
              </Toolbar>
              <DataTable
                columns={categoryRoomColumns}
                rows={categoryRooms}
                rowKey={(c) => c.id}
                loading={loading}
                caption="ประเภทของสถานที่"
                empty={
                  <EmptyState
                    title="ยังไม่มีประเภทของสถานที่"
                    description="เช่น ห้องเรียน ห้องปฏิบัติการ ห้องพักครู"
                    action={
                      <ButtonLink href="/admin/createcategoryroom" variant="primary">
                        เพิ่มประเภทของสถานที่
                      </ButtonLink>
                    }
                  />
                }
              />
            </>
          )}
        </section>
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        busy={deleting}
        title={`ลบ ${pendingDelete?.name ?? ""}`}
        description={
          pendingDelete && (
            <>
              <p>
                ลบ <span className="font-medium text-ink">{pendingDelete.name}</span>{" "}
                ออกจากระบบถาวร
              </p>
              {pendingDelete.warning && (
                <p className="mt-2 text-alert">{pendingDelete.warning} และย้อนกลับไม่ได้</p>
              )}
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
