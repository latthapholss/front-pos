import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { additemset, gettwoproduct, ip, post } from "../Static/api";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import { Link as RouterLink, useParams } from "react-router-dom";
import { InputAdornment } from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function ItemsetPromotionadd() {
  const [products1, setProducts1] = useState({});
  const [products2, setProducts2] = useState({});
  const [productName1, setProductName1] = useState("");
  const [productName2, setProductName2] = useState("");
  const [productQuantity1, setProductQuantity1] = useState("");
  const [productQuantity2, setProductQuantity2] = useState("");
  const [setQuantity, setSetQuantity] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountCodeCost, setDiscountCodeCost] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const { id1, id2 } = useParams();
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [details, setDetails] = useState("");
  const [itemsetname, setItemsetName] = useState("");
  const navigate = useNavigate();
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    handlegettwoproduct();
    console.log(products1);
  }, []);
  const handlegettwoproduct = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
      "Cookie",
      "connect.sid=s%3AQG7ortzxQHWMz05v6-9Pqys5rEPaOLJX.X%2Fe0C28RNrn%2FEqXutKVniwtXfn6arQnoZjjURx%2FBETs"
    );

    const raw = JSON.stringify({
      product_id1: id1, // Use dynamic IDs from URL
      product_id2: id2,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(ip + gettwoproduct, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          const product1 = {
            id: result.data.product1[0].product_id,
            name: result.data.product1[0].product_name,
            quantity: result.data.product1[0].total_qty,
            price: result.data.product1[0].total_price,
            cost: result.data.product1[0].total_cost,
          };

          const product2 = {
            id: result.data.product2[0].product_id,
            name: result.data.product2[0].product_name,
            quantity: result.data.product2[0].total_qty,
            price: result.data.product2[0].total_price,
            cost: result.data.product2[0].total_cost,
          };

          setProducts1(product1);
          setProducts2(product2);
          const totalPrice = product1.price + product2.price;
          const totalCost = product1.cost + product2.cost;
          setTotalPrice(totalPrice);
          setTotalCost(totalCost);
          console.log("Product 1:", product1);
          console.log("Product 2:", product2);
        } else {
          Swal.fire({
            icon: "error",
            title: "สินค้าหมดหรือไม่มีสินค้า",
            text: result.message,
          }).then((result) => {
            if (result.isConfirmed) {
              window.history.back();
            }
          });
        }
      })
      .catch((error) => console.error(error));
  };

  const calculateDiscountedPrice = (price, discount) => {
    const discountedPrice = price - price * (parseFloat(discount) / 100);
    setDiscountedPrice(discountedPrice);
  };

  const handleAddProductSet = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
      "Cookie",
      "connect.sid=s%3Akff5Isq6V9owpc0C5gMhC_i0DdNsDazP.90aRlzFd%2FTgwJKqQYTj55q%2FmGTAqPXaBeaD2eDyf1mw"
    );

    const raw = JSON.stringify({
      itemset_name: itemsetname,
      itemset_detail: details,
      itemset_price: discountCode
        ? totalPrice - totalPrice * (parseFloat(discountCode) / 100)
        : totalPrice,
      itemset_qty: setQuantity,
      itemset_product_1: products1.id,
      itemset_product_2: products2.id,
      itemset_cost: totalCost,
    });
    if (!itemsetname || !details || !setQuantity || !discountCode) {
      // ถ้ามีข้อมูลไม่ครบ ให้แสดงข้อความเตือน
      Swal.fire({
        icon: "error",
        title: "กรุณากรอกข้อมูล",
        text: "กรุณากรอกข้อมูลให้ครบถ้วน",
      });
      return;
    }
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(ip + additemset, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Itemset added successfully!",
          }).then(() => {
            // หลังจากกด OK แล้ว กลับไปยังหน้า "/promotion/ItemsetManage"
            navigate("/promotion/ItemsetManage");
          });
        } else {
          // กรณีมีข้อผิดพลาดจากการเพิ่มชุดสินค้า
          Swal.fire({
            icon: "error",
            title: "Failed",
            text: `Failed to add itemset: ${result.message}`,
          });
        }
      })
      .catch((error) => {
        console.error("Error adding itemset:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while adding itemset.",
        });
      });
  };

  const handleDiscountCodeChange = (e) => {
    const value = e.target.value;
    // ตรวจสอบว่าค่าที่กรอกเข้ามาไม่เกิน 100
    if (value === "" || (parseInt(value) >= 0 && parseInt(value) <= 100)) {
      setDiscountCode(value);
      setDiscountCodeCost(value);
    }
  };

  const handleDetailsChange = (event) => {
    setDetails(event.target.value);
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
          จัดการโปรโมชั่น
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
                เพิ่มชุดสินค้า
              </Typography>
            </Grid>
            <Container style={{ display: "flex", justifyContent: "center" }}>
              <Box
                sx={{
                  bgcolor: "white",
                  display: "grid",
                  gap: 2,
                  padding: 2,
                  borderBottomLeftRadius: 2,
                  borderBottomRightRadius: 2,
                }}
              >
                {/* TextField สำหรับราคารวมตอนลด */}
                <TextField
                  sx={{ mb: 2, gridColumn: "1 / span 2" }}
                  fullWidth
                  margin="normal"
                  type="text"
                  label="ชื่อชุดสินค้า"
                  value={itemsetname}
                  onChange={(e) => setItemsetName(e.target.value)}
                />

                {/* TextField สำหรับชื่อสินค้าที่ 1 */}
                <TextField
                  value={products1.name}
                  onChange={(e) => setProductName1(e.target.value)}
                  fullWidth
                  margin="normal"
                  disabled
                  InputProps={{
                    style: { textAlign: "center" },
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant="body2">
                          ชื่อสินค้าชิ้นที่ 1 :
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* TextField สำหรับจำนวนสินค้าของชิ้นที่ 1 */}
                <TextField
                  sx={{ mb: 2 }}
                  value={products1.quantity}
                  onChange={(e) => setProductQuantity1(e.target.value)}
                  fullWidth
                  margin="normal"
                  type="number"
                  disabled
                  InputProps={{
                    style: { textAlign: "center" },
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant="body2">
                          จำนวนสินค้าของ {products1.name} :
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* TextField สำหรับชื่อสินค้าที่ 2 */}
                <TextField
                  value={products2.name}
                  onChange={(e) => setProductName2(e.target.value)}
                  fullWidth
                  margin="normal"
                  disabled
                  InputProps={{
                    style: { textAlign: "center" },
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant="body2">
                          ชื่อสินค้าชิ้นที่ 2 :
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* TextField สำหรับจำนวนสินค้าของชิ้นที่ 2 */}
                <TextField
                  sx={{ mb: 2 }}
                  value={products2.quantity}
                  onChange={(e) => setProductQuantity2(e.target.value)}
                  fullWidth
                  margin="normal"
                  type="number"
                  disabled
                  InputProps={{
                    style: { textAlign: "center" },
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant="body2">
                          จำนวนสินค้าของ {products2.name}
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  sx={{ mb: 2 }}
                  label="จำนวนชุดสินค้า (ไม่เกินจำนวนคู่สูงสุด)"
                  value={setQuantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    const maxPairs = Math.min(
                      Math.floor(parseInt(products1.quantity)),
                      Math.floor(parseInt(products2.quantity))
                    );
                    // Check if the entered value is within the allowed range
                    if (value <= maxPairs) {
                      setSetQuantity(value);
                    } else {
                      // If entered value exceeds the maximum allowed, set it to the maximum
                      setSetQuantity(maxPairs);
                    }
                  }}
                  fullWidth
                  margin="normal"
                  type="number"
                />

                <TextField
                  sx={{ mb: 2 }}
                  label="กรอก % ลดราคา"
                  value={discountCode}
                  onChange={handleDiscountCodeChange}
                  fullWidth
                  margin="normal"
                  type="number"
                />

                <TextField
                  sx={{ mb: 2, gridColumn: "1 / span 2" }}
                  fullWidth
                  margin="normal"
                  type="number"
                  disabled
                  value={
                    discountCode
                      ? totalPrice -
                      totalPrice * (parseFloat(discountCode) / 100)
                      : totalPrice
                  }
                  InputProps={{
                    style: { textAlign: "center" },
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant="body2"> ราคารวมตอนลด </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: discountCode ? "red" : "inherit",
                            marginLeft: 1,
                            marginRight: 1,
                          }}
                        >
                          {discountCode
                            ? ` (ลด ${totalPrice * (parseFloat(discountCode) / 100)
                            } บาท)`
                            : ` ${totalPrice} บาท`}
                        </Typography>
                        :
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  sx={{ mb: 2, gridColumn: "1 / span 2" }}
                  fullWidth
                  margin="normal"
                  type="number"
                  disabled
                  value={totalCost}
                  InputProps={{
                    style: { textAlign: "center" },
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant="body2"> ราคาต้นทุนรวม </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: discountCodeCost ? "red" : "inherit",
                            marginLeft: 1,
                            marginRight: 1,
                          }}
                        ></Typography>
                        :
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  sx={{ mb: 2, gridColumn: "1 / span 2" }}
                  label="กรอกรายละเอียด"
                  value={details}
                  onChange={handleDetailsChange}
                  fullWidth
                  margin="normal"
                  type="text"
                />
                {/* ลิงก์ย้อนกลับ */}
                <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
                  <Link component={RouterLink} to="/promotion/promotionitemset" color="primary">
                    ย้อนกลับ
                  </Link>
                </Typography>

                {/* ปุ่มเพิ่มชุดสินค้า */}
                <Button
                  sx={{ mt: 0, backgroundColor: "#55BD2A", color: "white" }}
                  variant="contained"
                  onClick={handleAddProductSet}
                >
                  เพิ่มชุดสินค้า
                </Button>
              </Box>
            </Container>
          </Container>
        </Box>
      </Box>
    </div>
  );
}