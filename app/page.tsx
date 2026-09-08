import Image from "next/image";
import Link from "next/link";
import { IconArrowRight, IconAsset, IconClock, IconReturn } from "./component/ui/icons";

export const metadata = {
  title: "หน้าแรก",
};

const drawers = [
  {
    href: "/home",
    address: "/home",
    title: "ยืมของจากห้อง",
    description: "เลือกห้อง ดูของที่อยู่ในห้องนั้น แล้วยืมย้ายไปห้องอื่น",
    icon: <IconReturn size={20} />,
  },
  {
    href: "/allasset",
    address: "/allasset",
    title: "ค้นครุภัณฑ์ทั้งโรงเรียน",
    description: "ค้นหาด้วยชื่อหรือประเภท แล้วดูว่าของชิ้นนั้นกระจายอยู่ห้องไหนบ้าง",
    icon: <IconAsset size={20} />,
  },
  {
    href: "/profile/history",
    address: "/profile/history",
    title: "คืนของ และดูสถานะรายการ",
    description: "รายการที่ยืมไป วันที่ต้องคืน และสถานะการตรวจสอบของแอดมิน",
    icon: <IconClock size={20} />,
  },
];

export default function Landing() {
  return (
    <>
      {/* หน้าลิ้นชักใบใหญ่ — ป้ายทะเบียนของทั้งระบบ */}
      <section className="border-b border-edge bg-plate">
        <div className="mx-auto grid max-w-rail gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:py-20">
          <div>
            <h1 className="text-[2.25rem] font-semibold leading-[1.12] tracking-tight text-ink sm:text-[3rem] lg:text-[3.5rem]">
              ทะเบียนครุภัณฑ์
              <span className="mt-1 block text-ink-2">ที่รู้ว่าของอยู่ห้องไหน</span>
            </h1>
            <p className="mt-5 max-w-[52ch] text-[1.0625rem] leading-relaxed text-ink-2">
              ครุภัณฑ์ของโรงเรียนศรีนครินทร์วิทยานุเคราะห์ไม่ได้อยู่ในคลังกลาง
              แต่กระจายอยู่ตามห้อง ระบบนี้เก็บว่าของแต่ละชิ้นอยู่ห้องไหน
              เหลือให้ยืมกี่ชิ้น และใครยืมไปเมื่อไร โดยที่ยอดของทั้งสองห้องยังตรงกันเสมอ
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/home"
                className="inline-flex h-11 items-center gap-2 rounded border border-ink bg-ink px-4 text-base font-medium text-plate shadow-plate transition-colors duration-[var(--dur)] hover:bg-[#2c3032]"
              >
                เริ่มที่รายชื่อห้อง
                <IconArrowRight size={17} />
              </Link>
              <a
                href="https://www.srinakarin.ac.th/about.html"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex h-11 items-center gap-2 rounded border border-edge-strong bg-plate px-4 text-base text-ink shadow-plate transition-colors duration-[var(--dur)] hover:border-ink"
              >
                เว็บไซต์โรงเรียน
              </a>
            </div>
          </div>

          {/* ภาพโรงเรียนติดตั้งเหมือนแผ่นป้ายบนหน้าลิ้นชัก */}
          <figure className="relative">
            <div className="plate overflow-hidden p-2">
              <Image
                src="/head.jpg"
                alt="อาคารเรียนโรงเรียนศรีนครินทร์วิทยานุเคราะห์"
                width={1200}
                height={800}
                priority
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="h-auto w-full object-cover"
              />
              <figcaption className="mt-2 flex items-baseline justify-between gap-3 border-t border-edge px-1 pt-2">
                <span className="font-mono text-[0.75rem] uppercase tracking-[0.08em] text-ink-3">
                  Srinakarin Wittayanukhro School
                </span>
                <span className="text-meta text-ink-2">นาทวี · สงขลา</span>
              </figcaption>
            </div>
          </figure>
        </div>
      </section>

      {/* หน้าลิ้นชักสามใบ — ทางเข้าสู่งานจริงสามอย่าง */}
      <section className="mx-auto max-w-rail px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="mb-1 text-xl font-semibold text-ink">งานที่ทำได้ที่นี่</h2>
        <p className="mb-6 text-base text-ink-2">
          ทุกอย่างเริ่มจากห้อง เพราะห้องคือที่ที่ของอยู่จริง
        </p>

        <ul className="space-y-2">
          {drawers.map((d) => (
            <li key={d.href}>
              <Link
                href={d.href}
                className="tag-row drawer-face group flex items-center gap-4 px-4 py-4 transition-shadow duration-[var(--dur)] hover:shadow-lift sm:gap-6 sm:px-6 sm:py-5"
              >
                <span className="hidden shrink-0 text-ink-2 sm:block">{d.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="tag-strip mb-1.5 font-mono">{d.address}</span>
                  <span className="block text-[1.0625rem] font-semibold text-ink">
                    {d.title}
                  </span>
                  <span className="mt-0.5 block text-base text-ink-2">{d.description}</span>
                </span>
                <IconArrowRight
                  size={20}
                  className="shrink-0 text-ink-3 transition-transform duration-[var(--dur)] group-hover:translate-x-1 group-hover:text-ink"
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* แผ่นป้ายติดต่อ — สลักไว้ที่ขอบล่างของตู้ */}
      <footer className="border-t border-black/40 bg-rail">
        <div className="mx-auto grid max-w-rail gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6 sm:py-12">
          <div>
            <h2 className="mb-2 font-mono text-[0.75rem] uppercase tracking-[0.14em] text-ink-rail-2">
              ที่อยู่
            </h2>
            <p className="text-base leading-relaxed text-ink-rail">
              119 ถนนเพชรเกษม ตำบลคลองทราย
              <br />
              อำเภอนาทวี จังหวัดสงขลา 90160
            </p>
          </div>
          <div>
            <h2 className="mb-2 font-mono text-[0.75rem] uppercase tracking-[0.14em] text-ink-rail-2">
              อีเมล
            </h2>
            <a
              href="mailto:Srinakarin.school@gmail.com"
              className="text-base text-ink-rail underline decoration-white/30 hover:decoration-white"
            >
              Srinakarin.school@gmail.com
            </a>
          </div>
          <div>
            <h2 className="mb-2 font-mono text-[0.75rem] uppercase tracking-[0.14em] text-ink-rail-2">
              โทรศัพท์
            </h2>
            <p className="font-mono text-base leading-relaxed text-ink-rail">
              <a href="tel:074371744" className="hover:underline">
                074-371744-5
              </a>
              <br />
              <a href="tel:0825234382" className="hover:underline">
                082-523-4382
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
