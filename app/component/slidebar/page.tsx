"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { useSession, signOut } from 'next-auth/react';
import { Layout, Menu } from "antd"
import { DesktopOutlined, FileOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons"

const { Sider } = Layout

type MenuItem = {
  key: string
  icon?: React.ReactNode
  label: string
  children?: MenuItem[]
}

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const userRole = session?.user?.role;

  const handleMenuClick = (key: string) => {
    if (key === "1") router.push("/");
    else if (key === "2") router.push("/profile");
    else if (key === "3") router.push("/");
    else if (key === "4") router.push("/allasset");
    else if (key === "5") router.push("/admin");
    else if (key === "6") router.push("/admin");
    else if (key === "7") router.push("/admin");
    else if (key === "8") router.push("/admin/borrowall");
    else if (key === "9") router.push("/profile/history");
    else if (key === "logout") signOut(); // ✅ ใช้ signOut() จาก next-auth
    else if (key === "login") router.push("/login");
  };

  // 🔹 สร้างเมนูตาม session และ role ของผู้ใช้
  const items: MenuItem[] = [{
    key: "1",
    label: "หน้าหลัก",
    icon: <DesktopOutlined /> },
    isAuthenticated && { key: "2", label: "ข้อมูลส่วนตัว",
    icon: <FileOutlined />,
  },
     {
      key: "sub1",
      label: "ผู้ใช้",
      icon: <UserOutlined />,
      children: [
        { key: "3", label: "สถานที่ทั้งหมด" },
        { key: "4", label: "ครุภัณฑ์ทั้งหมด" },
      ],
    },

    isAuthenticated && userRole === "admin" && {
      key: "sub2",
      label: "แอดมิน",

      icon: <TeamOutlined />,
      children: [
        { key: "5", label: "ครุภัณฑ์" },
        { key: "6", label: "ประเภทครุภัณฑ์" },
        { key: "7", label: "สถานที่ทั้งหมด" },
      ],
      
    },

    isAuthenticated && {
      key: "sub3",
      label: "ประวัติ",
      icon: <TeamOutlined />,
      children: [
        { key: "8", label: "การยืม/คืน" },
        { key: "9", label: "การยืม/คืนทั้งหมด" },
      ],
    },

    isAuthenticated
      ? { key: "logout", label: "ออกจากระบบ", icon: <UserOutlined /> }
      : { key: "login", label: "เข้าสู่ระบบ", icon: <UserOutlined /> },
  ].filter(Boolean); // ✅ ลบค่าที่เป็น null ออก

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      style={{
        backgroundColor: "#111827",
        color: "white",
        position: "fixed",
        height: "100vh",
        zIndex: 1000,
        
        
      }}
    >
      <Menu
        theme="dark"
        defaultSelectedKeys={["1"]}
        mode="inline"
        items={items}
        style={{
          backgroundColor: "#111827",
          color: "#FFFFFF" }}
        onClick={({ key }) => handleMenuClick(key)}
      />
    </Sider>
  );
};

export default Sidebar;
