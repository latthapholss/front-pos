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
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import SidebarAdmin from '../Component/Sidebar-Employee';
import Navbaradmin from './navbaradmin';
import ProductDialog from '../Admin/ProductDialog';
import ProductTypeDialog from '../Admin/ProductTypeDialog';
import { ADD_PRODUCT_TYPE, PRODUCT, PRODUCT_TYPE, get, post, FILTERPRODUCT, ACTIVE_PRODUCT, UPDATE_PRODUCT } from '../Static/api';
import axios from 'axios';
import EditProductDialog from './EditProductDialog';

function AdminProduct() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
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

  useEffect(() => {
    handleGetProduct();
  }, []);

  const handleAddProduct = () => {
    setOpenProductDialog(true); // Open ProductDialog
  };
  //บันทึกสินค้า
  const handleSaveProduct = (newProduct) => {
    setProducts([...products, newProduct]);
    setOpenDialog(false);
  };

  //ลบสินค้าแบบsoftdelete
  const handleDeleteProduct = async (id) => {
    try {
      // เปลี่ยนสถานะ is_active เป็น false เมื่อกดปุ่มลบ (Soft Delete)
      await post({ product_id: id, is_active: false }, ACTIVE_PRODUCT);

      // อัปเดตรายการสินค้าใน state หลังจากลบสินค้าแล้ว (Soft Delete)
      setProducts((prevProducts) =>
        prevProducts.map((product) => (product.id === id ? { ...product, is_active: false } : product))
      );

      // อัปเดตรายการสินค้าใน filteredProducts หลังจากลบสินค้าแล้ว (Soft Delete)
      setFilteredProducts((prevProducts) =>
        prevProducts.map((product) => (product.id === id ? { ...product, is_active: false } : product))
      );

      console.log('สินค้าได้ถูกลบแล้ว', id); // แสดงข้อมูลใน Console เมื่อกดปุ่มลบสินค้าสำเร็จ

      handleGetProduct();
    } catch (error) {
      console.log(error);
      // การจัดการข้อผิดพลาด
    }
  };
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
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
    setOpenEditDialog(true); // Open EditProductDialog
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


  //กรองสินค้าแต่ยังใช้งานไม่ได้
  const handleFilterStatusType = (status) => {
    let filteredProducts = [];
    switch (status) {
      case 'delete':
        filteredProducts = products.filter((product) => !product.is_active);
        break;
      case 'almost':
        filteredProducts = products.filter((product) => product.status === 'almost_out_of_stock');
        break;
      case 'oos':
        filteredProducts = products.filter((product) => product.status === 'out_of_stock');
        break;
      default:
        filteredProducts = products;
        break;
    }
    setFilteredProducts(filteredProducts);
  };

  //กรองประเภทสินค้ายังใช้งานไม่ได้
  const handleGetCategories = () => {
    get(PRODUCT_TYPE)
      .then((res) => {
        if (res.success) {
          setCategories(res.result);
        } else {
          console.error('Error fetching product categories:', res.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching product categories:', error);
      });
  };

  const handleCloseDialog = () => {
    setSelectedProduct(null);
    setOpenProductDialog(false); // Close ProductDialog
    setOpenEditDialog(false); // Close EditProductDialog
  };

  const handleOpenEditDialog = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };
  const handleSaveCategory = async (newCategory) => {
    await post({ product_type: newCategory }, ADD_PRODUCT_TYPE)
      .then(async (res) => {
        if (res.success) {
          console.log('เพิ่มประเภทสินค้า:', newCategory);
          alert(res.message);
          setOpenTypeDialog(false);
        } else {
          alert(res.message);
        }
      })
      .catch((error) => {
        console.error('Error saving category:', error);
      });
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
  const handleFilterStatus = (status) => {
    setFilterType(status);
    setCurrentPage(1); // อัปเดต currentPage เพื่อให้กลับไปหน้าแรก
    handleGetProduct(status, filterCategory); // ดึงข้อมูลสินค้าใหม่เมื่อมีการเลือกสถานะสินค้าใหม่
  };



  const handleFilterCategory = (event) => {
    const selectedCategory = event.target.value;
    setFilterCategory(selectedCategory);
    setCurrentPage(1); // อัปเดต currentPage เพื่อให้กลับไปหน้าแรก
    handleGetProduct(statusFilter, selectedCategory); // ดึงข้อมูลสินค้าใหม่เมื่อมีการเลือกประเภทสินค้าใหม่
  };



  //get data สินค้า
  const handleGetProduct = async (statusFilter, filterCategory) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (statusFilter && statusFilter !== 'delete') {
        queryParams.append('status', statusFilter);
      }
      if (filterCategory) {
        queryParams.append('category', filterCategory);
      }
      queryParams.append('itemsPerPage', itemsPerPage); // อัปเดตค่า itemsPerPage ในการดึงข้อมูลสินค้า
  
      const url = `${PRODUCT}?${queryParams}`;
      const res = await get(url);
  
      console.log('Response:', res);
  
      if (res.success) {
        const data = res.result.filter((product) => product.is_active);
        const modifiedData = data.map((item) => ({
          id: item.product_id,
          name: item.product_name,
          description: item.product_detail,
          costPrice: item.product_cost,
          sellingPrice: item.product_price,
          quantity: item.product_qty,
          category: item.product_type,
          is_active: item.is_active,
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
  



  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ width: '240px' }}>
        <SidebarAdmin />
      </Box>
      <Box component="main" flexGrow={1} p={3}>
        <Container maxWidth="xl">
          <Grid container justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h5" sx={{ color: '#696CFF' }}>
              สินค้า
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddProduct}
            >
              เพิ่มสินค้า
            </Button>
          </Grid>

          <Grid container spacing={2} mb={4}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                value={filterCategory}
                onChange={handleFilterCategory}
                label="กรองตามประเภทสินค้า"
                fullWidth
              >
                <MenuItem value="">ทั้งหมด</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.name}>
                    {category.name}
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
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                value={filterType}
                onChange={(event) => setFilterType(event.target.value)}
                label="กรองสถานะสินค้า" // Label for the select dropdown
                fullWidth
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="delete">สินค้าที่ลบ</MenuItem>
                <MenuItem value="almost">ใกล้หมด</MenuItem>
                <MenuItem value="oos">หมด</MenuItem>
              </TextField>
            </Grid>

            {/* Add the rest of your components here */}
          </Grid>

          <Paper elevation={3} sx={{ width: '100%', borderRadius: 5, overflow: 'hidden', marginBottom: 4 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Table sx={{ borderRadius: 5 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>NO.</TableCell>
                    <TableCell>รหัสสินค้า</TableCell>
                    <TableCell>ชื่อสินค้า</TableCell>
                    <TableCell>ราคาทุน</TableCell>
                    <TableCell>ราคาขาย</TableCell>
                    <TableCell>จำนวน</TableCell>
                    <TableCell>รายละเอียดสินค้า</TableCell>
                    <TableCell>หมวดหมู่</TableCell>
                    <TableCell>แก้ไข</TableCell>
                    <TableCell>ลบ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {getCurrentPageItems().map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.costPrice}</TableCell>
                      <TableCell>{product.sellingPrice}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEditProduct(product)}>
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleDeleteProduct(product.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>

          <Pagination
            count={Math.ceil(filteredProducts.length / itemsPerPage)}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)} // อัปเดต currentPage ที่นี่เพื่อให้มีค่าใหม่ก่อนเรียกใช้ handleGetProduct
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '20px'
            }}
          />

          <ProductDialog open={openDialog} onClose={handleCloseDialog} onSave={handleSaveProduct} />
          <ProductDialog
            open={openProductDialog}
            onClose={handleCloseDialog}
            onSave={handleSaveProduct}
          />
          {selectedProduct && (
            <EditProductDialog
              open={openEditDialog}
              onClose={handleCloseDialog}
              product={selectedProduct}
              onUpdate={handleUpdateProduct}
            />
          )}


        </Container>
      </Box>
    </Box>
  );
}

export default AdminProduct;
