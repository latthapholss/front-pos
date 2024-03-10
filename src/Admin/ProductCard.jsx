import React, { useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, Typography, Button, Box, TextField, Snackbar, Popover, useTheme } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const ProductCard = ({ id, name, price, image, onSelect, product_qty, product_cost, product_detail, category, lot, product_lot_id, itemset_id,selectedLotId, selectedPrice, selectedCost, selectedQuantity, product_width, product_length, product_thickness }) => {
  const [quantity, setQuantity] = useState(1);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const [snackbarContent, setSnackbarContent] = useState({ severity: "info", message: "" });

  const [adjustedProductQty, setAdjustedProductQty] = useState(product_qty); // New state to manage adjusted quantity

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
      // Notify the user that they cannot add more than what's available
      setSnackbarContent({
        severity: "error",
        message: "ไม่สามารถเพิ่มได้ สินค้าในคลังมีน้อยกว่าที่เลือก",
      });
      setOpenSnackbar(true);
      return; // Exit the function early to prevent further processing
    }

    if (quantity > selectedQuantity) {
      // Notify the user that the requested quantity exceeds the current lot, but still process the addition
      setSnackbarContent({
        severity: "success",
        message: "เพิ่มสินค้าสำเร็จ แต่จำนวนเกินล็อตปัจจุบัน จะดำเนินการจากล็อตถัดไป",
      });
    } else {
      // Success scenario: quantity does not exceed the current lot's available quantity
      setSnackbarContent({
        severity: "success",
        message: "เพิ่มสินค้าสำเร็จ.",
      });
    }
    // If selected quantity is within current lot's capacity
    setAdjustedProductQty(prevQty => prevQty - quantity);

    onSelect({
      id, name, price: selectedPrice, image, quantity,
      product_qty: adjustedProductQty - quantity,
      product_cost: selectedCost, product_detail, category, lot, product_lot_id,itemset_id
    });
    setOpenSnackbar(true);

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
        {/* <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem', mb: 0.5 }}>
          จำนวนสินค้า: {adjustedProductQty}
        </Typography>  */}
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem', mb: 0.5 }}>
          จำนวนสินค้า: {product_qty}
        </Typography>       
         {/* <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem', mb: 0.5 }}>
          itemset_id: {itemset_id}
        </Typography> */}

        {/* <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem', mb: 0.5 }}>
        จำนวนล็อตนี้: {selectedQuantity}
        </Typography> */}
        {/* <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem', mb: 0.5 }}>
          ราคาล็อตนี้: {selectedPrice}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem', mb: 0.5 }}>
          ล็อตที่: {selectedLotId}
        </Typography>  */}


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
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">ราคา: {price} THB</Typography>
          <Typography variant="body2" color="text.secondary">ประเภทสินค้า: {category}</Typography>
          <Typography variant="body2" color="text.secondary">จำนวนสินค้าคงเหลือ: {adjustedProductQty}</Typography>
          <Typography variant="body2" color="text.secondary">รายละเอียดสินค้า: {product_detail}</Typography>
          {category === "กระจก" && (
            <>
              <Typography variant="body2" color="text.secondary">ความสูง: {product_width} นิ้ว</Typography>
              <Typography variant="body2" color="text.secondary">ความยาว: {product_length} นิ้ว</Typography>
              <Typography variant="body2" color="text.secondary">ความหนา: {product_thickness} มิลลิเมตร </Typography>
            </>
          )}
          {category === "อลูมิเนียม" && (
            <>
              <Typography variant="body2" color="text.secondary">ความยาว: {product_length} นิ้ว</Typography>
              <Typography variant="body2" color="text.secondary">ความหนา: {product_thickness} มิลลิเมตร </Typography>
            </>
          )}

          {/* <Typography variant="body2" color="text.secondary">Lot: {lot}</Typography>
          <Typography variant="body2" color="text.secondary">Product Lot ID: {product_lot_id}</Typography>
          <Typography variant="body2" color="text.secondary">ต้นทุนสินค้า: {product_cost} THB</Typography> */}
        </Box>
      </Popover>
    </Card>
  );
};

export default ProductCard;
