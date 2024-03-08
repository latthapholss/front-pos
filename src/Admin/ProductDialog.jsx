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
import { ADD_PRODUCT, PRODUCT_TYPE, UNIT, get, ip, post, getlotprouduct } from '../Static/api';
import axios from 'axios';
import Swal from 'sweetalert2';
import { message } from 'antd';

const ProductDialog = ({ open, person, onClose, onSave, handleGetProduct }) => {
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [image, setImage] = useState('')
  const [newProduct, setNewProduct] = useState({
    id: '',
    name: '',
    costPrice: '',
    sellingPrice: '',
    quantity: '',
    description: '',
    category: '',
    unit: '',
    image: '',
    length: null,
    width: null,
    lots: ''
  });
  if (person && person.user_type === 0) {
    // Admin user
  } else if (person && person.user_type === 1) {
    // Employee user
  } else if (person && person.user_type === 2) {
    // Member user
  }
  useEffect(() => {
    handleGetCategory();
    handleGetUnit();


  }, [])
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const selectedCategory = categories.find(category => category.id === newProduct.category);

  // const handleSaveProduct = async () => {
  //     console.log("newProduct:",newProduct)
  //     if(newProduct.name.length > 0){
  //         if(newProduct.quantity.length >0){
  //             if(newProduct.sellingPrice.length >0 ){
  //                 if(newProduct.category){
  //                     if(newProduct.unit){
  //                         if(newProduct.costPrice >0 ){
  //                             let req = { 
  //                                 product_name: newProduct.name,
  //                                 product_detail : newProduct.description ? newProduct.description : "ไม่มีรายละเอียดเพิ่มเติม",
  //                                 product_cost : newProduct.costPrice,
  //                                 product_price: newProduct.sellingPrice,
  //                                 product_qty: newProduct.quantity,
  //                                 product_type_id : newProduct.category,
  //                                 unit_id: newProduct.unit
  //                               }
  //                               console.log("newProduct (REQ):",req)
  //                               await post(req, ADD_PRODUCT).then(async (res) => {
  //                                 if (res.success) {
  //                                     setNewProduct({
  //                                         id: '',
  //                                         name: '',
  //                                         costPrice: '',
  //                                         sellingPrice: '',
  //                                         quantity: '',
  //                                         description: '',
  //                                         category: '',
  //                                         unit:'',
  //                                         image: null,
  //                                     });
  //                                     onClose()
  //                                     alert(res.message)
  //                                 } else {
  //                                     alert(res.message)
  //                                 }
  //                             })
  //                         }else{
  //                             alert("กรอกข้อมูลก่อน costPrice") 
  //                         }
  //                     }else{
  //                         alert("กรอกข้อมูลก่อน unit")
  //                     }
  //                 }else{
  //                     alert("กรอกข้อมูลก่อน category")
  //                 }
  //             }else{
  //                 alert("กรอกข้อมูลก่อน sellingPrice")
  //             }

  //         }else{
  //             alert("กรอกข้อมูลก่อน quantity")
  //     }
  //       }else{
  //         alert("กรอกข้อมูลก่อน name")
  //       }

  //     // onSave(newProduct);
  //     // setNewProduct((prevProduct) => ({
  //     //     ...prevProduct,
  //     //     id: generateNextProductId(prevProduct.id),
  //     //     name: '',
  //     //     costPrice: '',
  //     //     sellingPrice: '',
  //     //     quantity: '',
  //     //     description: '',
  //     //     category: '',
  //     //     image: null,
  //     // }));
  // };
  const handleChange = (event) => {
    const { name, value } = event.target;




    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };
  console.log('Selected Category:', newProduct.category);



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




  const handleSaveProduct = async () => {
    if (newProduct.name.length > 0) {
      if (newProduct.category) {
        if (newProduct.unit) {
          try {
            const formData = new FormData();
            formData.append('product_name', newProduct.name);
            formData.append(
              'product_detail',
              newProduct.description ? newProduct.description : 'ไม่มีรายละเอียดเพิ่มเติม'
            );
            formData.append('product_type_id', newProduct.category);
            formData.append('unit_id', newProduct.unit);
            formData.append('product_image', selectedImage);
            formData.append('product_thickness', newProduct.thickness);
            formData.append('product_length', newProduct.length);
            formData.append('product_width', newProduct.width);
            formData.append('product_lot_id', newProduct.lots);
  
            console.log(newProduct.length)
            console.log(newProduct.width)
  
            const response = await axios.post(
              `${ip}/product/add_product`,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              }
            );
  
            if (response.data.success) {
              setNewProduct({
                id: '',
                name: '',
                costPrice: '',
                sellingPrice: '',
                quantity: '',
                description: '',
                category: '',
                unit: '',
                image: null,
                length: null,
                width: null,
                lots: ''
              });
              setSelectedImage(null);
              onClose();
              handleGetProduct();
  
              message.success('เพิ่มสินค้าสำเร็จ');
            } else {
              message.error(response.data.message);
            }
          } catch (error) {
            console.error('Error:', error);
            message.error('เกิดข้อผิดพลาดในการส่งข้อมูล');
          }
        } else {
          message.error('กรอกข้อมูลไม่ครบถ้วน: กรุณาระบุหน่วยสินค้า');
        }
      } else {
        message.error('กรอกข้อมูลไม่ครบถ้วน: กรุณาเลือกประเภทสินค้า');
      }
    } else {
      message.error('กรอกข้อมูลไม่ครบถ้วน: กรุณาระบุชื่อสินค้า');
    }
  };





  const handleImageUpload = (event) => {
    const imageFile = event.target.files[0];

    setSelectedImage(imageFile);

  };




  const generateNextProductId = (currentId) => {
    const numericId = Number(currentId.substring(1));
    const nextNumericId = numericId + 1;
    const paddedNextNumericId = String(nextNumericId).padStart(4, '0');
    return `P${paddedNextNumericId}`;
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
  console.log(selectedCategory ? selectedCategory.name : 'Category not found');

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
  const [lots, setLots] = useState([]);

  const handleGetLot = () => {
    get(getlotprouduct).then(async (res) => {
      if (res.success) {
        let data = res.result;
        const modifiedData = await data.map((item) => {
          return {
            product_lot_id: item.product_lot_id,
            lot_number: item.lot_number,
            is_active: item.is_active,
          };
        });
        setLots(modifiedData);
      }
    });
  };
  useEffect(() => {
    // Your side-effect logic here.
    handleGetLot();
    // Optional cleanup mechanism
    return () => {
      // Cleanup code, if needed
    };
  }, [/* dependencies */]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>เพิ่มสินค้าใหม่</DialogTitle>
      <DialogContent>
        <DialogContentText>กรุณากรอกข้อมูลสินค้าใหม่</DialogContentText>
        <Box mt={2} display="flex" flexDirection="column" alignItems="center" mb={2}>
          {/* Product Image */}
          <div>
            {selectedImage ? (
              <div>
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Product Image"
                  style={{ maxWidth: '100%', maxHeight: '300px' }}
                />
              </div>
            ) : (
              <Box
                width="300px"
                height="300px"
                border="1px dashed gray"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
                  <input
                    accept="image/*"
                    id="image-upload"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                  <Button variant="contained" color="primary" component="span">
                    {image ? 'เปลี่ยนรูปภาพ' : 'เลือกรูปภาพ'}
                  </Button>
                </label>
              </Box>
            )}
          </div>
          {/* Delete Image Button */}
          {selectedImage && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setSelectedImage(null)}
              style={{ marginTop: '8px' }}
            >
              ลบรูปภาพ
            </Button>

          )}
        </Box>
        <Grid container spacing={2}>

          {/* Product Name */}
          <Grid item xs={6}>
            <TextField
              label="ชื่อสินค้า"
              name="name"
              value={newProduct.name}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          {/* Product Quantity */}
          {/* <Grid item xs={6}>
            <TextField
              label="จำนวนสินค้า"
              name="quantity"
              value={newProduct.quantity}
              onChange={handleChange}
              fullWidth
            />
          </Grid> */}

          {/* Selling Price */}
          {/* <Grid item xs={6}>
            <TextField
              label="ราคาปลีก"
              name="sellingPrice"
              value={newProduct.sellingPrice}
              onChange={handleChange}
              fullWidth
            />
          </Grid> */}
          {/* Category */}
          <Grid item xs={6}>
            <TextField
              select
              label="ประเภทสินค้า"
              name="category"
              value={newProduct.category}
              onChange={handleChange}
              fullWidth
            >
              {categories.map(item => <MenuItem value={item.id}>{item.name}</MenuItem>)}
            </TextField>
          </Grid>

          {(selectedCategory && (selectedCategory.name === 'กระจก' || selectedCategory.name === 'อลูมิเนียม')) ? (
            <>
              <Grid item xs={6}>
                <TextField
                  label="ความหนา"
                  name="thickness"
                  value={newProduct.thickness}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="ความยาว "
                  name="length"
                  value={newProduct.length}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (parseFloat(value) >= 1 || value === '') {
                      handleChange(e);
                    } else {
                      // Clear the value if it's less than 1
                      handleChange({ target: { name: e.target.name, value: '' } });
                      alert('ค่าต้องมากกว่าหรือเท่ากับ 1');
                    }
                  }} fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="ความกว้าง"
                  name="width"
                  value={newProduct.width}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (parseFloat(value) >= 1 || value === '') {
                      handleChange(e);
                    } else {
                      // Clear the value if it's less than 1
                      handleChange({ target: { name: e.target.name, value: '' } });
                      alert('ค่าต้องมากกว่าหรือเท่ากับ 1');
                    }
                  }}
                  fullWidth
                />
              </Grid>


            </>
          ) : null}

          <Grid item xs={6}>
            <TextField
              select
              label="หน่วยสินค้า"
              name="unit"
              value={newProduct.unit}
              onChange={handleChange}
              fullWidth
            >
              {units.map(item => <MenuItem value={item.id}>{item.name}</MenuItem>)}
            </TextField>
          </Grid>
          {/* Cost Price */}
          {/* <Grid item xs={6}>
            <TextField
              label="ราคาทุน"
              name="costPrice"
              value={newProduct.costPrice}
              onChange={handleChange}
              fullWidth
            />
          </Grid> */}
          {/* Product Description */}
          <Grid item xs={12}>
            <Box mt={2}>
              <TextField
                label="รายละเอียดสินค้า"
                name="description"
                value={newProduct.description}
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
        <Button onClick={handleSaveProduct} variant="contained" color="primary">
          บันทึก
        </Button>
      </DialogActions>
    </Dialog>

  );
}

export default ProductDialog
