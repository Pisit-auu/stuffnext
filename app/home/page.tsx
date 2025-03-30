'use client'
import Image from "next/image";
import Link from 'next/link';
import { Card } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Home() {
  const [locations, setLocations] = useState<any[]>([]);//ข้อมูล locationทุกที่ 
  const [searchLocation, setSearchLocation] = useState(''); //เก็บข้อมูลที่ sort
  const [filteredLocations, setFilteredLocations] = useState<any[]>([]); //กรองข้อมูลlocation ตามที่ค้นหา 
  const [categories, setCategories] = useState<any[]>([]); // ประเภทของcategoryของห้อง
  const [selectedCategory, setSelectedCategory] = useState(''); // เก็บประเภทที่เลือก
 
  //ดึงข้อมูล locationทุกที่ และ ประเภทของcategoryของห้อง
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get(`/api/location`);
        setLocations(res.data);
        setFilteredLocations(res.data); // กำหนดค่าเริ่มต้น
      } catch (error) {
        console.error(error);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axios.get(`/api/categoryroom`);
        setCategories(res.data); // รับข้อมูลประเภท
      } catch (error) {
        console.error(error);
      }
    };

    fetchLocations();
    fetchCategories();
  }, []);

  useEffect(() => {
    // ค้นหาจากข้อมูลที่มีอยู่ และกรองตามประเภทที่เลือก
    setFilteredLocations(
      locations.filter(location => 
        location.namelocation.toLowerCase().includes(searchLocation.toLowerCase()) &&
        (selectedCategory ? location.categoryroom?.name === selectedCategory : true) 
      )
    );
  }, [searchLocation, selectedCategory, locations]);

  return (
    <div className="mt-8 max-w-7xl mx-auto px-4 py-8">
      {/* Input Search and Category Filter */}
      <div className="flex justify-center items-center gap-4 mb-8">
        {/* Input Search */}
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="ค้นหาครุภัณฑ์..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
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

        {/* Category Filter Dropdown */}
        <div className="relative w-48">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            <option value="">เลือกประเภทสถานที่</option>
            {categories.map((category: any) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Layout */}
      <table className="min-w-full table-auto border-collapse border border-gray-300">
  <thead>
    <tr className="bg-gray-100">
      <th className="py-2 px-4 border-b text-left text-sm font-semibold">สถานที่</th>
      <th className="py-2 px-4 border-b text-left text-sm font-semibold">ผู้รับผิดชอบ</th>
      <th className="py-2 px-4 border-b text-left text-sm font-semibold">ประเภท</th>
      <th className="py-2 px-4 border-b text-left text-sm font-semibold">ดำเนินการ</th>
    </tr>
  </thead>
  <tbody>
    {filteredLocations.map((location) => (
      <tr key={location.id} className="odd:bg-gray-50 even:bg-white">
        <td className="py-2 px-4 border-b text-sm">{location.namelocation}</td>
        <td className="py-2 px-4 border-b text-sm">{location.nameteacher}</td>
        <td className="py-2 px-4 border-b text-sm">{location.categoryroom?.name}</td>
        <td className="py-2 px-4 border-b text-left">
          <Link
            href={`location/${location.namelocation}`}
            className="inline-block px-4 py-2 rounded-lg bg-[#113FB3] text-white text-center hover:bg-indigo-600 focus:outline-none transition duration-300 text-sm"
          >
            ยืมของภายในห้อง
          </Link>
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
}
