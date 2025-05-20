'use client';
import axios from 'axios';
import React, { use, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Select, Input, Button, Popconfirm } from 'antd';
import { signOut } from "next-auth/react";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import '@ant-design/v5-patch-for-react-19';

const { Option } = Select;

// Define the Location type
interface Location {
  id: string;
  namelocation: string;
  // Add other properties if needed
}

export default function location() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [assetLocation, setAssetLocation] = useState<any[]>([]); // เก็บ asset ที่อยู่ในห้อง
  const [newfilteredLocation, senewFilteredLocation] = useState<any[]>([]);  //ให้แสดงเฉพาะข้อมูลที่ตรงกับคำค้นหา
  const [category, setSelectCategory] = useState<string>("");  //เก็บcategory ที่เลือกเพื่อกรองข้อมูล
  const [namelocation , setnamelocation] = useState('')
  const [searchLocation, setSearchLocation] = useState('');//เก็บsearchLocationที่เลือกเพื่อกรองข้อมูล
  const [allLoction, setallLocation] = useState<Location[]>([]);  //เก็บlocation อื่นๆ
  const [thisLocation, setthisLocation] = useState<Location | null>(null); // เก็บ locationปัจจุบัน
  const [nameuser, setnameuser] = useState(''); // เก็บชื่อผู้ใช้
  const [isModalOpen, setIsModalOpen] = useState(false); //เก็บสถานะเพื่อแสดงหน้ายืม
  const [selectedDetailAsset, setSelectedAsset] = useState<any | undefined>(undefined);
  const [avilablevaluecanput, setupdateinRoomavailableValue] = useState(''); //จำนวนที่จะยืม
  const [note, setNote] = useState(''); //เก็บ หมายเหตุที่จะยืม
  const [maxinputvalue, setmaxinputvalue] = useState('');  //จำนวนที่สามารถยืมได้มากสุด
  const [selectBorrowLocation, setselectBorrowLocation] = useState<any | undefined>(undefined); //เก็บสถานที่ที่จะยืมไป
  const [checksession, setchecksession] = useState(false);
  const [userId, setUserId] = useState('');  //เก็บ id user
  const [valueinroom, setvalueinroom] = useState(0);  //จำนวนของที่ยืมในห้อง
  const [unvalueinroom, setunvalueinroom] = useState(0);//จำนวนของที่ยืมในห้อง
  const [borrowbotton ,setborrowbotton ] = useState(false); //เก็บสถานะปุ่มยืม
  // Session
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]); // สถานะสำหรับประเภท

  //ฟังก์ชัน เช็ค user ว่ามี sessionไหม
  const fetchUser = async () => {
    if (!session?.user?.username) return; //เช็คว่ามี session ไหม
    if (session.user.id) {
      const res = await axios.get(`/api/auth/signup/${session?.user.username}`);
      if(!res.data){
        alert('ไม่พบบัญชีผู้ใช้')
        signOut();
        return;
      }
      setUserId(session.user.id); // เก็บ id user
    }
    setnameuser(session.user.name ?? ""); // ถ้าเป็น null/undefined ใช้ค่าเป็น "" แทน
  };

  //ตรวจสอบสถานะของผู้ใช้ (status) คอย setchecksession และ ดึงข้อมูล user , สถานที่ๆเลือก , ดึงข้อมูลประเภท
  useEffect(() => {
    if (status === 'unauthenticated') {
      setchecksession(false);
    } else if (status === 'authenticated') {
      setchecksession(true);
      fetchUser();
      fetchlocation();
      fetchCategories();
    }
  }, [status, router]);

  //ฟังก์ชัน ดึงข้อมูลประเภท
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`/api/category`);
      setCategories(res.data); // รับข้อมูลประเภท
    } catch (error) {
      console.error(error);
    }
  }

  //เรียกใช้งานฟังก์ชัน fetchassetlocationandborrow()
  useEffect(() => {
    fetchassetlocationandborrow();
  }, []);


  
  const fetchassetlocationandborrow = async () => {
    try {
      //ดึงข้อมูลการยืม (borrow) และตำแหน่งสินทรัพย์ (assetlocationroom)
      const response = await axios.get(`/api/borrow/location/${id}`);
      const res = await axios.get(`/api/assetlocationroom?location=${id}`);
      const newassetLocation = []
      //console.log(res.data)
      setnamelocation(decodeURIComponent(id))
      for (let i = 0; i < res.data.length; i++) {
        
        newassetLocation.push({ id: res.data[i].id, 
           asset: res.data[i].asset, 
           assetId: res.data[i].assetId, 
           createdAt: res.data[i].createdAt,
           inRoomaunavailableValue: res.data[i].inRoomaunavailableValue, 
           inRoomavailableValue: res.data[i].inRoomavailableValue, 
           location: res.data[i].location,
           locationId: res.data[i].locationId,
           borrowed: 0
          });

          // ลดจำนวนที่สามารถให้ยืมได้ และ  เพิ่มจำนวนสินทรัพย์ที่ถูกยืม
        for (let j = 0; j < response.data.length; j++) {
          if(response.data[j].asset.name === res.data[i].asset.name && response.data[j].ReturnStatus === 'w' ){
             newassetLocation[i].inRoomavailableValue -= response.data[j].valueBorrow;
             newassetLocation[i].borrowed += response.data[j].valueBorrow;
          }
        }
      }
      setAssetLocation(newassetLocation);
      senewFilteredLocation(newassetLocation);


    } catch (err) {
      setError('Failed to fetch borrow history');
    } 
  }


  //กรองข้อมูลตำแหน่งสินทรัพย์ assetLocationและอัปเดตผลลัพธ์ที่กรองไว้ใน senewFilteredLocation
  useEffect(() => {
    const filtered = assetLocation.filter((As: any) =>
      As.asset.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
      As.location.namelocation.toLowerCase().includes(searchLocation.toLowerCase())||
      As.asset.category.name.toLowerCase().includes(category.toLowerCase())
    );

    senewFilteredLocation(filtered);
  }, [searchLocation, assetLocation]);

  // กรองสินทรัพย์ตามหมวดหมู่ category
  useEffect(() => {
    const filtered = assetLocation.filter((As: any) =>
      As.asset.category.name.toLowerCase().includes(category.toLowerCase())
    );

    senewFilteredLocation(filtered);
  }, [category]);


  //อัปเดต thisLocation และ allLocation กรองข้อมูลตำแหน่งให้ไม่ซ้ำซ้อน allLocation ไม่รวม thisLocation
  const fetchlocation = async () => {
    try {
      const [res, getlocation] = await Promise.all([
        axios.get(`/api/location`),
        axios.get(`/api/location/${decodeURIComponent(id)}`)
      ]);
      setthisLocation(getlocation.data); // Set thisLocation with the correct type
      setallLocation(res.data.filter((loc: { id: any; }) => loc.id !== getlocation.data.id));
    } catch (error) {
      console.error(error);
    }
  };

  //ฟังก์ชันเมื่อเลือกของที่ยิม
  const clisckbutton = (asset: any,savevalueinroom: number,saveunvalueinroom: number) => {
    if (checksession) {
      setmaxinputvalue(asset.inRoomavailableValue);
      setSelectedAsset(asset);
      setvalueinroom(savevalueinroom);
      setunvalueinroom(saveunvalueinroom);
      
      if (nameuser === '' || nameuser === null) {
        alert('โปรดเพิ่มชื่อจริง ก่อนยืมที่หน้า โปรไฟล์');
        router.push(`/profile`);
        return;
      }
      setIsModalOpen(true);
    } else {
      alert('โปรด login ก่อนยืม');
    }
  };


  //เมื่อกดปุ่มยืมของ
  const clickborrow = async () => {
    if(!selectBorrowLocation){
      alert("กรุณาเลือกสถานที่ที่จะยืม")
      return
    }
    if(parseInt(avilablevaluecanput) < 1|| avilablevaluecanput ===''){
      alert("จำนวนที่ยืมต้อง > 0 หรือ กรอกตัวเลข")
      return
    }
    setborrowbotton(true)
    try {
      const getborrowlocation = await axios.get(`/api/assetlocationroom?location=${selectBorrowLocation}`);
      const savegetassetlocationinroomvalue = valueinroom; // เก็บค่าของก่อนที่ยืม
      const savegetassetlocationinroomunvalue = unvalueinroom;
      
      
      const hasborrowAsset = getborrowlocation.data.some((item: { assetId: any; }) => item.assetId === selectedDetailAsset.assetId);
      
      if (hasborrowAsset) {
        let idAssetborrow: number = 0;
        let saveassetlocationvalule: number = 0; // save ค่าที่อยู่ห้องที่จะยืม
        let saveassetlocationunvalule: number = 0; // save ค่าที่อยู่ห้องที่จะยืม
        getborrowlocation.data.forEach((item: {
                  inRoomavailableValue: number;
                  inRoomaunavailableValue: number; assetId: string; id: number 
        }) => {
          if (selectedDetailAsset.assetId === item.assetId) {
            idAssetborrow = item.id;
            saveassetlocationvalule = item.inRoomavailableValue;
            saveassetlocationunvalule = item.inRoomaunavailableValue;
          }
        });
        if(parseInt(avilablevaluecanput, 10)<0){
          alert("ค่าที่เพิ่ม < 0")
          return
        }
        if( savegetassetlocationinroomvalue < parseInt(avilablevaluecanput, 10)){
          alert("ค่าของในห้อง < ค่าที่จะยิม")
          return
        }
        await axios.put(`/api/assetlocation/${idAssetborrow}`, {
        
          inRoomavailableValue: saveassetlocationvalule + parseInt(avilablevaluecanput, 10),
          inRoomaunavailableValue: saveassetlocationunvalule,
        });
        await axios.put(`/api/assetlocation/${selectedDetailAsset.id}`, {
          inRoomavailableValue: savegetassetlocationinroomvalue- parseInt(avilablevaluecanput, 10),
          inRoomaunavailableValue: savegetassetlocationinroomunvalue,
        });
        setIsModalOpen(false);
        router.push(`/home`);
        alert('ยืมสำเร็จ');
      } else {
        await axios.post('/api/assetlocation', {
          assetId: selectedDetailAsset.assetId,
          locationId: selectBorrowLocation,
          inRoomavailableValue: 0,
          inRoomaunavailableValue: 0,
        });
        const getupdateborrowlocation = await axios.get(`/api/assetlocationroom?location=${selectBorrowLocation}`);
        let idAssetborrow: number = 0;

        getupdateborrowlocation.data.forEach((item: { assetId: string; id: number }) => {
          if (selectedDetailAsset.assetId === item.assetId) {
            idAssetborrow = item.id;
          }
        });
        if(parseInt(avilablevaluecanput, 10)<0){
          alert("ค่าที่เพิ่ม < 0")
          return
        }
        if( savegetassetlocationinroomvalue < parseInt(avilablevaluecanput, 10)){
          alert("ค่าของในห้อง < ค่าที่จะยิม")
          return
        }
        await axios.put(`/api/assetlocation/${idAssetborrow}`, {
          inRoomavailableValue: parseInt(avilablevaluecanput),
          inRoomaunavailableValue: 0,
        });
        await axios.put(`/api/assetlocation/${selectedDetailAsset.id}`, {
          inRoomavailableValue: savegetassetlocationinroomvalue - parseInt(avilablevaluecanput, 10),
          inRoomaunavailableValue: savegetassetlocationinroomunvalue,
        });
        setIsModalOpen(false);
        setborrowbotton(false)
        router.push(`/home`);
        alert('ยืมสำเร็จ');
       
      }
      // เพิ่มประวัติการยืม
      await axios.post('/api/borrow', {
        userId: userId,
        assetId: selectedDetailAsset.assetId,
        borrowLocationId: selectBorrowLocation,
        returnLocationId: thisLocation?.namelocation || '', // Use optional chaining and provide a fallback
        note,
        valueBorrow: avilablevaluecanput,
      });
    } catch (error) {
      console.error(error);
    }
  };


  // ปิดpopup ของที่ยืม
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAsset(undefined);
  };

  //อัพเดตสถานที่ๆยืม
  const onChange = async (value: string) => {
    setselectBorrowLocation(value);
  };

  const onSearch = (value: string) => {
    // console.log('search:', value);
  };
  const handleDownload = async () => {
    const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Assets');

      // กำหนดหัวตาราง
      worksheet.columns = [
        { header: 'ชื่อครุภัณฑ์', key: 'name', width: 30 },
        { header: 'ประเภทครุภัณฑ์', key: 'category', width: 20 },
        { header: 'วันที่เพิ่ม', key: 'createdAt', width: 20 },
        { header: 'สถานที่', key: 'location', width: 20 },
        { header: 'จำนวนใช้งานได้', key: 'usableCount', width: 20 },
        { header: 'จำนวนใช้งานไม่ได้', key: 'unusableCount', width: 20 },
        { header: 'พร้อมให้ยืม', key: 'availableCount', width: 20 },
      ];

      // ใส่ข้อมูลแต่ละแถว
      newfilteredLocation.forEach((item) => {
        worksheet.addRow({
          name: item.asset.name,
          category: item.asset.category.name,
          createdAt: item.createdAt,
          location: item.location.namelocation,
          usableCount: item.inRoomavailableValue + item.borrowed,
          unusableCount: item.inRoomaunavailableValue,
          availableCount: item.inRoomavailableValue,
        });
      });

      // สร้างไฟล์ Excel แล้วดาวน์โหลด
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `ครุภัณฑ์ในห้อง ${namelocation}.xlsx`);
      });
  }
  return (
    <div className="mt-8 max-w-7xl mx-auto px-4 py-8">
     <div className="flex items-center space-x-2 mb-6">
    <div className="relative flex-1">
      <input
        type="text"
        placeholder="ค้นหาครุภัณฑ์..."
        value={searchLocation}
        onChange={(e) => setSearchLocation(e.target.value)}
        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      />
      <button className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <img src="/search.png" alt="ค้นหา" className="w-6 h-6" />
      </button>
    </div>

    <select
      value={category}
      onChange={(e) => setSelectCategory(e.target.value)}
      className="w-48 px-4 py-3 border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
    >
      <option value="">เลือกประเภทครุภัณฑ์</option>
      {categories.map((cat: any) => (
        <option key={cat.idname} value={cat.name}>
          {cat.name}
        </option>
      ))}
    </select>

    <button
      onClick={handleDownload}
      className="block sm:inline-block px-4 py-3 rounded-lg bg-[#006600] text-center text-white hover:bg-green-600 transition-all"
    >
      โหลดไฟล์ Exel
    </button>
  </div>
  
      <h1 className="mb-4 text-xl">ครุภัณฑ์ในห้อง {namelocation}</h1>
  
      {newfilteredLocation.length === 0 ? (
        <div className="text-center text-gray-500 text-xl font-semibold">⏳ ไม่มีข้อมูล</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border text-left">ชื่อครุภัณฑ์</th>
                <th className="px-4 py-2 border text-left">ประเภทครุภัณฑ์</th>
                <th className="px-4 py-2 border text-left">วันที่เพิ่ม</th>
                <th className="px-4 py-2 border text-left">จำนวนใช้งานได้</th>
                <th className="px-4 py-2 border text-left">จำนวนใช้งานไม่ได้</th>
                <th className="px-4 py-2 border text-left">พร้อมให้ยืม</th>
                <th className="px-4 py-2 border text-left">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {newfilteredLocation.map((As: any) => (
                <tr key={As.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 border">{As.asset.name}</td>
                  <td className="px-4 py-2 border">{As.asset.category.name}</td>
                  <td className="px-4 py-2 border">{As.createdAt}</td>
                  <td className="px-4 py-2 border">{As.inRoomavailableValue + As.borrowed}</td>
                  <td className="px-4 py-2 border">{As.inRoomaunavailableValue}</td>
                  <td className="px-4 py-2 border">{As.inRoomavailableValue}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => clisckbutton(As, As.inRoomavailableValue, As.inRoomaunavailableValue)}
                      className="px-4 py-2 rounded-lg bg-[#113FB3] text-white hover:bg-blue-600 transition w-full"
                    >
                      ยืม
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
  
      {/* Modal สำหรับยืมครุภัณฑ์ */}
      {isModalOpen && selectedDetailAsset && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="mb-4">ครุภัณฑ์ที่ยืม: {selectedDetailAsset.asset.name}</h2>
            <h2 className="mb-4">รหัสครุภัณฑ์: {selectedDetailAsset.asset.assetid}</h2>
            <h2 className="mb-4">สถานที่ของครุภัณฑ์: {selectedDetailAsset.location.namelocation}</h2>
            <Select
              showSearch
              placeholder="เลือกสถานที่ยืม"
              optionFilterProp="children"
              onSearch={onSearch}
              onChange={onChange}
              value={selectBorrowLocation}
              className="w-full mb-4"
            >
              {Array.isArray(allLoction) && allLoction.length > 0 ? (
                allLoction.map((locate) => (
                  <Option key={locate.namelocation} value={locate.namelocation}>
                    {locate.namelocation}
                  </Option>
                ))
              ) : (
                <Option value={""} disabled>ไม่พบข้อมูล</Option>
              )}
            </Select>
            <Input
              value={avilablevaluecanput}
              type="number"
              min="0"
              max={maxinputvalue}
              onChange={(e) => {
                let value = Number(e.target.value);
                if (value > parseInt(maxinputvalue)) {
                  value = parseInt(maxinputvalue);
                } else if (value < 0 || isNaN(value)) {
                  value = 0;
                }
                setupdateinRoomavailableValue(String(value));
              }}
              onBlur={(e) => {
                if (!e.target.value) {
                  setupdateinRoomavailableValue("0");
                }
              }}
              placeholder={`จำนวนที่ยืม เลือกได้สูงสุด ${maxinputvalue}`}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Input
              value={note}
              type="text"
              onChange={(e) => setNote(String(e.target.value))}
              placeholder="หมายเหตุ"
              className="mt-4 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex flex-col space-y-4 mt-6">
              <Button onClick={clickborrow} disabled={borrowbotton || Number(maxinputvalue) === 0} type="primary" className="w-full">
                ยืม
              </Button>
              <Button onClick={closeModal} className="w-full">ปิด</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
  
}