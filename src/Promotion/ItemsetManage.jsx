import {
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
} from "@mui/material";

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
  const navigate = useNavigate();
  const NavigateItemset = () => {
    navigate("/promotion/promotionitemset");
  };
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;
    setRowsPerPage(newRowsPerPage);
    const newPage = Math.ceil((indexOfFirstItem + 1) / newRowsPerPage);
    setCurrentPage(newPage);
  };

  useEffect(() => {
    handleGet();
  }, []);

  const handleSwitchChange = (id) => {
    // เขียนโค้ดเพื่อปรับเปลี่ยนสถานะการใช้งานของ promotion ด้วย id ที่รับมา
  };

  const handleOpenEditDialog = (promotionData) => {
    // เขียนโค้ดเพื่อเปิด dialog สำหรับแก้ไข promotion
  };
  const indexOfLastItem = currentPage * rowsPerPage;

  const handleDeletePromotion = (id) => {
    // เขียนโค้ดเพื่อลบ promotion ด้วย id ที่รับมา
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
  };
  const itemsPerPage = 10;
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
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
                    <TableCell style={{ color: "white" }}>ลบ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemset.map((itemsetData, index) => (
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
                      <TableCell>
                        <IconButton
                          onClick={() =>
                            handleDeletePromotion(itemsetData.itemset_id)
                          }
                        >
                          <DeleteIcon />
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
                Rows per page:
              </Typography>
              <Select
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                variant="outlined"
                sx={{ marginRight: 2 }}
              >
                <MenuItem value={10}>10 rows</MenuItem>
                <MenuItem value={20}>20 rows</MenuItem>
                <MenuItem value={30}>30 rows</MenuItem>
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
              />
            </Box>
          </Container>
        </Box>
      </Box>
      <Pagination
        count={Math.ceil(itemset.length / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
      />
    </div>
  );
}
