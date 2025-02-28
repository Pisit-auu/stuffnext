'use client'
import Image from "next/image";
import Link from 'next/link';
import { Card } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Home() {
  const [locations, setLocations] = useState<any[]>([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<any[]>([]);

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
    fetchLocations();
  }, []);

  useEffect(() => {
    // ค้นหาจากข้อมูลที่มีอยู่ ไม่ต้องเรียก API ใหม่
    setFilteredLocations(
      locations.filter(location => 
        location.namelocation.toLowerCase().includes(searchLocation.toLowerCase())
      )
    );
  }, [searchLocation, locations]);



  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Input Search */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="🔍 ค้นหาสถานที่..."
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          className="w-full sm:w-96 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>

      {/* Grid Layout for Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredLocations.map((location) => (
          <Card
            key={location.id}
            variant={"outlined"}
            className="shadow-lg hover:shadow-2xl transition-all duration-300 rounded-lg overflow-hidden"
          >
            {/* รูปภาพสถานที่ */}
            {location.image && (
              <div className="relative w-full h-40">
                <Image
                  src={location.image}
                  alt={location.namelocation}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
            )}

            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">{location.namelocation}</h3>
              <p className="text-gray-600 mt-2">ผู้รับผิดชอบ: {location.nameteacher}</p>
              <Link
                href={`location/${location.namelocation}`}
                className="mt-4 block w-full text-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
              >
                ดูรายละเอียด
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
