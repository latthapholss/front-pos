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
import SidebarAdmin from '../Component/Sidebar-member';
import { useHistory } from 'react-router-dom';

function MemberPersonal() {
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
    // Get the history object from useHistory hook
  
    // Handle the click event for editing purchase history
    const editPurchaseHistoryURL = `/Member/profile`; // Change the route as needed
  
    console.log('Editing purchase history:', member);
  
    // Navigate to the desired URL
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
            <Typography variant="h5">ดูข้อมูลส่วนตัว</Typography>
           
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
                  <TableCell>ดูข้อมูลส่วนตัว</TableCell>
                 
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
  {member.purchaseHistory ? (
    <IconButton onClick={() => {
      const editPurchaseHistoryURL = '/Member/profile'; // Change the route as needed
      console.log('Editing purchase history:', member);
      window.location.href = editPurchaseHistoryURL;
    }}>
      <ShoppingCartIcon />
    </IconButton>
  ) : (
    <span>-</span>
  )}
</TableCell>
                    
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

        </Container>
      </Box>
    </Box>
  );
}

export default MemberPersonal;
