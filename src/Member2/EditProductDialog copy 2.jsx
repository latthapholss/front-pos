import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  MenuItem,
  Grid
} from '@mui/material';
import axios from 'axios';
import { PRODUCT_TYPE, UNIT, UPDATE_PRODUCT, get, post } from '../Static/api';

const EditProductDialog = ({ open, onClose, product, onUpdate, selectedImageProp, setSelectedImageProp, productId, handleGetProduct, handleCloseDialog, }) => {
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [updatedProduct, setUpdatedProduct] = useState({
    product_id: '', // เพิ่ม product_id ใน state
    name: '',
    costPrice: '',
    sellingPrice: '',
    quantity: '',
    description: '',
    category: '',
    unit: '',
    image: '',
  });
  const [isImageSelected, setIsImageSelected] = useState();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUpdatedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (open && product) { // เช็คว่า open และ product มีค่าให้แสดงข้อมูลสินค้า
      setUpdatedProduct(product); // เรียกใช้ค่า product แทนที่จะเรียกใช้ productToUpdate
    }
    handleGetCategory();
    handleGetUnit();
  }, [open, product]);

  const baseURL = 'http://localhost:4000';

  const handleUpdateProduct = async () => {
    console.log("Updated product_id:", updatedProduct.id);
    if (
      updatedProduct.name.length === 0 ||
      updatedProduct.quantity.length === 0 ||
      updatedProduct.sellingPrice.length === 0 ||
      !updatedProduct.category ||
      !updatedProduct.unit ||
      updatedProduct.costPrice <= 0

    ) {
      alert('กรุณากรอกข้อมูลให้ครบและถูกต้อง');
      return;
    }
    console.log('รูป' + isImageSelected);
    const requestData = {
      product_id: updatedProduct.id,
      product_name: updatedProduct.name,
      product_detail: updatedProduct.description || "ไม่มีรายละเอียดเพิ่มเติม",
      product_cost: updatedProduct.costPrice,
      product_price: updatedProduct.sellingPrice,
      product_qty: updatedProduct.quantity,
      product_type_id: updatedProduct.category,
      unit_id: updatedProduct.unit,


    };




      if (isImageSelected) {
        console.log("มายัง5:", updatedProduct.id);
        
        // สร้าง FormData และเพิ่มข้อมูลรูปภาพและ ID สินค้า
        const formData = new FormData();
        formData.append('product_image', isImageSelected);
        formData.append('product_id', updatedProduct.id);
      
        // อัปโหลดรูปภาพโดยใช้ Axios
        const baseUrl = 'http://localhost:4000/api/v1';
        const endpoint = '/product/update_product';
        const url = `${baseUrl}${endpoint}`;
      
        const uploadResponse = await axios.post(
          url,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      
        console.log('Image upload response:', uploadResponse.data);
      }
      


      console.log("มายัง2", updatedProduct.id);
      console.log("มายัง2", updatedProduct.id);

      const baseUrl = 'http://localhost:4000/api/v1';
      const endpoint = '/product/update_product';
      const url = `${baseUrl}${endpoint}`;

      const updateResponse = await axios.post(url, requestData);

      
      console.log("มายัง2", updatedProduct.id);



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
      });

      setIsImageSelected(null); // Reset the selected image state
      alert(updateResponse.data.message); // Show success message
      handleGetProduct(); // Refresh product data
      handleCloseDialog(); // Close the dialog
    
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
      setIsImageSelected(resizedImage); // ตรวจสอบว่าคุณกำหนดค่า isImageSelected ให้มีค่าหรือไม่

      // ...
    });
  };


  const handleGetCategory = () => {
    get(PRODUCT_TYPE).then(async (res) => {
      if (res.success) {
        let data = res.result
        const modifiedData = await data.map(item => {
          return {
            id: item.product_type_id,
            name: item.product_type,
            is_active: item.is_active
          };
        });
        setCategories(modifiedData);
      }
    })
  }

  const handleGetUnit = () => {
    get(UNIT).then(async (res) => {
      if (res.success) {
        let data = res.result
        const modifiedData = await data.map(item => {
          return {
            id: item.unit_id,
            name: item.unit,
            is_active: item.is_active
          };
        });
        setUnits(modifiedData);
      }
    })
  }
  const handleDeleteImage = () => {
    setSelectedImageProp(null);
    setIsImageSelected(null); // Update the state to indicate no image selected

  };


  console.log("selectedImageProp:", selectedImageProp);

  console.log("updatedProduct:", updatedProduct);

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
                      src={
                        URL.createObjectURL(isImageSelected)
                      }
                      alt="Product_Image"
                      style={{ maxWidth: '100%', maxHeight: '300px' }}
                    />
                  </div>
                ) : (
                  <div>
                    <img src={selectedImageProp} alt="Product_Image" style={{ maxWidth: '100%', maxHeight: '300px' }} />

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
              label="ราคาทุน"
              name="costPrice"
              value={updatedProduct.costPrice}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="ราคาปลีก"
              name="sellingPrice"
              value={updatedProduct.sellingPrice}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="จำนวนสินค้า"
              name="quantity"
              value={updatedProduct.quantity}
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
              {categories.map(item => <MenuItem value={item.id}>{item.name}</MenuItem>)}
              {/* ... */}
            </TextField>
          </Grid>
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
              {units.map(item => <MenuItem value={item.id}>{item.name}</MenuItem>)}
              {/* ... */}
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
}

export default EditProductDialog;