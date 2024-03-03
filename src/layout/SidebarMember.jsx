import React, { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import "./sidebar.css";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ReceiptIcon from "@mui/icons-material/Receipt";

const SidebarMember = () => {
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
                    <Typography
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        fontWeight: "bold", // เพิ่มตัวหนา
                        fontStyle: "italic", // แต่งข้อความ
                      }}
                    >
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

              <Link to="/member/promotion" className="menu-bars">

                <MenuItem className="aa" icon={< HomeOutlinedIcon />} > <span className="bb">หน้าหลัก</span> </MenuItem>

              

              </Link>

              <Link to="/member/history" className="menu-bars">
              <MenuItem className="aa" icon={<ReceiptIcon />}><span className="bb">ประวัติการซื้อ</span></MenuItem>

              </Link>

              <Link to="/profile" className="menu-bars">
           
                <MenuItem className="aa" icon={<PeopleOutlinedIcon/>}><span className="bb">ดูข้อมูลส่วนตัว</span></MenuItem>

              </Link>
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
export default SidebarMember;
