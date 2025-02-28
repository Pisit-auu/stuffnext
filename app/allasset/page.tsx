'use client'
import Link from 'next/link'
import { Card } from 'antd';
import axios from 'axios'
import React, { useEffect, useState } from 'react';

export default function Allasset() {
  const [category, setSelectCategory] = useState('')  
  const [searchAsset, setSearchAsset] = useState('')  
  const [asset, setAsset] = useState<any[]>([])  
  const [assetlocation, setAssetlocation] = useState<any[]>([])  
  const [assetCount, setAssetCount] = useState<any[]>([])  
  const [categorys, setCategory] = useState([])

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

  // ฟังก์ชันค้นหาภายใน
  const filteredAssets = asset.filter((assetItem) => {
    const matchesCategory = category ? assetItem.category.name === category : true;
    const matchesSearch = assetItem.name.toLowerCase().includes(searchAsset.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-gray-50">
      {/* ค้นหาครุภัณฑ์ */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
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
        <select
          value={category}
          onChange={(e) => setSelectCategory(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
        >
          <option value="">เลือกประเภทครุภัณฑ์</option>
          {categorys.map((cat: any) => (
            <option key={cat.idname} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {filteredAssets.length === 0 ? (
        <div className="text-center text-gray-500 text-lg font-semibold py-6">
          ❌ ไม่มีข้อมูลสินทรัพย์
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredAssets.map((assetItem) => {
            const countData = assetCount.find((item) => item.assetId === assetItem.assetid)
            return (
              <Card
                key={assetItem.id}
                title={
                  <div className="text-lg font-bold text-gray-800 text-center">
                    {assetItem.name}
                  </div>
                }
                variant={"outlined"}
                className="shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl p-6 bg-white"
              >
                <div className="px-2 py-4 text-center">
                  <p className="text-gray-700 text-md">📦 จำนวนทั้งหมด: <span className="font-semibold">{assetItem.availableValue + assetItem.unavailableValue + (countData?.totalCount || 0)}</span></p>
                  <p className="text-green-600 text-md">✓ พร้อมใช้งาน: <span className="font-semibold">{assetItem.availableValue + (countData?.totalAvailable || 0)}</span></p>
                </div>
                <div className="flex justify-center mt-6">
                  <Link
                    className="w-full text-center px-4 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-md"
                    href={`allasset/${assetItem.assetid}`}
                  >
                    ดูรายละเอียด
                  </Link>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  );
}
