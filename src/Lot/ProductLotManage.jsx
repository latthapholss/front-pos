import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Typography, TextField, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { get, getlotprouduct, ip, post, ACTIVE_PRODUCT, DELETELOT } from '../Static/api';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import EditLotDialog from './EditLotDialog';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { message } from 'antd';



function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function ProductLotManage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { productId } = location.state;
    const [lots, setLots] = useState([]);
    const [open, setOpen] = useState(false); // สถานะเพื่อเปิด/ปิด Dialog
    const [productname, setProductname] = useState('');
    const [newLot, setNewLot] = useState({
        lot_number: '',
        expiry_date: '',
        product_lot_qty: '',
        product_lot_cost: '',
        product_lot_price: '',
        add_date: getCurrentDate(),
    });
    const [selectedLot, setSelectedLot] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedLotId, setSelectedLotId] = useState(null); // Define selectedLotId state

    function getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    useEffect(() => {
        console.log('Product ID:', productId);
    }, [productId]);

    const handleEditLot = (lot) => {
        setSelectedLot(lot); // Set the selected lot to state
        setOpenEditDialog(true); // Open the edit dialog
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
    };

    // Define handleDeleteLot function
    // Define handleDeleteLot function



    useEffect(() => {
        handleGetLot(productId); // ส่ง productId ไปยัง handleGetLot
    }, [productId]);



    const handleBackClick = () => {
        navigate('/admin/AdminProduct'); // Navigate to a specific route
    };
    const handleOpenDialog = (productId) => {
        setSelectedLotId(productId); // เซ็ต lotId ให้กับ state ที่เก็บข้อมูล lotId ที่เลือก
        setOpen(true); // เปิด Dialog
    };



    const handleCloseDialog = () => {
        setOpen(false);
    };

    const handleAddLot = async () => {
        // Validate newLot data before sending the request
    if (!newLot.add_date) {
        newLot.add_date = getCurrentDate();
    }

        if (!newLot.add_date) {
            
            message.error('กรุณากรอกวันเพิ่มล็อต');
        } else if (!newLot.product_lot_qty) {
            message.error('กรุณากรอกจำนวนสินค้าในล็อต');
        } else if (!newLot.product_lot_cost) {
            message.error('กรุณากรอกราคาทุนสินค้าในล็อต');
        } else if (!newLot.product_lot_price) {
            message.error('กรุณากรอกราคาขายสินค้าในล็อต');
        } else {
            try {
                const requestData = {
                    product_id: productId, // เพิ่ม product_id ไปยังข้อมูลที่จะส่ง
                    add_date: newLot.add_date,
                    product_lot_qty: newLot.product_lot_qty,
                    product_lot_cost: newLot.product_lot_cost,
                    product_lot_price: newLot.product_lot_price
                };

                const response = await axios.post(
                    `${ip}/product/addlotprouduct`,
                    requestData,
                    {
                        headers: {
                            'Content-Type': 'application/json', // Set the content type to JSON
                        },
                    }
                );

                if (response.data.success) {
                    setNewLot({
                        lot_number: '',
                        add_date: '',
                        product_lot_qty: '',
                        product_lot_cost: '',
                        product_lot_price: ''
                    });
                    handleCloseDialog();
                    handleGetLot(); // ส่ง productId ไปด้วย
                    getCurrentDate();
                    Swal.fire({
                        icon: 'success',
                        title: 'เพิมล็อตสินค้าสำเร็จ',
                        // text: response.data.message,
                    });
                } else {
                    message.error(response.data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                message.error('เกิดข้อผิดพลาดในการส่งข้อมูล');
            }
        }
    };




    const handleGetLot = () => {
        const product_id = productId; // แทนด้วยค่า product_id ที่ต้องการส่ง
        const requestBody = { product_id }; // สร้างอ็อบเจ็กต์ requestBody และกำหนดค่า product_id
        post(requestBody, getlotprouduct)
            .then(async (res) => {
                if (res.success) {
                    let data = res.result;

                    // ตรวจสอบว่า data ไม่เป็น empty และมี property product_name ก่อนเรียกใช้ setProductname
                    if (data.length > 0 && data[0].product_name) {
                        setProductname(data[0].product_name); // เรียกใช้ setProductname ด้วยค่า product_name จาก item แรกของ data
                    }

                    const modifiedData = await data.map((item) => {
                        return {
                            productname: item.product_name,
                            lot_id: item.product_lot_id,
                            add_date: item.add_date,
                            is_active: item.is_active,
                            product_lot_qty: item.product_lot_qty,
                            product_lot_cost: item.product_lot_cost,
                            product_lot_price: item.product_lot_price
                        };
                    });
                    setLots(modifiedData);

                    console.log('Modified data:', modifiedData);
                    // ตรวจสอบอีกครั้งว่า data ไม่เป็น empty ก่อนทำการ log
                    if (data.length > 0) {
                        console.log('Product name:', data[0].product_name);
                    }
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };




    const handleDeleteLot = async (lotid) => {
        const numericId = parseInt(lotid);

        try {
            const response = await post({ lotId: numericId, is_active: 0 }, DELETELOT);

            console.log('API Response:', response);

            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'ลบล็อตสินค้าเรียบร้อยแล้ว!',
                    text: 'ล็อตสินค้าถูกลบออกจากระบบเรียบร้อยแล้ว',
                }).then((result) => {
                    if (result.isConfirmed || result.isDismissed) {
                        handleGetLot(lotid);
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'ลบล็อตสินค้าไม่สำเร็จ',
                    text: 'ไม่สามารถลบล็อตสินค้าได้ กรุณาลองใหม่อีกครั้ง',
                });
            }
        } catch (error) {
            console.error('Error deleting lot:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'เกิดข้อผิดพลาดในการลบล็อตสินค้า กรุณาลองใหม่อีกครั้ง',
            });
        }
    }


    return (
        <div>
            <Box sx={{ padding: '10px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <Typography sx={{ fontSize: '24px' }}>
                        จัดการล็อตสินค้า
                    </Typography>

                    <Button startIcon={<ArrowBackIcon />} color="primary" onClick={handleBackClick} >
                        ย้อนกลับ
                    </Button>
                </Box>
                <Box sx={{ margin: '15px', backgroundColor: 'white', borderRadius: 3, padding: '20px', }}>
                    <Box sx={{ marginTop: '10px', justifyContent: 'space-between', display: 'flex' }}>
                        <Typography variant="h5" sx={{ marginBottom: '10px' }}>
                            ล็อตสินค้า: {productname}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button
                                variant="contained"
                                endIcon={<AddCircleOutlineIcon />}
                                sx={{ backgroundColor: '#28bc94', marginRight: '10px' }}
                                onClick={() => handleOpenDialog(productId)}
                            >
                                เพิ่มล็อตสินค้า
                            </Button>
                        </Box>
                    </Box>


                    <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
                        <Table sx={{ minWidth: 'auto' }}>
                            <TableHead style={{
                                backgroundColor: "#009ae1", color: 'white'
                            }}>
                                <TableRow>
                                    <TableCell style={{ color: 'white' }}>เลขล็อตสินค้า</TableCell>
                                    <TableCell style={{ color: 'white' }}>วันเพิ่มล็อต</TableCell>
                                    <TableCell style={{ color: 'white' }}>จำนวนสินค้า</TableCell>
                                    <TableCell style={{ color: 'white' }}>ราคาต้นทุน</TableCell>
                                    <TableCell style={{ color: 'white' }}>ราคาขาย</TableCell>
                                    <TableCell style={{ color: 'white' }}>แก้ไข</TableCell>
                                    <TableCell style={{ color: 'white' }}>ลบ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {lots.map((lot) => (
                                    <TableRow key={lot.lot_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>

                                        <TableCell component="th" scope="row">
                                            {`PLID${String(lot.lot_id).padStart(6, '0')}`}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(lot.add_date).toLocaleString('th-TH', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {lot.product_lot_qty}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {lot.product_lot_cost}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {lot.product_lot_price}
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="outlined" color="primary" onClick={() => handleEditLot(lot)}>
                                                แก้ไข
                                            </Button>

                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                sx={{ color: 'red', borderColor: 'red' }}
                                                onClick={() => handleDeleteLot(lot.lot_id)}
                                            >
                                                ลบ
                                            </Button>

                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogTitle>เพิ่มล็อตสินค้า</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        กรุณากรอกข้อมูลล็อตสินค้าใหม่:
                    </DialogContentText>
                    {/* <TextField
                        autoFocus
                        margin="dense"
                        label=""
                        type="text"
                        fullWidth
                        value={productId} // เพิ่ม prop value เพื่อให้แสดงค่า productId
                        disabled // เพิ่ม prop disabled เพื่อทำให้ TextField นี้ไม่สามารถแก้ไขได้
                        onChange={(e) => setNewLot({ ...newLot, lot_number: e.target.value })}
                    />
 */}
                    <TextField
                        margin="dense"
                        label="วันเพิ่มล็อต"
                        type="date" // เปลี่ยนชนิดของ TextField เป็น date เพื่อให้รับค่าและแสดงเฉพาะวันที่
                        fullWidth
                        value={newLot.add_date}
                        onChange={(e) => setNewLot({ ...newLot, add_date: e.target.value })}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    <TextField
                        margin="dense"
                        label="จำนวนสินค้าในล็อต"
                        type="number"
                        fullWidth
                        value={newLot.product_lot_qty}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (parseFloat(value) >= 1 || value === '') {
                                setNewLot({ ...newLot, product_lot_qty: value });
                            } else {
                                // Clear the value if it's less than 1
                                setNewLot({ ...newLot, product_lot_qty: '' });
                            }
                        }}
                    />
                    <TextField
                        margin="dense"
                        label="ราคาทุนสินค้าในล็อต"
                        type="number"
                        fullWidth
                        value={newLot.product_lot_cost}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (parseFloat(value) >= 1 || value === '') {
                                setNewLot({ ...newLot, product_lot_cost: value });
                            } else {
                                // Clear the value if it's less than 1
                                setNewLot({ ...newLot, product_lot_cost: '' });
                            }
                        }}
                    />
                    <TextField
                        margin="dense"
                        label="ราคาขายสินค้าในล็อต"
                        type="number"
                        fullWidth
                        value={newLot.product_lot_price}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (parseFloat(value) >= 1 || value === '') {
                                setNewLot({ ...newLot, product_lot_price: value });
                            } else {
                                // Clear the value if it's less than 1
                                setNewLot({ ...newLot, product_lot_price: '' });
                            }
                        }}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        ยกเลิก
                    </Button>
                    <Button onClick={handleAddLot} color="primary">
                        เพิ่ม
                    </Button>
                </DialogActions>
            </Dialog>
            <EditLotDialog
                open={openEditDialog}
                handleClose={handleCloseEditDialog}
                lotData={selectedLot} // ส่งข้อมูลล็อตที่เลือกไปยัง EditLotDialog
                handleEdit={handleEditLot} // ส่งฟังก์ชัน handleEditLot เพื่อแก้ไขล็อต
                handleGetLot={handleGetLot} // ส่งฟังก์ชัน handleGetLot เพื่อโหลดข้อมูลล็อตใหม่หลังจากการแก้ไข
            />


        </div >

    );

}
