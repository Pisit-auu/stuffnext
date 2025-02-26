'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function CreateAsset() {
  const [assetid, setAssetid] = useState('');
  const [name, setAssetname] = useState('');
  const [img, setImg] = useState('');
  const [categoryId, setCategory] = useState('');
  const [listcategory, setlistCategory] = useState([]);
  const [availableValue, setAvailableValue] = useState<number>(0);
  const [unavailableValue, setunAvailableValue] = useState<number>(0);
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false); // สถานะการอัปโหลด

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true); // ตั้งสถานะว่ากำลังอัปโหลด

    try {
      // ทำการอัปโหลดไฟล์ที่เลือก
      const formData = new FormData();
      formData.append("file", file);
      
      // ใส่คำสั่ง API ของคุณที่นี่เพื่ออัปโหลดไฟล์
      // ตัวอย่างนี้เป็นเพียงคำสั่งที่ส่งไฟล์ไปยัง API
      const res = await axios.post("/api/uploadimg", formData);
      
      // แสดง URL ของรูปภาพที่อัปโหลดแล้ว
      setImg(res.data.url); 
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false); // ปิดสถานะการอัปโหลด
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/category');
      setlistCategory(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      alert('เลือกประเภทครุภัณฑ์');
      return;
    }

    try {
      await axios.post('/api/asset', {
        name,
        img,
        assetid,
        categoryId,
        availableValue,
        unavailableValue,
      });
      
      router.push('/admin');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">เพิ่มครุภัณฑ์</h1>
      <div className="space-y-6">
        {/* ชื่อครุภัณฑ์ */}
        <div>
          <label htmlFor="Asset" className="block text-sm font-medium text-gray-700">
            ชื่อครุภัณฑ์
          </label>
          <input
            type="text"
            id="Asset"
            required
            value={name}
            onChange={(e) => setAssetname(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* รหัสครุภัณฑ์ */}
        <div>
          <label htmlFor="Assetid" className="block text-sm font-medium text-gray-700">
            รหัสครุภัณฑ์
          </label>
          <input
            type="text"
            id="Assetid"
            required
            value={assetid}
            onChange={(e) => setAssetid(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* รูปภาพ */}
        <div>
          <label className="block text-sm font-medium text-gray-700">รูปภาพ</label>
          <div className="p-5">
            <div className="flex flex-col gap-3">
            <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFile(e.target.files[0]);
              }
            }}
            disabled={isUploading} // ปิดการใช้งานการเลือกไฟล์ระหว่างการอัปโหลด
          />
          <button
            type="button"
            onClick={handleUpload}
            className="bg-blue-500 text-white p-2 rounded"
            disabled={isUploading} // ปิดการใช้งานปุ่ม "อัปโหลด" ระหว่างการอัปโหลด
          >
            {isUploading ? "กำลังอัปโหลด..." : "อัปโหลด"}
          </button>
            </div>

            {img && (
              <div className="mt-5">
                <h2 className="text-lg font-bold">รูปที่อัปโหลด:</h2>
                <img src={img} alt="Uploaded" className="w-64 h-64 object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* ประเภทครุภัณฑ์ */}
        <div>
          <label className="block text-sm font-medium text-gray-700">ประเภทครุภัณฑ์</label>
          <select
            value={categoryId}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 w-full"
          >
            <option value="">เลือกประเภทครุภัณฑ์</option>
            {listcategory.map((category: any) => (
              <option key={category.idname} value={category.idname}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* จำนวนที่พร้อมใช้งาน */}
        <div>
          <label htmlFor="Available" className="block text-sm font-medium text-gray-700">
            จำนวนที่พร้อมใช้งาน
          </label>
          <input
            type="number"
            id="Available"
            required
            value={availableValue}
            onChange={(e) => setAvailableValue(parseInt(e.target.value, 10))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* จำนวนที่เสีย */}


        {/* ปุ่มเพิ่ม */}
        <div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto"
          >
            เพิ่ม
          </button>
        </div>
      </div>
    </div>
  );
}
