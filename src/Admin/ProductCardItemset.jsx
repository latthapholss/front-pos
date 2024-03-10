import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Card, CardMedia, CardContent, Typography, Button, Box, TextField, Snackbar, Popover, useTheme } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const ProductCardItemset = ({ id, name, price, image, onSelect, itemsetName, itemsetDetail, itemsetPrice, itemsetQty }) => {
  const [quantity, setQuantity] = useState(1);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false); // State for dialog
  const theme = useTheme();
  const [snackbarContent, setSnackbarContent] = useState({ severity: "info", message: "" });

  const [adjustedProductQty, setAdjustedProductQty] = useState(itemsetQty);

  useEffect(() => {
    setAdjustedProductQty(itemsetQty);
  }, [itemsetQty]);

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (value > adjustedProductQty) {
      setSnackbarContent({
        severity: 'error',
        message: 'จำนวนที่เลือกเกินขีดจำกัดที่มีอยู่',
      });
      setOpenSnackbar(true);
    } else {
      setOpenSnackbar(false);
      setQuantity(value >= 1 ? value : 1);
    }
  };

  const handleSelect = () => {
    if (quantity > adjustedProductQty) {
      setOpenSnackbar(true);
      setSnackbarContent({
        severity: "error",
        message: "จำนวนที่เลือกมากกว่าจำนวนที่มีอยู่ในสต็อก",
      });
    } else {
      setAdjustedProductQty(prevQty => prevQty - quantity);
      onSelect({
        id, name, price: itemsetPrice, image, quantity,
        itemsetQty: adjustedProductQty - quantity,
        itemsetName, itemsetDetail, itemsetPrice, itemsetQty,
      });
      setOpenSnackbar(true);
      setSnackbarContent({
        severity: "success",
        message: "เลือกสินค้าเรียบร้อย",
      });
    }
  };

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Button onClick={handleDialogOpen}>
        เปิด Dialog
      </Button>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>รายละเอียดสินค้า</DialogTitle>
        <DialogContent>
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              component="img"
              height="140"
              image={image}
              alt={name}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ราคา: {itemsetPrice} THB
              </Typography>
              <Typography variant="body2" color="text.secondary">
                จำนวนสินค้า: {adjustedProductQty}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                รายละเอียดสินค้า: {itemsetDetail}
              </Typography>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>ปิด</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <MuiAlert elevation={6} variant="filled" onClose={() => setOpenSnackbar(false)} severity={snackbarContent.severity}>
          <AlertTitle>{snackbarContent.severity === "success" ? "Success" : "Error"}</AlertTitle>
          {snackbarContent.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default ProductCardItemset;
