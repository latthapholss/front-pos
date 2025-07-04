import React, { useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, Typography, Button, Box, TextField } from '@mui/material';

const ProductCard = ({ name, price, image, onSelect, products, }) => { // Add 'products' prop here
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(price);


  useEffect(() => {
    const calculatedTotalPrice = price * quantity;
    setTotalPrice(calculatedTotalPrice);
  }, [quantity, price]);

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    setQuantity(value);
  };

  useEffect(() => {
    const calculatedTotalPrice = price * quantity;
    setTotalPrice(calculatedTotalPrice);
  }, [quantity, price]);

  const handleSelect = () => {
    const product = {
      name,
      price: price, // Use the base price here
      image,
      quantity,
      total: price * quantity,
    };
    onSelect(product);
    setQuantity(1);
  };
  

  return (
    <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column' ,mt:'10px'}}>
      <Box sx={{ position: 'relative', width: '100%', paddingBottom: '100%', overflow: 'hidden' }}>
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
      <CardContent sx={{ flex: '1 0 auto' }}>
        <Typography variant="h6" component="div" sx={{ fontSize: '0.9rem' }}>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
          ราคา: {price}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <TextField
            type="number"
            label="Quantity"
            value={quantity}
            onChange={handleQuantityChange}
            inputProps={{ min: 1 }}
            fullWidth
            sx={{ fontSize: '0.8rem' }}
          />
        </Box>
      </CardContent>
      <Button onClick={handleSelect} sx={{ fontSize: '0.8rem', alignSelf: 'center', mb: '8px' }}>
        เลือกสินค้า
      </Button>
    </Card>
  );
};

export default ProductCard;
