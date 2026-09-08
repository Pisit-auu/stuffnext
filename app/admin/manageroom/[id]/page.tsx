"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Button, ButtonLink } from "../../../component/ui/Button";
import { SearchField, SelectField, TextField } from "../../../component/ui/Field";
import { PageShell, PageHeader, Toolbar } from "../../../component/ui/Layout";
import {
  CodeTag,
  DataTable,
  EmptyState,
  ErrorState,
  TickBar,
  type Column,
} from "../../../component/ui/Data";
import { ConfirmDialog, Modal } from "../../../component/ui/Modal";
import { IconPlus, IconSheet, IconTrash } from "../../../component/ui/icons";
import { useToast } from "../../../component/ui/Toast";
import { exportSheet } from "@/lib/excel";
import { errorMessage, formatDate } from "@/lib/format";
import type { Asset, AssetLocation, Location } from "@/lib/types";

export default function ManageRoom() {
  const { id } = useParams() as { id: string };
  const roomId = decodeURIComponent(id);
  const toast = useToast();

  const [rows, setRows] = useState<AssetLocation[]>([]);
  const [location, setLocation] = useState<Location | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // เพิ่มของเข้าห้อง
  const [addOpen, setAddOpen] = useState(false);
  const [availableAssets, setAvailableAssets] = useState<Asset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [addAvailable, setAddAvailable] = useState("0");
  const [addUnavailable, setAddUnavailable] = useState("0");
  const [addDate, setAddDate] = useState("");
  const [addError, setAddError] = useState("");
  const [adding, setAdding] = useState(false);

  // แก้ไขของในห้อง
  const [detail, setDetail] = useState<AssetLocation | null>(null);
  const [editing, setEditing] = useState(false);
  const [editAvailable, setEditAvailable] = useState("0");
  const [editUnavailable, setEditUnavailable] = useState("0");
  const [editDate, setEditDate] = useState("");
  const [editError, setEditError] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [removing, setRemoving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [assetRes, locationRes] = await Promise.all([
        axios.get<AssetLocation[]>(`/api/assetlocationroom?location=${id}`),
        axios.get<Location>(`/api/location/${roomId}`),
      ]);
      setRows(assetRes.data);
      setLocation(locationRes.data);
    } catch (err) {
      setError(errorMessage(err, "โหลดข้อมูลของในห้องไม่สำเร็จ"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter(
      (row) =>
        row.asset.name.toLowerCase().includes(term) ||
        row.asset.assetid.toLowerCase().includes(term),
    );
  }, [rows, search]);

  /** เปิดลิ้นชักเพิ่มของ — เลือกได้เฉพาะของที่ยังไม่อยู่ในห้อง และยังเหลือในคลัง */
  const openAdd = async () => {
    setAddOpen(true);
    setSelectedAssetId("");
    setAddAvailable("0");
    setAddUnavailable("0");
    setAddDate("");
    setAddError("");
    try {
      const res = await axios.get<Asset[]>("/api/asset");
      setAvailableAssets(
        res.data.filter(
          (asset) =>
            !rows.some((row) => row.assetId === asset.assetid) &&
            (asset.availableValue > 0 || asset.unavailableValue > 0),
        ),
      );
    } catch (err) {
      setAddError(errorMessage(err, "โหลดรายการครุภัณฑ์ไม่สำเร็จ"));
    }
  };

  const selectedAsset = availableAssets.find((a) => a.assetid === selectedAssetId);

  const submitAdd = async () => {
    if (!selectedAsset) {
      setAddError("เลือกครุภัณฑ์ที่จะเพิ่มเข้าห้องก่อน");
      return;
    }
    const available = Number(addAvailable);
    const unavailable = Number(addUnavailable);
    if (!Number.isFinite(available) || !Number.isFinite(unavailable)) {
      setAddError("จำนวนต้องเป็นตัวเลข");
      return;
    }
    if (available < 0 || unavailable < 0) {
      setAddError("จำนวนต้องไม่ติดลบ");
      return;
    }
    if (available + unavailable < 1) {
      setAddError("ใส่จำนวนอย่างน้อย 1 ชิ้น");
      return;
    }
    if (available > selectedAsset.availableValue) {
      setAddError(`คลังกลางเหลือของพร้อมใช้งาน ${selectedAsset.availableValue} ชิ้น`);
      return;
    }
    if (unavailable > selectedAsset.unavailableValue) {
      setAddError(`คลังกลางเหลือของไม่พร้อมใช้งาน ${selectedAsset.unavailableValue} ชิ้น`);
      return;
    }

    setAdding(true);
    setAddError("");
    try {
      await axios.post("/api/assetlocation", {
        assetId: selectedAsset.assetid,
        locationId: location?.namelocation ?? roomId,
        inRoomavailableValue: available,
        inRoomaunavailableValue: unavailable,
        createdAt: addDate,
      });
      toast.success(`เพิ่ม ${selectedAsset.name} เข้าห้อง ${roomId} แล้ว`);
      setAddOpen(false);
      await load();
    } catch (err) {
      setAddError(errorMessage(err, "เพิ่มครุภัณฑ์เข้าห้องไม่สำเร็จ"));
    } finally {
      setAdding(false);
    }
  };

  const openDetail = (row: AssetLocation) => {
    setDetail(row);
    setEditing(false);
    setEditAvailable(String(row.inRoomavailableValue));
    setEditUnavailable(String(row.inRoomaunavailableValue));
    setEditDate(row.createdAt ?? "");
    setEditError("");
  };

  const maxAvailable = detail
    ? detail.asset.availableValue + detail.inRoomavailableValue
    : 0;
  const maxUnavailable = detail
    ? detail.asset.unavailableValue + detail.inRoomaunavailableValue
    : 0;

  /** แก้ไขจำนวนในห้อง = ย้ายส่วนต่างกลับเข้า/ออกจากคลังกลาง */
  const submitEdit = async () => {
    if (!detail) return;
    const available = Number(editAvailable);
    const unavailable = Number(editUnavailable);

    if (!Number.isFinite(available) || !Number.isFinite(unavailable)) {
      setEditError("จำนวนต้องเป็นตัวเลข");
      return;
    }
    if (available < 0 || unavailable < 0) {
      setEditError("จำนวนต้องไม่ติดลบ");
      return;
    }
    if (available > maxAvailable || unavailable > maxUnavailable) {
      setEditError(
        `รวมกับของในคลังกลางแล้ว ใส่ได้ไม่เกิน ${maxAvailable} / ${maxUnavailable} ชิ้น`,
      );
      return;
    }

    setSavingEdit(true);
    setEditError("");
    try {
      const current = await axios.get<AssetLocation>(`/api/assetlocation/${detail.id}`);
      const asset = await axios.get<Asset>(`/api/asset/${current.data.assetId}`);

      await axios.put(`/api/assetlocation/${detail.id}`, {
        inRoomavailableValue: available,
        inRoomaunavailableValue: unavailable,
        createdAt: editDate,
      });

      await axios.put(`/api/asset/${current.data.assetId}`, {
        availableValue:
          asset.data.availableValue + current.data.inRoomavailableValue - available,
        unavailableValue:
          asset.data.unavailableValue + current.data.inRoomaunavailableValue - unavailable,
      });

      toast.success("บันทึกจำนวนในห้องแล้ว");
      setDetail(null);
      await load();
    } catch (err) {
      setEditError(errorMessage(err, "บันทึกไม่สำเร็จ"));
    } finally {
      setSavingEdit(false);
    }
  };

  /** เอาของออกจากห้อง = คืนยอดทั้งหมดกลับเข้าคลังกลาง */
  const submitRemove = async () => {
    if (!detail) return;
    setRemoving(true);
    try {
      const current = await axios.get<AssetLocation>(`/api/assetlocation/${detail.id}`);
      const asset = await axios.get<Asset>(`/api/asset/${current.data.assetId}`);

      await axios.delete(`/api/assetlocation/${detail.id}`);
      await axios.put(`/api/asset/${current.data.assetId}`, {
        availableValue: asset.data.availableValue + current.data.inRoomavailableValue,
        unavailableValue:
          asset.data.unavailableValue + current.data.inRoomaunavailableValue,
      });

      toast.success("เอาของออกจากห้องและคืนยอดกลับคลังกลางแล้ว");
      setConfirmRemove(false);
      setDetail(null);
      await load();
    } catch (err) {
      toast.error(errorMessage(err, "เอาของออกจากห้องไม่สำเร็จ"));
    } finally {
      setRemoving(false);
    }
  };

  const handleDownload = async () => {
    try {
      await exportSheet<AssetLocation>({
        filename: `ข้อมูลครุภัณฑ์ ห้อง${roomId}`,
        sheetName: "ครุภัณฑ์ในห้อง",
        rows: filtered,
        columns: [
          { header: "รหัสครุภัณฑ์", width: 18, value: (r) => r.asset?.assetid },
          { header: "ชื่อครุภัณฑ์", width: 30, value: (r) => r.asset?.name },
          { header: "ประเภทครุภัณฑ์", width: 24, value: (r) => r.asset?.category?.name },
          { header: "จำนวนที่ใช้งานได้", width: 20, value: (r) => r.inRoomavailableValue },
          {
            header: "จำนวนที่ใช้งานไม่ได้",
            width: 22,
            value: (r) => r.inRoomaunavailableValue,
          },
          { header: "วันที่เพิ่ม", width: 18, value: (r) => r.createdAt },
        ],
      });
      toast.success(`บันทึกไฟล์ Excel แล้ว ${filtered.length} รายการ`);
    } catch (err) {
      toast.error(errorMessage(err, "สร้างไฟล์ Excel ไม่สำเร็จ"));
    }
  };

  const columns: Column<AssetLocation>[] = [
    {
      key: "asset",
      header: "ครุภัณฑ์",
      primary: true,
      render: (r) => (
        <div className="min-w-0">
          <CodeTag>{r.asset.assetid}</CodeTag>
          <p className="mt-1.5 font-medium leading-snug text-ink">{r.asset.name}</p>
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
      key: "stock",
      header: "ในห้องนี้",
      width: "13rem",
      render: (r) => (
        <TickBar
          available={r.inRoomavailableValue}
          broken={r.inRoomaunavailableValue}
          label={`ใช้งานได้ ${r.inRoomavailableValue} · ใช้งานไม่ได้ ${r.inRoomaunavailableValue}`}
        />
      ),
    },
    {
      key: "action",
      header: "ดำเนินการ",
      align: "right",
      width: "10rem",
      actions: true,
      render: (r) => (
        <Button
          size="sm"
          onClick={() => openDetail(r)}
          className="max-md:w-full"
          aria-label={`แก้ไขจำนวนของ ${r.asset.name}`}
        >
          แก้ไขจำนวน
        </Button>
      ),
    },
  ];

  return (
    <PageShell>
      <PageHeader
        trail={[
          { label: "หน้าแรก", href: "/" },
          { label: "จัดการทะเบียน", href: "/admin" },
          { label: roomId },
        ]}
        title={`จัดการของในห้อง ${roomId}`}
        meta={
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>
              ผู้รับผิดชอบ{" "}
              <span className="text-ink">{location?.nameteacher || "ยังไม่ระบุ"}</span>
            </span>
            <span>{rows.length.toLocaleString("th-TH")} รายการในห้องนี้</span>
          </span>
        }
        actions={
          <>
            <Button
              onClick={handleDownload}
              icon={<IconSheet size={16} />}
              disabled={loading || filtered.length === 0}
            >
              ดาวน์โหลด Excel
            </Button>
            <Button variant="primary" icon={<IconPlus size={16} />} onClick={openAdd}>
              เพิ่มครุภัณฑ์เข้าห้อง
            </Button>
          </>
        }
      />

      <Toolbar>
        <SearchField
          label="ค้นหาของในห้องนี้"
          placeholder="ค้นหาชื่อ หรือรหัสครุภัณฑ์..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80"
        />
        <ButtonLink
          href={`/location/${encodeURIComponent(roomId)}`}
          className="sm:ml-auto"
        >
          ดูหน้าห้องนี้แบบผู้ใช้ทั่วไป
        </ButtonLink>
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
          rowKey={(r) => r.id}
          loading={loading}
          caption={`ครุภัณฑ์ที่จัดเก็บอยู่ในห้อง ${roomId}`}
          empty={
            rows.length === 0 ? (
              <EmptyState
                title="ห้องนี้ยังไม่มีครุภัณฑ์"
                description="เพิ่มของจากคลังกลางเข้ามาในห้องนี้ได้เลย"
                action={
                  <Button variant="primary" icon={<IconPlus size={16} />} onClick={openAdd}>
                    เพิ่มครุภัณฑ์เข้าห้อง
                  </Button>
                }
              />
            ) : (
              <EmptyState
                title="ไม่พบครุภัณฑ์ที่ตรงกับที่ค้นหา"
                action={<Button onClick={() => setSearch("")}>ล้างคำค้นหา</Button>}
              />
            )
          }
        />
      )}

      {/* ลิ้นชักเพิ่มของเข้าห้อง */}
      <Modal
        open={addOpen}
        onClose={() => !adding && setAddOpen(false)}
        title="เพิ่มครุภัณฑ์เข้าห้อง"
        code={`ห้อง ${roomId}`}
        footer={
          <>
            <Button variant="quiet" onClick={() => setAddOpen(false)} disabled={adding}>
              ยกเลิก
            </Button>
            <Button variant="primary" onClick={submitAdd} loading={adding}>
              เพิ่มเข้าห้อง
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <SelectField
            label="ครุภัณฑ์จากคลังกลาง"
            required
            value={selectedAssetId}
            hint="แสดงเฉพาะของที่ยังไม่อยู่ในห้องนี้ และยังเหลือในคลังกลาง"
            onChange={(e) => {
              setSelectedAssetId(e.target.value);
              setAddAvailable("0");
              setAddUnavailable("0");
              setAddError("");
            }}
          >
            <option value="">เลือกครุภัณฑ์</option>
            {availableAssets.map((asset) => (
              <option key={asset.assetid} value={asset.assetid}>
                {asset.name} · {asset.assetid}
              </option>
            ))}
          </SelectField>

          {selectedAsset && (
            <>
              <p className="rounded border border-edge bg-sunk px-3 py-2 text-meta text-ink-2">
                คลังกลางเหลือ พร้อมใช้งาน{" "}
                <span className="font-mono text-stock">{selectedAsset.availableValue}</span>{" "}
                · ไม่พร้อมใช้งาน{" "}
                <span className="font-mono">{selectedAsset.unavailableValue}</span>
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="จำนวนที่พร้อมใช้งาน"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={selectedAsset.availableValue}
                  value={addAvailable}
                  onChange={(e) => setAddAvailable(e.target.value)}
                />
                <TextField
                  label="จำนวนที่ไม่พร้อมใช้งาน"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={selectedAsset.unavailableValue}
                  value={addUnavailable}
                  onChange={(e) => setAddUnavailable(e.target.value)}
                />
              </div>
              <TextField
                label="วันที่เพิ่มเข้าห้อง"
                type="date"
                value={addDate}
                onChange={(e) => setAddDate(e.target.value)}
              />
            </>
          )}

          {addError && (
            <p
              role="alert"
              className="rounded border border-alert/40 bg-alert-soft px-3 py-2 text-base text-alert"
            >
              {addError}
            </p>
          )}
        </div>
      </Modal>

      {/* ลิ้นชักรายละเอียด / แก้ไขจำนวน */}
      <Modal
        open={detail !== null && !confirmRemove}
        onClose={() => !savingEdit && setDetail(null)}
        title={detail?.asset.name ?? ""}
        code={detail?.asset.assetid}
        footer={
          editing ? (
            <>
              <Button variant="quiet" onClick={() => setEditing(false)} disabled={savingEdit}>
                ยกเลิกการแก้ไข
              </Button>
              <Button variant="primary" onClick={submitEdit} loading={savingEdit}>
                บันทึกจำนวน
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="danger"
                icon={<IconTrash size={16} />}
                onClick={() => setConfirmRemove(true)}
              >
                เอาออกจากห้อง
              </Button>
              <Button variant="primary" onClick={() => setEditing(true)}>
                แก้ไขจำนวน
              </Button>
            </>
          )
        }
      >
        {detail && (
          <div className="space-y-4">
            <p className="text-base text-ink-2">
              อยู่ในห้อง <span className="font-medium text-ink">{roomId}</span>
            </p>

            {editing ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    label="จำนวนที่ใช้งานได้"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={maxAvailable}
                    hint={`ใส่ได้ไม่เกิน ${maxAvailable}`}
                    value={editAvailable}
                    onChange={(e) => setEditAvailable(e.target.value)}
                  />
                  <TextField
                    label="จำนวนที่ใช้งานไม่ได้"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={maxUnavailable}
                    hint={`ใส่ได้ไม่เกิน ${maxUnavailable}`}
                    value={editUnavailable}
                    onChange={(e) => setEditUnavailable(e.target.value)}
                  />
                </div>
                <TextField
                  label="วันที่เพิ่มเข้าห้อง"
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                />
                <p className="text-meta text-ink-3">
                  ส่วนที่ลดลงจะถูกคืนเข้าคลังกลางโดยอัตโนมัติ
                  และถ้าใส่ 0 ทั้งสองช่อง ของชิ้นนี้จะถูกเอาออกจากห้อง
                </p>
                {editError && (
                  <p
                    role="alert"
                    className="rounded border border-alert/40 bg-alert-soft px-3 py-2 text-base text-alert"
                  >
                    {editError}
                  </p>
                )}
              </>
            ) : (
              <dl className="divide-y divide-edge rounded border border-edge">
                <div className="flex items-baseline justify-between gap-3 px-3 py-2.5">
                  <dt className="text-ink-2">ใช้งานได้</dt>
                  <dd className="font-mono text-stock">{detail.inRoomavailableValue}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-3 px-3 py-2.5">
                  <dt className="text-ink-2">ใช้งานไม่ได้</dt>
                  <dd className="font-mono text-ink-2">{detail.inRoomaunavailableValue}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-3 px-3 py-2.5">
                  <dt className="text-ink-2">วันที่เพิ่ม</dt>
                  <dd className="text-ink">{formatDate(detail.createdAt)}</dd>
                </div>
              </dl>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={confirmRemove}
        busy={removing}
        title="เอาของออกจากห้อง"
        description={
          detail && (
            <>
              <p>
                เอา <span className="font-medium text-ink">{detail.asset.name}</span>{" "}
                ออกจากห้อง {roomId}
              </p>
              <p className="mt-2">
                จำนวน {detail.inRoomavailableValue + detail.inRoomaunavailableValue} ชิ้น
                จะถูกคืนกลับเข้าคลังกลาง
              </p>
            </>
          )
        }
        confirmLabel="เอาออกจากห้อง"
        onConfirm={submitRemove}
        onCancel={() => setConfirmRemove(false)}
      />
    </PageShell>
  );
}
