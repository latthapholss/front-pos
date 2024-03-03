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
import { ADD_PRODUCT, PRODUCT_TYPE, UNIT, get, post } from '../Static/api';

function ProductDialog({ open, onClose, onSave }) {
    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([]);
    
    const [newProduct, setNewProduct] = useState({
        id: '',
        name: '',
        costPrice: '',
        sellingPrice: '',
        quantity: '',
        description: '',
        category: '',
        unit:'',
        image: null,
    });

    useEffect(() => {
        handleGetCategory();
        handleGetUnit();
      
        
      }, [])
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


    const handleSaveProduct = async () => {
        console.log("newProduct:",newProduct)
        if(newProduct.name.length > 0){
            if(newProduct.quantity.length >0){
                if(newProduct.sellingPrice.length >0 ){
                    if(newProduct.category){
                        if(newProduct.unit){
                            if(newProduct.costPrice >0 ){
                                let req = { 
                                    product_name: newProduct.name,
                                    product_detail : newProduct.description ? newProduct.description : "ไม่มีรายละเอียดเพิ่มเติม",
                                    product_cost : newProduct.costPrice,
                                    product_price: newProduct.sellingPrice,
                                    product_qty: newProduct.quantity,
                                    product_type_id : newProduct.category,
                                    unit_id: newProduct.unit
                                  }
                                  console.log("newProduct (REQ):",req)
                                  await post(req, ADD_PRODUCT).then(async (res) => {
                                    if (res.success) {
                                        setNewProduct({
                                            id: '',
                                            name: '',
                                            costPrice: '',
                                            sellingPrice: '',
                                            quantity: '',
                                            description: '',
                                            category: '',
                                            unit:'',
                                            image: null,
                                        });
                                        onClose()
                                        alert(res.message)
                                    } else {
                                        alert(res.message)
                                    }
                                })
                            }else{
                                alert("กรอกข้อมูลก่อน costPrice") 
                            }
                        }else{
                            alert("กรอกข้อมูลก่อน unit")
                        }
                    }else{
                        alert("กรอกข้อมูลก่อน category")
                    }
                }else{
                    alert("กรอกข้อมูลก่อน sellingPrice")
                }

            }else{
                alert("กรอกข้อมูลก่อน quantity")
        }
          }else{
            alert("กรอกข้อมูลก่อน name")
          }
      
        // onSave(newProduct);
        // setNewProduct((prevProduct) => ({
        //     ...prevProduct,
        //     id: generateNextProductId(prevProduct.id),
        //     name: '',
        //     costPrice: '',
        //     sellingPrice: '',
        //     quantity: '',
        //     description: '',
        //     category: '',
        //     image: null,
        // }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value,
        }));
    };

  

    const handleImageUpload = (event) => {
        const imageFile = event.target.files[0];
        setNewProduct((prevProduct) => ({
          ...prevProduct,
          image: imageFile,
        }));
      
        handleSaveProduct(imageFile); // Call handleSaveProduct with the image file
      };


    const generateNextProductId = (currentId) => {
        const numericId = Number(currentId.substring(1)); // Extract the numeric part of the current ID
        const nextNumericId = numericId + 1; // Increment the numeric ID
        const paddedNextNumericId = String(nextNumericId).padStart(4, '0'); // Pad the numeric ID with leading zeros
        return `P${paddedNextNumericId}`; // Return the formatted next ID
    };

    const handleGetCategory = () =>{
        get( PRODUCT_TYPE).then(async (res) => {
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
    
      const handleGetUnit =() =>{
        get( UNIT).then(async (res) => {
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
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>เพิ่มสินค้าใหม่</DialogTitle>
            <DialogContent>
                <DialogContentText>กรุณากรอกข้อมูลสินค้าใหม่</DialogContentText>
                <Box mt={2} display="flex" justifyContent="center" mb={2}>
                  {/* Product Image */}
          {newProduct.image ? (
            <img
              src={URL.createObjectURL(newProduct.image)}
              alt="Product Image"
              style={{ maxWidth: '100%', maxHeight: '300px' }}
            />
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
                  เลือกรูปภาพ
                </Button>
              </label>
            </Box>
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
                    <Grid item xs={6}>
                        <TextField
                            label="จำนวนสินค้า"
                            name="quantity"
                            value={newProduct.quantity}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                   
                    {/* Selling Price */}
                    <Grid item xs={6}>
                        <TextField
                            label="ราคาปลีก"
                            name="sellingPrice"
                            value={newProduct.sellingPrice}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
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
                            {categories.map(item =>  <MenuItem value={item.id}>{item.name}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            select
                            label="หน่วยสินค้า"
                            name="unit"
                            value={newProduct.unit}
                            onChange={handleChange}
                            fullWidth
                        >
                            {units.map(item =>  <MenuItem value={item.id}>{item.name}</MenuItem>)}
                        </TextField>
                    </Grid>
                    {/* Cost Price */}
                    <Grid item xs={6}>
                        <TextField
                            label="ราคาทุน"
                            name="costPrice"
                            value={newProduct.costPrice}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
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
