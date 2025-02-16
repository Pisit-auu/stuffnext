"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

export default function Manageroom() {
  const [groupedAssets, setGroupedAssets] = useState<any>({});
  const [asset, setAsset] = useState<any | null>(null);
  const { id } = useParams() as { id: string };

  useEffect(() => {
    fetchAssetLocation();
    fetchAsset();
  }, []);

  const fetchAssetLocation = async () => {
    try {
      const res = await axios.get(`/api/assetlocation`);
      groupAssetsById(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAsset = async () => {
    try {
      const res = await axios.get(`/api/asset/${decodeURIComponent(id)}`);
      setAsset(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const groupAssetsById = (data: any[]) => {
    const grouped: any = {};
    data.forEach((item: any) => {
      if (item.assetId !== decodeURIComponent(id)) return;
      if (!grouped[item.assetId]) {
        grouped[item.assetId] = [];
      }
      grouped[item.assetId].push({
        location: item.location.namelocation,
        inRoomavailableValue: item.inRoomavailableValue,
        inRoomunavailableValue: item.inRoomaunavailableValue,
      });
    });
    setGroupedAssets(grouped);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {asset ? (
        Object.keys(groupedAssets).length > 0 ? (
          Object.keys(groupedAssets).map((assetId) => (
            <div key={assetId} className="mb-6 bg-gray-100 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                🏷️ รหัสครุภัณฑ์: {assetId}
              </h2>
              <h3 className="text-xl font-semibold text-gray-700">
                🏷️ ชื่อครุภัณฑ์: {asset.name}
              </h3>
              <h3 className="text-xl font-semibold text-gray-700">
                🏷️ ประเภท: {asset.category.name}
              </h3>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-700">📦 จำนวนในคลัง</h3>
                <p className="text-gray-600">✅ พร้อมใช้งาน: {asset.availableValue}</p>
                <p className="text-gray-600">❌ ไม่พร้อมใช้งาน: {asset.unavailableValue}</p>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-700">📍 สถานที่จัดเก็บ</h3>
                {groupedAssets[assetId].map((item: any, index: number) => (
                  <div key={index} className="border-l-4 border-blue-500 bg-white p-4 my-2 rounded-lg shadow-sm">
                    <p className="text-gray-700 font-medium">📍 {item.location}</p>
                    <p className="text-gray-600">✅ ใช้งานได้: {item.inRoomavailableValue}</p>
                    <p className="text-gray-600">❌ ใช้งานไม่ได้: {item.inRoomunavailableValue}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 text-xl font-semibold py-6">
            ❌ ไม่มีข้อมูลสินทรัพย์ในห้องอื่นๆ
          </div>
        )
      ) : (
        <div className="text-center text-gray-500 text-xl font-semibold py-6">
          ⏳ กำลังโหลดข้อมูล...
        </div>
      )}
    </div>
  );
}
