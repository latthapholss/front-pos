import React, { useState } from "react";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,

} from "react-pro-sidebar";
import { Box, IconButton, Typography,} from "@mui/material";
import { Link } from "react-router-dom";
import "./sidebar.css";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import InventoryIcon from '@mui/icons-material/Inventory';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
const SidebarAdmin = () => {
  const [isCollapsed, setisCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [broken, setBroken] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
      }}
    >
      <Sidebar
        collapsed={isCollapsed}
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
        onBreakPoint={setBroken}
        image=""
        breakPoint="md"
        style={{ height: "100%", backgroundColor: "white" }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <div style={{ flex: 1, marginBottom: "32px" }}>
            <Menu iconShape="square">
              {/* LOGO */}
              <MenuItem
                onClick={() => setisCollapsed(!isCollapsed)}
                icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                style={{
                  margin: "10px 0 20px 0",
                }}
              >
                {!isCollapsed && (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    ml="15px"
                  >
                    <Typography sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      fontWeight: 'bold',  // เพิ่มตัวหนา
                      fontStyle: 'italic',  // แต่งข้อความ
                    }}>
                      Muangthong <br /> POS APP
                    </Typography>
                    <IconButton onClick={() => setisCollapsed(!isCollapsed)}>
                      <MenuOutlinedIcon />
                    </IconButton>
                  </Box>
                )}
              </MenuItem>
              {!isCollapsed && (
                <Box mb="25px">
                  {/* <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <img
                      alt="profile-user"
                      width="100px"
                      height="100px"
                      src={`/assets/user.jpg`}
                      style={{ cursor: "pointer", borderRadius: "50%" }}
                    />
                  </Box> */}
                  {/* <Box textAlign="center">
                    <Typography sx={{ m: "10px 0 0 0" }}>ROITAI</Typography>
                    <Typography>DEV </Typography>
                  </Box> */}
                </Box>
              )}
              <div className ="live">
              <Link to="/admin/dashboard" className="menu-bars">
                <MenuItem className="aa" icon={< HomeOutlinedIcon />} > <span className="bb">หน้าหลัก</span> </MenuItem>
              </Link>
              <Link to="/admin/cashier" className="menu-bars"  id="abc">
                <MenuItem className="aa"icon={<ShoppingBagIcon />}  ><span className="bb">สินค้า</span></MenuItem>
              </Link>
              <Link to="/admin/EmployeeManagement" className="menu-bars"  id="abc">
                <MenuItem className="aa"icon={<PeopleOutlinedIcon />}><span className="bb">จัดการข้อมูลพนักงาน</span></MenuItem>
              </Link>
              <Link to="/admin/membermanagement" className="menu-bars">
                <MenuItem className="aa"icon={<PeopleOutlinedIcon />} > <span className="bb">จัดการสมาชิก</span></MenuItem>
              </Link>
              <SubMenu label={<span style={{ color: 'black' }}>จัดการสินค้า</span>} className="aa"icon={<InventoryIcon />}>
                <Link to={"/admin/AdminProduct"} className="menu-bars">
                  <MenuItem > <span className="bb">สินค้า</span></MenuItem>
                </Link>
                <Link  to={"/admin/AdminCategories"} className="menu-bars" >
                  <MenuItem>ประเภท-หน่วย</MenuItem>
                </Link>
              </SubMenu>
              <Link to="/promotion/promotionadd" className="menu-bars">
                <MenuItem className="aa" icon={<LoyaltyIcon />}><span className="bb">จัดการโปรโมชั่น</span></MenuItem>
              </Link>
              <Link to="/admin/SalesDetailPage" className="menu-bars">
                <MenuItem className="aa" icon={<ReceiptIcon />}><span className="bb">ข้อมูลการขาย</span></MenuItem>
              </Link>
              </div>
            </Menu>


           
          </div>
        </div>
      </Sidebar>
      <main>
        <div style={{ padding: "16px 2px ", color: "#44596e" }}>
          <div style={{ marginBottom: "16px" }}>
            {broken && (
              <IconButton onClick={() => setToggled(!toggled)}>
                <MenuOutlinedIcon />
              </IconButton>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
export default SidebarAdmin;