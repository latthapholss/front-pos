import React, { useState, useEffect } from 'react';
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
    Pagination, Select, MenuItem
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ADD_EMPLOYEE, DELETEEMPLOYEE, GETEMPLOYEE, UPDATE_EMPLOYEE, get, post } from '../Static/api';
import Swal from 'sweetalert2';

function EmployeeManagement({ person }) {
    const [employees, setEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [employeeId, setEmployeeId] = useState('');
    const [employeeUsername, setEmployeeUsername] = useState(''); // เพิ่มตัวแปรสำหรับ user_username
    const [employeePassword, setEmployeePassword] = useState(''); // เพิ่มตัวแปรสำหรับ user_password

    const [employeeName, setEmployeeName] = useState('');
    const [employeeExperience, setEmployeeExperience] = useState('');

    // แบ่งหน้าฟังชั่น
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // จำนวนรายการที่แสดงต่อหน้า
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = employees.slice(indexOfFirstItem, indexOfLastItem);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    // dialog



    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(event.target.value);
        setCurrentPage(1);  // เมื่อเปลี่ยนแปลง rowsPerPage, ให้กลับไปที่หน้าแรก
    };


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    useEffect(() => {
        handleGetEmployee();
    }, []);



    const handleAddEmployee = () => {
        setOpenDialog(true);
        setSelectedEmployee(null);
        setEmployeeId('');
        setEmployeeUsername(''); // เพิ่มฟิลด์ user_username
        setEmployeeName(''); // เพิ่มฟิลด์ user_name_surname
        setEmployeePassword(''); // เพิ่มฟิลด์ user_password
    };


    const handleSaveEmployee = async () => {
        try {
            if (!employeeUsername || !employeePassword || !employeeName) {
                alert('กรุณากรอกข้อมูลที่จำเป็น (ชื่อผู้ใช้, รหัสผ่าน, ชื่อ-สกุล)');
                return;
            }

            const newEmployee = {
                user_username: employeeUsername,
                user_password: employeePassword,
                user_name_surname: employeeName,
                // เพิ่มฟิลด์อื่น ๆ ตามที่คุณต้องการ
            };

            if (selectedEmployee) {
                // กรณีแก้ไขข้อมูล
                const updatedEmployees = employees.map((employee) => {
                    if (employee.id === selectedEmployee.id) {
                        return { ...employee, ...newEmployee };
                    } else {
                        return employee;
                    }
                });

                setEmployees(updatedEmployees);
                const selectedEmployeeId = selectedEmployee.id.split('-')[1];
                console.log(selectedEmployeeId)
                // ทำการอัปเดตข้อมูลไปยัง API ด้วยข้อมูล newEmployee และ URL
                const updateRes = await post(newEmployee, UPDATE_EMPLOYEE.replace(':employee_id', selectedEmployeeId));
                if (updateRes.success) {
                    console.log('Employee updated successfully:', updateRes.message);
                    Swal.fire({
                        title: 'อัปเดตพนักงานสำเร็จ!',
                        text: updateRes.message,
                        icon: 'success',
                        confirmButtonText: 'ตกลง',
                    });
                    handleGetEmployee();
                    setOpenDialog(false);
                } else {
                    console.error('Error updating employee:', updateRes.message);
                    Swal.fire({
                        title: 'เกิดข้อผิดพลาด!',
                        text: 'ไม่สามารถอัปเดตพนักงาน: ' + updateRes.message,
                        icon: 'error',
                        confirmButtonText: 'ตกลง',
                    });
                }
            } else {
                // กรณีเพิ่มข้อมูล
                // ส่งข้อมูลไปยัง API ADD_EMPLOYEE
                const res = await post(newEmployee, ADD_EMPLOYEE);

                if (res.success) {
                    // เรียกใช้ API เรียบร้อย
                    console.log('Employee added successfully:', res.message);
                    Swal.fire({
                        title: 'เพิ่มพนักงานสำเร็จ!',
                        text: res.message,
                        icon: 'success',
                        confirmButtonText: 'ตกลง',
                    });
                    handleGetEmployee();
                    setOpenDialog(false);
                } else {
                    // ไม่สามารถเพิ่มพนักงาน
                    console.error('Error adding employee:', res.message);
                    Swal.fire({
                        title: 'เกิดข้อผิดพลาด!',
                        text: 'ไม่สามารถเพิ่มพนักงาน: ' + res.message,
                        icon: 'error',
                        confirmButtonText: 'ตกลง',
                    });
                }
            }
        } catch (error) {
            console.error('Error saving employee:', error);
            alert('ไม่สามารถทำงานได้')
        }
    };



    const handleGetEmployee = async () => {
        try {
            const res = await get(GETEMPLOYEE);
            if (res.success) {
                const data = res.result;

                // Filter out inactive employees with is_active !== 1
                const activeEmployees = data.filter((user) => user.is_active === 1);

                const modifiedData = activeEmployees.map((user, index) => {
                    let userType = "";
                    switch (user.user_type) {
                        case 0:
                            userType = "พนักงาน";
                            break;
                        case 1:
                            userType = "admin";
                            break;
                        case 2:
                            userType = "สมาชิก";
                            break;
                        default:
                            userType = "ไม่ระบุ";
                    }

                    // สร้างรหัสพนักงานแบบ EID000001 พร้อมไอดี
      

                    return {
                        id: user.user_id, // รหัสพนักงานพร้อมไอดี
                        name: user.user_name_surname,
                        userType: userType,
                        isActive: user.is_active,
                        password: user.user_password,
                        username: user.user_username
                    };
                });

                setOriginalEmployees(modifiedData); // Set originalEmployees here
                setEmployees(modifiedData);
                console.log('Fetched active employees:', modifiedData);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };





    const handleEditEmployee = (employee) => {
        setOpenDialog(true);
        setSelectedEmployee(employee);
        setEmployeeId(employee.id);
        setEmployeeName(employee.name);
        setEmployeeExperience(employee.experience);
        setEmployeeUsername(employee.username);
        setEmployeePassword(employee.password);
    };

    const handleDeleteEmployee = (employeeId) => {
        Swal.fire({
            title: 'แน่ใจใช่ไหม?',
            text: 'พนักงานจะถูกลบแบบนุ่มแล้ว',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ตกลง',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                // Extract the employee ID from the "employeeId" format like "EID000001-123"
                const selectedEmployeeId = employeeId.split('-')[1];

                console.log('Selected Employee ID:', selectedEmployeeId);

                // Assuming you have an API endpoint like DELETEEMPLOYEE that expects an "employee_id"
                const deleteData = { employee_id: selectedEmployeeId, is_active: 0 };
                console.log('Data to be sent for deletion:', deleteData);

                post(deleteData, DELETEEMPLOYEE).then((res) => {
                    if (res.success) {
                        // Update the state by marking the employee as inactive
                        const updatedEmployees = employees.map((employee) =>
                            employee.id === employeeId ? { ...employee, isActive: 0 } : employee
                        );
                        setEmployees(updatedEmployees);
                        Swal.fire('ลบแล้ว!', 'พนักงานถูกลบแบบนุ่มแล้ว', 'success');
                        handleGetEmployee();
                    } else {
                        Swal.fire('ข้อผิดพลาด', res.message, 'error');
                    }
                });
            }
        });
    };


    /*const handleSearch = () => {
        // Implement the search functionality here
        const filteredEmployees = employees.filter((employee) => {
            // In this example, we're filtering based on the employee name
            return employee.name.toLowerCase().includes(searchQuery.toLowerCase());
        });
        setEmployees(filteredEmployees);
    };*/
    const [originalEmployees, setOriginalEmployees] = useState([]);


    const handleSearch = (event) => {
        const searchValue = event.target.value;

        if (searchValue === "") {
            setEmployees(originalEmployees);
        } else {
            const filteredEmployees = originalEmployees.filter((employee) => {
                return (
                    employee.username.toLowerCase().includes(searchValue.toLowerCase())
                );
            });
            setEmployees(filteredEmployees);
        }

        setSearchQuery(searchValue);
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
                        fontSize: '24px', // Add this line for the border // Add some padding for space around the text
                        marginLeft: '20px',
                        height: '50px',
                        borderRadius: 2,
                        textAlign: 'center'
                    }}
                >
                    จัดการพนักงาน

                </Typography>
                <Button sx={{ backgroundColor: '#28bc94', marginRight: '20px' }}
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddEmployee}
                >
                    เพิ่มพนักงาน
                </Button>
            </Box>
            <Box sx={{ margin: '15px', backgroundColor: 'white', borderRadius: 3, padding: '20px' }}>
                <Box sx={{ marginLeft: '' }}>

                    <Box component="main">
                        <Container maxWidth="xl">
                            <Grid container justifyContent="space-between" alignItems="center" mb={4}>
                                <Typography
                                    variant="h4"
                                    align="left"
                                    gutterBottom
                                    fullWidth
                                    sx={{
                                        fontSize: '20px',
                                        borderBottom: '2px solid #009ae1',
                                        paddingBottom: '5px',
                                        color: '#333335',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    รายชื่อพนักงาน

                                </Typography>


                            </Grid>

                            <Grid>
                                <TextField
                                    label="ค้นหาพนักงาน"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    sx={{ marginBottom: '16px', backgroundColor: 'white' }}

                                />


                            </Grid>
                            <Paper elevation={3} sx={{ width: '100%', borderRadius: 2, overflow: 'hidden' }}>
                                <Table sx={{ borderRadius: 5 }}>
                                    <TableHead style={{
                                        backgroundColor: "#009ae1", color: 'white'
                                    }}>
                                        <TableRow >
                                            <TableCell style={{ color: 'white' }}>NO.</TableCell>
                                            <TableCell style={{ color: 'white' }}>รหัสพนักงาน</TableCell>
                                            <TableCell style={{ color: 'white' }}>ชื่อพนักงาน</TableCell>
                                            <TableCell style={{ color: 'white' }}>ชื่อผู้ใช้งาน</TableCell>
                                            <TableCell style={{ color: 'white' }}>ประเภทผู้ใช้</TableCell>
                                            <TableCell style={{ color: 'white' }}>แก้ไข</TableCell>
                                            <TableCell style={{ color: 'white' }}>ลบ</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {currentItems.map((employee, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{`EID${String(employee.id).padStart(6, '0')}`}</TableCell>
                                                <TableCell>{employee.name}</TableCell>
                                                <TableCell>{employee.username}</TableCell>
                                                <TableCell>{employee.userType}</TableCell>
                                                <TableCell>
                                                    <IconButton onClick={() => handleEditEmployee(employee)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton onClick={() => handleDeleteEmployee(employee.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
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
                                                    sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
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
                                                        {`${indexOfFirstItem + 1}–${Math.min(indexOfLastItem, employees.length)} of ${employees.length}`}
                                                    </Typography>
                                                    <Pagination
                                                        count={Math.ceil(employees.length / rowsPerPage)}  // ใช้ employees แทน ORDERS
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
                            {/* Pagination */}

                            {/* เพิ่มพนักงาน*/}
                            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                                <DialogTitle>{'เพิ่มพนักงาน'}</DialogTitle>
                                <DialogContent>
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            <TextField
                                                label="ชื่อผู้ใช้" // เปลี่ยนให้เป็น "ชื่อผู้ใช้" หรือตามที่ต้องการ
                                                value={employeeUsername} // เปลี่ยนให้เป็น employeeUsername หรือตามที่คุณตั้งชื่อไว้
                                                onChange={(e) => setEmployeeUsername(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                            />
                                            <TextField
                                                label="ชื่อ-สกุล" // เปลี่ยนให้เป็น "ชื่อ-สกุล" หรือตามที่ต้องการ
                                                value={employeeName}
                                                onChange={(e) => setEmployeeName(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                            />
                                            <TextField
                                                label="รหัสผ่าน"
                                                type="password"
                                                value={employeePassword} // เปลี่ยนให้เป็น employeePassword หรือตามที่คุณตั้งชื่อไว้
                                                onChange={(e) => setEmployeePassword(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                            />

                                        </div>
                                    </div>
                                </DialogContent>

                                <DialogActions>
                                    <Button onClick={() => setOpenDialog(false)}>ยกเลิก</Button>
                                    <Button onClick={handleSaveEmployee} variant="contained" color="primary">
                                        {selectedEmployee ? 'อัปเดต' : 'บันทึก'}
                                    </Button>
                                </DialogActions>
                            </Dialog>

                        </Container>
                    </Box>
                </Box >
            </Box>
        </div>
    );
}

export default EmployeeManagement;
