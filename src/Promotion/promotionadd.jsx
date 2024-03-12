import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  InputAdornment,
  Pagination,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  DELETEPROMOTION,
  PROMOTION,
  PROMOTIONSTATUS,
  PROMOTION_ADD,
  UPDATE_PROMOTION,
  get,
  ip,
  post,
} from "../Static/api";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router";
import { message } from "antd";

function Promotionadd({ person }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const [, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [promotionData, setPromotionData] = useState({
    promotion_name: "",
    promotion_detail: "",
    discount: "",
    promotion_start: "",
    promotion_end: "",
    quota: "",
  });
  if (person && person.user_type === 0) {
    // Admin user
  } else if (person && person.user_type === 1) {
    // Employee user
  } else if (person && person.user_type === 2) {
    // Member user
  }
  const [promotions, setPromotions] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const navigate = useNavigate();
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const NavigateItemset = () => {
    navigate("/promotion/promotionitemset");
  };

  useEffect(() => {
    handleGetPromotion();
    startAutoUpdatePromotionStatus();
  }, []);

  //page
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPromotionData({
      promotion_name: "",
      promotion_detail: "",
      discount: "",
      promotion_start: "",
      promotion_end: "",
      quota: "",
    });
  };

  const handleOpenEditDialog = (promotion) => {
    setSelectedPromotion(promotion);
    setEditDialogOpen(true);

    // แปลงวันที่เริ่มต้นและสิ้นสุดเป็นรูปแบบที่ถูกต้องสำหรับ datetime-local
  };

  const handleCloseEditDialog = () => {
    setSelectedPromotion(null);
    setEditDialogOpen(false);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPromotionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedPromotion((prevPromotion) => ({
      ...prevPromotion,
      [name]: value,
    }));
  };

  const handleEditPromotion = async (editedPromotionData) => {
    try {
      const dataWithId = {
        ...editedPromotionData,
        id: editedPromotionData.id,
        promotion_name: editedPromotionData.promotionName,
        promotion_detail: editedPromotionData.detail,
        promotion_start: editedPromotionData.startDate,
        promotion_end: editedPromotionData.endDate,
      };

      const response = await post(
        dataWithId,
        UPDATE_PROMOTION.replace(":promotion_id", editedPromotionData.id)
      );

      console.log("Response from server:", response);

      if (response.success) {
        console.log("Promotion updated successfully:", response.message);
        handleGetPromotion();

        // เพิ่ม SweetAlert เมื่อแก้ไขสินค้าเสร็จสิ้น
        Swal.fire({
          title: "แก้ไขสำเร็จ!",
          text: response.message,
          icon: "success",
          confirmButtonText: "ตกลง",
        });
      } else {
        console.error("Error updating promotion:", response.message);
      }

      handleCloseEditDialog();
    } catch (error) {
      console.error("Error updating promotion:", error);
    }
  };

  const handleDeletePromotion = (promotionId) => {
    Swal.fire({
      title: "แน่ใจใช่ไหม?",
      text: "โปรโมชั่นจะถูกยกเลิก !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        post({ promotion_id: promotionId, is_active: 0 }, DELETEPROMOTION).then(
          (res) => {
            if (res.success) {
              const updatedPromotions = promotions.map((promotion) =>
                promotion.id === promotionId
                  ? { ...promotion, is_active: 0 }
                  : promotion
              );
              setPromotions(updatedPromotions);
              Swal.fire("ลบแล้ว!", "โปรโมชั่นถูกยกเลิกแบบนุ่มแล้ว", "success");
              // เรียกฟังก์ชันดึงข้อมูลโปรโมชั่นใหม่หลังจากลบ
              handleGetPromotion();
            } else {
              Swal.fire("ข้อผิดพลาด", res.message, "error");
            }
          }
        );
      }
    });
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleSavePromotion = async () => {
    try {
      if (!promotionData.promotion_name) {
        message.error("กรุณากรอกชื่อโปรโมชั่น");
        return;
      }

      if (isNaN(promotionData.discount)) {
        message.error("กรุณากรอกค่า Discount ให้เป็นตัวเลข");
        return;
      }

      if (!promotionData.promotion_start || !promotionData.promotion_end) {
        message.error("กรุณากรอกข้อมูลเริ่มต้นและสิ้นสุดโปรโมชั่น");
        return;
      }

      if (isNaN(promotionData.quota)) {
        message.error("กรุณากรอกค่า Quota ให้เป็นตัวเลข");
        return;
      }

      const detail =
        promotionData.promotion_detail || "ไม่มีรายละเอียดโปรโมชั่น";

      const newData = {
        ...promotionData,
        promotion_detail: detail,
      };

      const res = await post(newData, PROMOTION_ADD);

      if (res.success) {
        console.log("Promotion added successfully:", res.message);

        // เพิ่ม SweetAlert เมื่อเพิ่มโปรโมชั่นสำเร็จ
        Swal.fire({
          title: "เพิ่มโปรโมชั่นสำเร็จ!",
          text: res.message,
          icon: "success",
          confirmButtonText: "ตกลง",
        });

        handleGetPromotion();
        startAutoUpdatePromotionStatus();
      } else {
        console.error("Error adding promotion:", res.message);
      }

      handleCloseDialog();

      console.log("Saved promotion data:", newData);
    } catch (error) {
      console.error("Error adding promotion:", error);
    }
  };

  const handleGetPromotion = async () => {
    try {
      // เรียก API เพื่อดึงข้อมูลโปรโมชั่น
      const res = await get(PROMOTION);

      if (res.success) {
        // กรองข้อมูลที่มี is_active เท่ากับ 1
        const activePromotions = res.result; //.filter(item => item.is_active === 1);

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
          is_active: item.is_active,
        }));

        setPromotions(modifiedData);
        const _currentItems = modifiedData.slice(
          indexOfFirstItem,
          indexOfLastItem
        );
        setCurrentItems(_currentItems);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching promotions:", error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().slice(0, 16);
    return formattedDate;
  };
  const startDateFormatted = selectedPromotion
    ? formatDate(selectedPromotion.startDate)
    : "";
  const endDateFormatted = selectedPromotion
    ? formatDate(selectedPromotion.endDate)
    : "";

  const startAutoUpdatePromotionStatus = () => {
    const interval = 60000;

    // เรียกใช้ฟังก์ชัน updatePromotionStatus เพื่ออัปเดตสถานะโปรโมชั่น
    const autoUpdatePromotionStatus = async () => {
      try {
        await get(PROMOTIONSTATUS); // เรียกใช้งาน updatePromotionStatus โดยใส่วงเล็บ ()
        console.log("Promotion statuses updated.");
      } catch (error) {
        console.error("Error updating promotion statuses:", error);
      }
    };

    // เรียกฟังก์ชัน autoUpdatePromotionStatus ครั้งแรกเพื่อเริ่มการอัปเดตสถานะโปรโมชั่นโดยอัตโนมัติ
    autoUpdatePromotionStatus();

    // สร้าง interval เพื่อเรียกฟังก์ชัน autoUpdatePromotionStatus ในระหว่างที่ระบบทำงาน
    setInterval(() => {
      autoUpdatePromotionStatus();
      console.log("Auto update triggered.");
    }, interval);
  };

  const handleSwitchChange = (promotion_id) => {
    // Create a copy of promotions to avoid directly mutating the state
    const updatedPromotions = [...promotions];

    // Find the index of the promotion to toggle
    const promoIndex = updatedPromotions.findIndex(
      (obj) => obj.id === promotion_id
    );

    // Toggle the is_active status based on the current value
    updatedPromotions[promoIndex].is_active =
      updatedPromotions[promoIndex].is_active === 1 ? 0 : 1;

    // Update the state with the modified promotions
    setPromotions(updatedPromotions);

    // Update the currentItems if needed
    const _currentItems = updatedPromotions.slice(
      indexOfFirstItem,
      indexOfLastItem
    );
    setCurrentItems(_currentItems);

    // Make the API request to update the status on the server
    axios
      .get(`${ip}/promotion/switchactive/${promotion_id}`)
      .then((response) => {
        if (response.data.success) {
          // Handle the success response from the server if needed.
          console.log("Promotion status updated on the server.");
        } else {
          // Handle any error response from the server.
          console.error(
            "Error toggling promotion status on the server:",
            response.data.message
          );
        }
      })
      .catch((error) => {
        // Handle network or other errors.
        console.error("Error making server request:", error);
      });
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          align="left"
          sx={{
            color: "#333335",
            marginTop: "20px",
            fontSize: "24px", // Add this line for the border // Add some padding for space around the text
            marginLeft: "20px",
            height: "50px",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          จัดการโปรโมชั่น
        </Typography>
        <Button
          sx={{ backgroundColor: "#28bc94", marginRight: "20px" }}
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          เพิ่มโปรโมชั่น
        </Button>
      </Box>
      <Box
        sx={{
          margin: "15px",
          backgroundColor: "white",
          height: "1100px",
          borderRadius: 3,
          padding: "20px",
        }}
      >
        <Box component="main">
          <Container maxWidth="xl">
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              mb={4}
            >
              <Typography
                variant="h5"
                sx={{
                  fontSize: "20px",
                  borderBottom: "2px solid #009ae1",
                  paddingBottom: "5px",
                  color: "#333335",
                  fontWeight: "bold",
                }}
              >
                โปรโมชั่น
              </Typography>
              <Button
                sx={{ backgroundColor: "#28bc94", marginRight: "20px" }}
                variant="contained"
                // startIcon={<AddIcon />}
                onClick={NavigateItemset}
              >
                ชุดสินค้า
              </Button>
            </Grid>

            <Paper
              elevation={3}
              sx={{ width: "100%", borderRadius: 2, overflow: "hidden" }}
            >
              <Table sx={{ borderRadius: 5 }}>
                <TableHead
                  style={{
                    backgroundColor: "#009ae1",
                    color: "white",
                  }}
                >
                  <TableRow>
                    <TableCell style={{ color: "white" }}>
                      ลำดับชุดโปรโมชั่น
                    </TableCell>
                    <TableCell style={{ color: "white" }}>
                      ชื่อชุดโปรโมชั่น
                    </TableCell>
                    <TableCell style={{ color: "white" }}>
                      รายละเอียดสินค้า
                    </TableCell>
                    <TableCell style={{ color: "white" }}>
                      ราคาโปรโมชั่น
                    </TableCell>
                    <TableCell style={{ color: "white" }}>
                      วันที่เริ่มต้น
                    </TableCell>
                    <TableCell style={{ color: "white" }}>
                      วันที่หมดอายุ
                    </TableCell>
                    <TableCell style={{ color: "white" }}>
                      สถานะการใช้งาน
                    </TableCell>
                    <TableCell style={{ color: "white" }}>
                      จำนวนโปรโมชั่น (quota)
                    </TableCell>
                    <TableCell style={{ color: "white" }}>แก้ไข</TableCell>
                    <TableCell style={{ color: "white" }}>ลบ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? promotions.slice(
                        (currentPage - 1) * rowsPerPage,
                        currentPage * rowsPerPage
                      )
                    : promotions
                  ).map((promotionData, index) => (
                    <TableRow key={promotionData.id}>
                      <TableCell>{indexOfFirstItem + index + 1}</TableCell>
                      <TableCell>{promotionData.promotionName}</TableCell>
                      <TableCell>{promotionData.detail}</TableCell>
                      <TableCell>{promotionData.discount} %</TableCell>
                      <TableCell>
                        {new Date(promotionData.startDate).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(promotionData.endDate).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={promotionData.is_active === 1}
                              onChange={() =>
                                handleSwitchChange(promotionData.id)
                              }
                            />
                          }
                        />
                      </TableCell>
                      <TableCell>{promotionData.quota}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleOpenEditDialog(promotionData)}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() =>
                            handleDeletePromotion(promotionData.id)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TableRow
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <TableCell colSpan={10}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="caption" sx={{ marginRight: 2 }}>
                      จำนวนแถวต่อหน้า:
                    </Typography>
                    <Select
                      value={rowsPerPage}
                      onChange={handleChangeRowsPerPage}
                      variant="outlined"
                      sx={{ marginRight: 2 }}
                    >
                      <MenuItem value={10}>10 แถว</MenuItem>
                      <MenuItem value={20}>20 แถว</MenuItem>
                      <MenuItem value={30}>30 แถว</MenuItem>
                    </Select>
                    <Typography variant="caption" sx={{ marginRight: 2 }}>
                      {`${indexOfFirstItem + 1}–${Math.min(
                        indexOfLastItem,
                        promotions.length
                      )} of ${promotions.length}`}
                    </Typography>
                    <Pagination
                      count={Math.ceil(promotions.length / rowsPerPage)}
                      page={currentPage}
                      onChange={handleChangePage}
                      color="primary"
                    />
                  </Box>
                </TableCell>
              </TableRow>
            </Paper>

            <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
              <Pagination
                count={Math.ceil(promotions.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>เพิ่มโปรโมชั่น</DialogTitle>

              <DialogContent>
                <TextField
                  label="ชื่อโปรโมชั่น"
                  name="promotion_name"
                  value={promotionData.promotion_name}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="รายละเอียดโปรโมชั่น"
                  name="promotion_detail"
                  value={promotionData.promotion_detail}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="ส่วนลด (%)"
                  name="discount"
                  value={promotionData.discount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (parseFloat(value) >= 1 || value === "") {
                      handleInputChange(e);
                    } else {
                      // Clear the value if it's less than 1
                      handleInputChange({
                        target: { name: e.target.name, value: "" },
                      });
                    }
                  }}
                  type="number"
                  InputProps={{
                    inputProps: { min: 0, max: 100 },
                  }}
                  fullWidth
                  margin="normal"
                />

                <TextField
                  name="promotion_start"
                  value={promotionData.promotion_start.toLocaleString()}
                  onChange={handleInputChange}
                  type="datetime-local"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                    style: { position: "relative", top: -12 }, // ปรับตำแหน่ง label
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        วันที่เริ่มโปรโมชั่น
                      </InputAdornment>
                    ),
                  }}
                  margin="normal"
                />

                <TextField
                  name="promotion_end"
                  value={promotionData.promotion_end.toLocaleString()}
                  onChange={handleInputChange}
                  type="datetime-local"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                    style: { position: "relative", top: -12 }, // ปรับตำแหน่ง label
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        วันสิ้นสุดโปรโมชั่น
                      </InputAdornment>
                    ),
                  }}
                  margin="normal"
                />

                <TextField
                  label="จำนวนโปรโมชั่น (quota)"
                  name="quota"
                  value={promotionData.quota}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (parseFloat(value) >= 1 || value === "") {
                      handleInputChange(e);
                    } else {
                      // Clear the value if it's less than 1
                      handleInputChange({
                        target: { name: e.target.name, value: "" },
                      });
                    }
                  }}
                  type="number"
                  InputProps={{
                    inputProps: { min: 0 },
                  }}
                  fullWidth
                  margin="normal"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                  ยกเลิก
                </Button>
                <Button onClick={handleSavePromotion} color="primary">
                  บันทึก
                </Button>
              </DialogActions>
            </Dialog>
          </Container>
        </Box>
      </Box>

      {selectedPromotion !== null && (
        <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
          <DialogTitle>แก้ไขโปรโมชั่น</DialogTitle>
          <DialogContent>
            <TextField
              label="ชื่อโปรโมชั่น"
              name="promotionName"
              value={selectedPromotion ? selectedPromotion.promotionName : ""}
              onChange={handleEditInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="รายละเอียดโปรโมชั่น"
              name="detail"
              value={selectedPromotion.detail}
              onChange={handleEditInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Discount (%)"
              name="discount"
              value={selectedPromotion.discount}
              onChange={(e) => {
                const value = e.target.value;
                if (parseFloat(value) >= 1 || value === "") {
                  handleEditInputChange(e);
                } else {
                  // Clear the value if it's less than 1
                  handleEditInputChange({
                    target: { name: e.target.name, value: "" },
                  });
                }
              }}
              type="number"
              InputProps={{
                inputProps: { min: 0, max: 100 },
              }}
              fullWidth
              margin="normal"
            />
            <TextField
              label="วันที่เริ่มต้น"
              name="startDate"
              value={startDateFormatted}
              onChange={handleEditInputChange}
              type="datetime-local"
              fullWidth
              InputLabelProps={{
                shrink: true,
                style: { position: "relative", top: -12 },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    วันที่เริ่มโปรโมชั่น
                  </InputAdornment>
                ),
              }}
              margin="normal"
            />
            <TextField
              label="วันที่หมดอายุ"
              name="endDate"
              value={endDateFormatted}
              onChange={handleEditInputChange}
              type="datetime-local"
              fullWidth
              InputLabelProps={{
                shrink: true,
                style: { position: "relative", top: -12 },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    วันสิ้นสุดโปรโมชั่น
                  </InputAdornment>
                ),
              }}
              margin="normal"
            />

            <TextField
              label="จำนวนโปรโมชั่น (quota)"
              name="quota"
              value={selectedPromotion.quota}
              onChange={(e) => {
                const value = e.target.value;
                if (parseFloat(value) >= 1 || value === "") {
                  handleEditInputChange(e);
                } else {
                  // Clear the value if it's less than 1
                  handleEditInputChange({
                    target: { name: e.target.name, value: "" },
                  });
                }
              }}
              type="number"
              InputProps={{
                inputProps: { min: 0 },
              }}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog} color="primary">
              ยกเลิก
            </Button>
            <Button
              onClick={() => handleEditPromotion(selectedPromotion)}
              color="primary"
            >
              บันทึกการแก้ไข
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

export default Promotionadd;