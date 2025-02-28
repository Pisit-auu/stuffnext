'use client';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Category {
  idname: string;
  name: string;
}

export default function Edit() {
  const { id } = useParams() as { id: string };
  const [assetid, setAssetid] = useState('');
  const [name, setAssetname] = useState('');
  const [img, setImg] = useState('');
  const [categoryId, setCategory] = useState<Category | null>(null); // เปลี่ยนประเภทของ categoryId
  const [listcategory, setlistCategory] = useState<Category[]>([]);
  const [availableValue, setAvailableValue] = useState('');
  const [unavailableValue, setunAvailableValue] = useState('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post('/api/uploadimg', formData);
      setImg(res.data.url);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const fetchPost = async (id: string) => {
    try {
      const resasset = await axios.get(`/api/asset/${id}`);
      const rescategory = await axios.get('/api/category');
      setAssetname(resasset.data.name);
      setImg(resasset.data.img);
      setCategory(resasset.data.category); // ตรวจสอบว่า category มีโครงสร้างถูกต้อง
      setAssetid(resasset.data.assetid);
      setAvailableValue(resasset.data.availableValue);
      setunAvailableValue(resasset.data.unavailableValue);
      setlistCategory(rescategory.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPost(id);
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryId) {
      alert('กรุณาเลือกประเภทครุภัณฑ์');
      return;
    }

    try {
      await axios.put(`/api/asset/${id}`, {
        name,
        img,
        assetid,
        categoryId: categoryId.idname, // ใช้ categoryId.idname
        availableValue,
        unavailableValue,
      });
      router.push('/admin');
    } catch (error) {
      alert("รหัสครุภัณฑ์ซ้ำไม่สามารถแก้ไขได้")
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">แก้ไข ครุภัณฑ์</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="Asset" className="block text-sm font-medium text-slate">
            ชื่อครุภัณฑ์
          </label>
          <input
            type="text"
            name="Asset"
            id="Asset"
            required
            value={name}
            onChange={(e) => setAssetname(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="Assetid" className="block text-sm font-medium text-slate">
            รหัสครุภัณฑ์
          </label>
          <input
            type="text"
            name="Assetid"
            id="Assetid"
            required
            value={assetid}
            onChange={(e) => setAssetid(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="Category" className="block text-sm font-medium text-slate">
            รูปภาพ
            <div className="p-5">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
                disabled={isUploading}
              />
              <button
                type="button"
                onClick={handleUpload}
                className="bg-blue-500 text-white p-2 rounded"
                disabled={isUploading}
              >
                {isUploading ? 'กำลังอัปโหลด...' : 'อัปโหลด'}
              </button>
            </div>
          </label>
          {img && img !== '' && (
            <div className="mt-5">
              <img src={img} alt="Uploaded" className="w-48 h-48 object-cover" />
            </div>
          )}
        </div>
        <div>
          <label className="mr-8">ประเภทครุภัณฑ์</label>
          <select
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            value={categoryId ? JSON.stringify(categoryId) : ''}
            onChange={(e) => setCategory(JSON.parse(e.target.value))}
          >
            {categoryId && (
              <option key={categoryId.idname} value={JSON.stringify(categoryId)}>
                {categoryId.name}
              </option>
            )}
            {listcategory
              .filter((categorys) => categorys.idname !== categoryId?.idname)
              .map((categorys) => (
                <option
                  key={categorys.idname}
                  value={JSON.stringify({ idname: categorys.idname, name: categorys.name })}
                >
                  {categorys.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label htmlFor="Available" className="block text-sm font-medium text-slate">
            จำนวนที่พร้อมใช้งาน
          </label>
          <input
            type="number"
            name="Available"
            id="Available"
            required
            value={availableValue}
            onChange={(e) => setAvailableValue(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="unavailable" className="block text-sm font-medium text-slate">
            จำนวนที่เสีย
          </label>
          <input
            type="number"
            name="unavailable"
            id="unavailable"
            required
            value={unavailableValue}
            onChange={(e) => setunAvailableValue(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            แก้ไข
          </button>
        </div>
      </form>
    </div>
  );
}