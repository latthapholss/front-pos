import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Container,
  TextField, Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import { localStorageKeys } from '../Static/LocalStorage';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Get_memberdetail, ip } from '../Static/api';

function MemberProfile({ person }) {
  // const [members, setMembers] = useState([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  // Pagination
  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 10;
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = members.slice(indexOfFirstItem, indexOfLastItem);
  const [member, setMember] = useState({
    ชื่อ: '', // แก้ไขเป็นข้อมูลว่างเพื่อให้เริ่มต้นเป็นค่าว่าง
    ชื่อสมาชิก: '',
    อีเมล: '',
    รหัสผ่าน: '',
    ยืนยันPassword: '',
  });
  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handlePasswordInputChange = (event) => {
    const { name, value } = event.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // useEffect(() => {
  //   const storedMemberData = JSON.parse(localStorage.getItem(localStorageKeys.loginSession));
  //   console.log('Stored Member Data:', storedMemberData);
  //   if (storedMemberData && storedMemberData.user_type === 2) {
  //     setMember({
  //       ไอดี: storedMemberData.member_id,
  //       ชื่อ: storedMemberData.member_fname,
  //       ชื่อสมาชิก: storedMemberData.member_fname + ' ' + storedMemberData.member_lname,
  //       อีเมล: storedMemberData.member_email,
  //       รหัสผ่าน: '**********',
  //       ยืนยันPassword: '**********',
  //       เบอร์โทร: storedMemberData.member_phone,
  //       ที่อยู่: storedMemberData.member_address,
  //       points: storedMemberData.point
  //     });
  //   }
  // }, []);

  useEffect(() => {
    HandleMemberDetail();
  }, []);
  


  const HandleMemberDetail = async () => {
    try {
      const storedMemberData = JSON.parse(localStorage.getItem(localStorageKeys.loginSession));
      const memberId = storedMemberData.member_id;
      const response = await axios.get(`${ip}${Get_memberdetail}${memberId}`);
      const { data } = response;
      setMember({
        ไอดี: storedMemberData.member_id,
        ชื่อ: storedMemberData.member_fname,
        ชื่อสมาชิก: storedMemberData.member_fname + ' ' + storedMemberData.member_lname,
        อีเมล: storedMemberData.member_email,
        รหัสผ่าน: '**********',
        ยืนยันPassword: '**********',
        เบอร์โทร: storedMemberData.member_phone,
        ที่อยู่: storedMemberData.member_address,
        points: storedMemberData.point
      }); // Set member state with the data received from the API
      console.log(data); // Change 'member' to 'data' for clarity
    } catch (error) {
      console.error('Error fetching member detail:', error);
    }
  }



  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMember((prevMember) => ({
      ...prevMember,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // Prepare the data to send to the API
      const requestData = {
        member_id: member.ไอดี,
        member_fname: member.ชื่อสมาชิก.split(' ')[0],
        member_lname: member.ชื่อสมาชิก.split(' ')[1],
        member_email: member.อีเมล,
        member_phone: member.เบอร์โทร,
        member_address: member.ที่อยู่,
      };
      console.log('Data to be sent:', requestData);
      // Send a POST request to the API endpoint
      const response = await axios.post(ip + '/auth/update_profile', requestData);

      if (response.status === 200) {
        // Show success alert using SweetAlert2
        await Swal.fire({
          icon: 'success',
          title: 'บันทึกข้อมูลสำเร็จ',
          showConfirmButton: false,
          timer: 1500,
        });

        // You might want to update your local state or take other actions here
      } else {
        // Show error alert using SweetAlert2
        await Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'เกิดข้อผิดพลาดระหว่างการบันทึกข้อมูล',
        });
      }
    } catch (error) {
      // Show error alert using SweetAlert2
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'เกิดข้อผิดพลาดระหว่างการส่งคำขอ',
      });
      console.error('เกิดข้อผิดพลาดระหว่างการส่งคำขอ:', error);
    }
  };

  //change password
  const handlePasswordChange = async () => {
    try {
      // Check if the new password and confirm new password match
      if (passwordData.newPassword !== passwordData.confirmNewPassword) {
        alert('รหัสผ่านใหม่และยืนยันรหัสผ่านใหม่ไม่ตรงกัน\nกรุณากรอกรหัสผ่านใหม่และยืนยันรหัสผ่านใหม่ให้ตรงกัน');
        return;
      }

      // Send a request to change the password
      const response = await axios.post(ip + '/auth/update_password', {
        member_id: member.ไอดี,
        old_password: passwordData.oldPassword,
        new_password: passwordData.newPassword,
      });

      if (response.status === 200 && response.data.success) {
        // Password change successful
        alert('เปลี่ยนรหัสผ่านสำเร็จ');
        // You can add additional logic here if needed

        // Close the dialog
        handleDialogClose();
      } else {
        // Show error alert with the specific error message from the server
        alert(response.data.message || 'เกิดข้อผิดพลาดระหว่างการเปลี่ยนรหัสผ่าน');
      }
    } catch (error) {
      // Show a generic error alert
      alert('กรุณากรอกข้อมูลให้ถูกต้อง');
      console.error('เกิดข้อผิดพลาดระหว่างการส่งคำขอ:', error);
    }
  };



  // const handleSave = async () => {
  //   // Check if the password and confirm password match
  //   if (member.รหัสผ่าน === member.ยืนยันPassword) {
  //     try {
  //       // Check if the old password is correct
  //       const isOldPasswordValid = await axios.post('http://localhost:4000/api/v1/auth/check_old_password', {
  //         member_id: member.ไอดี,
  //         old_password: member.รหัสผ่านเก่า // Change this to match the field name in your API
  //       });

  //       if (!isOldPasswordValid.data.success) {
  //         // Show warning alert using SweetAlert2
  //         await Swal.fire({
  //           icon: 'warning',
  //           title: 'รหัสผ่านเดิมไม่ถูกต้อง',
  //           text: 'กรุณากรอกรหัสผ่านเดิมให้ถูกต้อง',
  //         });
  //         return;
  //       }

  //       // Prepare the data to send to the API
  //       const requestData = {
  //         member_id: member.ไอดี,
  //         member_fname: member.ชื่อสมาชิก.split(' ')[0],
  //         member_lname: member.ชื่อสมาชิก.split(' ')[1],
  //         member_email: member.อีเมล,
  //         member_phone: member.เบอร์โทร,
  //         member_address: member.ที่อยู่,
  //         user_password: member.รหัสผ่าน,
  //         old_password: member.รหัสผ่านเก่า // Change this to match the field name in your API
  //       };

  //       // Send a PUT request to the API endpoint
  //       const response = await axios.post('http://localhost:4000/api/v1/auth/update_profile', requestData);

  //       if (response.status === 200) {
  //         // Show success alert using SweetAlert2
  //         await Swal.fire({
  //           icon: 'success',
  //           title: 'บันทึกข้อมูลสำเร็จ',
  //           showConfirmButton: false,
  //           timer: 1500,
  //         });

  //         // You might want to update your local state or take other actions here
  //       } else {
  //         // Show error alert using SweetAlert2
  //         await Swal.fire({
  //           icon: 'error',
  //           title: 'เกิดข้อผิดพลาด',
  //           text: 'เกิดข้อผิดพลาดระหว่างการบันทึกข้อมูล',
  //         });
  //       }
  //     } catch (error) {
  //       // Show error alert using SweetAlert2
  //       await Swal.fire({
  //         icon: 'error',
  //         title: 'เกิดข้อผิดพลาด',
  //         text: 'เกิดข้อผิดพลาดระหว่างการส่งคำขอ',
  //       });
  //       console.error('เกิดข้อผิดพลาดระหว่างการส่งคำขอ:', error);
  //     }
  //   } else {
  //     // Show warning alert using SweetAlert2
  //     await Swal.fire({
  //       icon: 'warning',
  //       title: 'รหัสผ่านไม่ตรงกัน',
  //       text: 'กรุณากรอกรหัสผ่านและยืนยันรหัสผ่านให้ตรงกัน',
  //     });
  //   }
  // };
  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          variant="h4"
          align="left"

          sx={{
            color: '#333335',
            marginTop: '20px',
            fontSize: '24px', // Add this line for the border // Add some padding for space around the text
            marginLeft: '20px',
            height: '50px',
            borderRadius: 2,
            textAlign: 'center'
          }}
        >
          จัดการข้อมูลส่วนตัว

        </Typography>

      </Box>
      <Box sx={{ margin: '15px', backgroundColor: 'white', height: '1100px', borderRadius: 3, padding: '20px' }}>
        <Container maxWidth="xl">

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <TableHead>
              <TableRow>
                <TableCell variant="h2" sx={{ fontSize: '20px', fontWeight: 'bold' }}>ข้อมูลส่วนตัว</TableCell>
              </TableRow>
            </TableHead>
            <Box bgcolor="green" color="white" borderRadius={1}>
              Point: {member.points}
            </Box>
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Table >
              <TableBody >
                <TableRow>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <span style={{ marginRight: '8px' }}>ไอดี:</span>
                      <TextField name="ชื่อ" value={member.ไอดี} onChange={handleInputChange} fullWidth />
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <span style={{ marginRight: '8px' }}>ชื่อ-นามสกุล:</span>
                      <TextField name="ชื่อสมาชิก" value={member.ชื่อสมาชิก} onChange={handleInputChange} fullWidth />
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <span style={{ marginRight: '8px' }}>อีเมล:</span>
                      <TextField name="อีเมล" value={member.อีเมล} onChange={handleInputChange} fullWidth />
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <span style={{ marginRight: '8px' }}>เบอร์โทร:</span>
                      <TextField name="เบอร์โทร" value={member.เบอร์โทร} onChange={handleInputChange} fullWidth />
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <span style={{ marginRight: '8px' }}>ที่อยู่:</span>
                      <TextField name="ที่อยู่" value={member.ที่อยู่} onChange={handleInputChange} fullWidth />
                    </Box>
                  </TableCell>
                </TableRow>
  

                <TableRow>
                  <TableCell sx={{ justifyContent: 'space-between' }}>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                      บันทึก
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleDialogOpen} sx={{ marginLeft: 10 }}>
                      เปลี่ยนรหัสผ่าน
                    </Button>
                  </TableCell>


                </TableRow>
              </TableBody>
            </Table>
          </Box>

        </Container>
      </Box>
      {/* Password Change Dialog */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>เปลี่ยนรหัสผ่าน</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ marginBottom: 2 }}>
            กรุณากรอกรหัสผ่านเดิม รหัสผ่านใหม่ และยืนยันรหัสผ่านใหม่
          </DialogContentText>
          <TextField
            label="รหัสผ่านเดิม"
            type="password"
            fullWidth
            name="oldPassword"
            value={passwordData.oldPassword}
            onChange={handlePasswordInputChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="รหัสผ่านใหม่"
            type="password"
            fullWidth
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordInputChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="ยืนยันรหัสผ่านใหม่"
            type="password"
            fullWidth
            name="confirmNewPassword"
            value={passwordData.confirmNewPassword}
            onChange={handlePasswordInputChange}
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>ยกเลิก</Button>
          <Button variant="contained" color="primary" onClick={handlePasswordChange}>
            บันทึก
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );

}

export default MemberProfile;
