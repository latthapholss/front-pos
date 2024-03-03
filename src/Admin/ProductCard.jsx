import React, { useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, Typography, Button, Box, TextField, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const ProductCard = ({ id, name, price, image, onSelect, product_qty, product_cost, product_detail, category, lot, product_lot_id }) => {
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(price);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const calculatedTotalPrice = price * quantity;
    setTotalPrice(calculatedTotalPrice);
  }, [quantity, price]);

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    setQuantity(value);
  };

  const handleSelect = () => {
    const product = {
      id,
      name,
      price,
      image,
      quantity,
      total: price * quantity,
      product_qty,
      product_cost,
      product_detail,
      category,
      product_lot_id
    };
    onSelect(product);
    setQuantity(1);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column', mt: '10px', padding: '16px' }}>
      <Box sx={{ position: 'relative', width: '100%', paddingBottom: '120%', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          image={image}
        />
      </Box>

      <CardContent sx={{ flex: '1 0 auto', textAlign: 'center' }}>
        <Typography variant="h6" component="div" sx={{ fontSize: '1.2rem', fontWeight: 'bold', mb: 1 }}>
          {name}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem', mb: 0.5 }}>
          ราคา: {price}
        </Typography>

      

        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem', mb: 0.5 }}>
          ประเภทสินค้า: {category}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem', mb: 0.5 }}>
          จำนวนสินค้า: {product_qty}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem', mb: 0.5 }}>
          ล็อตสินค้า:{lot}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: '1rem', visibility: 'hidden' }}>
          รหัสสินค้า: {id}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column' }}>
          <TextField
            type="number"
            label="จำนวน"
            value={quantity}
            onChange={handleQuantityChange}
            inputProps={{ min: 1 }}
            fullWidth
            variant="outlined"
            sx={{
              '& input': {
                padding: '12px',
              },
              '& label': {
                fontSize: '0.9rem',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#009ae1',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#009ae1',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#009ae1',
              },
            }}
          />
        </Box>
      </CardContent>

      <Button onClick={handleSelect} sx={{ mt: '10px', backgroundColor: '#009ae1', color: 'white' }}>
        เลือกสินค้า
      </Button>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity="success">
          <AlertTitle>Success</AlertTitle>
          เพิ่มสินค้าเรียบร้อยแล้ว
        </MuiAlert>
      </Snackbar>
    </Card>
  );
};

export default ProductCard;
