import Navbar from '../../component/Navbars/page';

const Home = () => {
  return (
    <div className='bg-[#ffff]  '>
      <Navbar />

      <div className="bg-[#17a2b8] ">
        <div className="flex items-center justify-center">
          <div className=" text-center lg:text-left">
            {/* คุณสามารถเพิ่มเนื้อหาหรือข้อความในฝั่งซ้าย */}
          </div>
          <div className=" text-center lg:text-right">
            <img src="/img/head.jpg" alt="Head Image" />
          </div>
        </div>
      </div>


      <div className="mt-12 pt-5 flex justify-center">
  <div className="container pb-3 ">
    <div className="text-center pb-2">
    <p className="section-title px-5 text-[#17a2b8] text-center relative">
    <span className="px-4 font-bold before:content-['————'] before:pr-2 after:content-['————'] after:pl-2">
        ปรัชญาการศึกษา
    </span>
    </p>


      <h1 className="mt-4 mb-4 text-2xl md:text-3xl lg:text-4xl font-semibold text-[#134c5a] "> “เราสร้างสรรค์กิจกรรม เพื่อพัฒนาชีวิต”</h1>
    </div>
    <div className="flex justify-center items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-screen-xl">
        <div className="bg-white shadow-lg border-t rounded-lg mb-6 p-6 md:p-8 hover:shadow-2xl transition-all duration-300">
          <div className="text-center">
            <h4 className="text-xl font-bold mb-3">Hand</h4>
            <p className="text-sm md:text-base text-gray-600">การพัฒนาทักษะที่สำคัญ(ไปสู่การมีสมรรถนะ) ทักษะกระบวนการคิด การทำงานเป็นขั้นเป็นตอน การวางแผน การเรียนรู้ ผ่านการทำงานจริง...</p>
          </div>
        </div>
        <div className="bg-white shadow-lg border-t rounded-lg mb-6 p-6 md:p-8 hover:shadow-2xl transition-all duration-300">
          <div className="text-center">
            <h4 className="text-xl font-bold mb-3">Head</h4>
            <p className="text-sm md:text-base text-gray-600">การพัฒนาความรู้ที่จำเป็น (แก่นของความรู้) ทักษะที่ได้จากการปฏิบัติจริงจนถึงคุนค่า...</p>
          </div>
        </div>
        <div className="bg-white shadow-lg border-t rounded-lg mb-6 p-6 md:p-8 hover:shadow-2xl transition-all duration-300">
          <div className="text-center">
            <h4 className="text-xl font-bold mb-3">Heart</h4>
            <p className="text-sm md:text-base text-gray-600">การพัฒนาความรู้ที่จำเป็น (แก่นของความรู้) ทักษะที่ได้จากการปฏิบัติจริงจนถึงคุนค่า...</p>
          </div>
        </div>
        <div className="bg-white shadow-lg border-t rounded-lg mb-6 p-6 md:p-8 hover:shadow-2xl transition-all duration-300">
          <div className="text-center">
            <h4 className="text-xl font-bold mb-3">Deep learning</h4>
            <p className="text-sm md:text-base text-gray-600">การพัฒนาความรู้ที่จำเป็น (แก่นของความรู้) ทักษะที่ได้จากการปฏิบัติจริงจนถึงคุนค่า...</p>
          </div>
        </div>
        <div className="bg-white shadow-lg border-t rounded-lg mb-6 p-6 md:p-8 hover:shadow-2xl transition-all duration-300">
          <div className="text-center">
            <h4 className="text-xl font-bold mb-3">Transformative learning</h4>
            <p className="text-sm md:text-base text-gray-600">การเรียนรู้ที่สามารถเอาความรู้มาเปลี่ยนแปลงตนเงได้โดยมีฉันทะ วิริยะต่อสิ่งนั้นๆ...</p>
          </div>
        </div>
        <div className="bg-white shadow-lg border-t rounded-lg mb-6 p-6 md:p-8 hover:shadow-2xl transition-all duration-300">
          <div className="text-center">
            <h4 className="text-xl font-bold mb-3">Eco school</h4>
            <p className="text-sm md:text-base text-gray-600">ห้องเรียนตื่นรู้เชิงนิเวศสมรรถนะฐานชุมชน การศึกษาและการจัดการสิ่งแวดล้อมอย่างยั่งยืน...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


<div className=" py-10 min-h-screen flex items-center">
  <div className="container mx-auto px-6">
    <div className="flex flex-col lg:flex-row items-center justify-center">
      {/* รูปภาพหลัก */}
      <div className="sm:w-1/2 lg:w-[445px] w-full mb-6 lg:mb-0">
        <img className="w-full rounded-lg shadow-md" src="/img/about-3.jpg" alt="About us" />
      </div>

      {/* เนื้อหา */}
      <div className="lg:w-1/2 w-full lg:pl-10">
        <span className="text-lg font-semibold text-[#17a2b8] mb-2  before:pr-2 after:content-['————'] after:pl-2">
        Learn About Us
    </span>
        <h3 className="text-3xl font-bold mt-4 mb-4">เกี่ยวกับโรงเรียนศรีนครินทร์วิทยานุเคราะห์</h3>
        <p className="text-gray-700 leading-relaxed">
          โรงเรียนศรีนครินทร์วิทยานุเคราะห์ ได้เริ่มก่อตั้งสถานรับเลี้ยงเด็ก เมื่อพ.ศ.๒๕๓๒ โดยมีปรัชญาการศึกษาว่า
          <span className="font-semibold"> "เราสร้างสรรค์กิจกรรม เพื่อพัฒนาชีวิต"</span> 
          ต่อมาได้ปวารณาเข้าร่วมโครงการเทิดพระเกียรติสมเด็จพระศรีนครินทราบรมราชชนนีในพระชนมายุ ๙๐ พรรษา
          และเป็นโรงเรียนศรีนครินทร์วิทยานุเคราะห์ (เอกชนร่วมเทิดพระเกียรติ) เมื่อปี พ.ศ.๒๕๓๖
        </p>

        {/* ส่วนของรายการ */}
        <div className="flex flex-col md:flex-row items-center pt-2 justify-center">
          <div className="md:w-1/3 sm:w-[200] w-full mb-4 md:mb-0">
            <img className="w-full rounded-lg shadow-md" src="/img/about-4.jpg" alt="School" />
          </div>
          <div className="md:w-2/3 w-full md:pl-4">
            <ul className="space-y-2 text-gray-700">
              <li className="py-2 border-t border-b flex items-center">
                <i className="fa fa-check text-[#17a2b8] mr-3">✔</i> เราสร้างสรรค์กิจกรรม เพื่อพัฒนาชีวิต
            

              </li>
              <li className="py-2 border-b flex items-center">
                <i className="fa fa-check text-[#17a2b8] mr-3">✔</i>เราจะผลิตผู้สำเร็จการศึกษาให้เป็นคนที่สมบูรณ์
              </li>
              <li className="py-2 border-b flex items-center">
                <i className="fa fa-check text-[#17a2b8] mr-3">✔</i>ส่งเสริมการเรียนรู้แบบการศึกษานอกสถานที่
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</div>






<div class="container-fluid pt-5">
  <div class="container">
    <div class="text-center pb-2">
      <p class="section-title px-5"><span class="px-2">Popular Classes</span></p>
      <h1 class="mb-4">Programs</h1>
    </div>
    <div class="flex flex-wrap justify-center">
      <div class="lg:w-1/3 md:w-1/2 sm:w-full mb-5">
        <div class="card border-0 bg-light shadow-sm pb-2">
          <img class="card-img-top mb-2" src="img/program1.jpg" alt=""></img>
          <div class="card-body text-center">
            <h4 class="card-title">SLK/SLP(srinakarinleadership program)</h4>
            <p class="card-text">รายละเอียดเพิ่มเติม</p>
          </div>
          <div class="card-footer bg-transparent py-4 px-5">
            <div class="flex border-b py-1">
              <div class="w-1/2 text-right pr-2"><strong>อายุ</strong></div>
              <div class="w-1/2">3 - 6 Years</div>
            </div>
            <div class="flex border-b py-1">
              <div class="w-1/2 text-right pr-2"><strong>เวลาเรียน</strong></div>
              <div class="w-1/2">08:00 - 10:00</div>
            </div>
            <div class="flex py-1">
              <div class="w-1/2 text-right pr-2"><strong>ค่าเล่าเรียน</strong></div>
              <div class="w-1/2">0000/ เทอม</div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</div>




    </div>
  );
};

export default Home;
