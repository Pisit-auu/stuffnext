"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { ButtonLink, Button } from "../component/ui/Button";
import { FilterSelect, SearchField } from "../component/ui/Field";
import { PageShell, PageHeader, Toolbar } from "../component/ui/Layout";
import {
  CodeTag,
  DataTable,
  EmptyState,
  ErrorState,
  type Column,
} from "../component/ui/Data";
import { IconArrowRight, IconSheet } from "../component/ui/icons";
import { useToast } from "../component/ui/Toast";
import { exportSheet } from "@/lib/excel";
import { errorMessage } from "@/lib/format";
import type { CategoryRoom, Location } from "@/lib/types";

export default function Home() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [categories, setCategories] = useState<CategoryRoom[]>([]);
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [locationRes, categoryRes] = await Promise.all([
        axios.get<Location[]>("/api/location"),
        axios.get<CategoryRoom[]>("/api/categoryroom"),
      ]);
      setLocations(locationRes.data);
      setCategories(categoryRes.data);
    } catch (err) {
      setError(errorMessage(err, "โหลดรายชื่อสถานที่ไม่สำเร็จ"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const term = searchLocation.trim().toLowerCase();
    return locations.filter((location) => {
      const matchName =
        location.namelocation.toLowerCase().includes(term) ||
        (location.nameteacher ?? "").toLowerCase().includes(term);
      const matchCategory = selectedCategory
        ? location.categoryroom?.name === selectedCategory
        : true;
      return matchName && matchCategory;
    });
  }, [locations, searchLocation, selectedCategory]);

  const handleDownload = async () => {
    try {
      await exportSheet<Location>({
        filename: "สถานที่ทั้งหมด",
        sheetName: "สถานที่",
        rows: filtered,
        columns: [
          { header: "สถานที่", width: 30, value: (l) => l.namelocation },
          { header: "ผู้รับผิดชอบ", width: 30, value: (l) => l.nameteacher },
          { header: "ประเภทห้อง", width: 20, value: (l) => l.categoryroom?.name },
        ],
      });
      toast.success(`บันทึกไฟล์ Excel แล้ว ${filtered.length} รายการ`);
    } catch (err) {
      toast.error(errorMessage(err, "สร้างไฟล์ Excel ไม่สำเร็จ"));
    }
  };

  const columns: Column<Location>[] = [
    {
      key: "name",
      header: "สถานที่",
      primary: true,
      render: (l) => (
        <div className="min-w-0">
          <CodeTag>{l.namelocation}</CodeTag>
          {l.nameteacher && (
            <p className="mt-1.5 text-meta text-ink-2 md:hidden">
              ผู้รับผิดชอบ {l.nameteacher}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "teacher",
      header: "ผู้รับผิดชอบ",
      hideOnCard: true,
      render: (l) => <span className="text-ink-2">{l.nameteacher || "—"}</span>,
    },
    {
      key: "category",
      header: "ประเภทห้อง",
      render: (l) => (
        <span className="text-ink-2">{l.categoryroom?.name || "ไม่ระบุประเภท"}</span>
      ),
    },
    {
      key: "action",
      header: "ดำเนินการ",
      align: "right",
      width: "12rem",
      actions: true,
      render: (l) => (
        <ButtonLink
          href={`/location/${encodeURIComponent(l.namelocation)}`}
          size="sm"
          variant="secondary"
          iconAfter={<IconArrowRight size={15} />}
          className="max-md:w-full"
        >
          ดูของในห้องนี้
        </ButtonLink>
      ),
    },
  ];

  return (
    <PageShell>
      <PageHeader
        title="สถานที่ทั้งหมด"
        trail={[{ label: "หน้าแรก", href: "/" }, { label: "สถานที่" }]}
        meta={
          loading
            ? "กำลังโหลด..."
            : `${filtered.length.toLocaleString("th-TH")} ห้อง${
                filtered.length !== locations.length
                  ? ` จากทั้งหมด ${locations.length.toLocaleString("th-TH")} ห้อง`
                  : ""
              }`
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
          label="ค้นหาสถานที่หรือผู้รับผิดชอบ"
          placeholder="ค้นหาชื่อห้อง หรือผู้รับผิดชอบ..."
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          className="w-full sm:w-80"
        />
        <FilterSelect
          label="กรองตามประเภทห้อง"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-56"
        >
          <option value="">ทุกประเภทห้อง</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
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
          rows={filtered}
          rowKey={(l) => l.id}
          loading={loading}
          caption="รายชื่อสถานที่ทั้งหมดในโรงเรียน"
          empty={
            locations.length === 0 ? (
              <EmptyState
                title="ยังไม่มีสถานที่ในระบบ"
                description="แอดมินสามารถเพิ่มห้องได้ที่หน้าจัดการทะเบียน"
              />
            ) : (
              <EmptyState
                title="ไม่พบห้องที่ตรงกับที่ค้นหา"
                description="ลองเปลี่ยนคำค้นหา หรือล้างตัวกรองประเภทห้อง"
                action={
                  <Button
                    onClick={() => {
                      setSearchLocation("");
                      setSelectedCategory("");
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
