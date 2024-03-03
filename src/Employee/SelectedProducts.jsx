import React from 'react';
import { Box, Typography, Grid, Paper, Divider, Button, Card } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';



const SelectedProducts = ({ selectedProducts, totalAmount, removeProduct }) => {
  const handleRemoveProduct = (productId) => {
    removeProduct(productId);
  };

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
      <Button variant="contained" color="primary" sx={{ mt: 1, fontSize: '1rem', height: '40px' }}>
        ยืนยัน
      </Button>
    </Card>
  );
};

export default SelectedProducts;
