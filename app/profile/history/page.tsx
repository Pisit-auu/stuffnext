'use client';
import { Button, Popconfirm, Flex } from 'antd';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { QuestionCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import '@ant-design/v5-patch-for-react-19';
import { signOut } from "next-auth/react";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
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
    assetid: any;
    name: string;
    id: number;
  };
  borrowLocation: {
    namelocation: string;
  };
  note: string;
  returnLocationId: string;
  valueBorrow: number;
}


const UserBorrowHistory = () => {
  const { data: session } = useSession(); // ดึง session ของผู้ใช้
  const [borrowHistory, setBorrowHistory] = useState<BorrowHistory[]>([]);   //เก็บข้อมูลการยืม
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');  //ยืมถึงวันที่
  const [searchTerm, setSearchTerm] = useState<string>(''); //เก็บคำค้นหา
  const [filteredHistory, setFilteredHistory] = useState<BorrowHistory[]>(borrowHistory); //ผลลัพธ์ที่ค้นหา


  //ดึงข้อมูลประวัติการยืมของผู้ใช้ที่ล็อกอินอยู่ เก็บไว้ใน setBorrowHistory
  useEffect(() => {
    if (!session?.user?.id) {
      setError('User is not logged in');
      setLoading(false);
      return;
    }

    const fetchBorrowHistory = async () => {
      try {
        const response = await axios.get(`/api/borrow/userid/${session.user.id}`);
        if (Array.isArray(response.data)) {
          setBorrowHistory(response.data);
        } else {
          setError('Data format error');
        }
      } catch (err) {
        setError('Failed to fetch borrow history');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBorrowHistory();
  }, [session]);

  //กรอง (filter) ข้อมูลประวัติการยืม (borrowHistory) ตามวันที่และคำค้นหา แล้วอัปเดตไปที่ setFilteredHistory
  useEffect(() => {
    const filtered = borrowHistory.filter((borrow) => {
      const borrowDate = new Date(borrow.createdAt).setHours(0, 0, 0, 0);
      const isWithinDateRange =
        (startDate ? borrowDate >= new Date(startDate).setHours(0, 0, 0, 0) : true) &&
        (endDate ? borrowDate <= new Date(endDate).setHours(23, 59, 59, 999) : true);
  
      const matchesSearchTerm =
        borrow.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        borrow.asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        borrow.borrowLocation.namelocation.toLowerCase().includes(searchTerm.toLowerCase());
  
      return isWithinDateRange && matchesSearchTerm;
    });
  
    setFilteredHistory(filtered);
  }, [startDate, endDate, searchTerm, borrowHistory]);
  
  //ฟังก์ชันสำหรับ ดึงข้อมูล user
  const fetchuser = async () => {
    try {
      const res = await axios.get(`/api/auth/signup/${session?.user?.username}`);
      
      if (!res.data) {
        alert('ไม่พบบัญชีผู้ใช้');
        signOut();
        return;
      }
    } catch (err) {
      setError('Failed to fetch user');
    }
  };

  //ฟังก์ชันสำหรับ ดึงข้อมูล location
  const fethcheckclocation = async (response: any) => {
    try{
      const reschecklocation = await axios.get(`/api/location/${response.data.returnLocationId}`)
    }catch(error){
      alert('ไม่มีห้องนี้อยู่แล้ว')
      return
    }
  };

 //ฟังก์ชันเมื่อกดปุ่มคืน
  const handleReturn = async (borrowId: number, id?: number) => {
    try {
      // สร้างวันที่คืนเป็นวันที่ปัจจุบัน
      fetchuser();
      const rescheck = await axios.get(`/api/borrow/${borrowId}`);
      fethcheckclocation(rescheck)
      const dayReturn = new Date().toISOString();
      // ส่งคำขอ PUT ไปที่ API
      const response = await axios.put(`/api/borrow/${borrowId}`, {
        id : borrowId,
        dayReturn, // ส่งวันที่คืน
      });
      if (response.status === 200) {
        // อัพเดตข้อมูลใน state
        setBorrowHistory((prevHistory) =>
          prevHistory.map((borrow) =>
            borrow.id === borrowId
              ? { ...borrow, dayReturn } // อัพเดตแค่วันที่คืน
              : borrow
          )
        );
      }
      alert("สถานะการคืนจะอัพเดต เมื่อแอดมินตรวจสอบเสร็จสิ้น")
    } catch (err) {
      setError('Failed to update return date');
    }
  };

  //ฟังก์ชันเมื่อกดปุ่มยกเลิกการคืน
  const handlecancleReturn = async (borrowId: number, id?: number) => {
    fetchuser();
    try {
      const rescheck = await axios.get(`/api/borrow/${borrowId}`);
      fethcheckclocation(rescheck)
      if(rescheck.data.ReturnStatus==='c'){
        alert("แอดมินได้ตรวจสอบแล้วไม่สามารถยกเลิกได้")
        window.location.reload()
        return
      }

      // สร้างวันที่คืนเป็น null
      const dayReturn = null
      // ส่งคำขอ PUT ไปที่ API
      const response = await axios.put(`/api/borrow/${borrowId}`, {
        id: borrowId,
        dayReturn, 
      });
  
      if (response.status === 200) {
        // อัพเดตข้อมูลใน state
        setBorrowHistory((prevHistory) =>
          prevHistory.map((borrow) =>
            borrow.id === borrowId
              ? { ...borrow, dayReturn } // อัพเดตแค่วันที่คืน
              : borrow
          )
        );
      }
    } catch (err) {
      setError('Failed to update return date');
    }
  };

  //ฟังก์ชันปุ่มยกเลิก
  const handlecancle = async (
    id: number,
  ) => {
    fetchuser();
    try {

      const response = await axios.get(`/api/borrow/${id}`)
      fethcheckclocation(response)
      if(response.data.ReturnStatus==='c'){
        alert("แอดมินได้ตรวจสอบแล้วไม่สามารถยกเลิกได้")
        window.location.reload()
        return
      }
      let presentlocation = ''
      let locationreturn = ''
      presentlocation =response.data.borrowLocationId
      locationreturn = response.data.returnLocationId// ห้องที่อยู่


      const getreturnlocation = await axios.get(`/api/assetlocationroom?location=${locationreturn}`);//เรียก ห้องที่จะคืน
      const getassetlocationinroom = await axios.get(`/api/assetlocationroom?location=${presentlocation}`); //เรียก assetidที่อยู่ในห้องนั้น
      const filtered = getassetlocationinroom.data.filter((item: { asset: { assetid: any; }; }) => item.asset.assetid === response.data.assetId); // กรองว่า getassetlocationinroom == assetid
      if(filtered[0] === undefined){
        alert("ครุภัณฑ์ที่ยืมมาถูกยืมไปห้องอื่น หรือ ไม่มีครุภัณฑ์ในห้อง")
        return
      }
      const savegetassetlocationinroomvalue = filtered[0].inRoomavailableValue //เก็บค่าของก่อนที่คืน
      const savegetassetlocationinroomunvalue = filtered[0].inRoomaunavailableValue

      //เช็คว่าห้องนั้นมีของซ้ำไหม
      const hasReturnAsset = getreturnlocation.data.some((item: { assetId: any; }) => item.assetId === response.data.assetId );
      
      if(hasReturnAsset){
          const getupdateReturnlocation = await axios.get(`/api/assetlocationroom?location=${locationreturn}`);
          let idAssetReturn: number = 0;
          let saveassetlocationvalule: number = 0;  //save ค่าที่อยู่ห้องที่จะคืน
          let saveassetlocationunvalule: number = 0;//save ค่าที่อยู่ห้องที่จะคืน
          
          getupdateReturnlocation.data.forEach((item: {
            inRoomaunavailableValue: number;
            inRoomavailableValue: number; assetId: string, id: number 
      }) => {
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
          alert("ยกเลิกสำเร็จ");
          window.location.reload();
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
            alert("ยกเลิกสำเร็จ");
            window.location.reload();
            
            

      }
      await axios.delete(`/api/borrow/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = async () => {
const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Borrow History');

  worksheet.columns = [
    { header: 'ผู้ยืม', key: 'user', width: 20 },
    { header: 'ครุภัณฑ์', key: 'asset', width: 30 },
    { header: 'จำนวนที่ยืม', key: 'valueBorrow', width: 15 },
    { header: 'ยืมไปที่ห้อง', key: 'borrowLocation', width: 20 },
    { header: 'ยืมจากห้อง', key: 'returnLocation', width: 20 },
    { header: 'สถานะการยืม', key: 'borrowStatus', width: 20 },
    { header: 'สถานะการคืน', key: 'returnStatus', width: 20 },
    { header: 'วันที่ยืม', key: 'borrowDate', width: 20 },
    { header: 'วันที่คืน', key: 'returnDate', width: 20 },
    { header: 'หมายเหตุ', key: 'note', width: 30 },
  ];

filteredHistory.forEach((borrow) => {
  worksheet.addRow({
    user: borrow.user?.name || 'ไม่พบข้อมูล',
    asset: borrow.asset?.name || 'ไม่พบข้อมูล',
    valueBorrow: borrow.valueBorrow,
    borrowLocation: borrow.borrowLocation?.namelocation || '-',
    returnLocation: borrow.returnLocationId || 'N/A',
    borrowStatus: borrow.Borrowstatus === 'c' ? 'ตรวจสอบแล้ว' : 'รอตรวจสอบ',
    returnStatus: borrow.ReturnStatus === 'w' ? 'รอตรวจสอบ' : 'ตรวจสอบแล้ว',
    borrowDate: borrow.createdAt ? new Date(borrow.createdAt).toLocaleDateString('th-TH') : '-',
    returnDate: borrow.dayReturn ? new Date(borrow.dayReturn).toLocaleDateString('th-TH') : '-',
    note: borrow.note || '',
  });
});


  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, `การยืมของ ${session?.user.name} .xlsx`);
  });
}


  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto mt-4 p-4">
      <h1 className="text-2xl font-semibold mb-4">สถานะการยืมของ {session?.user.name}</h1>

      {/* ฟอร์มการค้นหาด้วยวันที่ */}
      <div className="mb-4">
      <label htmlFor="startDate" className="mr-2">วันที่เริ่มต้น:</label>
      <input
        id="startDate"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="px-4 py-2 border rounded"
      />
      <label htmlFor="endDate" className="ml-4 mr-2">ถึงวันที่:</label>
      <input
        id="endDate"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="px-4 py-2 border rounded"
      />
             <button onClick={handleDownload}
                        className="ml-4 block sm:inline-block w-full sm:w-auto px-4 py-2 rounded-lg bg-[#006600] text-center text-white hover:bg-green-600 transition-all"
                      >
                        โหลดไฟล์ Exel
                      </button>
    </div>
    

      {/* ฟอร์มการค้นหาด้วยข้อมูล */}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ค้นหาครุภัณฑ์, หรือ ยืมจากสถานที่"
          className="px-4 py-2 border rounded w-full"
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
              <th className="px-4 py-2 text-left">การดำเนินการ</th>
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
                  {borrow.Borrowstatus === 'c' ? 'ตรวจสอบแล้ว' : 'รอตรวจสอบ'}
                </td>
                <td className="px-4 py-2">
                  {borrow.ReturnStatus === 'w' ? 'รอตรวจสอบ' : 'ตรวจสอบแล้ว'}
                </td>
                <td className="px-4 py-2">{new Date(borrow.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2">{borrow.dayReturn ? new Date(borrow.dayReturn).toLocaleDateString() : 'ยังไม่ได้คืน'}</td>
                <td className="px-4 py-2">{borrow.note}</td>
                <td className="px-4 py-2">
                  {borrow.ReturnStatus !== 'c' && !borrow.dayReturn && (
                                    <Button type="primary" ghost  onClick={() => handleReturn(borrow.id, borrow.asset.id)}
                                    className="mr-4 px-4 py-2 bg-blue-500 text-white rounded">
                                              คืน
                                           </Button>
                    
                  )}
                  {borrow.ReturnStatus !== 'c' && borrow.dayReturn && (
                                    <Button type="primary" ghost  onClick={() => handlecancleReturn(borrow.id, borrow.asset.id)}
                                    className="mr-4 px-4 py-2 bg-blue-500 text-white rounded">
                                              ยกเลิกการคืน
                                           </Button>
                    
                  )}
                  {borrow.Borrowstatus ==='c' || borrow.ReturnStatus !== 'c' && (
                                          <Popconfirm
                                          title="Delete the task"
                                          description="ยืนยันที่จะลบหรือไม่?"
                                          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                          onConfirm={() => handlecancle(borrow.id)}
                                        >
                                          <Button danger >ยกเลิก</Button>
                                        </Popconfirm>
                    
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserBorrowHistory;
