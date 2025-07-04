import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, createTheme } from '@mui/material';
import ProductCard from './ProductCard';
import SelectedProducts from './SelectedProducts';
import SidebarAdmin from '../Component/Sidebar-Employee';
import { PRODUCT, get } from '../Static/api';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const CashierPage = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const theme = createTheme({
    palette: {
      background: {
        default: '#f5f5f5',
      },
    },
  });

  useEffect(() => {
    handleGetProduct();
    setSelectedProducts(getSelectedProductsFromLocalStorage());
  }, []);

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
          image: item.product_image,
        }));
        setProducts(modifiedData);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const filteredProducts = products;

  // คำนวณสินค้าที่ต้องแสดงในหน้าปัจจุบัน
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // คำนวณจำนวนหน้าทั้งหมด
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Split products into two rows for display
  const middleIndex = Math.ceil(currentProducts.length / 2);
  const firstRowProducts = currentProducts.slice(0, middleIndex);
  const secondRowProducts = currentProducts.slice(middleIndex);

  return (
    <Grid container>
      <Grid item xs={12} md={2} sx={{ width: '100%' }}>
        <SidebarAdmin />
      </Grid>
      <Grid item xs={12} md={4} sx={{ width: '100%', height: '100%' }}>
        <Box p={3} sx={{ height: '100%' }}>
          <Typography variant="h4" align="left" gutterBottom sx={{ color: '#696CFF' }}>
            สินค้า
          </Typography>
          {/* First row of ProductCard */}
          <Grid container spacing={2} justifyContent="flex-start">
            {firstRowProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id} sx={{ display: 'flex' }}>
                <ProductCard
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  onSelect={selectProduct}
                  sx={{ width: '100%' }}
                  products={products}
                />
              </Grid>
            ))}
          </Grid>
          {/* Second row of ProductCard */}
          <Grid container spacing={2} justifyContent="flex-start">
            {secondRowProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id} sx={{ display: 'flex' }}>
                <ProductCard
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  onSelect={selectProduct}
                  sx={{ width: '100%' }}
                  products={products}
                />
              </Grid>
            ))}
          </Grid>

          <Stack spacing={2} mt={2} justifyContent="center">
            <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
          </Stack>
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
        <SelectedProducts
          selectedProducts={selectedProducts}
          totalAmount={totalAmount}
          removeProduct={removeSelectedProduct}
        />
      </Grid>
    </Grid>
  );
};

export default CashierPage;