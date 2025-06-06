'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Select } from 'antd';
import { Input } from 'antd';
import { useRouter } from 'next/navigation'
import { Button, Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
const { Option } = Select;

interface Asset {
  assetid: string;
  availableValue: number;
  unavailableValue: number;
  createdAt: string;
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
    const [Dateedit , setDateedit] = useState('')
  const [addlocationid , setaddlocationid] = useState('')
  const [Iddelete , setIddelete] = useState('')
  const [statusedit , seteditstatus] = useState(false)
  const [selectedDate, setSelectedDate] = useState("");

  const [unavilablevaluecanput , setunavilablevaluecanput] = useState('')
  const [avilablevaluecanput , setavilablevaluecanput] = useState('')
  const fetchAsset = async () => {
    try {
      const resasset = await axios.get(`/api/asset`);
      setAsset(resasset.data);
  
      const filteredData = resasset.data.filter((assetA: Asset) => {
        // ตรวจสอบว่า `assetA.assetid` ตรงกับ `assetB.assetId` ใน assetLocation
        const isInB = assetLocation.some((assetB) => assetB.assetId === assetA.assetid);
        // กรองเฉพาะ asset ที่ยังไม่อยู่ใน assetLocation และมีค่า availableValue หรือ unavailableValue มากกว่า 0
        return !isInB && (assetA.availableValue > 0 || assetA.unavailableValue > 0);
      });
  
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
          createdAt : selectedDate
        });

        // รีเฟรชข้อมูลใหม่หลังจากเพิ่มข้อมูลเสร็จ
        fetchassetlocation();
        setnewSelectedAsset('')
        setinRoomunavailableValue('0')
        setinRoomavailableValue('0')
        setIsaddAssetOpen(false); 
        setSelectedDate('')
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
          const getassetlocation = await axios.get(`/api/assetlocation/${Iddelete}`);
         // console.log(getassetlocation.data.assetId)
        //ค่าปัจจุบันในห้อง
          const saveinRoomunavailableValue = getassetlocation.data.inRoomaunavailableValue
          const saveinRoomavailableValue = getassetlocation.data.inRoomavailableValue
          //ดึงค่าปัจจุบันในคลัง
          const getasset = await axios.get(`/api/asset/${getassetlocation.data.assetId}`);
          const valueasset = getasset.data.availableValue
          const unvalueasset = getasset.data.unavailableValue
         // console.log(valueasset+ saveinRoomavailableValue - updateInRoomavailableValue)
         // console.log(unvalueasset+saveinRoomunavailableValue - updateInRoomunavailableValue)
            console.log(Dateedit)
            await axios.put(`/api/assetlocation/${Iddelete}`, {
                inRoomavailableValue: updateInRoomavailableValue,
                inRoomaunavailableValue: updateInRoomunavailableValue,
                createdAt: Dateedit
            })
            
            await axios.put(`/api/asset/${getassetlocation.data.assetId}`, {
              availableValue: valueasset + saveinRoomavailableValue - Number(updateInRoomavailableValue),
              unavailableValue: unvalueasset + saveinRoomunavailableValue - Number(updateInRoomunavailableValue),
            });
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
      const getassetlocation = await axios.get(`/api/assetlocation/${Iddelete}`);
      const getasset = await axios.get(`/api/asset/${getassetlocation.data.assetId}`);
      const valueasset = getasset.data.availableValue
      const unvalueasset = getasset.data.unavailableValue
    //ค่าปัจจุบันในห้อง
      const saveinRoomunavailableValue = getassetlocation.data.inRoomaunavailableValue
      const saveinRoomavailableValue = getassetlocation.data.inRoomavailableValue
       await axios.delete(`/api/assetlocation/${parseInt(Iddelete,10)}`);
       await axios.put(`/api/asset/${getassetlocation.data.assetId}`, {
        availableValue: valueasset+ saveinRoomavailableValue,
        unavailableValue: unvalueasset+saveinRoomunavailableValue,
    })
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
    setDateedit(asset.createdAt)
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
    setSelectedAsset(undefined);
    
  };

  const onChange = async (value: string) => {
    setnewSelectedAsset(value);
    //console.log(value)
    try {
      const res = await axios.get(`/api/asset/${value}`);
      setunavilablevaluecanput(res.data.unavailableValue)
      setavilablevaluecanput(res.data.availableValue)
    //  console.log(res.data.unavailableValue)
      //console.log(res.data.availableValue)
    } catch (error) {
      console.error(error);
    }
    

   // console.log(`selected ${value}`);
  };

  const onSearch = (value: string) => {
 //   console.log('search:', value);
  };

      const handleDownload = async () => {
        const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet('ข้อมูลครุภัณฑ์ในสถานที่');

          worksheet.columns = [
            { header: 'ชื่อครุภัณฑ์', key: 'assetName', width: 30 },
            { header: 'ประเภทครุภัณฑ์', key: 'categoryName', width: 30 },
            { header: 'จำนวนที่ใช้งานได้', key: 'availableValue', width: 20 },
            { header: 'จำนวนที่ใช้งานไม่ได้', key: 'unavailableValue', width: 20 },
            { header: 'วันที่เพิ่ม', key: 'createdAt', width: 20 },
          ];

          filteredLocation.forEach((item) => {
            worksheet.addRow({
              assetName: item.asset?.name || '-',
              categoryName: item.asset?.category?.name || '-',
              availableValue: item.inRoomavailableValue ?? '-',
              unavailableValue: item.inRoomaunavailableValue ?? '-',
              createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-',
            });
          });

          const buffer = await workbook.xlsx.writeBuffer();
          const blob = new Blob([buffer], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });

          saveAs(blob, `ข้อมูลครุภัณฑ์ ห้อง${addlocationid}.xlsx`);
        };
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
             <div className='text-2xl'> สถานที่ {addlocationid} </div>
      {/* 🔍 Input Search */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder=" ค้นหาชื่อของในห้อง"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          className="w-full sm:w-96 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
        <button onClick={handleDownload}
                        className="ml-4 block sm:inline-block w-full sm:w-auto px-4 py-2 rounded-lg bg-[#006600] text-center text-white hover:bg-green-600 transition-all"
                      >
                        โหลดไฟล์ Exel
                      </button>
      </div>
 
      <button onClick={() => openaddasset()} className="mb-4 w-full bg-[#113FB3] text-white py-2 rounded-lg hover:bg-blue-600 transition">
        เพิ่มครุภัณฑ์ในห้อง
      </button>
     
      {/* 🏠 Grid Layout for Cards */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-lg rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left border-b">ชื่อครุภัณฑ์</th>
                  <th className="px-4 py-2 text-left border-b">ประเภทครุภัณฑ์</th>
                  <th className="px-4 py-2 text-left border-b">จำนวนที่ใช้งานได้</th>
                  <th className="px-4 py-2 text-left border-b">จำนวนที่ใช้งานไม่ได้</th>
                   <th className="px-4 py-2 text-left border-b">วันที่เพิ่ม</th>
                  <th className="px-4 py-2 text-left border-b">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredLocation.map((As: any) => (
                  <tr key={As.id} className="border-b">
                    <td className="px-4 py-2">{As.asset.name}</td>
                    <td className="px-4 py-2">{As.asset.category.name}</td>
                    <td className="px-4 py-2">{As.inRoomavailableValue}</td>
                    <td className="px-4 py-2">{As.inRoomaunavailableValue}</td>
                    <td className="px-4 py-2">{As.createdAt}</td>
                    <td className="px-4 py-2">
                      <button onClick={() => openModal(As)} className="bg-[#113FB3] text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                        ดูรายละเอียด
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

      {/* Modal */}
      {isaddAssetOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-8 rounded-lg w-96 shadow-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">เพิ่มครุภัณฑ์</h2>
                <h1 className="text-lg font-medium text-gray-700 mb-4">เลือกครุภัณฑ์</h1>
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
                        max={avilablevaluecanput}
                        onChange={(e) => {
                          let value = Number(e.target.value); // แปลงค่าที่ป้อนเป็นตัวเลข
                      
                          // จำกัดค่าไม่ให้น้อยกว่า 1 และไม่มากกว่า availableValue
                          if (value > parseInt(avilablevaluecanput,10)) {
                            value = parseInt(avilablevaluecanput,10);
                          } else if (value < 0 || isNaN(value)) {
                            value = 0;
                          }
                      
                          setinRoomavailableValue(String(value));
                        }}
                        onBlur={(e) => {
                          // ถ้าผู้ใช้ลบค่าทั้งหมดหรือเว้นว่างไว้ ให้ตั้งค่าเป็น 1
                          if (!e.target.value) {
                            setinRoomavailableValue("0");
                          }
                        }}
                        placeholder="จำนวนที่พร้อมใช้งาน"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Input
                        value={addInRoomunavailableValue}
                        type="number"
                        min="0"
                        max={unavilablevaluecanput}
                        onChange={(e) => {
                          let value = Number(e.target.value); // แปลงค่าที่ป้อนเป็นตัวเลข
                      
                          // จำกัดค่าไม่ให้น้อยกว่า 1 และไม่มากกว่า availableValue
                          if (value > parseInt(unavilablevaluecanput)) {
                            value = parseInt(unavilablevaluecanput);
                          } else if (value < 0 || isNaN(value)) {
                            value = 0;
                          }
                      
                          setinRoomunavailableValue(String(value));
                        }}
                        onBlur={(e) => {
                          // ถ้าผู้ใช้ลบค่าทั้งหมดหรือเว้นว่างไว้ ให้ตั้งค่าเป็น 1
                          if (!e.target.value) {
                            setinRoomunavailableValue("0");
                          }
                        }}
                        placeholder="จำนวนที่ไม่พร้อมใช้งาน"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                )}

                <div className="flex justify-end mt-6 space-x-4">
                    <button
                    onClick={updateAssetinroom}
                    className="bg-[#113FB3] text-white py-2 px-6 rounded-lg hover:bg-blue-600 focus:outline-none transition"
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
                max={selectedDetailAsset.asset.availableValue+selectedDetailAsset.inRoomavailableValue}
                type="number"
                onChange={(e) => {
                  let value = Number(e.target.value); // แปลงค่าที่ป้อนเป็นตัวเลข
              
                  // จำกัดค่าไม่ให้น้อยกว่า 1 และไม่มากกว่า availableValue
                  if (value > selectedDetailAsset.asset.availableValue+selectedDetailAsset.inRoomavailableValue) {
                    value = selectedDetailAsset.asset.availableValue+selectedDetailAsset.inRoomavailableValue;
                  } else if (value < 0 || isNaN(value)) {
                    value = 0;
                  }
              
                  setupdateinRoomavailableValue(String(value));
                }}
                onBlur={(e) => {
                  // ถ้าผู้ใช้ลบค่าทั้งหมดหรือเว้นว่างไว้ ให้ตั้งค่าเป็น 1
                  if (!e.target.value) {
                    setupdateinRoomavailableValue("0");
                  }
                }}
                placeholder="จำนวนที่พร้อมใช้งาน"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <p className="text-gray-700 mb-2">📦 จำนวนที่ใช้งานไม่ได้:</p>
              <Input
                value={updateInRoomunavailableValue}
                min="0"
                max={selectedDetailAsset.asset.unavailableValue+selectedDetailAsset.inRoomaunavailableValue}
                type="number"
                onChange={(e) => {
                  let value = Number(e.target.value); // แปลงค่าที่ป้อนเป็นตัวเลข
                  // จำกัดค่าไม่ให้น้อยกว่า 0 และไม่มากกว่า availableValue
                  if (value > selectedDetailAsset.asset.unavailableValue+selectedDetailAsset.inRoomaunavailableValue) {
                    value = selectedDetailAsset.asset.unavailableValue+selectedDetailAsset.inRoomaunavailableValue;
                  } else if (value < 0 || isNaN(value)) {
                    value = 0;
                  }
                  setupdateinRoomunavailableValue(String(value));
                }}
                onBlur={(e) => {
                  // ถ้าผู้ใช้ลบค่าทั้งหมดหรือเว้นว่างไว้ ให้ตั้งค่าเป็น 0
                  if (!e.target.value) {
                    setupdateinRoomunavailableValue("0");
                  }
                }}
                placeholder="จำนวนที่เสีย"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
             <div className="mb-4">
              <p className="text-gray-700 mb-2">วันที่เพิ่ม:</p>
                        <Input
              type="date"
              value={Dateedit}
              onChange={(e) => setDateedit(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            </div>
          </>
        ) : (
          <>
            <p className="text-gray-700 mb-2">📦 จำนวนที่ใช้งานได้: {selectedDetailAsset.inRoomavailableValue}</p>
            <p className="text-gray-700 mb-4">📦 จำนวนที่ใช้งานไม่ได้: {selectedDetailAsset.inRoomaunavailableValue}</p>
             <p className="text-gray-700 mb-4">📦 วันที่เพิ่ม: {selectedDetailAsset.createdAt}</p>
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
