'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';


interface BorrowHistory {
  id: number;
  createdAt: string;
  dayReturn: string | null;
  Borrowstatus: string;
  ReturnStatus: string;
  user: {
    name: string;
  };
  asset: {
    name: string;
  };
  borrowLocation: {
    namelocation: string;
  };
  note: string;
  returnLocationId: string;
  valueBorrow: number;
}

const BorrowHistoryPage = ({ params }: { params: { id: string } }) => {
  const [borrowHistory, setBorrowHistory] = useState<BorrowHistory[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<BorrowHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    const fetchBorrowHistory = async () => {
      try {
        const response = await axios.get(`/api/borrow/`);
        setBorrowHistory(response.data);
        setFilteredHistory(response.data); // ตั้งค่าข้อมูลให้ตรงกับข้อมูลที่ดึงมา
      } catch (err) {
        setError('Failed to fetch borrow history');
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowHistory();
  }, [params.id]);

  // ฟังก์ชันในการกรองข้อมูลจากคำค้นหา
  useEffect(() => {
    let filtered = borrowHistory;
  
    // กรองจากคำค้นหาผู้ยืม, ครุภัณฑ์, หรือห้องยืม
    if (searchTerm) {
      filtered = filtered.filter((borrow) =>
        borrow.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        borrow.asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        borrow.borrowLocation.namelocation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  
    // กรองจากวันที่ยืม
    if (startDate || endDate) {
      const startDateObj = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
      const endDateObj = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
  
      filtered = filtered.filter((borrow) => {
        const borrowDate = new Date(borrow.createdAt).setHours(0, 0, 0, 0); // เปลี่ยนวันที่ให้ไม่มีเวลา
        let isValid = true;
        if (startDateObj) {
          isValid = borrowDate >= startDateObj;
        }
        if (endDateObj) {
          isValid = isValid && borrowDate <= endDateObj;
        }
        return isValid;
      });
    }
  
    setFilteredHistory(filtered);
  }, [searchTerm, startDate, endDate, borrowHistory]);
  

      
  
      
  const updateBorrowStatus = async (
    id: number,
    Borrowstatus: string,
    ReturnStatus: string,
    dayReturn: string | null
  ) => {
    try {
      // สามารถปรับเป็น "รอตรวจสอบ" ได้
      const response = await axios.put(`/api/borrow/${id}`, {
        id,
        Borrowstatus,
        ReturnStatus,
        dayReturn,
      });
      setBorrowHistory((prevHistory) =>
        prevHistory.map((borrow) =>
          borrow.id === id ? { ...borrow, Borrowstatus, ReturnStatus, dayReturn } : borrow
        )
      );
    } catch (error) {
      console.error('Error updating borrow status:', error);
    }
  };
  
  const updateReturnStatus = async (
    id: number,
    Borrowstatus: string,
    ReturnStatus: string,
    dayReturn: string | null
  ) => {
    try {
        // สามารถปรับเป็น "รอตรวจสอบ" ได้
        const response = await axios.put(`/api/borrow/${id}`, {
          id,
          Borrowstatus,
          ReturnStatus,
          dayReturn,
        });
        setBorrowHistory((prevHistory) =>
          prevHistory.map((borrow) =>
            borrow.id === id ? { ...borrow, Borrowstatus, ReturnStatus, dayReturn } : borrow
          )
        );
        //หลังอัพเดตสถานะ
        if(ReturnStatus === 'c' || ReturnStatus === 'w'){
          const response = await axios.get(`/api/borrow/${id}`)

            let presentlocation = ''
            let locationreturn = ''
           if( ReturnStatus === 'w'){
            presentlocation =response.data.returnLocationId
            locationreturn = response.data.borrowLocationId// ห้องที่อยู่
           }else{
            presentlocation =response.data.borrowLocationId
            locationreturn = response.data.returnLocationId// ห้องที่อยู่
           }
          // console.log(response.data.borrowLocationId) // ห้องที่อยู่
           //console.log(response.data.returnLocationId)   //ห้องที่ต้องคืน
          //  console.log(response.data.valueBorrow)  //จำนวนที่ยืม
           //console.log(response.data.assetId) // รหัสของที่ยืม
                      try {
                        const getreturnlocation = await axios.get(`/api/assetlocationroom?location=${locationreturn}`);
                        const getassetlocationinroom = await axios.get(`/api/assetlocationroom?location=${presentlocation}`);
                        const filtered = getassetlocationinroom.data.filter(item => item.asset.assetid === response.data.assetId);  // กรองว่า getassetlocationinroom == assetid
                        console.log(filtered[0].inRoomavailableValue)
                        const savegetassetlocationinroomvalue = filtered[0].inRoomavailableValue //เก็บค่าของก่อนที่ยืม
                        const savegetassetlocationinroomunvalue = filtered[0].inRoomaunavailableValue
                
                        //เช็คว่าห้องนั้นมีของซ้ำไหม
                        const hasReturnAsset = getreturnlocation.data.some(item => item.assetId === response.data.assetId );
                
                        if(hasReturnAsset){
                            const getupdateReturnlocation = await axios.get(`/api/assetlocationroom?location=${locationreturn}`);
                            let idAssetReturn: number = 0;
                            let saveassetlocationvalule: number = 0;  //save ค่าที่อยู่ห้องที่จะคืน
                            let saveassetlocationunvalule: number = 0;//save ค่าที่อยู่ห้องที่จะคืน
                            
                            getupdateReturnlocation.data.forEach((item: { assetId: string, id: number }) => {
                              if (response.data.assetId  === item.assetId) {
                                idAssetReturn = item.id;
                                saveassetlocationvalule = item.inRoomavailableValue
                                saveassetlocationunvalule = item.inRoomaunavailableValue
                              }
                            });
                            await axios.put(`/api/assetlocation/${idAssetReturn}`, {
                              inRoomavailableValue: saveassetlocationvalule + parseInt(response.data.valueBorrow,10),
                              inRoomaunavailableValue: saveassetlocationunvalule,
                            });
                            await axios.put(`/api/assetlocation/${filtered[0].id}`, {
                              inRoomavailableValue: parseInt(savegetassetlocationinroomvalue,10) - parseInt(response.data.valueBorrow,10),
                              inRoomaunavailableValue: parseInt(savegetassetlocationinroomunvalue,10) ,
                            });
                            alert("คืนสำเร็จ");
                        }else{
                          await axios.post('/api/assetlocation', { 
                                assetId: response.data.assetId,
                                locationId: locationreturn,  
                                inRoomavailableValue: 0,
                                inRoomaunavailableValue: 0,
                              });
                              const getupdateborrowlocation = await axios.get(`/api/assetlocationroom?location=${locationreturn}`);
                              let idAssetborrow: number = 0;
                
                              getupdateborrowlocation.data.forEach((item: { assetId: string, id: number }) => {
                                if (response.data.assetId === item.assetId) {
                                  idAssetborrow = item.id;
                                }
                              });
                              await axios.put(`/api/assetlocation/${idAssetborrow}`, {
                                inRoomavailableValue: parseInt(response.data.valueBorrow),
                                inRoomaunavailableValue: 0,
                              });
                              await axios.put(`/api/assetlocation/${filtered[0].id}`, {
                                inRoomavailableValue: parseInt(savegetassetlocationinroomvalue,10) - parseInt(response.data.valueBorrow,10),
                                inRoomaunavailableValue: parseInt(savegetassetlocationinroomunvalue,10) ,
                              });
                              if(ReturnStatus === 'c' ){
                                alert("คืนสำเร็จ");
                              }
                              
                
                        }
                      } catch (error) {
                        console.error(error);
                      }
        }
   
    } catch (err) {
      setError('Failed to update borrow status');
    }
  };
  

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      
      <h1 className="text-2xl font-semibold mb-4">Borrow History</h1>
      
      {/* ฟอร์มค้นหาผู้ยืม, ครุภัณฑ์, หรือห้องยืม */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="ค้นหาโดย ชื่อผู้ยืม, ครุภัณฑ์, หรือยืมจากสถานที่"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* ฟอร์มค้นหาตามวันที่ */}
      <div className="mb-4">
        <label className="mr-2">วันที่เริ่มต้น:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-4 py-2 border rounded"
        />
        <label className="ml-4 mr-2">ถึงวันที่:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-4 py-2 border rounded"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">ผู้ยืม</th>
              <th className="px-4 py-2 text-left">ครุภัณฑ์</th>
              <th className="px-4 py-2 text-left">จำนวนที่ยืม</th>
              <th className="px-4 py-2 text-left">ยืมไปที่ห้อง</th>
              <th className="px-4 py-2 text-left">ยืมจากห้อง</th>
              <th className="px-4 py-2 text-left">สถานะการยืม</th>
              <th className="px-4 py-2 text-left">สถานะการคืน</th>
              <th className="px-4 py-2 text-left">วันที่ยืม</th>
              <th className="px-4 py-2 text-left">วันที่คืน</th>
              <th className="px-4 py-2 text-left">หมายเหตุ</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((borrow) => (
              <tr key={borrow.id} className="border-t">
                <td className="px-4 py-2">{borrow.user.name}</td>
                <td className="px-4 py-2"><Link
                href={`/allasset/${borrow.asset.assetid}`}
                className="px-4 py-2"
                >
                {borrow.asset.name}
                </Link></td>
                
                <td className="px-4 py-2">{borrow.valueBorrow}</td>
                <td className="px-4 py-2"><Link
                href={`/location/${borrow.borrowLocation.namelocation}`}
                className="px-4 py-2"
                >
                {borrow.borrowLocation.namelocation}
                </Link></td>
                <td className="px-4 py-2"><Link
                href={`/location/${borrow.returnLocationId }`}
                className="px-4 py-2"
                >
                {borrow.returnLocationId || 'N/A'}
                </Link></td>

                <td className="px-4 py-2">
                  <select
                    value={borrow.Borrowstatus}
                    onChange={(e) => updateBorrowStatus(borrow.id, e.target.value, borrow.ReturnStatus, borrow.dayReturn)}
                    className="border p-1 rounded"
                    disabled={borrow.ReturnStatus==="c" } 
                  >
                    <option value="w">รอตรวจสอบ</option>
                    <option value="c">ตรวจสอบแล้ว</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <select
                    value={borrow.ReturnStatus}
                    onChange={(e) => updateReturnStatus(borrow.id, borrow.Borrowstatus, e.target.value, borrow.dayReturn)}
                    className="border p-1 rounded"
                    disabled={!(borrow.dayReturn &&  borrow.Borrowstatus==="c") } // ปิดการเลือกถ้ายังไม่มีวันคืน
                  >
                    <option value="w">รอตรวจสอบ</option>
                    <option value="c">ตรวจสอบแล้ว</option>
                  </select>
                </td>
                <td className="px-4 py-2">{new Date(borrow.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2">{borrow.dayReturn ? new Date(borrow.dayReturn).toLocaleDateString() : 'ยังไม่ได้คืน'}</td>
                <td className="px-4 py-2">{borrow.note}</td>
              </tr>
            ))}
            
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BorrowHistoryPage;
