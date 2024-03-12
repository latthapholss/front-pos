import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Container,
  Pagination,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  CRefund,
  GETORDERDETAIL,
  PROMOTIONSTATUS,
  get,
  getorderproduct,
  ip,
  refundproduct,
  removeproduct,
} from "../Static/api";
import Swal from "sweetalert2";
import { MenuItem, Select } from "@mui/material";
import ReceiptDialog from "../Component/receipt/receiptDialog";
import orderBy from "lodash/orderBy";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ReceiptRefundDialog from "../Component/receipt/receiptRefundDialog";
import TextField from '@mui/material/TextField';

function SalesDetailPage({ person }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const [loading, setLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [viewReceiptOrderId, setViewReceiptOrderId] = useState(null);
  const [viewOrderProductsDialogOpen, setViewOrderProductsDialogOpen] = useState(false);
  const [selectedOrderProductData, setSelectedOrderProductData] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [viewReceiptRefundOrderId, setViewReceiptRefundOrderId] =
    useState(null);

  const [ORDERS, setORDERS] = useState([]);
  const [viewRefundProductsDialogOpen, setViewRefundProductsDialogOpen] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState({});


  useEffect(() => {
    handleGetORDER();
    startAutoUpdatePromotionStatus();
  }, []);

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
    setCurrentPage(1); // Reset the current page when changing rows per page
  };

  const handleReturnProduct = async (opid, order_id) => {
    try {
      // แสดงค่า opid และ order_id ที่จะส่งไปใน API ใน console.log
      console.log("Sending data to API:", { opid, order_id });

      const result = await fetch(`${ip}${refundproduct}`, {
        // ใช้ `${ip}${refundproduct}` เพื่อรวม URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ opid }), // ส่ง opid และ order_id ไปยัง API
      });

      if (!result.ok) {
        const errorText = await result.text(); // Get the error text if the response is not OK
        throw new Error(errorText || "Unexpected error");
      }

      const data = await result.json();

      if (data.success) {
        setSnackbarSeverity("success");
        setSnackbarMessage("คืนสินค้าเรียบร้อย");
        setSnackbarOpen(true);

        handleViewOrderProducts(order_id); // Call handleViewOrderProducts to load order products again

        handleGetORDER(order_id); // Assuming handleGetORDER reloads the order list
      } else {

        setSnackbarSeverity("error");
        setSnackbarMessage(data.message || "Unexpected error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage(error.message || "Unexpected error");
      setSnackbarOpen(true);
    }
  };

  const handleConfirmRefundProduct = async (opid, order_id) => {
    try {
      // แสดงค่า opid และ order_id ที่จะส่งไปใน API ใน console.log
      console.log("Sending data to API:", { opid, order_id });

      const result = await fetch(`${ip}${CRefund}`, {
        // ใช้ `${ip}${refundproduct}` เพื่อรวม URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ opid }), // ส่ง opid และ order_id ไปยัง API
      });

      if (!result.ok) {
        const errorText = await result.text(); // Get the error text if the response is not OK
        throw new Error(errorText || "Unexpected error");
      }

      const data = await result.json();

      if (data.success) {
        setSnackbarSeverity("success");
        setSnackbarMessage("คืนสินค้าเรียบร้อย");
        setSnackbarOpen(true);

        handleviewRefundProducts(order_id); // Call handleViewOrderProducts to load order products again
        setViewRefundProductsDialogOpen(false)
        handleGetORDER(order_id);
      } else {

        setSnackbarSeverity("error");
        setSnackbarMessage(data.message || "Unexpected error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage(error.message || "Unexpected error");
      setSnackbarOpen(true);
    }
  };
  const handleRemoveproduct = async (opid, order_id) => {
    try {
      // แสดงค่า opid และ order_id ที่จะส่งไปใน API ใน console.log
      console.log("Sending data to API:", { opid, order_id });

      const result = await fetch(`${ip}${removeproduct}`, {
        // ใช้ `${ip}${refundproduct}` เพื่อรวม URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ opid }), // ส่ง opid และ order_id ไปยัง API
      });

      if (!result.ok) {
        const errorText = await result.text(); // Get the error text if the response is not OK
        throw new Error(errorText || "Unexpected error");
      }

      const data = await result.json();

      if (data.success) {
        setSnackbarSeverity("success");
        setSnackbarMessage("นำสินค้าออกจากคลังเรียบร้อย");
        setSnackbarOpen(true);

        handleviewRefundProducts(order_id);
        setViewRefundProductsDialogOpen(false)
        handleGetORDER(order_id);
      } else {

        setSnackbarSeverity("error");
        setSnackbarMessage(data.message || "Unexpected error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage(error.message || "Unexpected error");
      setSnackbarOpen(true);
    }
  };
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };
  const padNumberWithZeros = (number, width) => {
    const numString = number.toString();
    const zerosToAdd = Math.max(0, width - numString.length);
    return "0".repeat(zerosToAdd) + numString;
  };

  const generateOrderCode = (orderId, paddingWidth) => {
    return `OID${padNumberWithZeros(orderId, paddingWidth)}`;
  };
  const handleviewRefundProducts = (orderId) => {
    setViewRefundProductsDialogOpen(true);
  };

  const handleGetORDER = async () => {
    try {
      console.log("Sending GET request to the API...");
      const res = await get(GETORDERDETAIL);

      console.log("Response from the API:", res);

      if (res.success) {
        if (Array.isArray(res.result)) {
          // Filter out duplicate orders based on order_id
          const uniqueOrders = [
            ...new Map(
              res.result.map((item) => [item.order_id, item])
            ).values(),
          ];
          const modifiedData = uniqueOrders.map((item) => ({
            order_id: item.order_id,
            total_amount: item.total_amount,
            status: item.status,
            point_use: item.point_use,
            order_date: new Date(item.order_date).toLocaleString(),
            order_products: item.order_products,
            total_quantity: item.total_quantity,
          }));

          console.log("Modified data:", modifiedData);

          setORDERS(modifiedData);
          setLoading(false);
        } else {
          console.error("'result' property is not an array:", res.result);
          setLoading(false);
        }
      } else {
        console.error("Error fetching promotions1:", res.error);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching promotions:", error);
      setLoading(false);
    }
  };

  const startAutoUpdatePromotionStatus = () => {
    const interval = 30000; // 30 วินาทีในมิลลิวินาที

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

  const handleViewReceipt = (orderId) => {
    // แก้ไขฟังก์ชันนี้เพื่อทำงานเมื่อคลิกที่ปุ่ม "ดูใบเสร็จ"
    console.log(`View receipt for order ID: ${orderId}`);
    // เปิดหน้า ReceiptDialog ที่นี่
    setViewReceiptOrderId(orderId);
  };

  const handleViewReceiptRefund = (orderId) => {
    // แก้ไขฟังก์ชันนี้เพื่อทำงานเมื่อคลิกที่ปุ่ม "ดูใบเสร็จ"
    console.log(`View receipt for order ID: ${orderId}`);
    // เปิดหน้า ReceiptDialog ที่นี่
    setViewReceiptRefundOrderId(orderId);
  };


  const currentItems = ORDERS.slice(indexOfFirstItem, indexOfLastItem);

  const [orderByField, setOrderByField] = useState(
    "order_date",
    "order_code",
    "unit_price",
    "quantity",
    "total_amount",
    "op_status"
  );

  const [order, setOrder] = useState("asc");

  // ... other state and functions ...

  const handleSort = (field) => {
    if (orderByField === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setOrderByField(field);
      setOrder("asc");
    }
  };
  const sortedItems = orderBy(
    currentItems,
    [
      (item) => {
        if (orderByField === "order_code") {
          return item.order_code.toLowerCase();
        } else if (orderByField === "order_date") {
          return new Date(item.order_date);
        } else if (orderByField === "unit_price") {
          const unitPriceValue =
            typeof item.unit_price === "string"
              ? parseFloat(item.unit_price.replace(/[^\d.]/g, "")) || 0
              : item.unit_price || 0;

          return isNaN(unitPriceValue) ? 0 : unitPriceValue;
        } else if (orderByField === "quantity") {
          return item.quantity || 0;
        } else if (orderByField === "total_amount") {
          const totalAmountValue =
            typeof item.total_amount === "string"
              ? parseFloat(item.total_amount.replace(/[^\d.]/g, "")) || 0
              : item.total_amount || 0;

          return isNaN(totalAmountValue) ? 0 : totalAmountValue;
        } else if (orderByField === "op_status") {
          return item.op_status === "คืนสินค้า"
            ? 0
            : item.op_status === "ขายสินค้าสำเร็จ"
              ? 0
              : 0;
        } else {
          return item[orderByField];
        }
      },
    ],
    [order]
  );

  const handleViewOrderProducts = async (orderId) => {
    try {
      const response = await fetch(`${ip}${getorderproduct}${orderId}`); // ใช้ getorderproduct แทน URL
      if (!response.ok) {
        throw new Error("Failed to fetch order products");
      }
      const data = await response.json();

      // Set the received order product data in the state
      setSelectedOrderProductData(data.result); // Use data.result to access the product details

      // Open the dialog with the order ID as part of the data
      setViewOrderProductsDialogOpen(true);

      // Log a message when the "View Order Products" button is clicked
      console.log(`View Order Products clicked for order ID: ${orderId}`);
    } catch (error) {
      console.error("Error fetching order products:", error);
    }
  };


  const handleViewOrderRefundProducts = async (orderId) => {
    try {
      const response = await fetch(`${ip}${getorderproduct}${orderId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch order products");
      }
      const data = await response.json();

      const successProducts = data.result.filter(product => product.status === "refund");

      console.log('ข้อมูล', successProducts)
      setSelectedRefund(successProducts);

      setViewRefundProductsDialogOpen(true);

      console.log(`View Order Products clicked for order ID: ${orderId}`);
    } catch (error) {
      console.error("Error fetching order products:", error);
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
            fontSize: "24px", // Add this line for the border // Add some padding for space around the text
            marginLeft: "20px",
            height: "50px",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          ข้อมูลการขาย
        </Typography>
      </Box>
      <Box sx={{ margin: "15px", backgroundColor: "white", borderRadius: 3 }}>
        <Box component="main" flexGrow={1} p={3}>
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
                รายการขาย
              </Typography>
            </Grid>
            <Paper
              elevation={3}
              sx={{ width: "100%", borderRadius: 2, overflow: "hidden" }}
            >
              <Table sx={{ borderRadius: 2 }}>
                <TableHead style={{ backgroundColor: "#009ae1" }}>
                  <TableRow style={{ color: "white" }}>
                    <TableCell
                      style={{ color: "white" }}
                      onClick={() => handleSort("order_code")}
                    >
                      รหัสออเดอร์{" "}
                      {orderByField === "order_code" && (
                        <span>{order === "asc" ? "▲" : "▼"}</span>
                      )}
                    </TableCell>
                    <TableCell
                      style={{ color: "white" }}
                      onClick={() => handleSort("order_date")}
                    >
                      วันที่ออเดอร์{" "}
                      {orderByField === "order_date" && (
                        <span>{order === "asc" ? "▲" : "▼"}</span>
                      )}
                    </TableCell>
                    {/* <TableCell
                      style={{ color: "white" }}
                      onClick={() => handleSort("unit_price")}
                    >
                      ราคาขาย{" "}
                      {orderByField === "unit_price" && (
                        <span>{order === "asc" ? "▲" : "▼"}</span>
                      )}
                    </TableCell> */}
                    <TableCell
                      style={{ color: "white" }}
                      onClick={() => handleSort("quantity")}
                    >
                      จำนวน{" "}
                      {orderByField === "quantity" && (
                        <span>{order === "asc" ? "▲" : "▼"}</span>
                      )}
                    </TableCell>
                    <TableCell
                      style={{ color: "white" }}
                      onClick={() => handleSort("total_amount")}
                    >
                      ยอดรวม{" "}
                      {orderByField === "total_amount" && (
                        <span>{order === "asc" ? "▲" : "▼"}</span>
                      )}
                    </TableCell>

                    <TableCell style={{ color: "white" }}>
                      รายการสินค้า
                    </TableCell>
                    <TableCell style={{ color: "white" }}>ใบเสร็จ</TableCell>
                    <TableCell style={{ color: "white" }}>
                      ใบเสร็จคืนสินค้า
                    </TableCell>
                    <TableCell style={{ color: "white" }}>
                      ยืนยันการคืนสินค้า                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedItems.map((item, index) => (
                    <TableRow key={item.order_id}>
                      <TableCell>{item.order_id}</TableCell>
                      <TableCell>{item.order_date}</TableCell>

                      <TableCell>{item.total_quantity}</TableCell>
                      <TableCell>{item.total_amount} บาท</TableCell>

                      <TableCell>
                        <Button
                          onClick={() => handleViewOrderProducts(item.order_id)}
                          variant="contained"
                          color="primary"
                        >
                          รายการสินค้า
                        </Button>
                      </TableCell>

                      <TableCell>
                        <Button
                          onClick={() => handleViewReceipt(item.order_id)}
                          variant="contained"
                          style={{ backgroundColor: "#F06B6B", color: "white" }}
                        >
                          ใบเสร็จสินค้า
                        </Button>
                      </TableCell>
                      <TableCell>
                        {item.order_products.some((product) => product.op_status === "refund") && (
                          <Button
                            onClick={() => handleViewReceiptRefund(item.order_id)}
                            variant="contained"
                            style={{
                              backgroundColor: "#795548",
                              color: "white",
                              marginRight: "8px", // Add some spacing between buttons
                            }}
                          >
                            ใบเสร็จคืนสินค้า
                          </Button>

                        )}
                      </TableCell>
                      <TableCell>
                        {item.order_products.some((product) => product.op_status === "refund") && (
                          <Button
                            onClick={() => handleViewOrderRefundProducts(item.order_id)}
                            variant="contained"
                            style={{
                              backgroundColor: "#9292D1",
                              color: "white",
                            }}
                          >
                            รายการคืนสินค้า
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={13}>
                      <Box
                        sx={{
                          mt: 3,
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="caption" sx={{ marginRight: 2 }}>
                          จำนวนหน้า:
                        </Typography>
                        <Select
                          value={rowsPerPage}
                          onChange={handleRowsPerPageChange}
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
                            ORDERS.length
                          )} of ${ORDERS.length}`}
                        </Typography>
                        <Pagination
                          count={Math.ceil(ORDERS.length / rowsPerPage)}
                          page={currentPage}
                          onChange={handlePageChange}
                          color="primary"
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </Container>
        </Box>
      </Box>
      <Dialog
        open={viewOrderProductsDialogOpen}
        onClose={() => setViewOrderProductsDialogOpen(false)}
      >
        <DialogTitle>รายการสินค้า</DialogTitle>
        <DialogContent>
          {Array.isArray(selectedOrderProductData) &&
            selectedOrderProductData.length > 0 ? (
            <Table>
              <TableHead style={{ backgroundColor: "#009ae1" }}>
                <TableRow>
                  <TableCell style={{ color: "white" }}>รหัสออเดอร์</TableCell>{" "}
                  {/* เพิ่มคอลัมน์รหัสออเดอร์ */}
                  <TableCell style={{ color: "white" }}>ชื่อสินค้า</TableCell>
                  <TableCell style={{ color: "white" }}>จำนวนสินค้า</TableCell>
                  <TableCell style={{ color: "white" }}>ราคา</TableCell>
                  <TableCell style={{ color: "white" }}>
                    สถานะออเดอร์{" "}
                    {orderByField === "op_status" && (
                      <span>{order === "asc" ? "▲" : "▼"}</span>
                    )}
                  </TableCell>
                  <TableCell style={{ color: "white" }}>คืนสินค้า</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedOrderProductData.map((product) => (
                  <TableRow key={product.product_id}>
                    <TableCell>{product.opid}</TableCell>
                    <TableCell>{product.product_name}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{product.unit_price}</TableCell>
                    <TableCell
                      style={{
                        color:
                          product.status === "success"
                            ? "#44C8A7"
                            : product.status === "refund"
                              ? "#ffbb00"
                              : product.status === "Confirmrefund"
                                ? "#1a237e"
                                : product.status === "RemoveProduct"
                                  ? "#d01716"
                                  : "white",
                        border: "1px solid #e0e0e0",
                        padding: "8px",
                        backgroundColor:
                          product.status === "success"
                            ? "#E8F8F4"
                            : product.status === "refund"
                              ? "#fff3d1"
                              : product.status === "Confirmrefund"
                                ? "#e8eaf6"
                                : product.status === "RemoveProduct"
                                  ? "#f8d7da"
                                  : "white",
                        borderRadius: "5px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {product.status === "success"
                        ? "ขายสินค้าสำเร็จ"
                        : product.status === "refund"
                          ? "คืนสินค้า"
                          : product.status === "Confirmrefund"
                            ? "เติมสินค้าเข้าคลัง"
                            : product.status === "RemoveProduct"
                              ? "สินค้ามีชำรุด:นำสินค้าออก"
                              : product.status}
                    </TableCell>

                    <TableCell>
                      {product.status === "success" && (
                        <Button
                          onClick={() =>
                            handleReturnProduct(product.opid, product.order_id)
                          }
                          variant="contained"
                          color="primary"
                        >
                          คืนสินค้า
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No order products to display.</p>
          )}
        </DialogContent>
      </Dialog>


      <Dialog
        open={viewRefundProductsDialogOpen}
        onClose={() => setViewRefundProductsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>ยืนยันการคืนสินค้า</DialogTitle>
        <DialogContent>
          {Array.isArray(selectedRefund) && selectedRefund.length > 0 ? (
            <Table>
              <TableHead style={{ backgroundColor: "#009ae1" }}>
                <TableRow sx={{ whiteSpace: 'nowrap' }}>
                  {/* <TableCell style={{ color: "white" ,whiteSpace: 'nowrap'}}>รหัสออเดอร์</TableCell>{" "} */}
                  {/* เพิ่มคอลัมน์รหัสออเดอร์ */}
                  <TableCell style={{ color: "white", width: '200px', whiteSpace: 'nowrap' }}>ชื่อสินค้า</TableCell>
                  <TableCell style={{ color: "white" }}>จำนวนสินค้า</TableCell>
                  <TableCell style={{ color: "white" }}>ราคา</TableCell>
                  <TableCell style={{ color: "white" }}>
                    สถานะออเดอร์{" "}
                    {orderByField === "op_status" && (
                      <span>{order === "asc" ? "▲" : "▼"}</span>
                    )}
                  </TableCell>
                  <TableCell style={{ color: "white" }}>คืนสินค้า</TableCell>
                  <TableCell style={{ color: "white" }}>ลบสินค้า</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedRefund.map((product) => (
                  <TableRow sx={{ whiteSpace: 'nowrap', textAlign: 'center' }} key={product.product_id}>
                    {/* <TableCell>{product.opid}</TableCell> */}
                    <TableCell>{product.product_name}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{product.unit_price}</TableCell>
                    <TableCell
                      style={{
                        color:
                          product.status === "refund"
                            ? "#ffbb00"
                            : "white",
                        border: "1px solid #e0e0e0",
                        padding: "8px",
                        backgroundColor:
                          product.status === "refund"
                            ? "#fff3d1"
                            : "white",
                        borderRadius: "5px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {product.status === "refund"
                        ? "คืนสินค้า"
                        : product.status}
                    </TableCell>

                    <TableCell>
                      <Button
                        onClick={() =>
                          handleConfirmRefundProduct(product.opid, product.order_id)
                        }
                        variant="contained"
                        color="primary"
                        style={{ backgroundColor: '#397D54' }}
                      >
                        ยืนยันการคืนสินค้า
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() =>
                          handleRemoveproduct(product.opid, product.order_id)
                        }
                        variant="contained"
                        color="primary"
                        style={{ backgroundColor: '#3b50ce' }}
                      >
                        นำสินค้าออก
                      </Button>
                    </TableCell>


                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
        </DialogContent>
      </Dialog>


      {viewReceiptOrderId && (
        <ReceiptDialog
          open={true}
          handleClose={() => setViewReceiptOrderId(null)}
          orderId={viewReceiptOrderId}
        />
      )}
      {viewReceiptRefundOrderId && (
        <ReceiptRefundDialog
          open={true}
          handleClose={() => setViewReceiptRefundOrderId(null)}
          orderId={viewReceiptRefundOrderId}
        />
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} // ปิด Snackbar หลังจากแสดงเป็นเวลา 3 วินาที
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // ตำแหน่งด้านขวาบน
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default SalesDetailPage;
