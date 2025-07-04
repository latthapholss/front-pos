import { useState } from "react";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from "../context";
import React from 'react';

const HeaderBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { logout } = useUser();
  const navigate = useNavigate()
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    logout(); // ลบข้อมูลผู้ใช้จาก context หรือ state และ localStorage
  
    // นำทางไปยังหน้า login โดยใช้ React Router เป็นตัวอย่าง
    navigate('/login', { replace: true });
  
    // โหลดหน้าเว็บใหม่, สามารถใส่ใน useEffect ของหน้า /login ถ้าไม่ต้องการให้โหลดทันที
    window.location.reload();
  };
  
  return (
    <Box display="flex" justifyContent="space-between" p={2} backgroundColor="white" >
      {/* search  */}
      <Box display="flex" borderRadius="3px" backgroundColor="#F5EFE7">
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* icons */}
      <Box display="flex">


        <IconButton>
          <PersonOutlinedIcon
            onClick={handleMenu}
            style={{ color: '#009ae1' }}
          />
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <Link to="#" className="menu-bars">
              <MenuItem onClick={handleClose}>Profile</MenuItem>
            </Link>
            <Link to="#" className="menu-bars">
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Link>
          </Menu>
        </IconButton>
      </Box>
    </Box>
  );
};

export default HeaderBar;