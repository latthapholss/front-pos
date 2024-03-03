import React, { useState, useEffect } from 'react';
import { Paper, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Card,
  Box,
  Typography,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { PROMOTION, PROMOTIONSTATUS, PROMOTION_ADD, get, post, } from '../Static/api';


const SelectedProducts = ({ selectedProducts, totalAmount, removeProduct,setselectedPromotionId, selectedPromotionId, handlePromotionChange }) => {
  const handleRemoveProduct = (productId) => {
    removeProduct(productId);
    const handlePromotionChange = (event) => {
      const selectedPromotionId = event.target.value;
      setselectedPromotionId(selectedPromotionId);  // ตรวจสอบการอัปเดต selectedPromotionId
  };
  };
  const [promotionData, setPromotionData] = useState({
    promotion_name: '',
    promotion_detail: '',
    discount: '',
    promotion_start: '',
    promotion_end: '',
    quota: '',
  });
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const handleGetPromotion = async () => {
    try {
      // เรียก API เพื่อดึงข้อมูลโปรโมชั่น
      const res = await get(PROMOTION);

      if (res.success) {
        // กรองข้อมูลที่มี is_active เท่ากับ 1
        const activePromotions = res.result.filter(item => item.is_active === 1);

        // ประมวลผลข้อมูลที่ได้รับ
        const modifiedData = activePromotions.map((item) => ({
          id: item.promotion_id,
          startDate: item.promotion_start,
          endDate: item.promotion_end,
          promotionName: item.promotion_name,
          detail: item.promotion_detail,
          discount: item.discount,
          quota: item.quota,
          selected: false,
        }));

        setPromotions(modifiedData);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetPromotion();
  }, []); // Empty dependency array to ensure it's called only on mount

  // ... rest of your code ...
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = promotions.slice(indexOfFirstItem, indexOfLastItem);
    

  
  return (
    <Card className="selected-products" sx={{ p: 1, border: '', borderRadius: '20px', width: '100%' }}>
      <Grid container component={Paper} elevation={0} sx={{ mt: 1, p: 1 }}>
        <Grid item xs={6}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontSize: '1.5rem', color: '#696CFF' }}>
            รายการสินค้า:
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ mt: 1, mb: 1, border: '1px solid #ccc' }} />
          <Grid container spacing={1}>
            <Grid item xs={2}>
              <Typography variant="subtitle2" sx={{ fontSize: '1rem' }}>ลำดับ</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="subtitle2" sx={{ fontSize: '1rem' }}>รายการสินค้า</Typography>
            </Grid>
            <Grid item xs={2} align="right">
              <Typography variant="subtitle2" sx={{ fontSize: '1rem' }}>ราคา</Typography>
            </Grid>
            <Grid item xs={2} align="right">
              <Typography variant="subtitle2" sx={{ fontSize: '1rem' }}>จำนวน</Typography>
            </Grid>
            <Grid item xs={2} align="right">
              <Typography variant="subtitle2" sx={{ fontSize: '1rem' }}>ลบ</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {selectedProducts.map((product, index) => (
            <Grid container spacing={1} key={product.id}>
              <Grid item xs={2}>
                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{index + 1}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{product.name}</Typography>
              </Grid>
              <Grid item xs={2} align="right">
      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
        {product.price * product.quantity} {/* Display the total price (price * quantity) */}
      </Typography>
    </Grid>
              <Grid item xs={2} align="right">
                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{product.quantity}</Typography>
              </Grid>
              <Grid item xs={2} align="right">
                <Box
                  component="span"
                  onClick={() => handleRemoveProduct(product.id)}
                  sx={{ cursor: 'pointer', color: '#FF0000', fontSize: '0.8rem' }}
                >
                  ⓧ
                </Box>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Divider sx={{ my: 1, border: '1px solid #ccc' }} />
      <Typography variant="body2" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
        ยอดรวม: {totalAmount}
      </Typography>
      <Box mt={2}>
      <FormControl fullWidth>
        <InputLabel>โปรโมชั่น</InputLabel>
        <Select
          value={selectedPromotionId}
          onChange={handlePromotionChange}
        >
          <MenuItem value={null}>ไม่เลือกโปรโมชั่น</MenuItem>
          {promotions.map((promotionData) => (
            <MenuItem key={promotionData.id} value={promotionData.id}>
              {promotionData.promotionName} - {promotionData.discount} %
            </MenuItem>
          ))}
        </Select>
      </FormControl>

 </Box>
    </Card>
  );
};

export default SelectedProducts;
