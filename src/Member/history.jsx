import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Container,
  Pagination
} from '@mui/material';
import { GETORDERDETAIL, PROMOTIONSTATUS, get, getorderhistory, getorderhistoryDetail, ip, } from '../Static/api';
import IconButton from '@mui/material/IconButton';
import AlarmIcon from '@mui/icons-material/Alarm';
import { localStorageKeys } from '../Static/LocalStorage';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import axios from 'axios';
import { red } from '@mui/material/colors';


function SalesDetailPage({ person }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const [, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]); // State variable for order details

  if (person && person.user_type === 0) {
    // Admin user
  } else if (person && person.user_type === 1) {
    // Employee user
  } else if (person && person.user_type === 2) {
    // Member user
  }
  const [ORDERS, setORDERS] = useState([]);

  const openDialogForOrder = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };


  useEffect(() => {
    handleGetORDER(); // Pass the member's ID to the function
  }, []);

  useEffect(() => {
    console.log("Current orders:", ORDERS);
  }, [ORDERS]);







  const handleCloseDialog = () => {
    setOpenDialog(false);
  };




  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };


  const handlegetOrderDetail = async (order_id) => {
    try {
      const url = `${ip}${getorderhistoryDetail}${order_id}`;
      const response = await axios.get(url);

      const orderDetailData = response.data; // Access response data directly with response.data

      if (orderDetailData.success) {
        // Assuming that result is an array of order details
        const orderDetails = orderDetailData.result;
        setOrderDetails(orderDetails);

        // Handle the order details data as needed
        console.log('Order Details:', orderDetails);
      } else {
        console.error('Error message from the server:', orderDetailData.message);
        // Handle the case where the server indicates an error
      }
    } catch (error) {
      console.error('Error fetching order detail:', error);
    }
  };








  const handleGetORDER = async () => {
    try {
      const storedMemberData = JSON.parse(localStorage.getItem(localStorageKeys.loginSession));
      console.log('Stored Member Data:', storedMemberData);

      if (storedMemberData && storedMemberData.user_type === 2) {
        setMember({
          ไอดี: storedMemberData.member_id,
          ชื่อ: storedMemberData.member_fname,
          ชื่อสมาชิก: storedMemberData.member_fname + ' ' + storedMemberData.member_lname,
          อีเมล: storedMemberData.member_email,
          รหัสผ่าน: '**********',
          ยืนยันPassword: '**********',
          เบอร์โทร: storedMemberData.member_phone,
          ที่อยู่: storedMemberData.member_address,
          point: storedMemberData.point
        });

        const memberId = storedMemberData.member_id;
        const url = `${getorderhistory}${memberId}`;
        console.log('Sending GET request to the API...');
        const res = await get(url);

        console.log('Response from the API:', res);

        if (res.success) {
          const ordersData = res.result.map(order => ({
            order_id: order.order_id,
            total_amount: order.total_amount,
            status: order.status,
            point: order.point,
            order_date: new Date(order.order_date).toLocaleString()
          }));

          console.log('Processed Orders Data:', ordersData);
          setORDERS(ordersData);
        } else {
          console.error('Error fetching orders:', res.message);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };





  const startAutoUpdatePromotionStatus = () => {
    const interval = 30000; // 30 วินาทีในมิลลิวินาที

    // เรียกใช้ฟังก์ชัน updatePromotionStatus เพื่ออัปเดตสถานะโปรโมชั่น
    const autoUpdatePromotionStatus = async () => {
      try {
        await get(PROMOTIONSTATUS); // เรียกใช้งาน updatePromotionStatus โดยใส่วงเล็บ ()
        console.log('Promotion statuses updated.');
      } catch (error) {
        console.error('Error updating promotion statuses:', error);
      }
    }

    // เรียกฟังก์ชัน autoUpdatePromotionStatus ครั้งแรกเพื่อเริ่มการอัปเดตสถานะโปรโมชั่นโดยอัตโนมัติ
    autoUpdatePromotionStatus();

    // สร้าง interval เพื่อเรียกฟังก์ชัน autoUpdatePromotionStatus ในระหว่างที่ระบบทำงาน
    setInterval(() => {
      autoUpdatePromotionStatus();
      console.log('Auto update triggered.');
    }, interval);
  };
  const [, setMember] = useState({
    ชื่อ: '', // แก้ไขเป็นข้อมูลว่างเพื่อให้เริ่มต้นเป็นค่าว่าง
    ชื่อสมาชิก: '',
    อีเมล: '',
    รหัสผ่าน: '',
    ยืนยันPassword: '',
  });





  const currentItems = ORDERS.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{
          color: '#333335',
          marginTop: '20px',
          fontSize: '24px', // Add this line for the border // Add some padding for space around the text
          marginLeft: '20px',
          height: '50px',
          borderRadius: 2,
          textAlign: 'center'
        }}>ประวัติการซื้อ</Typography>
      </Box>
      <Box sx={{ margin: '15px', backgroundColor: 'white', height: '1100px', borderRadius: 3, padding: '20px' }}>
        <Box component="main">
          <Typography variant="h5" sx={{
            color: '#333335',
            marginTop: '20px',
            fontSize: '20px', // Add this line for the border // Add some padding for space around the text
            marginLeft: '20px',
            height: '50px',
            borderRadius: 2,
          }}>รายการซื้อ</Typography>
          <Container maxWidth="xl">
            <Paper sx={{ mt: 3, mb: 3 ,p:2}}>
              <Table>
              <TableHead >
                  <TableRow>
                    <TableCell>รหัสสินค้า</TableCell>
                    <TableCell align="right">ยอดสินค้า</TableCell>
                    <TableCell align="right">วันที่ซื้อสินค้า</TableCell>
                    <TableCell align="right">แต้มที่ได้</TableCell>
                    <TableCell align="right">รายละเอียดสินค้าเพิ่มเติม</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentItems.map((order) => (
                    <TableRow key={order.order_id}>
                      <TableCell component="th" scope="row">
                        {order.order_id}
                      </TableCell>
                      <TableCell align="right">{order.total_amount}</TableCell>
                      <TableCell align="right">{order.order_date}</TableCell>
                      <TableCell align="right">{order.point}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          onClick={() => {
                            handlegetOrderDetail(order.order_id); // Pass the order_id to the handlegetOrderDetail function
                            openDialogForOrder(order); // Open the dialog for the selected order
                          }}
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid #00000', // Replace 'yourBorderColor' with the desired border color
                            cursor: 'pointer',
                            
                          }}
                        >
                          สินค้า
                        </Button>

                      </TableCell>


                    </TableRow>
                  ))}
                </TableBody>

              </Table>

              <Box
                sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
              >
                <Pagination
                  count={Math.ceil(ORDERS.length / itemsPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>

            </Paper>
          </Container>
        </Box>
      </Box>



      // ... (previous code)

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">รายละเอียดสินค้า</DialogTitle>
        <DialogContent>
          {/* Render order details in a table */}
          <Table >
            <TableHead>
              <TableRow>
                <TableCell>ชื่อสินค้า</TableCell>
                <TableCell>จำนวน</TableCell>
                <TableCell>ราคา</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderDetails.map((detail, index) => (
                <TableRow key={index}>
                  <TableCell>{detail.product_name}</TableCell>
                  <TableCell>{detail.quantity}</TableCell>
                  <TableCell>{detail.unit_price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseDialog} color="primary">
            ปิด
          </Button>
        </DialogActions>
      </Dialog>



    </div>

  );

}

export default SalesDetailPage;
