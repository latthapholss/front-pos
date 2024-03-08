import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { gettwoproduct, ip } from '../Static/api';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { InputAdornment } from '@mui/material';
import Swal from 'sweetalert2';

export default function ItemsetPromotionadd() {
    const [products1, setProducts1] = useState({});
    const [products2, setProducts2] = useState({});
    const [productName1, setProductName1] = useState('');
    const [productName2, setProductName2] = useState('');
    const [productQuantity1, setProductQuantity1] = useState('');
    const [productQuantity2, setProductQuantity2] = useState('');
    const [setQuantity, setSetQuantity] = useState('');
    const [discountCode, setDiscountCode] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const { id1, id2 } = useParams();
    const [discountedPrice, setDiscountedPrice] = useState(0);

    useEffect(() => {
        handlegettwoproduct();
        console.log(products1)
    }, []);

    const handlegettwoproduct = () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append(
            "Cookie",
            "connect.sid=s%3AQG7ortzxQHWMz05v6-9Pqys5rEPaOLJX.X%2Fe0C28RNrn%2FEqXutKVniwtXfn6arQnoZjjURx%2FBETs"
        );

        const raw = JSON.stringify({
            "product_id1": id1, // Use dynamic IDs from URL
            "product_id2": id2
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(ip + gettwoproduct, requestOptions)
            .then(response => response.json())
            .then(result => {
                // console.log(result);
                if (result.success) {
                    const product1 = {
                        id: result.data.product1.product_id,
                        name: result.data.product1.product_name,
                        quantity: result.data.product1.product_lot_qty,
                        is_active: result.data.product1.is_active,
                        price: result.data.product1.product_lot_price,
                        product_type_id: result.data.product1.product_type_id
                    };

                    const product2 = {
                        id: result.data.product2.product_id,
                        name: result.data.product2.product_name,
                        quantity: result.data.product2.product_lot_qty,
                        is_active: result.data.product2.is_active,
                        price: result.data.product2.product_lot_price,
                        product_type_id: result.data.product2.product_type_id
                    };

                    setProducts1(product1);
                    setProducts2(product2);
                    const totalPrice = product1.price + product2.price;
                    setTotalPrice(totalPrice);
                } else Swal.fire({
                    icon: 'error',
                    title: 'สินค้าหมดหรือไม่มีสินค้า',
                    text: result.message,
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Navigate back to the previous page upon closing the alert
                        window.history.back();
                    }
                });

            })
            .catch(error => console.error(error));
    };


    const calculateDiscountedPrice = (price, discount) => {
        const discountedPrice = price - (price * (parseFloat(discount) / 100));
        setDiscountedPrice(discountedPrice);
    };
    const handleAddProductSet = () => {
        // ตัวอย่างเท่านั้น คุณสามารถเขียนโค้ดในฟังก์ชันนี้ตามความต้องการของคุณ
        console.log("เพิ่มชุดสินค้า");
    };

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography
                    variant="h4"
                    align="left"
                    sx={{
                        color: '#333335',
                        marginTop: '20px',
                        fontSize: '24px',
                        marginLeft: '20px',
                        height: '50px',
                        borderRadius: 2,
                        textAlign: 'center'
                    }}
                >
                    จัดการโปรโมชั่น
                </Typography>
            </Box>

            <Box sx={{ margin: '15px', backgroundColor: 'white', height: '1100px', borderRadius: 3, padding: '20px' }}>
                <Box component="main">
                    <Container maxWidth="xl">
                        <Grid container justifyContent="space-between" alignItems="center" mb={4}>
                            <Typography variant="h5" sx={{
                                fontSize: '20px',
                                borderBottom: '2px solid #009ae1',
                                paddingBottom: '5px',
                                color: '#333335',
                                fontWeight: 'bold'
                            }}>เพิ่มชุดสินค้า</Typography>
                        </Grid>
                        <Container style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box
                                sx={{
                                    bgcolor: "white",
                                    display: 'grid',
                                    gap: 2,
                                    padding: 2,
                                    borderBottomLeftRadius: 2,
                                    borderBottomRightRadius: 2,
                                }}
                            >
                                {/* TextField สำหรับราคารวมตอนลด */}
                                <TextField
                                    sx={{ mb: 2, gridColumn: '1 / span 2' }}
                                    fullWidth
                                    margin="normal"
                                    type="number"
                                    disabled
                                    value={discountCode ? (totalPrice - (totalPrice * (parseFloat(discountCode) / 100))) : totalPrice}
                                    InputProps={{
                                        style: { textAlign: 'center' },
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Typography variant="body2" > ราคารวมตอนลด  </Typography>
                                                <Typography variant="body2" sx={{ color: discountCode ? 'red' : 'inherit', marginLeft: 1, marginRight: 1 }}>

                                                    {discountCode
                                                        ? ` (ลด ${totalPrice * (parseFloat(discountCode) / 100)} บาท)`
                                                        : ` ${totalPrice} บาท`}
                                                </Typography>
                                                :
                                            </InputAdornment>
                                        )
                                    }}
                                />





                                {/* TextField สำหรับชื่อสินค้าที่ 1 */}
                                <TextField
                                    value={products1.name}
                                    onChange={(e) => setProductName1(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    disabled
                                    InputProps={{
                                        style: { textAlign: 'center' },
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Typography variant="body2">ชื่อสินค้าชิ้นที่ 1 :</Typography>
                                            </InputAdornment>
                                        )
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
                                        style: { textAlign: 'center' },
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Typography variant="body2">จำนวนสินค้าของ {products1.name} :</Typography>
                                            </InputAdornment>
                                        )
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
                                        style: { textAlign: 'center' },
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Typography variant="body2">ชื่อสินค้าชิ้นที่ 2 :</Typography>
                                            </InputAdornment>
                                        )
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
                                        style: { textAlign: 'center' },
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Typography variant="body2">จำนวนสินค้าของ {products2.name}</Typography>
                                            </InputAdornment>
                                        )
                                    }}
                                />

                                {/* TextField สำหรับกรอกจำนวนชุดสินค้า */}
                                <TextField
                                    sx={{ mb: 2 }}
                                    label="กรอกจำนวนชุดสินค้า"
                                    value={setQuantity}
                                    onChange={(e) => setSetQuantity(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    type="number"
                                />

                                {/* TextField สำหรับกรอกเบอร์เซ็นลดราคา */}
                                <TextField
                                    sx={{ mb: 2 }}
                                    label="กรอก % ลดราคา"
                                    value={discountCode}
                                    onChange={(e) => setDiscountCode(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    type="number"
                                />

                                {/* ลิงก์ย้อนกลับ */}
                                <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
                                    <Link component={RouterLink} to="/login" color="primary">
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
