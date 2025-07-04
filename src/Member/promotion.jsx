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
  Switch,
  FormControlLabel,
  InputLabel,
  InputAdornment,
  Pagination
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DELETEPROMOTION, PROMOTION, PROMOTIONSTATUS, PROMOTION_ADD, UPDATE_PROMOTION, get, post } from '../Static/api';
import Swal from 'sweetalert2';
import FormGroup from '@mui/material/FormGroup';
import axios from 'axios';
import Modal from 'react-modal';

function Promotionadd({ person }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [promotionData, setPromotionData] = useState({
    promotion_name: '',
    promotion_detail: '',
    discount: '',
    promotion_start: '',
    promotion_end: '',
    quota: '',
  });
  if (person && person.user_type === 0) {
    // Admin user
  } else if (person && person.user_type === 1) {
    // Employee user
  } else if (person && person.user_type === 2) {
    // Member user
  }
  const [promotions, setPromotions] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  useEffect(() => {
    handleGetPromotion();
    startAutoUpdatePromotionStatus();
  }, []);


  useEffect(() => {
    console.log("useEffect promotions:", promotions)
    console.log("useEffect currentItems:", currentItems)
  }, [promotions, currentItems]);



  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPromotionData({
      promotion_name: '',
      promotion_detail: '',
      discount: '',
      promotion_start: '',
      promotion_end: '',
      quota: '',
    });
  };

  const handleOpenEditDialog = (promotion) => {
    setSelectedPromotion(promotion);
    setEditDialogOpen(true);
  };


  const handleCloseEditDialog = () => {
    setSelectedPromotion(null);
    setEditDialogOpen(false);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPromotionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedPromotion((prevPromotion) => ({
      ...prevPromotion,
      [name]: value,
    }));
  };

  const handleEditPromotion = async (editedPromotionData) => {
    try {
      const dataWithId = {
        ...editedPromotionData,
        id: editedPromotionData.id,
        promotion_name: editedPromotionData.promotionName,
        promotion_detail: editedPromotionData.detail,
        promotion_start: editedPromotionData.startDate,
        promotion_end: editedPromotionData.endDate,
      };

      const response = await post(
        dataWithId,
        UPDATE_PROMOTION.replace(':promotion_id', editedPromotionData.id)
      );

      console.log('Response from server:', response);

      if (response.success) {
        console.log('Promotion updated successfully:', response.message);
        handleGetPromotion();

        // เพิ่ม SweetAlert เมื่อแก้ไขสินค้าเสร็จสิ้น
        Swal.fire({
          title: 'แก้ไขสำเร็จ!',
          text: response.message,
          icon: 'success',
          confirmButtonText: 'ตกลง',
        });
      } else {
        console.error('Error updating promotion:', response.message);
      }

      handleCloseEditDialog();
    } catch (error) {
      console.error('Error updating promotion:', error);
    }
  };

  const modalContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '300px', // Adjust the maximum width as needed
    margin: '0 auto',
    padding: '20px',
    backgroundColor:'#696CFF'
  };



  const handleDeletePromotion = (promotionId) => {
    Swal.fire({
      title: 'แน่ใจใช่ไหม?',
      text: 'โปรโมชั่นจะถูกยกเลิก !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        post({ promotion_id: promotionId, is_active: 0 }, DELETEPROMOTION).then((res) => {
          if (res.success) {
            const updatedPromotions = promotions.map((promotion) =>
              promotion.id === promotionId ? { ...promotion, is_active: 0 } : promotion
            );
            setPromotions(updatedPromotions);
            Swal.fire('ลบแล้ว!', 'โปรโมชั่นถูกยกเลิกแบบนุ่มแล้ว', 'success');
            // เรียกฟังก์ชันดึงข้อมูลโปรโมชั่นใหม่หลังจากลบ
            handleGetPromotion();
          } else {
            Swal.fire('ข้อผิดพลาด', res.message, 'error');
          }
        });
      }
    });
  };

  const handlePageChange = (event, newPage) => {

    setCurrentPage(newPage);

  };

  const handleSavePromotion = async () => {
    try {
      if (!promotionData.promotion_name) {
        alert('กรุณากรอกชื่อโปรโมชั่น');
        return;
      }

      if (isNaN(promotionData.discount)) {
        alert('กรุณากรอกค่า Discount ให้เป็นตัวเลข');
        return;
      }

      if (!promotionData.promotion_start || !promotionData.promotion_end) {
        alert('กรุณากรอกข้อมูลเริ่มต้นและสิ้นสุดโปรโมชั่น');
        return;
      }

      if (isNaN(promotionData.quota)) {
        alert('กรุณากรอกค่า Quota ให้เป็นตัวเลข');
        return;
      }

      const detail = promotionData.promotion_detail || 'ไม่มีรายละเอียดโปรโมชั่น';

      const newData = {
        ...promotionData,
        promotion_detail: detail,
      };

      const res = await post(newData, PROMOTION_ADD);

      if (res.success) {
        console.log('Promotion added successfully:', res.message);

        // เพิ่ม SweetAlert เมื่อเพิ่มโปรโมชั่นสำเร็จ
        Swal.fire({
          title: 'เพิ่มโปรโมชั่นสำเร็จ!',
          text: res.message,
          icon: 'success',
          confirmButtonText: 'ตกลง',
        });

        handleGetPromotion();
        startAutoUpdatePromotionStatus();
      } else {
        console.error('Error adding promotion:', res.message);
      }

      handleCloseDialog();

      console.log('Saved promotion data:', newData);
    } catch (error) {
      console.error('Error adding promotion:', error);
    }
  };





  const handleGetPromotion = async () => {

    try {
      // เรียก API เพื่อดึงข้อมูลโปรโมชั่น
      const res = await get(PROMOTION);

      if (res.success) {
        // กรองข้อมูลที่มี is_active เท่ากับ 1
        const activePromotions = res.result //.filter(item => item.is_active === 1);

        // ประมวลผลข้อมูลที่ได้รับ
        const modifiedData = activePromotions.map((item) => ({
          id: item.promotion_id,
          startDate: item.promotion_start,
          endDate: item.promotion_end,
          promotionName: item.promotion_name,
          detail: item.promotion_detail,
          discount: item.discount,
          quota: item.quota,
          selected: false,
          is_active: item.is_active
        }));

        setPromotions(modifiedData);
        const _currentItems = modifiedData.slice(indexOfFirstItem, indexOfLastItem);
        setCurrentItems(_currentItems);
        setLoading(false);

      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
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




  const handleSwitchChange = (promotion_id) => {
    // Create a copy of promotions to avoid directly mutating the state
    const updatedPromotions = [...promotions];

    // Find the index of the promotion to toggle
    const promoIndex = updatedPromotions.findIndex((obj) => obj.id === promotion_id);

    // Toggle the is_active status
    updatedPromotions[promoIndex].is_active = !updatedPromotions[promoIndex].is_active;

    // Update the state with the modified promotions
    setPromotions(updatedPromotions);

    // Update the currentItems if needed
    const _currentItems = updatedPromotions.slice(indexOfFirstItem, indexOfLastItem);
    setCurrentItems(_currentItems);

    // Make the API request to update the status on the server
    axios
      .get(`http://localhost:4000/api/v1/promotion/switchactive/${promotion_id}`)
      .then((response) => {
        if (response.data.success) {
          // Handle the success response from the server if needed.
          console.log('Promotion status updated on the server.');
        } else {
          // Handle any error response from the server.
          console.error('Error toggling promotion status on the server:', response.data.message);
        }
      })
      .catch((error) => {
        // Handle network or other errors.
        console.error('Error making server request:', error);
      });
  };

  const closeModal = () => {
    setSelectedPromotion(null);
    setIsModalOpen(false);
  };
  const handleShowDetails = (promotionData) => {
    setSelectedPromotion(promotionData);
    setIsModalOpen(true); // Open the modal
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>

      <Box sx={{ marginLeft: '' }}>
        <Box component="main" flexGrow={1} p={3}>
          <Container maxWidth="xl">
            <Grid container justifyContent="space-between" alignItems="center" mb={4}>

            </Grid>
            <div>
              {currentItems.map((promotionData, index) => (
                <div key={promotionData.id} style={{ display: 'flex', marginBottom: '16px', paddingLeft: '300px' }}>
                  <Paper elevation={3} sx={{ width: '70%', borderRadius: 5, backgroundColor: 'sky', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div>
                      <strong>ชื่อชุดโปรโมชั่น:</strong> {promotionData.promotionName}
                    </div>
                    <div>
                      <strong>ราคาโปรโมชั่น:</strong> {promotionData.discount} %
                    </div>
                    <div>
                      <strong>วันที่เริ่มต้น:</strong> {new Date(promotionData.startDate).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>วันที่หมดอายุ:</strong> {new Date(promotionData.endDate).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>จำนวนโปรโมชั่น (quota):</strong> {promotionData.quota}
                    </div>

                  
                  </Paper>


                </div>
              ))}


              <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="รายละเอียดโปรโมชั่น"
              >
                <div style={modalContentStyle}>
                  <h2>รายละเอียดโปรโมชั่น</h2>
                  <div>
                    <strong>ชื่อชุดโปรโมชั่น:</strong> {selectedPromotion?.promotionName}
                  </div>
                  <div>
                    <strong>รายละเอียดโปรโมชั่น:</strong> {selectedPromotion?.detail}
                  </div>
                  <button onClick={closeModal}>ปิด</button>
                </div>
              </Modal>
            </div>



            <Box
              sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
            >
              <Pagination
                count={Math.ceil(promotions.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>เพิ่มโปรโมชั่น</DialogTitle>
              <DialogContent>
                <TextField
                  label="ชื่อโปรโมชั่น"
                  name="promotion_name"
                  value={promotionData.promotion_name}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="รายละเอียดโปรโมชั่น"
                  name="promotion_detail"
                  value={promotionData.promotion_detail}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="ส่วนลด (%)"
                  name="discount"
                  value={promotionData.discount}
                  onChange={handleInputChange}
                  type="number"
                  InputProps={{
                    inputProps: { min: 0, max: 100 },
                  }}
                  fullWidth
                  margin="normal"
                />

                <TextField
                  name="promotion_start"
                  value={promotionData.promotion_start}
                  onChange={handleInputChange}
                  type="datetime-local"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                    style: { position: 'relative', top: -12 }, // ปรับตำแหน่ง label
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">วันที่เริ่มโปรโมชั่น</InputAdornment>,
                  }}
                  margin="normal"
                />
                <TextField
                  name="promotion_end"
                  value={promotionData.promotion_end}
                  onChange={handleInputChange}
                  type="datetime-local"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                    style: { position: 'relative', top: -12 }, // ปรับตำแหน่ง label
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">วันสิ้นสุดโปรโมชั่น</InputAdornment>,
                  }}
                  margin="normal"
                />
                <TextField
                  label="จำนวนโปรโมชั่น (quota)"
                  name="quota"
                  value={promotionData.quota}
                  onChange={handleInputChange}
                  type="number"
                  InputProps={{
                    inputProps: { min: 0 },
                  }}
                  fullWidth
                  margin="normal"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                  ยกเลิก
                </Button>
                <Button onClick={handleSavePromotion} color="primary">
                  บันทึก
                </Button>
              </DialogActions>
            </Dialog>
          </Container>
        </Box>
      </Box>

      {selectedPromotion !== null && (
        <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
          <DialogTitle>แก้ไขโปรโมชั่น</DialogTitle>
          <DialogContent>
            <TextField
              label="ชื่อโปรโมชั่น"
              name="promotionName"
              value={selectedPromotion ? selectedPromotion.promotionName : ''}
              onChange={handleEditInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="รายละเอียดโปรโมชั่น"
              name="detail"
              value={selectedPromotion.detail}
              onChange={handleEditInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Discount (%)"
              name="discount"
              value={selectedPromotion.discount}
              onChange={handleEditInputChange}
              type="number"
              InputProps={{
                inputProps: { min: 0, max: 100 },
              }}
              fullWidth
              margin="normal"
            />
            <TextField
              label="วันที่เริ่มต้น"
              name="startDate"
              value={selectedPromotion.startDate}
              onChange={handleEditInputChange}
              type="datetime-local"
              fullWidth
              InputLabelProps={{
                shrink: true,
                style: { position: 'relative', top: -12 },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">วันที่เริ่มโปรโมชั่น</InputAdornment>
                ),
              }}
              margin="normal"
            />
            <TextField
              label="วันที่หมดอายุ"
              name="endDate"
              value={selectedPromotion.endDate}
              onChange={handleEditInputChange}
              type="datetime-local"
              fullWidth
              InputLabelProps={{
                shrink: true,
                style: { position: 'relative', top: -12 },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">วันสิ้นสุดโปรโมชั่น</InputAdornment>
                ),
              }}
              margin="normal"
            />
            <TextField
              label="จำนวนโปรโมชั่น (quota)"
              name="quota"
              value={selectedPromotion.quota}
              onChange={handleEditInputChange}
              type="number"
              InputProps={{
                inputProps: { min: 0 },
              }}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog} color="primary">
              ยกเลิก
            </Button>
            <Button onClick={() => handleEditPromotion(selectedPromotion)} color="primary">
              บันทึกการแก้ไข
            </Button>
          </DialogActions>
        </Dialog>
      )}

    </div>

  );

}

export default Promotionadd;
