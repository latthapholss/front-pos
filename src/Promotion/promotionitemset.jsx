import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Paper,
    Container,
    Select,
    MenuItem,
    Pagination
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getitemset, ip } from '../Static/api';

export default function PromotionItemSet() {
    const navigate = useNavigate();
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [itemset, setItemset] = useState();
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        handleGetItemSets();
    }, []);

    const handleGetItemSets = () => {
        const myHeaders = new Headers();
        myHeaders.append("Cookie", "connect.sid=s%3ASSC4hMkXL9fEmIVwMQF8D26HXanW06Sf.QB8Z4Hklq41c1k0jTtKS59G0lbKeDjBBI9lbU2izMD8");

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(ip + getitemset, requestOptions) // เปลี่ยนจาก "ip+getitemset" เป็น ip + getitemset
            .then(response => response.json())
            .then(result => {
                console.log(result); // แสดงค่า result ใน console เพื่อตรวจสอบ
                // แปลง confidence เป็นตัวเลข (อย่าลืมตัดเครื่องหมาย % ด้วย)
                const filteredResult = result.filter(item => parseFloat(item.confidence) > 70 && parseFloat(item.lift) >= 1.00);
                setItemset(filteredResult);
            })
            .catch(error => console.error(error));
    };


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const indexOfFirstItem = (currentPage - 1) * rowsPerPage;
    const indexOfLastItem = currentPage * rowsPerPage;

    const handleCreateProduct = (productId1, productId2) => {
        // ทำการสร้าง URL ด้วย template literals โดยระบุ product_id_1 และ product_id_2
        const url = `/additemset/${productId1}/${productId2}`;
        // ใช้ navigate เพื่อเปลี่ยนเส้นทางไปยัง URL ที่กำหนด
        navigate(url);
    };

    const handleGoBack = () => {
        navigate('/promotion/promotionadd')
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
            <Button startIcon={<ArrowBackIcon />} color="primary" onClick={handleGoBack} >

                ย้อนกลับ
            </Button>

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
                            }}>ชุดโปรโมชั่น</Typography>
                            <Button
                                sx={{ backgroundColor: '#28bc94', marginRight: '20px' }}
                                variant="contained"
                                onClick={() => navigate('/promotion/promotionitemset')}
                            >
                                จัดการชุดสินค้า
                            </Button>
                        </Grid>
                        <Paper elevation={3} sx={{ width: '100%', borderRadius: 2, overflow: 'hidden' }}>
                            <Table sx={{ borderRadius: 5 }}>
                                <TableHead style={{ backgroundColor: "#009ae1", color: 'white' }}>
                                    <TableRow>
                                        <TableCell style={{ color: 'white' }}>ชุดสินค้า</TableCell>
                                        <TableCell style={{ color: 'white' }}>รหัสสินค้า</TableCell>
                                        <TableCell style={{ color: 'white' }}>ชื่อสินค้า</TableCell>
                                        <TableCell style={{ color: 'white' }}>รหัสสินค้า</TableCell>
                                        <TableCell style={{ color: 'white' }}>ชื่อสินค้า</TableCell>
                                        <TableCell style={{ color: 'white' }}>สร้างสินค้า</TableCell> {/* เพิ่มคอลัมน์สร้างสินค้า */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {itemset && itemset.length > 0 ? (
                                        itemset.slice(indexOfFirstItem, indexOfLastItem).map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.rule}</TableCell>
                                                <TableCell>{`PID${String(item.product_id_1).padStart(6, '0')}`}</TableCell>
                                                <TableCell>{item.product_name1}</TableCell>
                                                <TableCell>{`PID${String(item.product_id_2).padStart(6, '0')}`}</TableCell>
                                                <TableCell>{item.product_name2}</TableCell>
                                                <TableCell>
                                                    {/* เพิ่มปุ่มสร้างสินค้า */}

                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleCreateProduct(item.product_id_1, item.product_id_2)}
                                                    >
                                                        สร้าง
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={10}>No data available</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                            <TableRow sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <TableCell colSpan={10}>
                                    <Box
                                        sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
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
                                        {/* <Typography variant="caption" sx={{ marginRight: 2 }}>
                                            {`${indexOfFirstItem + 1}–${Math.min(indexOfLastItem, itemset.length)} of ${itemset.length}`}
                                        </Typography> */}
                                        {/* <Pagination
                                            count={Math.ceil(itemset.length / rowsPerPage)}
                                            page={currentPage}
                                            onChange={handlePageChange}
                                            color="primary"
                                        /> */}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        </Paper>
                    </Container>
                </Box>
            </Box>
        </div>
    );
}
