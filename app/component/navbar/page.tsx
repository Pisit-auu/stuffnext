"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  IconAsset,
  IconChevronDown,
  IconClose,
  IconLogout,
  IconMenu,
  IconRoom,
  IconClock,
  IconUser,
} from "../ui/icons";

type NavLink = { href: string; label: string; icon: React.ReactNode };

/**
 * รางเหล็ก — ขอบบนของตู้พัสดุ
 * ป้ายระบบสลักอยู่ซ้ายสุด และตำแหน่งปัจจุบันถูกขีดเส้นใต้ไว้เสมอ
 */
export default function NavbarGlobal() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  const signedIn = status === "authenticated";
  const isAdmin = session?.user?.role === "admin";
  const displayName = session?.user?.name?.trim() || session?.user?.username || "บัญชีของฉัน";

  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!accountOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!accountRef.current?.contains(e.target as Node)) setAccountOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAccountOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [accountOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const links: NavLink[] = [
    { href: "/allasset", label: "ครุภัณฑ์ทั้งหมด", icon: <IconAsset size={16} /> },
    { href: "/home", label: "สถานที่ทั้งหมด", icon: <IconRoom size={16} /> },
  ];
  if (signedIn) {
    links.push({
      href: "/profile/history",
      label: "สถานะรายการ",
      icon: <IconClock size={16} />,
    });
  }

  const adminLinks = [
    { href: "/admin", label: "จัดการทะเบียน" },
    { href: "/admin/borrowall", label: "ประวัติการยืมทั้งหมด" },
    { href: "/admin/user", label: "ผู้ใช้งานทั้งหมด" },
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/40 bg-rail">
        <div className="mx-auto flex h-[var(--rail-h)] max-w-rail items-center gap-3 px-3 sm:px-6">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="เปิดเมนู"
            aria-expanded={menuOpen}
            className="-ml-1 rounded p-2 text-ink-rail transition-colors hover:bg-white/10 lg:hidden"
          >
            <IconMenu size={20} />
          </button>

          {/* ป้ายระบบ — แผ่นโลหะสลัก */}
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-2.5 rounded focus-visible:outline-offset-4"
          >
            <span className="flex h-8 items-center border border-white/25 px-2 font-mono text-[0.8125rem] font-medium tracking-[0.14em] text-ink-rail transition-colors group-hover:border-white/60">
              SNK
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[0.9375rem] font-semibold leading-tight text-ink-rail">
                ทะเบียนครุภัณฑ์
              </span>
              <span className="hidden text-[0.6875rem] uppercase tracking-[0.1em] text-ink-rail-2 sm:block">
                Srinakarin Inventory
              </span>
            </span>
          </Link>

          <nav aria-label="เมนูหลัก" className="ml-auto hidden items-stretch lg:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`flex h-[var(--rail-h)] items-center gap-2 border-b-2 px-3.5 text-[0.9375rem] transition-colors ${
                  isActive(l.href)
                    ? "border-ink-rail text-ink-rail"
                    : "border-transparent text-ink-rail-2 hover:border-white/25 hover:text-ink-rail"
                }`}
              >
                {l.icon}
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-3">
            {!signedIn ? (
              <Link
                href="/login"
                className="flex h-9 items-center gap-2 rounded border border-white/30 px-3 text-[0.9375rem] text-ink-rail transition-colors hover:border-white/70 hover:bg-white/10"
              >
                <IconUser size={16} />
                เข้าสู่ระบบ
              </Link>
            ) : (
              <div className="relative" ref={accountRef}>
                <button
                  type="button"
                  onClick={() => setAccountOpen((v) => !v)}
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                  className="flex h-9 max-w-[13rem] items-center gap-2 rounded border border-white/25 px-2.5 text-[0.9375rem] text-ink-rail transition-colors hover:border-white/60 hover:bg-white/10"
                >
                  <IconUser size={16} />
                  <span className="hidden truncate sm:inline">{displayName}</span>
                  <IconChevronDown
                    size={15}
                    className={`transition-transform duration-[var(--dur)] ${
                      accountOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {accountOpen && (
                  <div
                    role="menu"
                    className="animate-slide-up absolute right-0 top-[calc(100%+0.5rem)] w-60 overflow-hidden rounded border border-edge bg-plate shadow-drawer"
                  >
                    <div className="border-b border-edge px-3 py-2.5">
                      <p className="truncate text-base font-medium text-ink">{displayName}</p>
                      <p className="truncate font-mono text-meta text-ink-3">
                        {session?.user?.username}
                        {isAdmin && " · admin"}
                      </p>
                    </div>
                    <MenuLink href="/profile">โปรไฟล์ของฉัน</MenuLink>
                    <MenuLink href="/profile/history">สถานะการยืมของฉัน</MenuLink>
                    {isAdmin && (
                      <>
                        <p className="border-t border-edge px-3 pb-1 pt-2 text-[0.6875rem] uppercase tracking-[0.08em] text-ink-3">
                          แอดมิน
                        </p>
                        {adminLinks.map((l) => (
                          <MenuLink key={l.href} href={l.href}>
                            {l.label}
                          </MenuLink>
                        ))}
                      </>
                    )}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="flex w-full items-center gap-2 border-t border-edge px-3 py-2.5 text-left text-base text-ink-2 transition-colors hover:bg-sunk hover:text-ink"
                    >
                      <IconLogout size={16} />
                      ออกจากระบบ
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ลิ้นชักเมนูสำหรับจอแคบ */}
      {menuOpen && (
        <div className="fixed inset-0 z-[55] lg:hidden">
          <div
            className="absolute inset-0 bg-ink/50"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <nav
            aria-label="เมนู"
            className="animate-slide-in absolute inset-y-0 left-0 flex w-[17rem] max-w-[85vw] flex-col border-r border-edge bg-plate shadow-drawer"
          >
            <div className="flex items-center justify-between bg-rail px-4 py-3">
              <div>
                <p className="text-[0.9375rem] font-semibold text-ink-rail">
                  {signedIn ? displayName : "ทะเบียนครุภัณฑ์"}
                </p>
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-rail-2">
                  Srinakarin
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="ปิดเมนู"
                className="rounded p-1.5 text-ink-rail transition-colors hover:bg-white/10"
              >
                <IconClose size={19} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-2">
              {links.map((l) => (
                <DrawerLink key={l.href} href={l.href} active={isActive(l.href)} icon={l.icon}>
                  {l.label}
                </DrawerLink>
              ))}
              {signedIn && (
                <DrawerLink
                  href="/profile"
                  active={isActive("/profile")}
                  icon={<IconUser size={16} />}
                >
                  โปรไฟล์ของฉัน
                </DrawerLink>
              )}
              {isAdmin && (
                <>
                  <p className="px-4 pb-1 pt-4 text-[0.6875rem] uppercase tracking-[0.08em] text-ink-3">
                    แอดมิน
                  </p>
                  {adminLinks.map((l) => (
                    <DrawerLink key={l.href} href={l.href} active={isActive(l.href)}>
                      {l.label}
                    </DrawerLink>
                  ))}
                </>
              )}
            </div>

            <div className="border-t border-edge p-3">
              {signedIn ? (
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex w-full items-center gap-2 rounded border border-edge-strong px-3 py-2 text-base text-ink-2 transition-colors hover:bg-sunk hover:text-ink"
                >
                  <IconLogout size={16} />
                  ออกจากระบบ
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex w-full items-center justify-center gap-2 rounded border border-ink bg-ink px-3 py-2 text-base text-plate"
                >
                  <IconUser size={16} />
                  เข้าสู่ระบบ
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

function MenuLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      role="menuitem"
      className="block px-3 py-2.5 text-base text-ink transition-colors hover:bg-sunk"
    >
      {children}
    </Link>
  );
}

function DrawerLink({
  href,
  children,
  active,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-2.5 border-l-2 px-4 py-2.5 text-base transition-colors ${
        active
          ? "border-ink bg-sunk font-medium text-ink"
          : "border-transparent text-ink-2 hover:bg-sunk hover:text-ink"
      }`}
    >
      {icon}
      {children}
    </Link>
  );
}
