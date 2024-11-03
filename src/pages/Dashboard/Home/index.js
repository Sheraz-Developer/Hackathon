import React, { useState, useEffect } from "react";
import Account from "../Account/index";
import Add from "../Add Item/index";
import All from "../All Items/index";
import { Layout, Menu, Button, Spin } from "antd";
import { HomeOutlined, PlusOutlined, UserOutlined, ShoppingCartOutlined , ShoppingOutlined } from "@ant-design/icons";
import Order from "../Orders/order";
import Track from "../Track-order/Track";

const { Content, Sider } = Layout;

function getItem(label, key, icon) {
  return {
    key,
    icon,
    label,
  };
}

const items = [
  getItem("Manage Notes", "1", <HomeOutlined />),
  getItem("Add new Notes", "2", <PlusOutlined />),
  getItem("Profile", "3", <UserOutlined />),
];

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("3");
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 2000);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleMediaQueryChange = (e) => setIsMobile(e.matches);
    setIsMobile(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  const handleMenuClick = (e) => {
    setActiveMenu(e.key);
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
        <Spin />
      </div>
    );
  }

  return (
    <main>
      <Layout style={{ minHeight: "100vh" }}>
        {/* Sidebar for larger screens */}
        {!isMobile && (
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
          >
            <div className="demo-logo-vertical" />
            <Menu
              theme="light"
              selectedKeys={[activeMenu]}
              mode="inline"
              items={items}
              onClick={handleMenuClick}
            />
          </Sider>
        )}

        {/* Bottom navigation for small screens */}
        {isMobile && (
          <div className="bottom-nav" style={{ position: "fixed", bottom: 0, width: "100%", backgroundColor: "#fff", borderTop: "1px solid #ddd", display: "flex", justifyContent: "space-around", padding: "10px 0" }}>
            <Button icon={<HomeOutlined />} onClick={() => handleMenuClick({ key: "1" })} />
            <Button icon={<PlusOutlined />} onClick={() => handleMenuClick({ key: "2" })} />
            <Button icon={<UserOutlined />} onClick={() => handleMenuClick({ key: "3" })} />
            <Button icon={<ShoppingCartOutlined />} onClick={() => handleMenuClick({ key: "4" })} />
            <Button icon={<ShoppingCartOutlined />} onClick={() => handleMenuClick({ key: "5" })} />
          </div>
        )}

        <Layout style={{ backgroundColor: "#fff", borderLeft: "1px solid #ddd", borderTop: "1px solid #ddd" }}>
          <Content style={{ margin: "0 16px" }}>
            <div style={{ minHeight: 36 }}>
              {activeMenu === "1" && <All />}
              {activeMenu === "2" && <Add />}
              {activeMenu === "3" && <Account />}
              {activeMenu === "4" && <Order />}
              {activeMenu === "5" && <Track />}
            </div>
          </Content>
        </Layout>
      </Layout>
    </main>
  );
}
