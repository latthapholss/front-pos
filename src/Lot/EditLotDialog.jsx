import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { EditedLot, put } from '../Static/api';
import Swal from 'sweetalert2';
import { message } from 'antd';

export default function EditLotDialog({ open, handleClose, lotData, handleEdit,handleGetLot }) {
  const [editedLot, setEditedLot] = useState(lotData);

  useEffect(() => {
    setEditedLot(lotData); // Update the local state when lotData changes
  }, [lotData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Check if the input is for product_lot_qty or product_lot_cost and the value is negative
    if ((name === 'product_lot_qty' || name === 'product_lot_cost' || name === 'product_lot_price') && value < 0) {
      // Prevent setting a negative value, can set it to 0 or keep the previous positive value
      setEditedLot(prevLot => ({
        ...prevLot,
        [name]: 0 // or keep the previous value using prevLot[name]
      }));
    } else {
      // For all other cases, set the value as usual
      setEditedLot(prevLot => ({
        ...prevLot,
        [name]: value
      }));
    }
  };


  const handleSave = async () => {
    try {
      if (!editedLot.add_date || !editedLot.product_lot_qty || !editedLot.product_lot_cost || !editedLot.product_lot_price) {
        message.error('กรุณากรอกข้อมูลให้ครบทุกช่องก่อนบันทึก');
        return; 
      }
      const res = await put(`/product/updatelot/${editedLot?.lot_id}`, editedLot);
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'แก้ไขสินค้าสำเร็จ',
          // text: response.data.message,
      });
        handleGetLot();
        handleClose(); // ปิดกล่องโต้ตอบเมื่อบันทึกข้อมูลสำเร็จ
      } else {
        alert('Failed to save data'); // แสดงเตือนเมื่อเกิดข้อผิดพลาดในการบันทึกข้อมูล
      }
    } catch (error) {
      alert('Error saving data: ' + error); // แสดงเตือนเมื่อเกิดข้อผิดพลาดในการเรียกใช้ API
    }
  };
  
  
  

  if (!lotData) return null; // Guard clause if lotData is not available

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>แก้ไขข้อมูลล็อตสินค้า</DialogTitle>
      <DialogContent>
        {/* TextField components for editing lot details */}
        <input
          type="hidden"
          name="lot_id"
          value={editedLot?.lot_id || ''}
        />

        <TextField
          autoFocus
          margin="dense"
          label="เลขล็อตสินค้า"
          type="text"
          fullWidth
          name="lot_number"
          value={editedLot?.lot_id || ''}
          onChange={handleChange}
        />
        <TextField
          autoFocus
          margin="dense"
          label="วันเพิ่มล็อต"
          type="datetime-local"
          fullWidth
          name="add_date"
          value={editedLot?.add_date || ''}
          onChange={handleChange}
        />
        <TextField
          autoFocus
          margin="dense"
          label="จำนวนสินค้า"
          type="number"
          fullWidth
          name="product_lot_qty"
          value={editedLot?.product_lot_qty || ''}
          onChange={handleChange}
        />
        <TextField
          autoFocus
          margin="dense"
          label="ราคาทุนสินค้าในล็อต"
          type="number"
          fullWidth
          name="product_lot_cost"
          value={editedLot?.product_lot_cost || ''}
          onChange={handleChange}
        />
        <TextField
          autoFocus
          margin="dense"
          label="ราคาขายสินค้าในล็อต"
          type="number"
          fullWidth
          name="product_lot_price"
          value={editedLot?.product_lot_price || ''}
          onChange={handleChange}
        />

        {/* Repeat for other fields */}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          ยกเลิก
        </Button>
        <Button onClick={handleSave} color="primary">
          บันทึก
        </Button>
      </DialogActions>
    </Dialog>
  );
}
