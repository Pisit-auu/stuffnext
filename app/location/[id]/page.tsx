'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Select, Input, Button, Popconfirm } from 'antd';
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
  const [assetLocation, setAssetLocation] = useState<any[]>([]);
  const [filteredborrow, setFilteredborrow] = useState<any[]>([]);
  const [newfilteredLocation, senewFilteredLocation] = useState<any[]>([]);

  const [searchLocation, setSearchLocation] = useState('');
  const [allLoction, setallLocation] = useState<Location[]>([]);
  const [thisLocation, setthisLocation] = useState<Location | null>(null); // Properly type thisLocation
  const [nameuser, setnameuser] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetailAsset, setSelectedAsset] = useState<any | undefined>(undefined);
  const [avilablevaluecanput, setupdateinRoomavailableValue] = useState(''); //จำนวนที่จะยืม
  const [note, setNote] = useState('');
  const [maxinputvalue, setmaxinputvalue] = useState('');  
  const [selectBorrowLocation, setselectBorrowLocation] = useState<any | undefined>(undefined);
  const [checksession, setchecksession] = useState(false);
  const [userId, setUserId] = useState('');
  const [valueinroom, setvalueinroom] = useState(0);
  const [unvalueinroom, setunvalueinroom] = useState(0);
  const [borrowbotton ,setborrowbotton ] = useState(false);
  // Session
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    if (!session?.user?.username) return; // Check if username exists in the session
    if (session.user.id) {
      setUserId(session.user.id); // Set the user ID
    }
    setnameuser(session.user.name ?? ""); // ถ้าเป็น null/undefined ใช้ค่าเป็น "" แทน
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      setchecksession(false);
    } else if (status === 'authenticated') {
      setchecksession(true);
      fetchUser();
      fetchlocation();
    }
  }, [status, router]);

  useEffect(() => {
    fetchassetlocationandborrow();
  }, []);
  const fetchassetlocationandborrow = async () => {
    try {
      const response = await axios.get(`/api/borrow/location/${id}`);
      const res = await axios.get(`/api/assetlocationroom?location=${id}`);
      const newassetLocation = []
      console.log(res.data)
      for (let i = 0; i < res.data.length; i++) {
        
        newassetLocation.push({ id: res.data[i].id, 
           asset: res.data[i].asset, 
           assetId: res.data[i].assetId, 
           inRoomaunavailableValue: res.data[i].inRoomaunavailableValue, 
           inRoomavailableValue: res.data[i].inRoomavailableValue, 
           location: res.data[i].location,
           locationId: res.data[i].locationId,
           borrowed: 0
          });
        for (let j = 0; j < response.data.length; j++) {
          if(response.data[j].asset.name === res.data[i].asset.name && response.data[j].ReturnStatus === 'w' ){
             newassetLocation[i].inRoomavailableValue -= response.data[j].valueBorrow;
             newassetLocation[i].borrowed += response.data[j].valueBorrow;
          }
        }
      }
      // for (let j = 0; j < newassetLocation.length; j++) {
      //       console.log(newassetLocation[j])
      // }
      setAssetLocation(newassetLocation);
      senewFilteredLocation(newassetLocation);

      setFilteredborrow(response.data)
    } catch (err) {
      setError('Failed to fetch borrow history');
    } 
  }

  useEffect(() => {
    const filtered = assetLocation.filter((As: any) =>
      As.asset.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
      As.location.namelocation.toLowerCase().includes(searchLocation.toLowerCase())
    );
    senewFilteredLocation(filtered);
  }, [searchLocation, assetLocation]);


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

  const clickborrow = async () => {
    if(!selectBorrowLocation){
      alert("กรุณาเลือกสถานที่ที่จะยืม")
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

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAsset(undefined);
  };

  const onChange = async (value: string) => {
    setselectBorrowLocation(value);
  };

  const onSearch = (value: string) => {
    // console.log('search:', value);
  };

  return (
    <div className="mt-8 max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-center mb-6">
        <div className="relative w-full sm:w-96">
          {/* ไอคอนค้นหา */}
          <input
            type="text"
            placeholder="ค้นหาครุภัณฑ์..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <img 
              src="/search.png" 
              alt="ค้นหา"
              className="w-6 h-6"
            />
          </button>
        </div>
      </div>
      <h1 className='mb-4 text-xl'>ครุภัณฑ์ในห้อง</h1>
  
      {/* เช็คว่ามีข้อมูลใน newfilteredLocation หรือไม่ */}
      {newfilteredLocation.length === 0 ? (
        <div className="text-center text-gray-500 text-xl font-semibold">
          ⏳ ไม่มีข้อมูล
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {newfilteredLocation.map((As: any) => (
            <div key={As.id} className="bg-white shadow-lg rounded-lg overflow-hidden w-full">
              <img
                src={As.asset.img || 'https://res.cloudinary.com/dqod78cp8/image/upload/v1739554101/uploads/qgphknmc83jbkshsshp0.png'}
                alt={As.asset.name}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{As.asset.name} </h2>
                <p className="text-gray-600">สถานที่: {As.location.namelocation}</p>
                <p className="text-gray-700">จำนวนที่ใช้งานได้: {As.inRoomavailableValue + As.borrowed}</p>
                <p className="text-gray-700">พร้อมให้ยืม: {As.inRoomavailableValue}</p>
                <p className="text-gray-700">จำนวนที่ใช้งานไม่ได้: {As.inRoomaunavailableValue}</p>
                <div className="mt-4">
                  <button onClick={() => clisckbutton(As, As.inRoomavailableValue, As.inRoomaunavailableValue)} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                    ยืม
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
  
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
                <Option value={""} disabled>
                  ไม่พบข้อมูล
                </Option>
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
              <Button onClick={clickborrow} disabled={ borrowbotton|| Number(maxinputvalue)===0} type="primary" className="w-full">
                ยืม
              </Button>
              <Button onClick={closeModal} className="w-full">
                ปิด
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
}