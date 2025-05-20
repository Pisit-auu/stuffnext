'use client'
import Link from 'next/link'
import axios from 'axios'
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
export default function Allasset() {

  const [category, setSelectCategory] = useState('')   //เก็บประเภทครุภัณฑ์ที่เลือก
  const [searchAsset, setSearchAsset] = useState('')  //เก็บชื่อครุภัณฑ์ที่ค้นหา
  const [asset, setAsset] = useState<any[]>([])  //เก็บครุภัณฑ์ ทั้งหมดที่ดึงเข้ามา
  const [assetlocation, setAssetlocation] = useState<any[]>([])  
  const [assetCount, setAssetCount] = useState<any[]>([])  
  const [categorys, setCategory] = useState([])  //เก็บ ประเภทครุภัณฑ์
  const { data: session, status } = useSession(); //เก็บ session 


    const handleDownload = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Assets')

    // หัวตาราง
    worksheet.columns = [
      { header: 'ชื่อครุภัณฑ์', key: 'name', width: 30 },
      { header: 'จำนวนทั้งหมด', key: 'totalValue', width: 15 },
      { header: 'จำนวนพร้อมใช้งาน', key: 'availableValue', width: 15 },
    ]

    // ใส่ข้อมูล
    filteredAssets.forEach(assetItem => {
      const countData = assetCount.find(item => item.assetId === assetItem.assetid)

      worksheet.addRow({
        name: assetItem.name,
        totalValue: assetItem.availableValue + assetItem.unavailableValue + (countData?.totalCount || 0),
        availableValue: assetItem.availableValue + (countData?.totalAvailable || 0),
      })
    })

    // สร้างไฟล์ Excel เป็น buffer
    const buffer = await workbook.xlsx.writeBuffer()

    // สร้าง Blob และบันทึกไฟล์
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(blob, 'ครุภัณฑ์ทั้งหมด.xlsx')
  }

  // ดึงข้อมูล ประเภทของครุภัณฑ์ ชื่อครุภัณฑ์  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, assetRes, assetlocationRes] = await Promise.all([
          axios.get(`/api/category`),
          axios.get(`/api/asset`),
          axios.get(`/api/assetlocation`)
        ]);
        setCategory(categoryRes.data);
        setAsset(assetRes.data);
        setAssetlocation(assetlocationRes.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  //ฟังก์ชันนับ รวมจำนวนของที่อยู่ในห้องอื่นๆ มาแสดง
  const count = () => {
    const countData = asset.map((assetItem) => {
      const matchingLocations = assetlocation.filter((loc) => loc.assetId === assetItem.assetid)
      let totalAvailable = 0
      let totalUnavailable = 0

      matchingLocations.forEach((loc) => {
        totalAvailable += loc.inRoomavailableValue
        totalUnavailable += loc.inRoomaunavailableValue
      })

      return {
        assetId: assetItem.assetid,
        totalAvailable,
        totalUnavailable,
        totalCount: totalAvailable + totalUnavailable,
      }
    })
    setAssetCount(countData)
  }

  useEffect(() => {
    if (asset.length > 0 && assetlocation.length > 0) {
      count()  
    }
  }, [asset, assetlocation])

  const filteredAssets = asset.filter((assetItem) => {
    const matchesCategory = category ? assetItem.category.name === category : true;
    const matchesSearch = assetItem.name.toLowerCase().includes(searchAsset.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const deleteasset = async (data : any) => {
      const confirmDelete = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?");
    if (!confirmDelete) return;
    try { 
       await axios.delete(`/api/asset/${data}`)
       alert("ลบเสร็จสิ้น")
        window.location.reload();
      } catch (error) {
        console.error('Failed to delete the asset', error)
      }
};
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* ค้นหาครุภัณฑ์ */}
      <div className="flex justify-center items-center gap-4 mb-8">
        {/* Input Search */}
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="ค้นหาครุภัณฑ์..."
            value={searchAsset}
            onChange={(e) => setSearchAsset(e.target.value)}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <img 
              src="search.png" 
              alt="ค้นหา"
              className="w-6 h-6"
            />
          </button>
        </div>

        {/* Category Dropdown */}
        <div className="relative w-48">
          <select
            value={category}
            onChange={(e) => setSelectCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            <option value="">เลือกประเภทครุภัณฑ์</option>
            {categorys.map((cat: any) => (
              <option key={cat.idname} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          
        </div>
                     <button onClick={handleDownload}
                        className="block sm:inline-block w-full sm:w-auto px-4 py-2 rounded-lg bg-[#006600] text-center text-white hover:bg-green-600 transition-all"
                      >
                        โหลดไฟล์ Exel
                      </button>
      </div>

      {filteredAssets.length === 0 ? (
        <div className="text-center text-gray-500 text-lg font-semibold py-6">
          ❌ ไม่มีข้อมูลครุภัณฑ์
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">ชื่อครุภัณฑ์</th>
                <th className="py-2 px-4 border-b text-left">จำนวนทั้งหมด</th>
                <th className="py-2 px-4 border-b text-left">จำนวนพร้อมใช้งาน</th>
                <th className="py-2 px-4 border-b text-left">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((assetItem) => {
                const countData = assetCount.find((item) => item.assetId === assetItem.assetid)
                return (
                  <tr key={assetItem.id} className="odd:bg-gray-50 even:bg-white">
                    <td className="py-2 px-4 border-b">{assetItem.name}</td>
                    <td className="py-2 px-4 border-b">
                      {assetItem.availableValue + assetItem.unavailableValue + (countData?.totalCount || 0)}
                    </td>
                    <td className="py-2 px-4 border-b text-green-600">
                      {assetItem.availableValue + (countData?.totalAvailable || 0)}
                    </td>
                    <td className="py-2 px-4 border-b text-left">
                      <Link
                        className="block sm:inline-block w-full mr-4 sm:w-auto px-4 py-2 rounded-lg bg-[#113FB3] text-center text-white hover:bg-indigo-600 transition-all"
                        href={`allasset/${assetItem.assetid}`}
                      >
                        ดูรายละเอียด
                      </Link>
                       {session?.user.role === 'admin' && (
                              <button onClick={() => deleteasset(assetItem.assetid)}
                        className="block sm:inline-block w-full sm:w-auto px-4 py-2 rounded-lg bg-[#CC0033] text-center text-white hover:bg-red-600 transition-all"
                      >
                        ลบ
                      </button>
                      )}
                       
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}