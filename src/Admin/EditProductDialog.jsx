import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Grid
} from '@mui/material';
import axios from 'axios';
import { PRODUCT_TYPE, UNIT, UPDATE_PRODUCT, get, getlotprouduct, ip } from '../Static/api';
import Swal from 'sweetalert2';
import { message } from 'antd';


function EditProductDialog({ open, onClose, product, onUpdate, selectedImageProp, setSelectedImageProp, productId, productTypeId, handleGetProduct, handleCloseDialog }) {
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [batches, setBatches] = useState([]); // Define batches state
  const [updatedProduct, setUpdatedProduct] = useState({
    product_id: '',
    name: '',
    costPrice: '',
    sellingPrice: '',
    quantity: '',
    description: '',
    category: '',
    unit: '',
    image: '',
    thickness: '', // เพิ่ม state สำหรับความหนา
    length: '', // เพิ่ม state สำหรับความยาว
    width: '', // เพิ่ม state สำหรับความกว้าง
    batch: '', // เพิ่ม state สำหรับล็อต
  });
  const [isImageSelected, setIsImageSelected] = useState();
  const [lots, setLots] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUpdatedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };
  const selectedCategory = categories.find(category => category.id === updatedProduct.category);

  // Define handleGetBatches function
  // const handleGetBatches = async () => {
  //   get(getlotprouduct).then(async (res) => {
  //     if (res.success) {
  //       let data = res.result;
  //       const modifiedData = await data.map((item) => {
  //         return {
  //           lot_id: item.product_lot_id,
  //           lot_number: item.lot_number,
  //           add_date: item.add_date,
  //           is_active: item.is_active,
  //           product_lot_qty: item.product_lot_qty,
  //           product_lot_cost: item.product_lot_cost,
  //           product_lot_price: item.product_lot_price
  //         };
  //       });
  //       setBatches(modifiedData);
  //       console.log('Modified data:', modifiedData); // Add this line
  //     }
  //   });
  // };


  useEffect(() => {
    if (open && product) {
      setUpdatedProduct({
        product_id: product.product_id,
        name: product.name,
        costPrice: product.costPrice,
        sellingPrice: product.sellingPrice,
        quantity: product.quantity,
        description: product.description,
        category: productTypeId,
        unit: product.unit,
        image: product.image,
        thickness: product.thickness,
        length: product.length,
        width: product.width,
      });
      console.log('productTypeId:', productTypeId);
      console.log(':', updatedProduct);


    }

    const fetchData = async () => {
      await handleGetCategory();
      await handleGetUnit();

    };

    fetchData();
  }, [open, product]);


  const handleUpdateProduct = async () => {
    if (!productId) {
      alert('Product ID is missing!');
      return;
    }
    const numericId = parseInt(productId);
    console.log('Image upload numericId:', numericId);

    if (
      updatedProduct.name.length === 0 ||
      !updatedProduct.category ||
      !updatedProduct.unit
    ) {
      message.error('กรุณากรอกข้อมูลให้ครบและถูกต้อง');
      return;
    }

    const requestData = {
      product_id: numericId,
      product_name: updatedProduct.name,
      product_detail: updatedProduct.description || 'ไม่มีรายละเอียดเพิ่มเติม',
      product_type_id: updatedProduct.category,
      unit_id: updatedProduct.unit,
      product_thickness: updatedProduct.thickness, // เพิ่มการส่งค่าความหนา
      product_length: updatedProduct.length, // เพิ่มการส่งค่าความยาว
      product_width: updatedProduct.width, // เพิ่มการส่งค่าความกว้าง
    };

    if (isImageSelected) {
      const formData = new FormData();
      formData.append('product_image', isImageSelected);
      formData.append('product_id', numericId);

      const endpoint = UPDATE_PRODUCT;
      const url = `${ip}${endpoint}`;

      const uploadResponse = await axios.put(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Image upload response:', uploadResponse.data);
    }

    const endpoint = UPDATE_PRODUCT;
    const url = `${ip}${endpoint}`;

    const updateResponse = await axios.put(url, requestData);


    setUpdatedProduct({
      product_id: '',
      name: '',
      costPrice: '',
      sellingPrice: '',
      quantity: '',
      description: '',
      category: '',
      unit: '',
      image: null,
      thickness: '', // Reset ค่าความหนา
      length: '', // Reset ค่าความยาว
      width: '', // Reset ค่าความกว้าง
    });

    setIsImageSelected(null);
    Swal.fire({
      icon: 'success',
      title: 'แก้ไขล็อตสินค้าสำเร็จ',
      // text: response.data.message,
    });
    handleGetProduct();
    handleCloseDialog();
  };


  const resizeImage = (imageFile, maxWidth, maxHeight, callback) => {
    const img = new Image();
    img.src = URL.createObjectURL(imageFile);

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(callback, 'image/jpeg', 0.7);
    };
  };

  const handleImageUpload = (event) => {
    const imageFile = event.target.files[0];
    const maxWidth = 800;
    const maxHeight = 800;

    resizeImage(imageFile, maxWidth, maxHeight, (resizedImage) => {
      setSelectedImageProp(null);
      setIsImageSelected(resizedImage);
    });
  };

  const handleGetCategory = () => {
    get(PRODUCT_TYPE).then(async (res) => {
      if (res.success) {
        const data = res.result;
        const modifiedData = data.map(item => ({
          id: item.product_type_id,
          name: item.product_type,
          is_active: item.is_active
        }));
        setCategories(modifiedData);
      }
    });
  };

  const handleGetUnit = () => {
    get(UNIT).then(async (res) => {
      if (res.success) {
        const data = res.result;
        const modifiedData = data.map(item => ({
          id: item.unit_id,
          name: item.unit,
          is_active: item.is_active
        }));
        setUnits(modifiedData);
      }
    });
  };

  const handleDeleteImage = () => {
    setSelectedImageProp(null);
    setIsImageSelected(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>อัพเดทข้อมูลสินค้า</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'relative' }}>
                {isImageSelected ? (
                  <div>
                    <img
                      src={URL.createObjectURL(isImageSelected)}
                      alt="Product_Image"
                      style={{ maxWidth: '100%', maxHeight: '300px' }}
                    />
                  </div>
                ) : (
                  <div>
                    <img
                      src={selectedImageProp}
                      alt="Product_Image"
                      style={{ maxWidth: '100%', maxHeight: '300px' }}
                    />
                  </div>
                )}
                <Button variant="contained" color="secondary" onClick={handleDeleteImage}>
                  ลบรูปภาพ
                </Button>
                <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
                  <input
                    accept="image/*"
                    id="image-upload"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                  <Button variant="contained" color="primary" component="span">
                    เปลี่ยนรูป
                  </Button>
                </label>
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="รหัสสินค้า"
              name="product_id"
              value={productId}
              disabled
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="ชื่อสินค้า"
              name="name"
              value={updatedProduct.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>


          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="ประเภทสินค้า"
              name="category"
              value={updatedProduct.category}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              {categories.map(item => (
                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          {/* Conditionally render additional fields based on the selected category */}
          {(selectedCategory && (selectedCategory.name === 'กระจก' || selectedCategory.name === 'อะลูมิเนียม'||selectedCategory.name === 'กระจก')) ? (
            <>
              <Grid item xs={6}>
                <TextField
                  label="ความหนา"
                  name="thickness"
                  value={updatedProduct.thickness}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="ความยาว "
                  name="length"
                  value={updatedProduct.length}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (parseFloat(value) >= 1 || value === '') {
                      handleChange(e);
                    } else {
                      // Clear the value if it's less than 1
                      handleChange({ target: { name: e.target.name, value: '' } });
                    }
                  }} fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="ความกว้าง"
                  name="width"
                  value={updatedProduct.width}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (parseFloat(value) >= 1 || value === '') {
                      handleChange(e);
                    } else {
                      // Clear the value if it's less than 1
                      handleChange({ target: { name: e.target.name, value: '' } });
                    }
                  }}
                  fullWidth
                />
              </Grid>


            </>
          ) : null}

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="หน่วยสินค้า"
              name="unit"
              value={updatedProduct.unit}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              {units.map(item => (
                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="รายละเอียดสินค้า"
              name="description"
              value={updatedProduct.description}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
              margin="normal"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          ยกเลิก
        </Button>
        <Button onClick={handleUpdateProduct} variant="contained" color="primary">
          บันทึก
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductDialog;
