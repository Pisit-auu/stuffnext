'use client'
import Image from "next/image";
import Link from 'next/link'
import { Card } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
export default function Home() {
  const [locations, setLocation] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    fetchLocation();
  }, [searchLocation]);

  const fetchLocation = async () => {
    try {
      const query = new URLSearchParams({ search: searchLocation }).toString();
      const res = await axios.get(`/api/location?${query}`);
      setLocation(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    
    <div className="max-w-6xl mx-auto px-4 py-8 ">
       
      {/* Input Search */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="🔍 ค้นหาชื่อสถานที่..."
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          className="w-full sm:w-96 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>

      {/* Grid Layout for Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {locations.map((location: any) => (
          <Card
            key={location.id} 
            title={location.namelocation}
            bordered={false}
            className="shadow-sm hover:shadow-xl transition-all duration-300 rounded-lg"
          >
            <p className="text-gray-700 px-6 py-4">ผู้รับผิดชอบ: {location.nameteacher}</p>
            <Link
            className="mt-4 w-full inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            href={`location/${location.namelocation}`}
          >
            ดู
          </Link>
          </Card>
          
        ))}
      </div>
    </div>
  );
}
