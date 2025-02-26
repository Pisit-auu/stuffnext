import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <div className="bg-[#f9fafc] shadow-lg shadow-b-lg">
      <nav className="bg-white py-3 px-20 flex items-center justify-between shadow-md">
        <Link href="/" className="font-bold text-black text-4xl flex items-center">
          <Image src="/img/icon.png" alt="Logo" width={40} height={40} />
        </Link>
        <button
          className="lg:hidden text-black"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* เมนูหลักที่จะแสดงในขนาดใหญ่ */}
        <div className="lg:flex w-full hidden justify-center space-x-6">
          <Link href="/" className="text-[#2a326f] text-lg hover:text-[#40b2ca]">Home</Link>
          <Link href="/about" className="text-[#2a326f] text-lg hover:text-[#40b2ca]">About</Link>
          <Link href="/learning" className="text-[#2a326f] text-lg hover:text-[#40b2ca]">Learning</Link>
          <Link href="/class" className="text-[#2a326f] text-lg hover:text-[#40b2ca]">Programs</Link>
          <Link href="/team" className="text-[#2a326f] text-lg hover:text-[#40b2ca]">Team</Link>
          <Link href="/gallery" className="text-[#2a326f] text-lg hover:text-[#40b2ca]">Facilities</Link>
          <Link href="/blog" className="text-[#2a326f] text-lg hover:text-[#40b2ca]">Admission</Link>
          <Link href="/contact" className="text-[#2a326f] text-lg hover:text-[#40b2ca]">Contact</Link>
          <Link href="/login" className="text-[#2a326f] text-lg hover:text-[#40b2ca]">Login</Link>
        </div>
      </nav>
    </div>
  );
}
