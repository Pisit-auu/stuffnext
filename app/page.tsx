'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function SignIn() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Content Top */}
      <div className="flex flex-col md:flex-row-reverse items-center w-full max-w-5xl flex-grow p-4 md:p-16">
        {/* Image */}
        <div className="md:w-1/2 flex justify-center md:justify-end mb-8 md:mb-0">
        <img
            src="head.jpg"
            alt="Picture of the school"
            className=" rounded-lg shadow-md w-[400px] h-full" 
          />

        </div>

        {/* Content */}
        <div className="w-full md:w-1/2 text-center md:text-left md:pl-12">
          <h1 className="text-4xl md:text-5xl font-bold text-blackblue_111827 hover:text-black transition duration-100">
            ▎Srinakarin
          </h1>
          <p className="mt-4 text-base md:text-lg text-gray-600">
            เป็นเว็บไซต์ บริหารและจัดการอุปกรณ์ภายในโรงเรียนศรีนครินทร์วิทยานุเคราะห์
            คุณสามารถเยี่ยมชมเว็บไซต์หลักของโรงเรียนได้ที่นี่
          </p>
          <div className="flex justify-center md:justify-start">
            <Link href="https://www.srinakarin.ac.th/about.html">
              <button
                type="submit"
                className="w-24 bg-[#7EDBE9] text-black py-2 rounded-lg text-lg font-semibold hover:bg-[#99FFFF] transition duration-300 mt-8"
              >
                คลิกเลย
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content Center */}
      <div className="flex flex-col items-center w-full h-auto bg-gray-200 rounded-lg pb-10 md:pb-20 px-4 md:px-0">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 transition duration-100 mt-10 md:mt-20">
          คุณสมบัติของ Srinakarin Inventory
        </h1>
        <p className="mt-2 text-base md:text-lg text-gray-600">
          เลือกฟีเจอร์ที่ช่วยเพิ่มประสิทธิภาพในการจัดการทรัพย์สินของโรงเรียน
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center mt-8 md:mt-16 space-y-8 md:space-y-0 md:space-x-10">
        <Link href="/home">
  <div className="rounded-lg hover:bg-blue-200 p-4">
              <Image
                src="/borrow.png"
                alt="Button Icon"
                width={200}  
                height={200} 
                className="bg-white rounded-lg shadow-md object-cover"
              />
              <div className="mt-6 md:mt-12 text-xl text-blackblue_111827 text-center font-semibold">
                BORROW
              </div>
            </div>
          </Link>

          <Link href="/profile/history">
            <div className="rounded-lg hover:bg-blue-200 p-4">
              <Image
                src="/return.png"
                alt="Button Icon"
                width={200} 
                height={200} 
                className="bg-white rounded-lg shadow-md object-cover" // ใช้ object-cover เพื่อขยายให้เต็มกรอบ
              />
              <div className="mt-6 md:mt-12 text-xl text-blackblue_111827 text-center font-semibold">
                RETURN
              </div>
            </div>
          </Link>

          <Link href="/profile/history">
            <div className="rounded-lg hover:bg-blue-200 p-4">
              <Image
                src="/status.png"
                alt="Button Icon"
                width={200}  
                height={200} 
                className="bg-white rounded-lg shadow-md object-cover" 
              />
              <div className="mt-6 md:mt-12 text-xl text-blackblue_111827 text-center font-semibold">
                USER STATUS
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Content Bottom */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full bg-secondary p-8">
  <div className="flex flex-col text-md text-white transition text-center md:text-left px-6 py-4 rounded-lg bg-opacity-80 hover:bg-opacity-90 space-y-4">
    <div className="text-xl md:text-2xl font-semibold">Address</div>
    <div className="indent-4 md:indent-16">
      119 ถนนเพชรเกษม ตำบลคลองทราย อำเภอนาทวี จังหวัดสงขลา 90160
    </div>
  </div>

  <div className="flex flex-col text-md text-white transition text-center md:text-left px-6 py-4 rounded-lg bg-opacity-80 hover:bg-opacity-90 space-y-4">
    <div className="text-xl md:text-2xl font-semibold">Email</div>
    <div className="indent-4 md:indent-16">Srinakarin.school@gmail.com</div>
  </div>

  <div className="flex flex-col text-md text-white transition text-center md:text-left px-6 py-4 rounded-lg bg-opacity-80 hover:bg-opacity-90 space-y-4">
    <div className="text-xl md:text-2xl font-semibold">Phone</div>
    <div className="indent-4 md:indent-16">074-371744-5</div>
    <div className="indent-4 md:indent-16">082-5234382</div>
  </div>
</div>



    </div>
  )
}