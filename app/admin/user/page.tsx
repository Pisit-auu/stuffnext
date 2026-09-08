"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button, ButtonLink } from "../../component/ui/Button";
import { SearchField } from "../../component/ui/Field";
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
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconEdit,
  IconPlus,
  IconSheet,
  IconTrash,
} from "../../component/ui/icons";
import { useToast } from "../../component/ui/Toast";
import { exportSheet } from "@/lib/excel";
import { errorMessage } from "@/lib/format";
import type { AppUser } from "@/lib/types";

const PAGE_SIZE = 15;

export default function AdminUsers() {
  const { data: session } = useSession();
  const toast = useToast();

  const [users, setUsers] = useState<AppUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [originalUsername, setOriginalUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [savingUsername, setSavingUsername] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<AppUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/auth/signup", {
        params: { page, limit: PAGE_SIZE },
      });
      setUsers(res.data.users ?? []);
      setTotalCount(res.data.totalCount ?? 0);
    } catch (err) {
      setError(errorMessage(err, "โหลดรายชื่อผู้ใช้ไม่สำเร็จ"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const filteredUsers = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return users;
    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(term) ||
        `${user.name ?? ""} ${user.surname ?? ""}`.toLowerCase().includes(term),
    );
  }, [users, searchQuery]);

  const totalPages = totalCount > 0 ? Math.ceil(totalCount / PAGE_SIZE) : 1;

  const startEdit = (user: AppUser) => {
    setEditingId(user.id);
    setOriginalUsername(user.username);
    setNewUsername(user.username);
  };

  const saveUsername = async () => {
    if (editingId === null) return;
    const trimmed = newUsername.trim();
    if (!trimmed) {
      toast.error("กรอกชื่อผู้ใช้ใหม่ก่อนบันทึก");
      return;
    }
    if (trimmed === originalUsername) {
      setEditingId(null);
      return;
    }

    setSavingUsername(true);
    try {
      await axios.put(`/api/auth/signup/${originalUsername}`, { username: trimmed });

      // เปลี่ยนชื่อผู้ใช้ของตัวเอง ต้องเข้าสู่ระบบใหม่ด้วยชื่อใหม่
      if (session?.user?.username === originalUsername) {
        toast.info("เปลี่ยนชื่อผู้ใช้ของคุณแล้ว กรุณาเข้าสู่ระบบใหม่");
        signOut({ callbackUrl: "/login" });
        return;
      }

      toast.success(`เปลี่ยนชื่อผู้ใช้เป็น ${trimmed} แล้ว`);
      setEditingId(null);
      await fetchUsers(currentPage);
    } catch (err) {
      toast.error(errorMessage(err, "เปลี่ยนชื่อผู้ใช้ไม่สำเร็จ อาจมีชื่อนี้อยู่แล้ว"));
    } finally {
      setSavingUsername(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/auth/signup/${pendingDelete.id}`);
      toast.success(`ลบผู้ใช้ ${pendingDelete.username} แล้ว`);
      setPendingDelete(null);
      await fetchUsers(currentPage);
    } catch (err) {
      toast.error(errorMessage(err, "ลบผู้ใช้ไม่สำเร็จ"));
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = async () => {
    try {
      await exportSheet<AppUser>({
        filename: "รายชื่อผู้ใช้",
        sheetName: "ผู้ใช้",
        rows: users,
        columns: [
          { header: "ชื่อผู้ใช้", width: 20, value: (u) => u.username },
          {
            header: "ชื่อ-นามสกุล",
            width: 30,
            value: (u) => `${u.name ?? ""} ${u.surname ?? ""}`.trim(),
          },
          { header: "บทบาท", width: 14, value: (u) => u.role },
        ],
      });
      toast.success("บันทึกไฟล์ Excel แล้ว");
    } catch (err) {
      toast.error(errorMessage(err, "สร้างไฟล์ Excel ไม่สำเร็จ"));
    }
  };

  const columns: Column<AppUser>[] = [
    {
      key: "username",
      header: "ชื่อผู้ใช้",
      primary: true,
      width: "18rem",
      render: (u) =>
        editingId === u.id ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              aria-label={`ชื่อผู้ใช้ใหม่ของ ${u.username}`}
              autoFocus
              className="h-8 w-40 rounded border border-ink bg-plate px-2 font-mono text-meta text-ink focus:outline-none focus:ring-2 focus:ring-ink/15"
            />
          </div>
        ) : (
          <div className="min-w-0">
            <CodeTag>{u.username}</CodeTag>
            <p className="mt-1.5 text-base text-ink md:hidden">
              {`${u.name ?? ""} ${u.surname ?? ""}`.trim() || "—"}
            </p>
          </div>
        ),
    },
    {
      key: "fullname",
      header: "ชื่อ-นามสกุล",
      hideOnCard: true,
      render: (u) => (
        <span className="text-ink">
          {`${u.name ?? ""} ${u.surname ?? ""}`.trim() || "—"}
        </span>
      ),
    },
    {
      key: "role",
      header: "บทบาท",
      width: "9rem",
      render: (u) => (
        <StatusChip tone="neutral">
          {u.role === "admin" ? "แอดมิน" : "ผู้ใช้ทั่วไป"}
        </StatusChip>
      ),
    },
    {
      key: "action",
      header: "ดำเนินการ",
      align: "right",
      width: "14rem",
      actions: true,
      render: (u) => (
        <div className="flex flex-wrap justify-end gap-2 max-md:w-full">
          {editingId === u.id ? (
            <>
              <Button
                size="sm"
                variant="primary"
                icon={<IconCheck size={15} />}
                loading={savingUsername}
                onClick={saveUsername}
                className="max-md:flex-1"
              >
                บันทึก
              </Button>
              <Button size="sm" disabled={savingUsername} onClick={() => setEditingId(null)}>
                ยกเลิก
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                icon={<IconEdit size={15} />}
                onClick={() => startEdit(u)}
                className="max-md:flex-1"
                aria-label={`แก้ไขชื่อผู้ใช้ ${u.username}`}
              >
                แก้ไขชื่อผู้ใช้
              </Button>
              <Button
                size="sm"
                variant="danger"
                icon={<IconTrash size={15} />}
                aria-label={`ลบผู้ใช้ ${u.username}`}
                disabled={session?.user?.username === u.username}
                title={
                  session?.user?.username === u.username
                    ? "ลบบัญชีของตัวเองไม่ได้"
                    : undefined
                }
                onClick={() => setPendingDelete(u)}
              >
                ลบ
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <PageShell>
      <PageHeader
        trail={[
          { label: "หน้าแรก", href: "/" },
          { label: "จัดการทะเบียน", href: "/admin" },
          { label: "ผู้ใช้งาน" },
        ]}
        title="ผู้ใช้งานทั้งหมด"
        meta={
          loading
            ? "กำลังโหลด..."
            : `${totalCount.toLocaleString("th-TH")} บัญชี · หน้า ${currentPage} จาก ${totalPages}`
        }
        actions={
          <>
            <Button
              onClick={handleDownload}
              icon={<IconSheet size={16} />}
              disabled={loading || users.length === 0}
            >
              ดาวน์โหลด Excel
            </Button>
            <ButtonLink
              href="/admin/user/singupuser"
              variant="primary"
              icon={<IconPlus size={16} />}
            >
              เพิ่มผู้ใช้งาน
            </ButtonLink>
          </>
        }
      />

      <Toolbar>
        <SearchField
          label="ค้นหาผู้ใช้ในหน้านี้"
          placeholder="ค้นหาชื่อผู้ใช้ หรือชื่อ-นามสกุล (เฉพาะหน้านี้)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-96"
        />
      </Toolbar>

      {error ? (
        <ErrorState
          title="โหลดข้อมูลไม่สำเร็จ"
          description={error}
          action={
            <Button variant="primary" onClick={() => fetchUsers(currentPage)}>
              ลองอีกครั้ง
            </Button>
          }
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={filteredUsers}
            rowKey={(u) => u.id}
            loading={loading}
            caption="รายชื่อผู้ใช้งานระบบ"
            empty={
              users.length === 0 ? (
                <EmptyState
                  title="ยังไม่มีผู้ใช้ในระบบ"
                  action={
                    <ButtonLink href="/admin/user/singupuser" variant="primary">
                      เพิ่มผู้ใช้งาน
                    </ButtonLink>
                  }
                />
              ) : (
                <EmptyState
                  title="ไม่พบผู้ใช้ในหน้านี้"
                  description="การค้นหาทำงานเฉพาะผู้ใช้ในหน้าปัจจุบัน ลองเปลี่ยนหน้าดู"
                  action={<Button onClick={() => setSearchQuery("")}>ล้างคำค้นหา</Button>}
                />
              )
            }
          />

          {totalPages > 1 && (
            <nav
              aria-label="แบ่งหน้า"
              className="mt-5 flex items-center justify-center gap-3"
            >
              <Button
                icon={<IconChevronLeft size={16} />}
                disabled={currentPage === 1 || loading}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                ก่อนหน้า
              </Button>
              <span className="font-mono text-meta text-ink-2">
                {currentPage} / {totalPages}
              </span>
              <Button
                disabled={currentPage === totalPages || loading}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              >
                ถัดไป
                <IconChevronRight size={16} />
              </Button>
            </nav>
          )}
        </>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        busy={deleting}
        title="ลบผู้ใช้"
        description={
          pendingDelete && (
            <>
              <p>
                ลบบัญชี{" "}
                <span className="font-mono font-medium text-ink">
                  {pendingDelete.username}
                </span>{" "}
                {`${pendingDelete.name ?? ""} ${pendingDelete.surname ?? ""}`.trim()}
              </p>
              <p className="mt-2 text-alert">
                ประวัติการยืมทั้งหมดของผู้ใช้คนนี้จะถูกลบไปด้วย และย้อนกลับไม่ได้
              </p>
            </>
          )
        }
        confirmLabel="ลบผู้ใช้"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </PageShell>
  );
}
