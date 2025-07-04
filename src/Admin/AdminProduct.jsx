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
  MenuItem,
  Pagination,
  CircularProgress,
  Select,


} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import ProductDialog from './ProductDialog';
import ProductTypeDialog from './ProductTypeDialog';
import { ADD_PRODUCT_TYPE, PRODUCT, PRODUCT_TYPE, get, post, FILTERPRODUCT, ACTIVE_PRODUCT, UPDATE_PRODUCT, getImagePath } from '../Static/api';
import axios from 'axios';
import EditProductDialog from './EditProductDialog';
import './sweetalert.css';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';
import Swal from 'sweetalert2';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { getlotprouduct, ip, } from '../Static/api'; // Ensure these functions are correctly imported from your API utilities
import ProductLotManage from '../Lot/ProductLotManage';
import { localStorageKeys } from '../Static/LocalStorage';

function AdminProduct({ person }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openTypeDialog, setOpenTypeDialog] = useState(false);
  const [openUnitDialog, setOpenUnitDialog] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [filterType, setFilterType] = useState('');
  const [editedProduct, setEditedProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedImageProp, setSelectedImageProp] = useState(null);
  const [open, setOpen] = useState(false); // สถานะเพื่อเปิด/ปิด Dialog
  const [lots, setLots] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleOpenDialog = () => {
    setOpen(true);
  };



  const [newLot, setNewLot] = useState({
    lot_number: '',
    expiry_date: '',
    product_lot_qty: '',
    product_lot_cost: '',
    product_lot_price: ''
  });
  const handleAddLot = async () => {
    // Validate newLot data before sending the request
    if (!newLot.lot_number) {
      alert('กรุณากรอกเลขล็อตสินค้า');
    } else if (!newLot.add_date) {
      alert('กรุณากรอกวันหมดอายุล็อต');
    } else if (!newLot.product_lot_qty) {
      alert('กรุณากรอกจำนวนสินค้าในล็อต');
    } else if (!newLot.product_lot_cost) {
      alert('กรุณากรอกราคาทุนสินค้าในล็อต');
    } else if (!newLot.product_lot_price) {
      alert('กรุณากรอกราคาขายสินค้าในล็อต');
    } else {
      try {
        const requestData = {
          lot_number: newLot.lot_number,
          add_date: newLot.add_date,
          product_lot_qty: newLot.product_lot_qty,
          product_lot_cost: newLot.product_lot_cost,
          product_lot_price: newLot.product_lot_price
        };

        const response = await axios.post(
          `${ip}/product/addlotprouduct`,
          requestData,
          {
            headers: {
              'Content-Type': 'application/json', // Set the content type to JSON
            },
          }
        );

        if (response.data.success) {
          setNewLot({
            lot_number: '',
            add_date: '',
            product_lot_qty: '',
            product_lot_cost: '',
            product_lot_price: ''
          });
          handleCloseDialog();
          handleGetLot();
          alert(response.data.message);
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการส่งข้อมูล');
      }
    }
  };
  const handleGetLot = () => {
    get(getlotprouduct).then(async (res) => {
      if (res.success) {
        let data = res.result;
        const modifiedData = await data.map((item) => {
          return {
            lot_id: item.product_lot_id,
            lot_number: item.lot_number,
            add_date: item.add_date,
            is_active: item.is_active,
            product_lot_qty: item.product_lot_qty,
            product_lot_cost: item.product_lot_cost,
            product_lot_price: item.product_lot_price
          };
        });
        setLots(modifiedData);
        console.log('Modified data:', modifiedData); // Add this line
      }
    });
  };


  if (person && person.user_type === 0) {
    // Admin user
  } else if (person && person.user_type === 1) {
    // Employee user
  } else if (person && person.user_type === 2) {
    // Member user
  }

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };
  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1); // Reset to the first page when changing items per page
  };
  const totalProducts = filteredProducts.length; // จำนวนสินค้าทั้งหมด

  const totalPageCount = Math.ceil(totalProducts / itemsPerPage);


  const [updatedProduct, setUpdatedProduct] = useState({

    category: '',

  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setUpdatedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };
  console.log("updatedProduct:", updatedProduct);



  const [filterProductType, setFilterProductType] = useState('');





  // const filterProductsByStatus = (statusFilter, filteredProducts) => {
  //   if (statusFilter === 'all') {
  //     return filteredProducts; // ไม่กรองเลย
  //   }
  //   if (statusFilter === '') {
  //     return filteredProducts.filter(product => product.is_active === 1 && product.quantity > 0); // กรองสินค้าที่ถูกลบ
  //   }
  //   if (statusFilter === 'delete') {
  //     return filteredProducts.filter(product => product.is_active === 0 && product.quantity > 0); // กรองสินค้าที่ถูกลบ
  //   }

  //   if (statusFilter === 'almost') {
  //     return filteredProducts.filter(product => product.is_active > 0 && product.quantity > 0 && product.quantity <= 100); // กรองสินค้าใกล้หมด
  //   }

  //   if (statusFilter === 'oos') {
  //     return filteredProducts.filter(product => product.quantity === 0 && product.is_active === 0 || product.quantity === 0); // กรองสินค้าหมด

  //   }

  //   return filteredProducts;
  // };





  const [isProductLotManageOpen, setIsProductLotManageOpen] = useState(false);



  const handleOpenProductLotManage = (productId) => {
    setSelectedProductId(productId);
    navigate('/admin/Lot/ProductLotManage'); // Navigate to the desired page without appending the productId
  };








  const navigate = useNavigate();

  const handleNavigateToLotPage = (productId) => {
    navigate('/admin/Lot/ProductLotManage', { state: { productId: productId } });
    console.log('Navigated to Product Lot Management page with product ID:', productId);
  };


















  useEffect(() => {
    handleGetCategories();
    handleGetProduct();
  }, []);


  const handleAddProduct = () => {
    setOpenProductDialog(true); // เปิด ProductDialog สำหรับการเพิ่มสินค้า
  };
  //บันทึกสินค้า
  const handleSaveProduct = async (newProduct) => {
    try {
      // เพิ่มสินค้าใหม่ลงในรายการสินค้าทั้งหมด
      setProducts((prevProducts) => [...prevProducts, newProduct]);

      // ปิดหน้าต่างสำหรับการเพิ่มสินค้า
      setOpenProductDialog(false);

      // รีเซ็ตคำค้นหาใหม่เป็นค่าว่าง
      setSearchQuery('');

      // ดึงข้อมูลสินค้าใหม่เพื่ออัปเดตรายการสินค้า
      handleGetProduct();


    } catch (error) {
      console.error('Error saving product:', error);
    }
  };



  // Function to handle closing the ProductLotManage component
  const handleCloseProductLotManage = () => {
    setSelectedProductId(null);
  };






  const handleDeleteProduct = async (id, itemsetId) => {
    try {
        const numericId = parseInt(id);

        const response = await post({ product_id: numericId, is_active: 0 }, ACTIVE_PRODUCT);
        console.log('API Response:', response);
        console.log('Payload:', { product_id: numericId, is_active: 0 });

        // Logging itemsetId before making deletion request
        console.log('Item set ID:', itemsetId);

        const responseitemset = await post({ product_id: numericId }, `/itemset/delete/${itemsetId}`);
        console.log('Response for deleting item set:', responseitemset);

        if (response.success) {
            // Display success message using SweetAlert
            Swal.fire({
                icon: 'success',
                title: 'ลบสินค้า!',
                text: 'ลบสินค้าเสร็จสิ้น.',
            }).then((result) => {
                // Reload products using handleGetProduct
                if (result.isConfirmed || result.isDismissed) {
                    handleGetProduct();
                }
            });
        } else {
            // Handle unsuccessful deletion
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to delete the product. Please try again later.',
            });
        }
    } catch (error) {
        console.error(error);
    }
};






  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    // Assuming filteredProducts is the original list of products
    return filteredProducts.slice(startIndex, endIndex);
  };


  /* ----------------------------- */
  const handleProductChange = (field, value) => {
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      [field]: value,
    }));
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setOpenEditDialog(true); // เปิด EditProductDialog
  };


  const handleUpdateProduct = async () => {
    try {
      // ส่งข้อมูลสินค้าที่อัปเดตไปยังเซิร์ฟเวอร์โดยใช้ฟังก์ชัน 'post'
      const res = await post(editedProduct, UPDATE_PRODUCT);

      if (res.success) {
        console.log('อัปเดตสินค้าเรียบร้อยแล้ว:', editedProduct.id);
        // อัปเดตสถานะและตัวอย่างผู้ใช้ตามความเหมาะสมเมื่อมีการอัปเดตสินค้าเสร็จสิ้น
        setProducts((prevProducts) =>
          prevProducts.map((product) => (product.id === editedProduct.id ? editedProduct : product))
        );
        setFilteredProducts((prevProducts) =>
          prevProducts.map((product) => (product.id === editedProduct.id ? editedProduct : product))
        );
        handleCloseDialog();
      } else {
        console.error('เกิดข้อผิดพลาดในการอัปเดตสินค้า:', res.message);
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการอัปเดตสินค้า:', error);
    }
  };




  //กรองประเภทสินค้ายังใช้งานไม่ได้

  const handleCloseDialog = () => {
    setSelectedProduct(null);
    setOpenProductDialog(false); // Close ProductDialog
    setOpenEditDialog(false); // Close EditProductDialog
    setOpen(false);

  };




  //ค้นหาตามตัวแรก
  const handleSearch = (event) => {
    const searchValue = event.target.value;
    const filteredProducts = products.filter((product) => {
      return (
        product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        product.description.toLowerCase().includes(searchValue.toLowerCase())
      );
    });
    setFilteredProducts(filteredProducts);
    setSearchQuery(searchValue);
  };

  //กรองสถานะใช้งานไม่ได้


  const handleFilterCategory = (event) => {
    const selectedCategoryId = event.target.value;
    console.log(selectedCategoryId);
    setFilterCategory(selectedCategoryId);

    if (selectedCategoryId === "") {
      setFilteredProducts(products);
    } else {
      const filteredByCategory = products.filter(product => product.category === selectedCategoryId);
      console.log(filteredByCategory);
      setFilteredProducts(filteredByCategory); // อัปเดตรายการสินค้าที่แสดงผล

    }
  };





  //get data สินค้า
  const handleGetProduct = async (status = '', category = '') => {
    try {
      const res = await get(PRODUCT, { status, category });
      if (res.success) {
        const data = res.result;
        const modifiedData = data.map((item) => ({
          id: item.product_id,
          name: item.product_name,
          quantity: item.total_quantity,
          description: item.product_detail,
          category: item.product_type,
          unit: item.unit_id,
          image: getImagePath(item.product_image),
          is_active: item.is_active,
          product_type_id: item.product_type_id,
          itemset_id:item.itemset_id
        }));

        setProducts(modifiedData);
        setFilteredProducts(modifiedData);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };







  useEffect(() => {
    handleGetCategories();
  }, []);
  const handleGetCategories = async () => {
    try {
      const res = await get(PRODUCT_TYPE);
      if (res.success) {
        console.log('Categories response:', res.result);
        setCategories(res.result);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };









  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          variant="h4"
          align="left"

          sx={{
            color: '#333335',
            marginTop: '20px',
            fontSize: '24px', // Add this line for the border // Add some padding for space around the text
            marginLeft: '20px',
            height: '50px',
            borderRadius: 2,
            textAlign: 'center'
          }}
        >
          จัดการสินค้า

        </Typography>
        <Button sx={{ backgroundColor: '#28bc94', marginRight: '20px' }}
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddProduct}
        >
          เพิ่มสินค้า
        </Button>
      </Box>
      <Box sx={{ margin: '15px', backgroundColor: 'white', borderRadius: 3, padding: '20px' }}>
        <Box sx={{ marginLeft: '' }}>

          <Box component="main" >
            <Container maxWidth="xl">
              <Grid container justifyContent="space-between" alignItems="center" >
                <Typography
                  variant="h4"
                  align="left"
                  gutterBottom
                  fullWidth
                  sx={{
                    fontSize: '20px',
                    borderBottom: '2px solid #009ae1',
                    paddingBottom: '5px',
                    color: '#333335',
                    fontWeight: 'bold'
                  }}
                >
                  รายการสินค้า

                </Typography>
              </Grid>

              <Grid container spacing={2} mb={4} sx={{ mt: '10px' }}>
                <Grid item xs={12} sm={6} md={4}>

                  <TextField
                    select
                    value={filterCategory}
                    onChange={handleFilterCategory}
                    label="กรองตามประเภทสินค้า"
                    fullWidth
                    sx={{ backgroundColor: 'white' }}
                  >
                    <MenuItem value="">ทั้งหมด</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.product_type} value={category.product_type}>
                        {category.product_type}
                      </MenuItem>
                    ))}
                  </TextField>

                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    value={searchQuery}
                    onChange={handleSearch}
                    label="ค้นหาสินค้า"
                    fullWidth
                    sx={{ backgroundColor: 'white' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    select
                    value={filterType}
                    onChange={(event) => {
                      setFilterType(event.target.value);
                      setStatusFilter(event.target.value); // This sets statusFilter to the selected value
                    }}
                    label="กรองสถานะสินค้า"
                    fullWidth
                    sx={{ backgroundColor: 'white' }}
                  >
                    <MenuItem value="">สินค้าพร้อมใข้งาน</MenuItem>
                    <MenuItem value="almost">ใกล้หมด</MenuItem>
                    <MenuItem value="delete">สินค้าที่ลบ</MenuItem>
                    <MenuItem value="oos">หมด</MenuItem>
                  </TextField>

                </Grid>

                {/* Add the rest of your components here */}
              </Grid>

              <Paper elevation={3} sx={{ width: '100%', borderRadius: 2, overflow: 'hidden', marginBottom: 4 }}>


                <Table sx={{ borderRadius: 5 }}>
                  <TableHead style={{
                    backgroundColor: "#009ae1", color: 'white'
                  }}>
                    <TableRow>
                      <TableCell style={{ color: 'white' }}>NO.</TableCell>
                      <TableCell style={{ color: 'white' }}>รหัสสินค้า</TableCell>
                      <TableCell style={{ color: 'white' }}>ชื่อสินค้า</TableCell>
                      <TableCell style={{ color: 'white' }}>จำนวน</TableCell>
                      <TableCell style={{ color: 'white' }}>รายละเอียดสินค้า</TableCell>
                      <TableCell style={{ color: 'white' }}>หมวดหมู่</TableCell>
                      <TableCell style={{ color: 'white' }}>รูปภาพ</TableCell>
                      <TableCell style={{ color: 'white', paddingLeft: '40px' }}>จัดการล็อตสินค้า</TableCell>
                      <TableCell style={{ color: 'white' }}>แก้ไข</TableCell>
                      <TableCell style={{ color: 'white' }}>ลบ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getCurrentPageItems().map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{`PID${String(product.id).padStart(6, '0')}`}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>{product.description}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px' }} />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            sx={{ backgroundColor: '#009ae1', height: '39px' }}
                            onClick={() => handleNavigateToLotPage(product.id)}
                            startIcon={<EditIcon />}
                            disabled={product.itemset_id > 0} // เพิ่มการปิดใช้งานโดยตรงโดยใช้ disabled

                          >
                            จัดการล็อต
                          </Button>
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEditProduct(product)}>
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell>
                        <IconButton onClick={() => handleDeleteProduct(product.id, product.itemset_id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>

                </Table>

                <TableBody sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <TableRow>
                    <TableCell colSpan={13}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ marginRight: 2 }}>
                          จำนวนหน้า:
                        </Typography>
                        <Select
                          value={itemsPerPage}
                          onChange={handleItemsPerPageChange}
                          variant="outlined"
                          sx={{ marginRight: 2 }}
                        >
                          <MenuItem value={8}>8 แถว</MenuItem>
                          <MenuItem value={16}>16 แถว</MenuItem>
                          {/* Add more options as needed */}
                        </Select>
                        <Typography variant="caption" sx={{ marginRight: 2 }}>
                          {`${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                            currentPage * itemsPerPage,
                            totalProducts
                          )} of ${totalProducts}`}
                        </Typography>


                        <Pagination
                          count={totalPageCount}
                          page={currentPage}
                          onChange={handlePageChange}
                          color="primary"
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Paper>



              <ProductDialog
                open={openProductDialog}
                onClose={handleCloseDialog}
                onSave={handleSaveProduct}
                handleGetProduct={handleGetProduct} // Add this prop
              />

              {selectedProduct && selectedProduct.image && (
                <EditProductDialog
                  open={openEditDialog}
                  onClose={handleCloseDialog}
                  product={selectedProduct}
                  onUpdate={handleUpdateProduct}
                  selectedImageProp={selectedProduct.image}
                  setSelectedImageProp={setSelectedImageProp}
                  productId={selectedProduct.id}
                  productTypeId={selectedProduct.product_type_id} // เพิ่ม product_type_id ที่นี่
                  handleGetProduct={handleGetProduct} // Pass handleGetProduct as a prop
                  handleCloseDialog={handleCloseDialog} // Pass handleCloseDialog as a prop
                />

              )}


            </Container>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default AdminProduct;