import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Container,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  MenuItem,
  Select,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, } from '@mui/icons-material';
import { ADD_MEMBER, GETMEMBER, get, post, put } from '../Static/api';
import PersonIcon from '@mui/icons-material/Person';
import Alert from '@mui/material/Alert';
import RegexHelper from '../Static/RegexHelper';
import { Snackbar } from '@mui/material';
import Swal from 'sweetalert2';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { message } from 'antd';



function MemberManagement({ person }) {
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberId, setMemberId] = useState('');
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPassword, setMemberPassword] = useState('');
  const [memberStatus, setMemberStatus] = useState(false);
  const [memberPhone, setMemberPhone] = useState('');
  const [memberPurchaseHistory, setMemberPurchaseHistory] = useState('');
  const [user_username, setUserUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const [validationState, setValidationState] = useState({
    user_username: false,
    email: false,
    fname: false,
    lname: false,
    password: false,
    cpassword: false,
    // Add more fields as needed
  });
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage);
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = members.slice(indexOfFirstItem, indexOfLastItem);
  const [alertMessage, setAlertMessage] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedMemberData, setSelectedMemberData] = useState(null);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  useEffect(() => {
    handleGetMEMBER();
  }, []);

  if (person && person.user_type === 0) {
    // Admin user
  } else if (person && person.user_type === 1) {
    // Employee user
  } else if (person && person.user_type === 2) {
    // Member user
  }

  const handleOpenEditDialog = (member) => {
    setSelectedMemberData(member);
    setOpenEditDialog(true);
  };


  // Function to close the edit dialog
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };


  const handleAddMember = () => {
    setOpenDialog(true);
    setSelectedMember(null);
    setMemberId('');
    setMemberName('');
    setMemberEmail('');
    setMemberPassword('');
    setMemberStatus(false);
    setMemberPhone('');
    setMemberPurchaseHistory('');
  };

  const handleSaveMember = async () => {
    if (user_username.trim() === '') {
      message.error('กรุณากรอกชื่อผู้ใช้');
    } else if (!RegexHelper.validateEmail(email)) {
      message.error('กรุณากรอกอีเมลให้ถูกต้อง');
    } else if (fname.length < 2) {
      message.error('ชื่อควรมีความยาวอย่างน้อย 2 ตัวอักษร');
    } else if (lname.length < 2) {
      message.error('นามสกุลควรมีความยาวอย่างน้อย 2 ตัวอักษร');
    } else if (address.trim() === '') {
      message.error('กรุณากรอกที่อยู่');
  
    } else if (!/^\d{10}$/.test(phone)) {
      message.error('กรุณากรอกหมายเลขโทรศัพท์ให้ถูกต้อง (10 หลัก)');
    } else if (password.length < 6 || password.length > 20) {
      message.error('รหัสผ่านควรมีความยาวอยู่ระหว่าง 6 ถึง 20 ตัวอักษร');
    } else if (password !== cpassword) {
      message.error('รหัสผ่านไม่ตรงกัน');
    } else {
      let req = {
        member_email: email,
        member_fname: fname,
        member_lname: lname,
        user_password: password,
        member_address: address,
        member_phone: phone,
        user_username: user_username,
      };
      await post(req, ADD_MEMBER).then(async (res) => {
        if (res.success) {
          let { mid, member_fname, member_lname } = await res.result;
          console.log(mid, member_fname, member_lname);
          // Close the dialog
          handleGetMEMBER();
          handleClickOpen();
          setOpenDialog(false);
          Swal.fire({
            icon: 'success',
            title: 'บันทึกข้อมูลเสร็จสิ้น',
            // text: response.data.message,
          });
        } else {
          setAlertMessage('เกิดข้อผิดพลาดในการสมัครสมาชิก');
          setIsAlertOpen(true);
        }
      });
    }
  };


  const handleEditMember = async () => {
    const url = `/member/update_member/${selectedMemberData.id}`;
    const data = {
      member_fname: selectedMemberData.fname,
      member_lname: selectedMemberData.lname,
      member_email: selectedMemberData.email,
      member_address: selectedMemberData.address,
      member_phone: selectedMemberData.phone
    };

    // Check if the email is valid
    const isValidEmail = RegexHelper.validateEmail(selectedMemberData.email);

    if (!isValidEmail) {
      message.error('อีเมลไม่ถูกต้อง');
      console.error('Invalid email address');
      return; // Exit the function early if the email is invalid
    }
    if (!selectedMemberData.fname || !selectedMemberData.lname || !selectedMemberData.address || !selectedMemberData.phone) {
      message.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      console.error('Required fields are missing');
      return; 
    }
    try {
      const response = await put(url, data);
      if (response.success) {
        console.log('Member data updated successfully');
        setOpenEditDialog(false);
        Swal.fire({
          icon: 'success',
          title: 'แก้ไขสำเร็จ',
          text: 'ข้อมูลถูกแก้ไขเรียบร้อย',
          confirmButtonText: 'OK'
        });
        handleGetMEMBER();
      } else {
        console.error('Failed to update member data');
      }
    } catch (error) {
      console.error('Error updating member data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while updating member data',
        confirmButtonText: 'OK'
      });
      console.error('Error updating member data:', error);
    }
  };



  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const handleupdatemember = (member) => {
    // เปิดไดอะล็อกสำหรับแก้ไขข้อมูลสมาชิก
    setOpenDialog(true);
    // กำหนดข้อมูลสมาชิกที่ถูกเลือกไว้ใน state
    setSelectedMember(member);
    setUserUsername(member.user_username);
    setEmail(member.email);
    setFname(member.fname);
    setLname(member.lname);
    setAddress(member.address);
    setPhone(member.phone);
    setPassword(''); // เซ็ตรหัสผ่านเป็นค่าว่างเพื่อให้ผู้ใช้ต้องกรอกรหัสผ่านใหม่
    setCPassword(''); // เซ็ตยืนยันรหัสผ่านเป็นค่าว่างเพื่อให้ผู้ใช้ต้องกรอกรหัสผ่านใหม่
  };

  const handleGetMEMBER = async () => {
    try {
      const res = await get(GETMEMBER); // GETMEMBER คือ URL ของ API ที่เรียกข้อมูลสมาชิก

      if (res.success) {
        const data = res.result;
        const modifiedData = data.map((member, index) => {
          // สร้างรหัสสมาชิกแบบ MID000001 พร้อมไอดี
          const paddedNumber = String(index + 1).padStart(6, '0');


          return {
            userid: member.user_id,
            id: member.member_id, // รหัสสมาชิกพร้อมไอดี
            fname: member.member_fname,
            lname: member.member_lname,
            email: member.member_email,
            point: member.point,
            isActive: member.is_active,
            address: member.member_address,
            phone: member.member_phone
          };
        });

        setMembers(modifiedData);
        setOriginalMember(modifiedData);
        console.log('Fetched members:', modifiedData);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleResetPassword = async (userId, data) => {
  Swal.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: 'คุณต้องการรีเซ็ตรหัสผ่านสำหรับสมาชิกนี้ใช่หรือไม่?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'ใช่, รีเซ็ตรหัสผ่าน',
    cancelButtonText: 'ยกเลิก'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const url = `/member/getpassword/${userId}`;
      const response = await get(url, data); // ตรวจสอบให้แน่ใจว่า data ถูกนิยามแล้ว
      if (response.success) {
        console.log('Member data updated successfully');
        setOpenEditDialog(false);
        Swal.fire({
          title: 'รหัสผ่านใหม่',
          text: `รหัสผ่านใหม่ของสมาชิกคือ ${response.result.newPassword}`,
          icon: 'success'
        });
        handleGetMEMBER();
      } else {
        console.error('Failed to update member data');
      }
    }
  });
};




  const handleEditPurchaseHistory = (member) => {
    // Handle the click event for editing purchase history
    console.log('Editing purchase history:', member);
  };

  const handleDeleteMember = (memberId) => {
    const updatedMembers = members.filter((member) => member.id !== memberId);
    setMembers(updatedMembers);
    Swal.fire({
      icon: 'success',
      title: 'ลบสมาชิกเสร็จสิ้น',
      // text: response.data.message,
    });
  };

  const handleChangePage = (event, page) => {
    setCurrentPage(page);
  };


  useEffect(() => {

  }, []);
  const [originalMember, setOriginalMember] = useState([]);

  const handleSearch = (event) => {
    const searchValue = event.target.value;

    if (searchValue === "") {
      setMembers(originalMember);
    } else {
      const filteredMember = originalMember.filter((member) => {
        return (
          member.name.toLowerCase().includes(searchValue.toLowerCase())
        );
      });
      setMembers(filteredMember);
    }

    setSearchQuery(searchValue);
  };
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
          จัดการสมาชิก

        </Typography>

        <Button sx={{ backgroundColor: '#28bc94', marginRight: '20px' }}
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddMember}
        >
          เพิ่มสมาชิก
        </Button>

      </Box>
      <Box sx={{ margin: '15px', backgroundColor: 'white', height: '1100px', borderRadius: 3, padding: '20px' }}>
        <Box >

          <Box component="main">
            <Container maxWidth="xl">
              <Grid container justifyContent="space-between" alignItems="center" mb={4}>
                <Typography
                  variant="h4"
                  align="left"
                  gutterBottom
                  fullWidth
                  sx={{
                    fontSize: '20px',
                    borderBottom: '2px solid #009ae1',
                    paddingBottom: '5px',
                    color: '#333335',
                    fontWeight: 'bold'
                  }}
                >
                  รายชื่อสมาชิก

                </Typography>

              </Grid>
              <Grid container spacing={2} mb={4} sx={{ marginLeft: '2px ', marginBottom: '16px', marginTop: '20px', width: '20%', backgroundColor: 'white' }}>
                <TextField
                  label="ค้นหาสมาชิก"
                  value={searchQuery}
                  onChange={handleSearch}
                  fullWidth
                />
              </Grid>


              <Paper elevation={3} sx={{ width: '100%', borderRadius: 2, overflow: 'hidden', marginTop: '' }}>
                <Table sx={{ borderRadius: 5 }}>
                  <TableHead style={{
                    backgroundColor: "#009ae1", color: 'white'
                  }}>
                    <TableRow>
                      <TableCell style={{ color: 'white' }}>ลำดับ</TableCell>
                      <TableCell style={{ color: 'white' }}>รหัสสมาชิก</TableCell>
                      <TableCell style={{ color: 'white' }}>ชื่อสมาชิก</TableCell>
                      <TableCell style={{ color: 'white' }}>อีเมล</TableCell>
                      <TableCell style={{ color: 'white' }}>เบอร์โทรศัพท์</TableCell>
                      <TableCell style={{ color: 'white' }}>ที่อยู่</TableCell>
                      <TableCell style={{ color: 'white' }}>คะแนน</TableCell>
                      <TableCell style={{ color: 'white' }}>รีเซ็ตรหัสผ่าน</TableCell>
                      <TableCell style={{ color: 'white' }}>แก้ไข</TableCell>
                      <TableCell style={{ color: 'white' }}>ลบ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentItems.map((member, index) => (
                      <TableRow key={index}>
                        <TableCell>{indexOfFirstItem + index + 1}</TableCell>
                        <TableCell>{`MID${String(member.id).padStart(6, '0')}`}</TableCell>
                        <TableCell>{`${member.fname} ${member.lname}`}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.phone}</TableCell>
                        <TableCell>{member.address}</TableCell>
                        <TableCell>{member.point}</TableCell>

                        <TableCell>
                          <IconButton onClick={() => handleResetPassword(member.userid)}>
                            <VpnKeyIcon />
                          </IconButton>
                        </TableCell>


                        <TableCell>
                          <IconButton onClick={() => handleOpenEditDialog(member)}>
                            <EditIcon />
                          </IconButton>
                        </TableCell>

                        <TableCell>
                          <IconButton onClick={() => handleDeleteMember(member.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={10}>
                        <Box
                          sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
                        >
                          <Typography variant="caption" sx={{ marginRight: 2 }}>
                            Rows per page:
                          </Typography>
                          <Select
                            value={rowsPerPage}
                            onChange={handleRowsPerPageChange}
                            variant="outlined"
                            sx={{ marginRight: 2 }}
                          >
                            <MenuItem value={10}>10 rows</MenuItem>
                            <MenuItem value={20}>20 rows</MenuItem>
                            <MenuItem value={30}>30 rows</MenuItem>
                          </Select>
                          <Typography variant="caption" sx={{ marginRight: 2 }}>
                            {`${indexOfFirstItem + 1}–${Math.min(indexOfLastItem, members.length)} of ${members.length}`}
                          </Typography>
                          <Pagination
                            count={Math.ceil(members.length / rowsPerPage)}
                            page={currentPage}
                            onChange={handleChangePage}
                            color="primary"
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Paper>
              <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>{selectedMember ? 'แก้ไขข้อมูลพนักงาน' : 'เพิ่มพนักงาน'}</DialogTitle>
                <DialogContent>
                  <div style={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <TextField
                        sx={{ mb: 2 }}
                        label="ชื่อผู้ใช้"
                        value={user_username}
                        onChange={(e) => setUserUsername(e.target.value)}
                        fullWidth
                        margin="normal"
                        error={validationState.user_username}
                      />
                      <TextField
                        sx={{ mb: 2 }}
                        label="อีเมล"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        margin="normal"
                        error={validationState.email}
                      />
                      <TextField
                        sx={{ mb: 2 }}
                        label="ชื่อ"
                        value={fname}
                        onChange={(e) => setFname(e.target.value)}
                        fullWidth
                        margin="normal"
                        error={validationState.fname}
                      />
                      <TextField
                        sx={{ mb: 2 }}
                        label="นามสกุล"
                        value={lname}
                        onChange={(e) => setLname(e.target.value)}
                        fullWidth
                        margin="normal"
                        error={validationState.lname}
                      />
                      <TextField
                        sx={{ mb: 2 }}
                        label="ที่อยู่"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        fullWidth
                        margin="normal"
                      />
                      <TextField
                        sx={{ mb: 2 }}
                        label="เบอร์โทรศัพท์"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        fullWidth
                        margin="normal"
                      />
                      <TextField
                        sx={{ mb: 2 }}
                        label="รหัสผ่าน"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        error={validationState.password}
                      />
                      <TextField
                        sx={{ mb: 2 }}
                        label="ยืนยันรหัสผ่าน"
                        type="password"
                        value={cpassword}
                        onChange={(e) => setCPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        error={validationState.cpassword}
                      />
                    </div>
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenDialog(false)}>ยกเลิก</Button>
                  <Button onClick={handleSaveMember} variant="contained" color="primary">
                    {selectedMember ? 'อัปเดต' : 'บันทึก'}
                  </Button>
                </DialogActions>
                <Snackbar
                  open={isAlertOpen}
                  autoHideDuration={6000} // Adjust the duration as needed
                  onClose={() => setIsAlertOpen(false)}
                >
                  <Alert severity="error">
                    {alertMessage}
                  </Alert>
                </Snackbar>

              </Dialog>
              <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>แก้ไขข้อมูลสมาชิก</DialogTitle>
                <DialogContent>
                  {selectedMemberData && (
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <TextField
                          sx={{ mb: 2 }}
                          label="อีเมล"
                          value={selectedMemberData.email}
                          onChange={(e) => setSelectedMemberData({ ...selectedMemberData, email: e.target.value })}
                          fullWidth
                          margin="normal"
                          error={validationState.email}
                        />
                        <TextField
                          sx={{ mb: 2 }}
                          label="ชื่อ"
                          value={selectedMemberData.fname}
                          onChange={(e) => setSelectedMemberData({ ...selectedMemberData, fname: e.target.value })}
                          fullWidth
                          margin="normal"
                          error={validationState.fname}
                        />
                        <TextField
                          sx={{ mb: 2 }}
                          label="นามสกุล"
                          value={selectedMemberData.lname}
                          onChange={(e) => setSelectedMemberData({ ...selectedMemberData, lname: e.target.value })}
                          fullWidth
                          margin="normal"
                          error={validationState.lname}
                        />
                        <TextField
                          sx={{ mb: 2 }}
                          label="ที่อยู่"
                          value={selectedMemberData.address}
                          onChange={(e) => setSelectedMemberData({ ...selectedMemberData, address: e.target.value })}
                          fullWidth
                          margin="normal"
                        />
                        <TextField
                          sx={{ mb: 2 }}
                          label="เบอร์โทรศัพท์"
                          value={selectedMemberData.phone}
                          onChange={(e) => {
                            const phoneNumber = e.target.value.replace(/\D/g, ''); // ลบอักขระที่ไม่ใช่ตัวเลขออกจากค่าที่ป้อน
                            if (phoneNumber.length <= 10) { // ตรวจสอบว่ายาวไม่เกิน 10 ตัวอักษร
                              setSelectedMemberData({ ...selectedMemberData, phone: phoneNumber }); // อัปเดตค่าเฉพาะเมื่อยาวไม่เกิน 10 ตัวอักษร
                            }
                          }}
                          fullWidth
                          margin="normal"
                          inputProps={{
                            pattern: '[0-9]{10}', // กำหนดรูปแบบของข้อมูลที่รับเข้าสู่ฟิลด์
                            title: 'กรุณากรอกหมายเลขโทรศัพท์ 10 ตัวเท่านั้น' // ข้อความที่จะแสดงเมื่อข้อมูลไม่ตรงกับรูปแบบที่กำหนด
                          }}
                        />

                      </div>
                    </div>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenEditDialog(false)}>ยกเลิก</Button>
                  <Button onClick={handleEditMember} variant="contained" color="primary">
                    บันทึก
                  </Button>
                </DialogActions>
                <Snackbar
                  open={isAlertOpen}
                  autoHideDuration={6000} // Adjust the duration as needed
                  onClose={() => setIsAlertOpen(false)}
                >
                  <Alert severity="error">
                    {alertMessage}
                  </Alert>
                </Snackbar>
              </Dialog>

            </Container>
          </Box>
        </Box>
      </Box>
    </div>
  );

}

export default MemberManagement;
