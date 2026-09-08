/**
 * ชุดไอคอนของ "ทะเบียนโลหะ" — เส้นเดี่ยวหนัก 1.5 ปลายตัดตรง มุมตัดตรง
 * เขียนเองทั้งหมดเพื่อให้อยู่ในไวยากรณ์เดียวกับป้ายทะเบียนและเส้นสกัดบนตู้เหล็ก
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 18, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const IconSearch = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="6.25" />
    <path d="M15.5 15.5 20 20" />
  </Icon>
);

export const IconMenu = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" />
  </Icon>
);

export const IconClose = (p: IconProps) => (
  <Icon {...p}>
    <path d="m5.5 5.5 13 13M18.5 5.5l-13 13" />
  </Icon>
);

export const IconChevronDown = (p: IconProps) => (
  <Icon {...p}>
    <path d="m5.5 9 6.5 6.5L18.5 9" />
  </Icon>
);

export const IconChevronLeft = (p: IconProps) => (
  <Icon {...p}>
    <path d="M15 5.5 8.5 12l6.5 6.5" />
  </Icon>
);

export const IconChevronRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 5.5 15.5 12 9 18.5" />
  </Icon>
);

export const IconArrowRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </Icon>
);

/** ครุภัณฑ์ — กล่องมีป้ายทะเบียนติดหน้า */
export const IconAsset = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.5 7.5 12 3.5l8.5 4v9L12 20.5l-8.5-4z" />
    <path d="M3.5 7.5 12 11.5l8.5-4M12 11.5v9" />
  </Icon>
);

/** สถานที่ — หน้าลิ้นชัก/ประตูห้อง พร้อมลูกบิด */
export const IconRoom = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 3.5h15v17h-15z" />
    <path d="M8 3.5v17" />
    <circle cx="15.5" cy="12" r="1" fill="currentColor" stroke="none" />
  </Icon>
);

/** ป้ายทะเบียน */
export const IconTag = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.5 6.5h13l4 5.5-4 5.5h-13z" />
    <circle cx="7.5" cy="12" r="1" fill="currentColor" stroke="none" />
  </Icon>
);

export const IconUser = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="8" r="3.75" />
    <path d="M4.5 20.5c0-3.6 3.4-6 7.5-6s7.5 2.4 7.5 6" />
  </Icon>
);

export const IconLogout = (p: IconProps) => (
  <Icon {...p}>
    <path d="M14.5 4.5h5v15h-5" />
    <path d="M4 12h10M10.5 8l3.5 4-3.5 4" />
  </Icon>
);

/** ดาวน์โหลด Excel — แผ่นกระดาษพร้อมลูกศรลง */
export const IconSheet = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5.5 3.5h9l4 4v13h-13z" />
    <path d="M14.5 3.5v4h4" />
    <path d="M12 10.5v6M9.5 14l2.5 2.5 2.5-2.5" />
  </Icon>
);

export const IconPlus = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 4.5v15M4.5 12h15" />
  </Icon>
);

export const IconEdit = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 20h4l11-11-4-4L4 16z" />
    <path d="m14 5 4 4" />
  </Icon>
);

export const IconTrash = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 6.5h15M9.5 6.5V4h5v2.5" />
    <path d="M6.5 6.5 7.5 20.5h9l1-14" />
    <path d="M10.5 10v7M13.5 10v7" />
  </Icon>
);

export const IconCheck = (p: IconProps) => (
  <Icon {...p}>
    <path d="m4.5 12.5 5 5 10-11" />
  </Icon>
);

export const IconClock = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7v5.5l3.5 2" />
  </Icon>
);

export const IconAlert = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3.5 21.5 20h-19z" />
    <path d="M12 10v4.5" />
    <circle cx="12" cy="17.25" r="0.9" fill="currentColor" stroke="none" />
  </Icon>
);

export const IconInfo = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v6" />
    <circle cx="12" cy="7.75" r="0.9" fill="currentColor" stroke="none" />
  </Icon>
);

export const IconUpload = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 15.5v4h15v-4" />
    <path d="M12 16V4.5M8 8.5 12 4.5l4 4" />
  </Icon>
);

export const IconImage = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.5 4.5h17v15h-17z" />
    <path d="m3.5 16 5-5 4.5 4.5 3-3 4.5 4.5" />
    <circle cx="8.5" cy="9" r="1.25" />
  </Icon>
);

export const IconLock = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5.5 10.5h13v10h-13z" />
    <path d="M8.5 10.5V7a3.5 3.5 0 0 1 7 0v3.5" />
  </Icon>
);

export const IconReturn = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20 12a8 8 0 1 1-2.5-5.8" />
    <path d="M20.5 3.5V8H16" />
  </Icon>
);

export const IconSpinner = ({ size = 18, ...p }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="square"
    aria-hidden="true"
    className="animate-spin"
    {...p}
  >
    <path d="M12 3.5a8.5 8.5 0 1 0 8.5 8.5" />
  </svg>
);
