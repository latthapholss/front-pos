import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  FormControlLabel,
  Switch,
  IconButton,
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Select,
  Pagination,
  MenuItem,
  TextField, // Import TextField for input fields in the dialog
} from "@mui/material";
import { message } from "antd";
import Swal from "sweetalert2";
import AddIcon from "@mui/icons-material/Add";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getProductItemSet, ip } from "../Static/api";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
export default function ItemsetManage() {
  const [itemset, setitemset] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [indexOfFirstItem, setIndexOfFirstItem] = useState(0);
  const [selectedItemSet, setSelectedItemSet] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const indexOfLastItem = Math.min(currentPage * rowsPerPage, itemset.length);
  const navigate = useNavigate();
  const NavigateItemset = () => {
    navigate("/promotion/promotionitemset");
  };
  const handleChangeRowsPerPage = (event) => {
    const newItemsPerPage = +event.target.value;
    setRowsPerPage(newItemsPerPage);
    const newPage = Math.ceil((indexOfFirstItem + 1) / newItemsPerPage);
    const newIndexOfFirstItem = (newPage - 1) * newItemsPerPage;
    setCurrentPage(newPage);
    setIndexOfFirstItem(newIndexOfFirstItem);
    handleGet(); // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูลใหม่
  };

  useEffect(() => {
    handleGet();
  }, []);

  const handleSwitchChange = (id) => {
    // เขียนโค้ดเพื่อปรับเปลี่ยนสถานะการใช้งานของ promotion ด้วย id ที่รับมา
  };
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleOpenEditDialog = (itemsetData) => {
    setSelectedItemSet(itemsetData);
    setEditDialogOpen(true);
  };

  async function handleGet() {
    try {
      const myHeaders = new Headers();
      myHeaders.append(
        "Cookie",
        "connect.sid=s%3A0OC3wauPyIIzzEcfcA6ROGn-Ni7Tj2bM.RXcAaLWSQt%2BPYgNuuzceJniYgm8lpiNs1%2BNnTdVB3kk"
      );

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(ip + getProductItemSet, requestOptions);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.text();
      const parsedResult = JSON.parse(result);

      const Data = parsedResult.message.map((item) => ({
        itemset_id: item.itemset_id,
        itemset_name: item.itemset_name,
        itemset_detail: item.itemset_detail,
        itemset_price: item.itemset_price,
        is_active: item.is_active,
        itemset_qty: item.itemset_qty,
      }));

      setitemset(Data);
      console.log(Data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
    const newIndexOfFirstItem = (newPage - 1) * rowsPerPage;
    setIndexOfFirstItem(newIndexOfFirstItem);
    handleGet(); // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูลใหม่
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };
  const handleSaveChanges = async () => {
    if (!selectedItemSet) {
      console.error("No item set selected for editing");
      return;
    }

    // Check if any of the fields are empty

    if (
      selectedItemSet.itemset_name === "" ||
      selectedItemSet.itemset_detail === "" ||
      selectedItemSet.itemset_qty === ""
    ) {
      // Display an Ant Design Alert if any field is empty
      message.error("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    // Log details of the item set being edited
    console.log("Editing item set with details:", {
      itemset_name: selectedItemSet.itemset_name,
      itemset_detail: selectedItemSet.itemset_detail,
      itemset_price: selectedItemSet.itemset_price,
      itemset_qty: selectedItemSet.itemset_qty,
      itemset_id: selectedItemSet.itemset_id,
    });

    // Assuming ip is your base API URL and geteditProductItemSet is your API endpoint for editing an item set
    // You might need to replace some placeholder or append item set ID in the endpoint as necessary
    const updateEndpoint = `${ip}/itemset/updateitemset/${selectedItemSet.itemset_id}`;
    console.log(updateEndpoint);
    try {
      const response = await fetch(updateEndpoint, {
        method: "PUT", // or 'PATCH' as required by your API
        headers: {
          "Content-Type": "application/json",
          // Add Authorization header if needed
        },
        body: JSON.stringify({
          itemset_id: selectedItemSet.itemset_id,
          itemset_name: selectedItemSet.itemset_name,
          itemset_detail: selectedItemSet.itemset_detail,
          itemset_price: selectedItemSet.itemset_price,
          itemset_qty: selectedItemSet.itemset_qty,
          // Include other fields as necessary
        }),
      });

      if (!response.ok) {
        message.error(`สินค้าไม่เพียงพอ: ${response.statusText}`);
      } else {
        const updatedItemSet = await response.json();
        console.log("Successfully updated item set:", updatedItemSet);

        // Close the editing dialog and refresh the list of item sets
        setEditDialogOpen(false);
        handleGet(); // This function should fetch the latest list of item sets from your API to update the UI
        Swal.fire({
          icon: "success",
          title: "แก้ไขสินค้าสำเร็จ",
          text: "ข้อมูลของสินค้าถูกอัปเดตแล้ว",
        });
      }
    } catch (error) {
      console.error("Error updating item set:", error);
      // Optionally, display an error message to the user
    }
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
            fontSize: "24px",
            marginLeft: "20px",
            height: "50px",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          จัดการชุดสินค้า
        </Typography>
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
                onClick={NavigateItemset}
                startIcon={<AddIcon />}
              >
                เพิ่มชุดสินค้า
              </Button>
            </Grid>

            <Paper
              elevation={3}
              sx={{ width: "100%", borderRadius: 2, overflow: "hidden" }}
            >
              <Table sx={{ borderRadius: 5 }}>
                <TableHead
                  style={{ backgroundColor: "#009ae1", color: "white" }}
                >
                  <TableRow>
                    <TableCell style={{ color: "white" }}>
                      ลำดับชุดสินค้า
                    </TableCell>
                    <TableCell style={{ color: "white" }}>
                      ชื่อชุดสินค้า
                    </TableCell>
                    <TableCell style={{ color: "white" }}>
                      รายละเอียดชุดสินค้า
                    </TableCell>
                    <TableCell style={{ color: "white" }}>
                      ราคาชุดสินค้า(บาท)
                    </TableCell>
                    <TableCell style={{ color: "white" }}>
                      จำนวนชุดสินค้า
                    </TableCell>
                    <TableCell style={{ color: "white" }}>แก้ไข</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemset
                    .slice(indexOfFirstItem, indexOfFirstItem + rowsPerPage)
                    .map((itemsetData, index) => (
                      <TableRow key={itemsetData.itemset_id}>
                        <TableCell>{indexOfFirstItem + index + 1}</TableCell>
                        <TableCell>{itemsetData.itemset_name}</TableCell>
                        <TableCell>{itemsetData.itemset_detail}</TableCell>
                        <TableCell>{itemsetData.itemset_price}</TableCell>
                        <TableCell>{itemsetData.itemset_qty}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleOpenEditDialog(itemsetData)}
                          >
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Paper>

            <Box
              sx={{
                mt: 3,
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
                  itemset.length
                )} of ${itemset.length}`}
              </Typography>
              <Pagination
                count={Math.ceil(itemset.length / rowsPerPage)}
                page={currentPage}
                onChange={handleChangePage}
                color="primary"
                rowsPerPageOptions={[10, 20, 30]} // Optionally, provide the available rows per page options
                rowsPerPage={rowsPerPage} // Pass the rowsPerPage state
              />
            </Box>
          </Container>
        </Box>
      </Box>{" "}
      {selectedItemSet && (
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>แก้ไขชุดสินค้า</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="ชื่อชุดสินค้า"
              type="text"
              fullWidth
              variant="outlined"
              value={selectedItemSet ? selectedItemSet.itemset_name : ""}
              onChange={(e) =>
                setSelectedItemSet({
                  ...selectedItemSet,
                  itemset_name: e.target.value,
                })
              }
            />
            <TextField
              margin="dense"
              label="รายละเอียด"
              type="text"
              fullWidth
              variant="outlined"
              value={selectedItemSet ? selectedItemSet.itemset_detail : ""}
              onChange={(e) =>
                setSelectedItemSet({
                  ...selectedItemSet,
                  itemset_detail: e.target.value,
                })
              }
            />
            <TextField
              margin="dense"
              label="ราคาขายชุดสินค้า"
              type="number"
              fullWidth
              variant="outlined"
              value={selectedItemSet ? selectedItemSet.itemset_price : ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value >= 0 || value === "") {
                  setSelectedItemSet({
                    ...selectedItemSet,
                    itemset_price: value,
                  });
                }
              }}
            />
            <TextField
              margin="dense"
              label="จำนวนชุดสินค้า"
              type="number"
              fullWidth
              variant="outlined"
              value={selectedItemSet ? selectedItemSet.itemset_qty : ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value >= 0 || value === "") {
                  setSelectedItemSet({
                    ...selectedItemSet,
                    itemset_qty: value,
                  });
                }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleSaveChanges}>บันทึก</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}