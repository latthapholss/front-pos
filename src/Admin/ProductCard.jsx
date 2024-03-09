import React, { useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, Typography, Button, Box, TextField, Snackbar, Popover, useTheme } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const ProductCard = ({ id, name, price, image, onSelect, product_qty, product_cost, product_detail, category, lot, product_lot_id, selectedLotId,selectedPrice,selectedCost,selectedQuantity}) => {
  const [quantity, setQuantity] = useState(1);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const [snackbarContent, setSnackbarContent] = useState({ severity: "info", message: "" });

  const [adjustedProductQty, setAdjustedProductQty] = useState(product_qty); // New state to manage adjusted quantity
  const handleGetProduct = async () => {
    try {
      const res = await get(PRODUCTSALES);
      console.log("Product Sales Data:", res);
      if (res.success) {
        const data = res.result;
  
        const modifiedData = data.map(item => {
          // Assuming each item now contains an array of lot details
          const lots = item.lots; // Directly using the array of lot objects
  
          // Initialize variables for selecting the lot
          let selectedLotIndex = 0; // Index of the lot to be used for selling
          let minLotId = lots[0]?.product_lot_id || 0; // Initialize minimum lot ID

          lots.forEach((lot, i) => {
            if (lot.product_lot_id < minLotId) {
              minLotId = lot.product_lot_id; // Update minimum lot ID
          
              selectedLotIndex = i; // Update selected lot index to the lot with the minimum ID
            }
          });
          let maxPrice = lots[0]?.product_lot_price || 0; // Initialize with the first lot's price

          lots.forEach((lot, i) => {
            if (lot.product_lot_price > maxPrice) {
              maxPrice = lot.product_lot_price; // Update to the new maximum price
              
              selectedLotIndex = i; // Update selected lot index to the lot with the maximum price
            }
          });
        



          let totalQuantity = 0;
        
          lots.forEach(lot => {
              totalQuantity += lot.product_lot_qty; // Add the quantity of each lot to the total
          });
          
          // Selected lot details
          const selectedLot = lots[selectedLotIndex] || {};
  
          return {
            id: item.product_id,
            name: item.product_name,
            selectedLotId: selectedLot.product_lot_id,
            selectedPrice: selectedLot.product_lot_price,
            selectedCost: selectedLot.product_lot_cost,
            selectedQuantity: selectedLot.product_lot_qty,
  
            quantity: totalQuantity,
            description: item.product_detail,
            category: item.product_type,
            unit: item.unit,
            image: getImagePath(item.product_image),
            is_active: item.is_active,
            product_lot_id: selectedLot.product_lot_id,
            costPrice: selectedLot.product_lot_cost,
            sellingPrice: selectedLot.product_lot_price,
          };
        });
  
        setProducts(modifiedData.filter(product => product.is_active === 1));
        setFilteredAndSearchedProducts(modifiedData.filter(product => product.is_active === 1));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  

  useEffect(() => {
    // Reset adjusted quantity when product_qty prop changes
    setAdjustedProductQty(product_qty);
  }, [product_qty]);

const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (value > adjustedProductQty) {
        // Set error state and show Snackbar with error message
        setSnackbarContent({
            severity: 'error',
            message: 'จำนวนที่เลือกเกินขีดจำกัดที่มีอยู่',
        });
        setOpenSnackbar(true);
        // Optionally, prevent setting the quantity beyond the limit
        // setQuantity(adjustedProductQty);
    } else {
        setOpenSnackbar(false); // Close Snackbar if previously opened
        setQuantity(value >= 1 ? value : 1);
    }
};

  const handleSelect = () => {
    if (quantity > adjustedProductQty) {
      // Example logic to handle lot change
      const nextLot = findNextLot(quantity - adjustedProductQty, allLots); // allLots is an array of all available lots
      if (nextLot) {
        // Update state to reflect the new lot's details
        setSelectedPrice(nextLot.newPrice);
        setSelectedCost(nextLot.newCost);
        setSelectedQuantity(nextLot.newQuantity);
        setAdjustedProductQty(nextLot.newQuantity - (quantity - adjustedProductQty));
  
        // Proceed with onSelect using the new lot's details
        onSelect({
          id,
          name,
          price: nextLot.newPrice, // Updated price
          image,
          quantity, 
          product_qty: nextLot.newQuantity, // Updated quantity
          product_cost: nextLot.newCost, // Updated cost
          product_detail,
          category,
          lot: nextLot.lot, // Updated lot
          product_lot_id: nextLot.product_lot_id, // Updated product lot ID
        });
  
        setOpenSnackbar(true);
        setSnackbarContent({
          severity: "success",
          message: "Product updated with new lot details.",
        });
      } else {
        // Handle case where no suitable next lot is found
        setOpenSnackbar(true);
        setSnackbarContent({
          severity: "error",
          message: "No more lots available to fulfill quantity.",
        });
      }
    } else {
      // If selected quantity is within current lot's capacity
      setAdjustedProductQty(prevQty => prevQty - quantity);
      onSelect({
        id, name, price: selectedPrice, image, quantity,
        product_qty: adjustedProductQty - quantity,
        product_cost: selectedCost, product_detail, category, lot, product_lot_id,
      });
      setOpenSnackbar(true);
      setSnackbarContent({
        severity: "success",
        message: "Product added successfully.",
      });
    }
  };
    
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Card sx={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      mt: theme.spacing(2),
      padding: theme.spacing(2),
      boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
      transition: '0.3s',
      '&:hover': {
        boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.2)',
      },
      borderRadius: theme.shape.borderRadius,
    }}>
      <Box sx={{
        position: 'relative',
        width: '100%',
        paddingBottom: '120%',
        overflow: 'hidden',
        '& img': {
          transition: 'transform 0.5s ease',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        },
      }}>
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

      <CardContent sx={{ flex: '1 0 auto', textAlign: 'center', pt: theme.spacing(2) }}>
        <Typography variant="h6" component="div" sx={{ fontSize: '1.2rem', fontWeight: 'bold', mb: 1 }}>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem', mb: 0.5 }}>
          ราคา: {selectedPrice} THB
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem', mb: 0.5 }}>
          ประเภทสินค้า: {category}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem', mb: 0.5 }}>
          จำนวนสินค้า: {adjustedProductQty}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem', mb: 0.5 }}>
        จำนวนล็อตนี้: {selectedQuantity}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem', mb: 0.5 }}>
          ราคาล็อตนี้: {selectedPrice}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem', mb: 0.5 }}>
          ล็อตที่: {selectedLotId}
        </Typography>

      
        <Button
          aria-owns={open ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
          sx={{ mt: 2, backgroundColor: 'transparent', color: '#009ae1', textTransform: 'none' }}
        >
          รายละเอียดเพิ่มเติม
        </Button>

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

      <Button onClick={handleSelect} sx={{ mt: theme.spacing(2), backgroundColor: '#009ae1', color: 'white' }}>
        เลือกสินค้า
      </Button>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <MuiAlert elevation={6} variant="filled" onClose={() => setOpenSnackbar(false)} severity={snackbarContent.severity}>
          <AlertTitle>{snackbarContent.severity === "success" ? "Success" : "Error"}</AlertTitle>
          {snackbarContent.message}
        </MuiAlert>
      </Snackbar>

      <Popover
        id="mouse-over-popover"
        sx={{ pointerEvents: 'none' }}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">ราคา: {price} THB</Typography>
          <Typography variant="body2" color="text.secondary">ประเภทสินค้า: {category}</Typography>
          <Typography variant="body2" color="text.secondary">จำนวนสินค้า: {product_qty}</Typography>
          <Typography variant="body2" color="text.secondary">รายละเอียดสินค้า: {product_detail}</Typography>
          <Typography variant="body2" color="text.secondary">Lot: {lot}</Typography>
          <Typography variant="body2" color="text.secondary">Product Lot ID: {product_lot_id}</Typography>
          <Typography variant="body2" color="text.secondary">ต้นทุนสินค้า: {product_cost} THB</Typography>
        </Box>
      </Popover>
    </Card>
  );
};

export default ProductCard;
