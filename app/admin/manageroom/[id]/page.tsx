'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Select } from 'antd';
import { Input } from 'antd';
import { useRouter } from 'next/navigation'
import { Button, Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
interface Asset {
    id: number;
    name: string;
    img: string;
    assetid: string;
    categoryId: string;
    // คุณสามารถเพิ่มฟิลด์อื่นๆ ที่มีในอ็อบเจกต์นี้ได้
  }
  
export default function Manageroom() {
      const router = useRouter();
  const { id } = useParams() as { id: string };
  const [assetLocation, setAssetLocation] = useState<any[]>([]);
  const [filteredLocation, setFilteredLocation] = useState<any[]>([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetailAsset, setSelectedAsset] = useState<any | undefined>(undefined);
  const [isaddAssetOpen, setIsaddAssetOpen] = useState(false);
  const [newselectedAsset, setnewSelectedAsset] = useState<any | undefined>(undefined);
  const [Asset, setAsset] = useState<any[] | null>(null);
  const [inputvalueAssetselect, setinputvalueAssetselect] = useState(false);
  const [addInRoomavailableValue , setinRoomavailableValue] = useState('')
  const [addInRoomunavailableValue , setinRoomunavailableValue] = useState('')
  const [updateInRoomavailableValue , setupdateinRoomavailableValue] = useState('')
  const [updateInRoomunavailableValue , setupdateinRoomunavailableValue] = useState('')
  const [addlocationid , setaddlocationid] = useState('')
  const [Iddelete , setIddelete] = useState('')
  const [statusedit , seteditstatus] = useState(false)
  const fetchAsset = async () => {
    try {
      const resasset = await axios.get(`/api/asset`);
      setAsset(resasset.data);
      
      const filteredData = resasset.data.filter((assetA) => {
        // ตรวจสอบว่า `assetA.name` ตรงกับ `assetB.assetId` ในข้อมูล B
        const isInB = assetLocation.some((assetB) => assetB.assetId === assetA.assetid);
        // กรองเฉพาะ asset ที่ยังไม่อยู่ใน B โดยเปรียบเทียบจากชื่อ
        return !isInB; // เฉพาะ asset ที่ยังไม่มีใน B
      });
     // console.log('ข้อมูลที่กรองออกมา:', filteredData);
      // อัปเดต state หลังจากกรองข้อมูล
      setAsset(filteredData);
    } catch (error) {
      console.error(error);
    }
  };
  const updateAssetinroom = async () => {
    if (!newselectedAsset || !addInRoomavailableValue || !addInRoomunavailableValue) {
      // ถ้าข้อมูลที่จำเป็นยังไม่ถูกกรอก
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
        await axios.post('/api/assetlocation', {
          assetId: newselectedAsset,
          locationId: addlocationid,
          inRoomavailableValue: addInRoomavailableValue,
          inRoomaunavailableValue: addInRoomunavailableValue,
        });

        // รีเฟรชข้อมูลใหม่หลังจากเพิ่มข้อมูลเสร็จ
        fetchassetlocation();

        setIsaddAssetOpen(false); 
        router.push(`/admin/manageroom/${addlocationid}`);
        alert("เพิ่มข้อมูลครุภัณฑ์สำเร็จ");

    } catch (error) {
      console.error("Error updating asset in room:", error);
      alert("เกิดข้อผิดพลาดในการเพิ่มข้อมูล กรุณาลองใหม่");
    }
};
  
    


  useEffect(() => {
    fetchassetlocation();
  }, []);

  useEffect(() => {
    const filtered = assetLocation.filter((As: any) =>
      As.asset.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
      As.location.namelocation.toLowerCase().includes(searchLocation.toLowerCase())
    );
    setFilteredLocation(filtered);
  }, [searchLocation, assetLocation]);

  const fetchassetlocation = async () => {
    try {
      const res = await axios.get(`/api/assetlocationroom?location=${id}`);
      const reslocation = await axios.get(`/api/location/${id}`);
      setAssetLocation(res.data);
     setaddlocationid(reslocation.data.namelocation)
      setFilteredLocation(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  const editmodal = async () => {
    
    if(statusedit){
        if(parseInt(updateInRoomavailableValue,10) < 0 || parseInt(updateInRoomunavailableValue,10)< 0){
                alert("ค่าที่อัพเดตต้อง>=0")
                return
        }
        try {
            await axios.put(`/api/assetlocation/${Iddelete}`, {
                inRoomavailableValue: updateInRoomavailableValue,
                inRoomaunavailableValue: updateInRoomunavailableValue,
            })
            console.log(Iddelete)
            setIsModalOpen(false);
            seteditstatus(false)
            fetchassetlocation();
          } catch (error) {
            console.error(error)
          }
    }else{
        seteditstatus(true)
        
    }
  };

  const deleteAssetlocation = async () => {
    try {
       await axios.delete(`/api/assetlocation/${parseInt(Iddelete,10)}`);
       setIsModalOpen(false);
       fetchassetlocation();
    } catch (error) {
      console.error(error);
    }
  };

  const openaddasset = () => {
    setIsaddAssetOpen(true);
    setinputvalueAssetselect(true)
    fetchAsset();
  };

  const openModal = (asset: any) => {
    setIddelete(asset.id)
    setupdateinRoomavailableValue(asset.inRoomavailableValue)
    setupdateinRoomunavailableValue(asset.inRoomaunavailableValue)
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  const closeaddAsset = () => {
    setIsaddAssetOpen(false);
    setinputvalueAssetselect(false);
    
  };

  const closeModal = () => {
    setIsModalOpen(false);
    seteditstatus(false)
    setSelectedAsset(undefined); // Use undefined instead of null
    
  };

  const onChange = (value: string) => {
    setnewSelectedAsset(value);
    

   // console.log(`selected ${value}`);
  };

  const onSearch = (value: string) => {
 //   console.log('search:', value);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 🔍 Input Search */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="🔍 ค้นหาชื่อของในห้อง"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          className="w-full sm:w-96 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>
      <button onClick={() => openaddasset()} className="m-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
        เพิ่มครุภัณฑ์ในห้อง
      </button>

      {/* 🏠 Grid Layout for Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredLocation.map((As: any) => (
          <div key={As.id} className="bg-white shadow-lg rounded-lg overflow-hidden w-full">
            <img
              src={As.asset.img || "https://res.cloudinary.com/dqod78cp8/image/upload/v1739554101/uploads/qgphknmc83jbkshsshp0.png"}
              alt={As.asset.name}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold">{As.asset.name}</h2>
              <p className="text-gray-600">📍 สถานที่: {As.location.namelocation}</p>
              
              <p className="text-gray-700">📦 จำนวนที่ใช้งานได้: {As.inRoomavailableValue}</p>
              <p className="text-gray-700">📦 จำนวนที่ใช้งานไม่ได้: {As.inRoomaunavailableValue}</p>

              <div className="mt-4">
                <button onClick={() => openModal(As)} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                  ดูรายละเอียด
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isaddAssetOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-8 rounded-lg w-96 shadow-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">เพิ่มครุภัณฑ์</h2>
                <h1 className="text-lg font-medium text-gray-700 mb-4">เลือกประเภทครุภัณฑ์</h1>
                <Select
                    showSearch
                    placeholder="เลือกครุภัณฑ์"
                    optionFilterProp="children"
                    onSearch={onSearch} // ใช้ onSearch
                    onChange={onChange}
                    value={newselectedAsset}
                    className="w-full mb-4"
                >
                    {Asset && Asset.length > 0 ? (
                    Asset.map((asset) => (
                        <Option key={asset.assetid} value={asset.assetid}>
                        {asset.name}
                        </Option>
                    ))
                    ) : (
                    <Option value={""} disabled>
                        ไม่พบข้อมูล
                    </Option>
                    )}
                </Select>

                {inputvalueAssetselect && (
                    <div className="space-y-4">
                    <Input
                        value={addInRoomavailableValue}
                        type="number"
                        min="0"
                        onChange={(e) => setinRoomavailableValue(e.target.value)}
                        placeholder="จำนวนที่พร้อมใช้งาน"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Input
                        value={addInRoomunavailableValue}
                        type="number"
                        min="0"
                        onChange={(e) => setinRoomunavailableValue(e.target.value)}
                        placeholder="จำนวนที่เสีย"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    </div>
                )}

                <div className="flex justify-end mt-6 space-x-4">
                    <button
                    onClick={updateAssetinroom}
                    className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 focus:outline-none transition"
                    >
                    เพิ่ม
                    </button>
                    <button
                    onClick={closeaddAsset}
                    className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 focus:outline-none transition"
                    >
                    ปิด
                    </button>
                </div>
                </div>
            </div>
            )}

      {/* Details Modal */}
      {isModalOpen && selectedDetailAsset && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg w-96">
      <h2 className="text-xl font-semibold text-center mb-4">{selectedDetailAsset.asset.name}</h2>
      <p className="text-gray-600 text-center mb-4">📍 สถานที่: {selectedDetailAsset.location.namelocation}</p>

      {
        statusedit ? (
          <>
            <div className="mb-4">
              <p className="text-gray-700 mb-2">📦 จำนวนที่ใช้งานได้:</p>
              <Input
                value={updateInRoomavailableValue}
                min="0"
                type="number"
                onChange={(e) => setupdateinRoomavailableValue(e.target.value)}
                placeholder="จำนวนที่พร้อมใช้งาน"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <p className="text-gray-700 mb-2">📦 จำนวนที่ใช้งานไม่ได้:</p>
              <Input
                value={updateInRoomunavailableValue}
                min="0"
                type="number"
                onChange={(e) => setupdateinRoomunavailableValue(e.target.value)}
                placeholder="จำนวนที่เสีย"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-700 mb-2">📦 จำนวนที่ใช้งานได้: {selectedDetailAsset.inRoomavailableValue}</p>
            <p className="text-gray-700 mb-4">📦 จำนวนที่ใช้งานไม่ได้: {selectedDetailAsset.inRoomaunavailableValue}</p>
          </>
        )
      }

      <div className="flex flex-col space-y-4 mt-6">
        <Button onClick={editmodal} type="primary" className="w-full">
          แก้ไข
        </Button>

        <Popconfirm
          title="Delete the task"
          description="ยืนยันที่จะลบหรือไม่?"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          onConfirm={() => deleteAssetlocation()}
        >
          <Button danger className="w-full">
            Delete
          </Button>
        </Popconfirm>

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
