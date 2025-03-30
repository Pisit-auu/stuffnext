"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

export default function detailAsset() {
  const [groupedAssets, setGroupedAssets] = useState<any>({}); //เก็บข้อมูลครุภัณฑ์ที่อยู๋ทุกห้อง
  const [asset, setAsset] = useState<any | null>(null); //เก็บข้อมูลครุภัณฑ์
  const { id } = useParams() as { id: string };
  const [allvalueallroom , setallvalueallroom] = useState(0)  //จำนวนทั้งหมดทุกห้องที่ใช้ได้
  const [allvalueallroomunavailible , setallvalueallroomunavailible] = useState(0) //จำนวนทั้งหมดทุกห้องที่ใช้ไม่ได้

  useEffect(() => {
    fetchAssetLocation();
    fetchAsset();
  }, []);
  //ฟังก์ชันดึงข้อมูลครุภัณฑ์แต่ละห้อง
  const fetchAssetLocation = async () => {
    try {
      const res = await axios.get(`/api/assetlocation`);
      groupAssetsById(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  //ฟังก์ชันดึงข้อมูลครุภัณฑ์
  const fetchAsset = async () => {
    try {
      const res = await axios.get(`/api/asset/${decodeURIComponent(id)}`);
      setAsset(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  
  //นับจำนวนของทั้งหมดทุกห้อง
  const groupAssetsById = (data: any[]) => {
    const grouped: any = {};
    data.forEach((item: any) => {
      if (item.assetId !== decodeURIComponent(id)) return;
      if (!grouped[item.assetId]) {
        grouped[item.assetId] = [];
      }
      grouped[item.assetId].push({
        location: item.location.namelocation,
        inRoomavailableValue: item.inRomavailableValue,
        inRoomaunavailableValue: item.inRoomaunavailableValue,
      });
    });
    setGroupedAssets(grouped);
    let valueallroomavailible = 0;
    let valueallroomunavailible =0;
    Object.values(grouped).forEach((items) => {
      (items as { inRoomavailableValue: number , inRoomaunavailableValue: number }[]).forEach((item) => {
        valueallroomavailible = valueallroomavailible+ item.inRoomavailableValue
        valueallroomunavailible = valueallroomunavailible + item.inRoomaunavailableValue 
      });
    });
    //console.log(valueallroomunavailible);
    setallvalueallroom(valueallroomavailible)
    setallvalueallroomunavailible(valueallroomunavailible)
  };

  return (
    <div className="mt-4 max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl">
      {asset ? (
        <>
          <div className="mb-6 bg-gray-50 p-6 rounded-lg shadow-md hover:bg-gray-100 transition-all duration-300">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              รหัสครุภัณฑ์: {asset.assetid}
            </h2>
            <div className="flex items-center space-x-6">
              <img
                src={asset?.img || "/srinakarin.png"}
                alt={asset?.name || "Asset"}
                className="w-40 h-48 object-cover rounded-lg shadow-md"
              />
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {asset?.name || "ชื่อครุภัณฑ์"}
                </h3>
                <p className="text-xl font-semibold text-gray-700">
                  {asset?.category?.name || "ประเภท"}
                </p>
                <div className="grid grid-cols-2 gap-6 mt-4">
                  {/* คลัง */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-700">
                      📦 จำนวนในคลัง
                    </h4>
                    <p className="text-gray-600">
                      ✅ พร้อมใช้งาน: {asset?.availableValue || 0}
                    </p>
                    <p className="text-gray-600">
                      ❌ ไม่พร้อมใช้งาน: {asset?.unavailableValue || 0}
                    </p>
                  </div>
                  {/* ทุกห้อง */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-700">
                      📦 จำนวนทั้งหมดทุกห้อง
                    </h4>
                    <p className="text-gray-600">
                      ✅ พร้อมใช้งาน: {allvalueallroom || 0}
                    </p>
                    <p className="text-gray-600">
                      ❌ ไม่พร้อมใช้งาน: {allvalueallroomunavailible || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          {Object.keys(groupedAssets).length > 0 ? (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-700">สถานที่จัดเก็บ</h3>
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border-b px-4 py-2 text-left text-gray-700">สถานที่</th>
                    <th className="border-b px-4 py-2 text-left text-gray-700">พร้อมใช้งาน</th>
                    <th className="border-b px-4 py-2 text-left text-gray-700">ไม่พร้อมใช้งาน</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(groupedAssets).map((assetId) =>
                    groupedAssets[assetId].map((item: any, index: number) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="border-b px-4 py-2 text-gray-700">{item.location}</td>
                        <td className="border-b px-4 py-2 text-gray-600">{item.inRoomavailableValue}</td>
                        <td className="border-b px-4 py-2 text-gray-600">{item.inRoomaunavailableValue}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-500 text-xl font-semibold py-6">
              ❌ ไม่มีข้อมูลสถานที่จัดเก็บ
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-gray-500 text-xl font-semibold py-6">
          ⏳ กำลังโหลดข้อมูล...
        </div>
      )}
    </div>
  );
  
}