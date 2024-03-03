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
import { PRODUCT_TYPE, UNIT, get } from '../Static/api';

const EditProductDialog = ({ open, PRODUCT, onClose, product, onUpdate, selectedImageProp, setSelectedImageProp }) => {
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editedProduct, setEditedProduct] = useState({ /* Initial state here */ });
  const [isImageSelected, setIsImageSelected] = useState();
  const [selectedImage, setSelectedImage] = useState(null);

  const [updatedProduct, setUpdatedProduct] = useState({
    id: '',
    name: '',
    costPrice: '',
    sellingPrice: '',
    quantity: '',
    description: '',
    category: '',
    unit: '',
  });
  const handleGetProducts = async (status = '',) => {
    try {
      const res = await get(PRODUCT, { status });
      console.log(res); // แสดงผลข้อมูลที่ได้รับจาก API ในคอนโซล
      if (res.success) {
        const data = res.result;
        const modifiedData = data.map((item) => ({
          id: item.product_id,
          name: item.product_name,
          price: item.product_price,
          image: `http://localhost:4000/${item.product_image}`, // สร้าง URL รูปภาพโดยใช้ URL ของ backend
          category: item.product_type,
          unit: item.unit,
          is_active: item.is_active, // เพิ่ม property is_active

        }));
        setProducts(modifiedData);
        setFilteredProducts(modifiedData);

      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (open && product) { // เช็คว่า open และ product มีค่าให้แสดงข้อมูลสินค้า
      setUpdatedProduct(product); // เรียกใช้ค่า product แทนที่จะเรียกใช้ productToUpdate
    }
    handleGetCategory();
    handleGetUnit();
  }, [open, product]);

  useEffect(() => {
    setSelectedImage();
  },);

  const handleUpdateProduct = async () => {

  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUpdatedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
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
      setSelectedImage(resizedImage);

      // setSelectedImageProp((resizedImage)); // Update selectedImageProp with resized image URL
      setIsImageSelected(resizedImage); // Update the state to indicate image selection

      // Update the image URL in the updatedProduct object
      setUpdatedProduct((prevProduct) => ({
        ...prevProduct,
        image: URL.createObjectURL(resizedImage),
      }));
    });
  };




  // ... (rest of the component)






























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
    setSelectedImage(null)
    setIsImageSelected(false); // Update the state to indicate no image selected
    setUpdatedProduct((prevProduct) => ({
      ...prevProduct,
      image: null, // Reset the image URL in the product data
    }));
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
