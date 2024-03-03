import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Box,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { Grid } from '@mui/material';
import { PRODUCT_TYPE, UNIT, UPDATE_PRODUCT, get, post } from '../Static/api';

function EditProductDialog({ open, onClose, product = {}, onUpdate }) {
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [editedProduct, setEditedProduct] = useState(product);

  useEffect(() => {
    handleGetCategory();
    handleGetUnit();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleGetCategory = () => {
    get(PRODUCT_TYPE).then(async (res) => {
      if (res.success) {
        let data = res.result;
        const modifiedData = await data.map((item) => {
          return {
            id: item.product_type_id,
            name: item.product_type,
            is_active: item.is_active,
          };
        });
        setCategories(modifiedData);
      }
    });
  };

  const handleGetUnit = () => {
    get(UNIT).then(async (res) => {
      if (res.success) {
        let data = res.result;
        const modifiedData = await data.map((item) => {
          return {
            id: item.unit_id,
            name: item.unit,
            is_active: item.is_active,
          };
        });
        setUnits(modifiedData);
      }
    });
  };

  const handleSave = async () => {
    try {
      if (editedProduct.product_id && editedProduct.product_id.trim() !== '') {
        // ตรวจสอบว่า editedProduct มี product_id ที่มีค่าไม่ใช่สตริงว่างหรือไม่
  
        // ลบ product_id ออกจาก object ก่อนส่งไปยัง API
        const { product_id, ...productData } = editedProduct;
  
        // Use the 'post' function to send the update request
        const res = await post(productData, UPDATE_PRODUCT);
  
        if (res.success) {
          // Call the onUpdate function with the updated product data
          onUpdate(editedProduct);
          onClose();
        } else {
          console.error('Failed to update product:', res.message);
        }
      } else {
        console.error('Product ID is missing or invalid!');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };
  
  
  


  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>แก้ไขสินค้า</DialogTitle>
      <DialogContent>
        <DialogContentText>กรุณาแก้ไขข้อมูลสินค้า</DialogContentText>
        <Grid container spacing={2}>
        <Grid item xs={6}>
            <TextField
              label="รหัสสินค้า"
              name="name"
              value={editedProduct.id}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="ชื่อสินค้า"
              name="name"
              value={editedProduct.name}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="จำนวนสินค้า"
              name="quantity"
              value={editedProduct.quantity}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="ราคาปลีก"
              name="sellingPrice"
              value={editedProduct.sellingPrice}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              label="ประเภทสินค้า"
              name="category"
              value={editedProduct.category}
              onChange={handleChange}
              fullWidth
            >
              {categories.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              label="หน่วยสินค้า"
              name="unit"
              value={editedProduct.unit}
              onChange={handleChange}
              fullWidth
            >
              {units.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="ราคาทุน"
              name="costPrice"
              value={editedProduct.costPrice}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Box mt={2}>
              <TextField
                label="รายละเอียดสินค้า"
                name="description"
                value={editedProduct.description}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
              />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>ยกเลิก</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          บันทึก
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditProductDialog;
