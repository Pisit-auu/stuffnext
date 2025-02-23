"use client"

import React, { useState } from "react"
import { Layout, Menu } from "antd"
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons"

const { Sider } = Layout

type MenuItem = {
  key: string
  icon?: React.ReactNode
  label: string
  children?: MenuItem[]
}

const items: MenuItem[] = [
  { key: "1", label: "หน้าหลัก", icon: <DesktopOutlined />  },
  { key: "2", label: "ข้อมูลส่วนตัว", icon: <FileOutlined /> },
  {
    key: "sub1",
    label: "ผู้ใช้",
    icon: <UserOutlined />,
    children: [
      { key: "3", label: "สถานที่ทั้งหมด" },
      { key: "4", label: "ครุภัณฑ์ทั้งหมด" },
    ],
  },
  {
    key: "sub2",
    label: "แอดมิน",
    icon: <TeamOutlined />,
    children: [
      { key: "5", label: "ครุภัณฑ์" },
      { key: "6", label: "ประเภทครุภัณฑ์" },
      { key: "7", label: "สถานที่ทั้งหมด" },
    ],
  },
  {
    key: "sub3",
    label: "ประวัติ",
    icon: <TeamOutlined />,
    children: [
      { key: "8", label: "การยืม/คืน" },
      { key: "9", label: "การยืม/คืนทั้งหมด" }
    ],
  },{ key: "10", label: "logout" },{ key: "11", label: "login" },

]

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
      <div className="demo-logo-vertical" />
      
      <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline" items={items} />
    </Sider>
  )
}

export default Sidebar
