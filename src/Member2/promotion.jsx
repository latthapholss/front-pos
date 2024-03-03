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

function MemberPromotion() {
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

  
    // สมมติว่านี่คือข้อมูลที่คุณต้องการแสดงในตาราง
    const data = [
      { id: 1, ลำดับชุดโปรโมชั่น: '1', ชุดโปรโมชั่น: 'ตะปู+ค้อน', ราคา: '1500', 'วันหมดอายุโปรโมชั่น': '*19/01/2567 16:00' },
      { id: 2, ลำดับชุดโปรโมชั่น: '1', ชุดโปรโมชั่น: 'หลังคา+ประตู', ราคา: '5000',  'วันหมดอายุโปรโมชั่น': '*19/01/2567 16:00' },
      { id: 2, ลำดับชุดโปรโมชั่น: '1', ชุดโปรโมชั่น: 'กระเบื้อง+สี', ราคา: '3000',   'วันหมดอายุโปรโมชั่น': '*1/03/2567 16:00' },
      // เพิ่มข้อมูลแถวอื่นๆ ตามที่คุณต้องการ
    ];
    return (
      <Box sx={{ display: 'flex' }}>
      <Box sx={{ width: '240px' }}>
        <SidebarAdmin />
      </Box>
      <Box component="main" flexGrow={1} p={3}>
        <Container maxWidth="xl">
          <Grid container justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h5">โปรโมชั่น</Typography>
            </Grid>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ลำดับชุดโปรโมชั่น</TableCell>
            <TableCell>ชุดโปรโมชั่น</TableCell>
            <TableCell>ราคา</TableCell>
            <TableCell>วันหมดอายุโปรโมชั่น</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row['ลำดับชุดโปรโมชั่น']}</TableCell>
              <TableCell>{row['ชุดโปรโมชั่น']}</TableCell>
              <TableCell>{row['ราคา']}</TableCell>
              <TableCell>{row['วันหมดอายุโปรโมชั่น']}</TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </Container>
      </Box>
    </Box>
    );
  };
  
  

  export default MemberPromotion;
