import React, { useState,  } from 'react';
import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Container,
  TextField,
} from '@mui/material';
import SidebarEmployee  from '../Component/Sidebar-Employee';
import SidebarAdmin from '../Component/Sidebar-Admin';

function MemberProfile({ person }) {


  // Pagination
 

 
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMember((prevMember) => ({
      ...prevMember,
      [name]: value,
    }));
  };
  if (person && person.user_type === 0) {
    // Admin user
  } else if (person && person.user_type === 1) {
    // Employee user
  } else if (person && person.user_type === 2) {
    // Member user
  }
  const handleSave = () => {
    // ตรวจสอบความถูกต้องของรหัสผ่าน
    if (member.รหัสผ่าน === member.ยืนยันPassword) {
      // ทำการบันทึกข้อมูลหรือทำการอัปเดตข้อมูลตามที่คุณต้องการ
      console.log('บันทึกข้อมูลสำเร็จ');
    } else {
      console.log('รหัสผ่านไม่ตรงกัน');
    }
  };
  const [member, setMember] = useState({
    ชื่อ: 'UID000001',
    ชื่อสมาชิก: 'John Doe',
    อีเมล: 'member@member.com',
    รหัสผ่าน: '**********',
    ยืนยันPassword: '**********',
  });
  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ width: '240px' }}>
      {person && person.user_type === 0 ? <SidebarEmployee /> : null}
  {person && person.user_type === 1 ? <SidebarEmployee /> : null}
  {person && person.user_type === 2 ? <SidebarAdmin /> : null}         </Box>
      <Box component="main" flexGrow={1} p={3}>
        <Container maxWidth="xl">
          <Grid container justifyContent="space-between" alignItems="center" mb={4}>

          </Grid>

          <Box display="flex" justifyContent="center" alignItems="center" height="100vh" >
      <Box width={600} p={3} border={1} borderRadius={5}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell variant="h2">ข้อมูลส่วนตัว</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <span style={{ marginRight: '8px' }}>ไอดี:</span>
                  <TextField value={member.ชื่อ} onChange={handleInputChange} fullWidth />
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <span style={{ marginRight: '8px' }}>ชื่อ-นามสกุล:</span>
                  <TextField value={member.ชื่อสมาชิก} onChange={handleInputChange} fullWidth />
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <span style={{ marginRight: '8px' }}>อีเมล:</span>
                  <TextField  value={member.อีเมล} onChange={handleInputChange} fullWidth />
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <span style={{ marginRight: '8px' }}>รหัสผ่าน:</span>
                  <TextField type="password" value={member.รหัสผ่าน} onChange={handleInputChange} fullWidth />
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <span style={{ marginRight: '8px' }}>ยืนยันรหัสผ่าน:</span>
                  <TextField type="password" value={member.ยืนยันPassword} onChange={handleInputChange} fullWidth />
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Button variant="contained" color="primary" onClick={handleSave}>
                  บันทึ
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default MemberProfile;
