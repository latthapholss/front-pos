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
  Switch,
  FormControlLabel
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import SidebarAdmin from '../Component/Sidebar-Employee';

function MemberManagement() {
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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = members.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    // Fetch members from API or database
    // and update the state
  }, []);

  const handleSearch = () => {
    // Implement search logic based on searchQuery
    // and update the state
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

  const handleSaveMember = () => {
    const newMember = {
      id: memberId,
      name: memberName,
      email: memberEmail,
      password: memberPassword,
      status: memberStatus ? 'on' : 'off',
      phone: memberPhone,
      purchaseHistory: memberPurchaseHistory
    };

    if (selectedMember) {
      // Update existing member
      const updatedMembers = members.map((member) =>
        member.id === selectedMember.id ? newMember : member
      );
      setMembers(updatedMembers);
    } else {
      // Add new member
      setMembers([...members, newMember]);
    }

    setOpenDialog(false);
  };

  const handleEditMember = (member) => {
    setOpenDialog(true);
    setSelectedMember(member);
    setMemberId(member.id);
    setMemberName(member.name);
    setMemberEmail(member.email);
    setMemberPassword(member.password);
    setMemberStatus(member.status === 'on');
    setMemberPhone(member.phone);
    setMemberPurchaseHistory(member.purchaseHistory);
  };

  const handleEditPurchaseHistory = (member) => {
    // Handle the click event for editing purchase history
    console.log('Editing purchase history:', member);
  };

  const handleDeleteMember = (memberId) => {
    const updatedMembers = members.filter((member) => member.id !== memberId);
    setMembers(updatedMembers);
  };

  const handleChangePage = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ width: '240px' }}>
        <SidebarAdmin />
      </Box>
      <Box component="main" flexGrow={1} p={3}>
        <Container maxWidth="xl">
          <Grid container justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h5">จัดการสมาชิก</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddMember}
            >
              เพิ่มสมาชิก
            </Button>
          </Grid>

          <Grid container spacing={2} mb={4}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                label="ค้นหา"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button variant="contained" onClick={handleSearch}>
                ค้นหา
              </Button>
            </Grid>
          </Grid>

          <Paper elevation={3} sx={{ width: '100%', borderRadius: 5, overflow: 'hidden' }}>
            <Table sx={{ borderRadius: 5 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ลำดับ</TableCell>
                  <TableCell>รหัสสมาชิก</TableCell>
                  <TableCell>ชื่อสมาชิก</TableCell>
                  <TableCell>อีเมล</TableCell>
                  <TableCell>เบอร์โทรศัพท์</TableCell>
                  <TableCell>Password</TableCell>
                  <TableCell>สถานะ</TableCell>
                  <TableCell>ประวัติการซื้อ</TableCell>
                  <TableCell>แก้ไข</TableCell>
                  <TableCell>ลบ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentItems.map((member, index) => (
                  <TableRow key={index}>
                    <TableCell>{indexOfFirstItem + index + 1}</TableCell>
                    <TableCell>{member.id}</TableCell>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>*******</TableCell> {/* Display asterisks instead of member.password */}
                    <TableCell>
                      <Switch
                        checked={member.status === 'on'}
                        onChange={() => handleEditMember(member)}
                      />
                    </TableCell>
                    <TableCell>
                      {member.purchaseHistory ? (
                        <IconButton onClick={() => handleEditPurchaseHistory(member)}>
                          <ShoppingCartIcon />
                        </IconButton>
                      ) : (
                        <span>-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditMember(member)}>
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
          </Paper>

          <Pagination
            count={Math.ceil(members.length / itemsPerPage)}
            page={currentPage}
            onChange={handleChangePage}
            sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
          />
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>{selectedMember ? 'แก้ไขข้อมูลพนักงาน' : 'เพิ่มพนักงาน'}</DialogTitle>
            <DialogContent>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <TextField
                    label="รหัสสมาชิก"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="ชื่อสมาชิก"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="อีเมล"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    fullWidth
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <TextField
                    label="เบอร์โทรศัพท์"
                    value={memberPhone}
                    onChange={(e) => setMemberPhone(e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Password"
                    value={memberPassword}
                    onChange={(e) => setMemberPassword(e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="ประวัติการซื้อ"
                    value={memberPurchaseHistory}
                    onChange={(e) => setMemberPurchaseHistory(e.target.value)}
                    fullWidth
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={memberStatus}
                        onChange={() => setMemberStatus(!memberStatus)}
                      />
                    }
                    label="สถานะ"
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
          </Dialog>
        </Container>
      </Box>
    </Box>
  );
}

export default MemberManagement;
