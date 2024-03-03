import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, createTheme } from '@mui/material';
import ProductCard from './ProductCard';
import SelectedProducts from './SelectedProducts';
import SidebarEmployee from '../Component/Sidebar-Employee';
import SidebarAdmin from '../Component/Sidebar-Admin';

import { PRODUCT, get } from '../Static/api';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import { TextField } from '@mui/material';
import { ADD_PRODUCT_TYPE, PRODUCT_TYPE, post, FILTERPRODUCT, ACTIVE_PRODUCT, UPDATE_PRODUCT } from '../Static/api';
import { Button } from '@mui/material';
import CashierPageDialog from './CashierPageDialog';
import axios from 'axios'; // Import axios or your preferred HTTP library


import { UNIT } from '../Static/api'; // ต้องแทนที่ด้วยพาธที่ถูกต้อง



const CashierPage = ({ removeProduct, person }) => {

  if (person && person.user_type === 0) {
    // Employee user
  } else if (person && person.user_type === 1) {
    // admin user
  } else if (person && person.user_type === 2) {
    // Member user
  }

  // ... (other component code)

  const handlePromotionChange = (event) => {
    const selectedPromotionId = event.target.value;
    setselectedPromotionId(selectedPromotionId);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPromotionId, setselectedPromotionId] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredAndSearchedProducts, setFilteredAndSearchedProducts] = useState([]);

  const [filterCategory, setFilterCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    fetch(PRODUCT_TYPE) // หรือเป็น API ที่ใช้งานเพื่อดึงข้อมูลประเภทสินค้า
      .then((response) => response.json())
      .then((data) => setCategories(data.result)) // อัปเดต state 'categories' ด้วยข้อมูลที่ได้รับจาก API
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  const handleGetPromotion = async () => {
    // ... (โค้ดของ handleGetPromotion)
  };




  const theme = createTheme({
    palette: {
      background: {
        default: '#f5f5f5',
      },
    },
  });

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    const filteredProducts = products.filter((product) => {
      return (
        product.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    });
    setFilteredAndSearchedProducts(filteredProducts);
    setSearchQuery(searchValue);
  };
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  // ...

  // Pass selectedPromotion to the CashierPageDialog component




  const handleFilterCategory = (event) => {
    const selectedCategoryId = event.target.value;
    console.log(selectedCategoryId);
    setFilterCategory(selectedCategoryId);
    setCurrentPage(1);

    if (selectedCategoryId === "") {
      setFilteredAndSearchedProducts(products);
    } else {
      const filteredByCategory = products.filter(product => product.category === selectedCategoryId);
      setFilteredAndSearchedProducts(filteredByCategory);
    }
  };


  const [units, setUnits] = useState([]); // เพิ่ม state เพื่อเก็บข้อมูลหน่วยสินค้า
  const CashierPage = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const openDialog = () => {
      setIsDialogOpen(true);
    };

    // สร้างฟังก์ชันเพื่อปิดหน้าต่าง
    const closeDialog = () => {
      setIsDialogOpen(false);
    };

    // สร้างฟังก์ชันเพื่อการยืนยันการชำระสินค้า
    const handleConfirmPayment = () => {
      // ทำสิ่งที่คุณต้องการเมื่อยืนยันการชำระสินค้า
      // อาจเป็นการส่งข้อมูลไปยัง API หรือดำเนินการอื่น ๆ
      // ...
      setSelectedProducts([]);

      // หลังจากนั้นปิดหน้าต่าง
      closeDialog();
    };

    // ... rest of the component code
  };
  useEffect(() => {
    // เรียก API เพื่อดึงข้อมูลหน่วยสินค้า
    fetch(UNIT)
      .then((response) => response.json())
      .then((data) => setUnits(data))
      .catch((error) => console.error('Error fetching units:', error));
  }, []);

  const groupedProducts = [];
  selectedProducts.forEach((product) => {
    const existingGroup = groupedProducts.find((group) => group.name === product.name);
    if (existingGroup) {
      existingGroup.quantity += product.quantity;
    } else {
      groupedProducts.push({ ...product });
    }
  });

  const [unit, setUnit] = useState('');
  useEffect(() => {
    // เรียก API เพื่อดึงข้อมูลหน่วยสินค้า
    // และอัปเดต state 'units' ด้วยข้อมูลที่ได้รับ
    // ตัวอย่างเช่น
    //   fetch(UNIT)
    //  .then((response) => response.json())
    //  .then((data) => setUnits(data))
    //  .catch((error) => console.error('Error fetching units:', error));

    // เนื่องจากข้อมูลใน 'units' มีรูปแบบเช่น [{ id: 1, name: 'ชิ้น' }, ...]
    // คุณสามารถใช้ map เพื่อสร้างตัวเลือกสำหรับ MenuItem
  }, []); // ให้ useEffect ทำงานเมื่อคอมโพเนนต์โหลดครั้งแรกเท่านั้น

  <SelectedProducts
    selectedProducts={groupedProducts}
  />
  useEffect(() => {
    handleGetProduct();
    handleGetCategories();
    setSelectedProducts(getSelectedProductsFromLocalStorage());
    handleGetPromotion(); // เพิ่มการเรียกใช้งาน handleGetPromotion

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
  const handleGetProduct = async () => {
    try {
      const res = await get(PRODUCT);
      console.log(res); // แสดงผลข้อมูลที่ได้รับจาก API ในคอนโซล
      if (res.success) {
        const data = res.result;
        const modifiedData = data.map((item) => ({
          id: item.product_id,
          name: item.product_name,
          price: item.product_price,
          image: `http://localhost:4000/${item.product_image}`, // สร้าง URL รูปภาพโดยใช้ URL ของ backend
          category: item.product_type,
          is_active: item.is_active, // เพิ่ม property is_active
          quantity: item.product_qty,

        }));
        setProducts(modifiedData);
        setFilteredAndSearchedProducts(modifiedData); // อัปเดต state ที่ใช้แสดงผลสินค้าที่ผ่านการกรองและค้นหา

      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setUpdatedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };
  const [updatedProduct, setUpdatedProduct] = useState({
    category: '',
  });


  useEffect(() => {
    saveSelectedProductsToLocalStorage(selectedProducts);
  }, [selectedProducts]);

  const totalAmount = selectedProducts.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  const saveSelectedProductsToLocalStorage = (selectedProducts) => {
    localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
  };

  const getSelectedProductsFromLocalStorage = () => {
    const storedSelectedProducts = localStorage.getItem('selectedProducts');
    return storedSelectedProducts ? JSON.parse(storedSelectedProducts) : [];
  };

  const removeSelectedProduct = (productId) => {
    const updatedSelectedProducts = selectedProducts.filter(
      (product) => product.id !== productId
    );
    setSelectedProducts(updatedSelectedProducts);
  };

  const selectProduct = (product) => {
    setSelectedProducts([...selectedProducts, product]);
    console.log('Selected Product:', product);
  };






  return (
    <Grid container>
      <Grid item xs={12} md={2} sx={{ width: '100%' }}>

        <Button
          sx={{ marginLeft: '1200px', width: '100%' }}
          variant="contained"
          color="primary"
          onClick={openDialog} // เปิดหน้าต่างยืนยันการชำระเงิน
        >
          ตระกร้าสินค้า ({groupedProducts.length} รายการ)
        </Button>
      </Grid>
      <Grid item xs={12} md={10} sx={{ width: '100%', height: '100%' }}>
        <Box p={3} sx={{ height: '100%' }}>
          <Typography variant="h4" align="left" gutterBottom sx={{ color: '#696CFF' }}>
            สินค้า
          </Typography>  <Grid container spacing={2} mb={4}>
            <Grid item xs={12} sm={6} md={0}>

              <TextField
                select
                value={filterCategory}
                onChange={handleFilterCategory}
                label="กรองตามประเภทสินค้า"
                fullWidth
              >
                <MenuItem value="">ทั้งหมด</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.product_type} value={category.product_type}>
                    {category.product_type}
                  </MenuItem>
                ))}
              </TextField>

            </Grid>

            <Grid item xs={12} sm={6} md={0}>
              <TextField
                value={searchQuery}
                onChange={handleSearch}
                label="ค้นหาสินค้า"
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} justifyContent="flex-start">
            {filteredAndSearchedProducts
              .filter((product) => product.is_active > 0)
              .map((product) => (
                <Grid item xs={12} sm={6} md={2} key={product.id} sx={{ display: 'flex' }}>
                  <ProductCard
                    id={product.id}

                    name={product.name}
                    price={product.price}
                    category={product.category}
                    image={product.image}
                    onSelect={selectProduct}
                    sx={{ width: '100%' }}
                    products={products}
                  />
                </Grid>
              ))}
          </Grid>


        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        md={5}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          mt: '50px',
          marginLeft: '10px',
          height: '1000px',
        }}
      >

      </Grid>

      <CashierPageDialog
        open={isDialogOpen}
        onClose={closeDialog}
        selectedProducts={selectedProducts}
        totalAmount={totalAmount}
        selectedPromotionId={selectedPromotionId}
        handleConfirmPayment={handleConfirmPayment}


      />
    </Grid>
  );
};

export default CashierPage;