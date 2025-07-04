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
    Pagination
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import SidebarAdmin from '../Component/Sidebar-Employee';

function EmployeeManagement() {
    const [employees, setEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [employeeId, setEmployeeId] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    const [employeeExperience, setEmployeeExperience] = useState('');
    const [employeeSalary, setEmployeeSalary] = useState('');
    // แบ่งหน้าฟังชั่น
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // จำนวนรายการที่แสดงต่อหน้า
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = employees.slice(indexOfFirstItem, indexOfLastItem);
    // dialog
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [startDate, setStartDate] = useState('');
    const [note, setNote] = useState('');

    useEffect(() => {
        // Fetch employees from API or database
        // and update the state
    }, []);

    const handleSearch = () => {
        // Implement search logic based on searchQuery
        // and update the state
    };

    const handleAddEmployee = () => {
        setOpenDialog(true);
        setSelectedEmployee(null);
        setEmployeeId('');
        setEmployeeName('');
        setEmployeeExperience('');
        setEmployeeSalary('');
    };

    const handleSaveEmployee = () => {
        const newEmployee = {
            id: employeeId,
            name: employeeName,
            experience: employeeExperience,
            salary: employeeSalary,
        };

        if (selectedEmployee) {
            // Update existing employee
            const updatedEmployees = employees.map((employee) =>
                employee.id === selectedEmployee.id ? newEmployee : employee
            );
            setEmployees(updatedEmployees);
        } else {
            // Add new employee
            setEmployees([...employees, newEmployee]);
        }

        setOpenDialog(false);
    };

    const handleEditEmployee = (employee) => {
        setOpenDialog(true);
        setSelectedEmployee(employee);
        setEmployeeId(employee.id);
        setEmployeeName(employee.name);
        setEmployeeExperience(employee.experience);
        setEmployeeSalary(employee.salary);
    };

    const handleDeleteEmployee = (employeeId) => {
        const updatedEmployees = employees.filter((employee) => employee.id !== employeeId);
        setEmployees(updatedEmployees);
    };
    const handleChangePage = (event, page) => {
        setCurrentPage(page);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Box sx={{ width: '240px' }}>
                <SidebarAdmin />
            </Box>
            <Box component="main" flexGrow={1} p={3}>
                <Container maxWidth="xl">
                    <Grid container justifyContent="space-between" alignItems="center" mb={4}>
                        <Typography variant="h5" sx={{color:'#696CFF'}}>จัดการข้อมูลพนักงาน</Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleAddEmployee}
                        >
                            เพิ่มพนักงาน
                        </Button>
                    </Grid>

                    <Grid container spacing={2} mb={4}>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                label="ค้นหา"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Button variant="contained" onClick={handleSearch}>
                                ค้นหา
                            </Button>
                        </Grid>
                    </Grid>

                    <Paper elevation={3} sx={{ width: '100%', borderRadius: 5, overflow: 'hidden' }}>
                        <Table sx={{ borderRadius: 5 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>NO.</TableCell>
                                    <TableCell>รหัสพนักงาน</TableCell>
                                    <TableCell>ชื่อพนักงาน</TableCell>
                                    <TableCell>วันเริ่มทำงาน</TableCell>
                                    <TableCell>ดูยอดขายพนักงาน</TableCell>
                                    <TableCell>แก้ไข</TableCell>
                                    <TableCell>ลบ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {employees.map((employee, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{employee.id}</TableCell>
                                        <TableCell>{employee.name}</TableCell>
                                        <TableCell>{employee.experience}</TableCell>
                                        <TableCell>{employee.salary}</TableCell>
                                        <TableCell>ยอดขาย</TableCell>
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
                    </Paper>
                    {/* Pagination */}
                    <Pagination
                        count={Math.ceil(employees.length / itemsPerPage)}
                        page={currentPage}
                        onChange={handleChangePage}
                        sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
                    />
                    {/* เพิ่มพนักงาน*/}
                    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                        <DialogTitle>{'เพิ่มพนักงาน'}</DialogTitle>
                        <DialogContent>
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <TextField
                                        label="รหัสพนักงาน"
                                        value={employeeId}
                                        onChange={(e) => setEmployeeId(e.target.value)}
                                        fullWidth
                                    />
                                    <TextField
                                        label="รหัสผ่าน"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        fullWidth
                                    />
                                    <TextField
                                        label="ชื่อพนักงาน"
                                        value={employeeName}
                                        onChange={(e) => setEmployeeName(e.target.value)}
                                        fullWidth
                                    />
                                    <TextField
                                        label="ที่อยู่"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        fullWidth
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <TextField
                                        label="เงินเดือนพนักงาน"
                                        value={employeeSalary}
                                        onChange={(e) => setEmployeeSalary(e.target.value)}
                                        fullWidth
                                    />
                                    <TextField
                                        label="วันที่เริ่มทำงาน"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        fullWidth
                                    />
                                    <TextField
                                        label="หมายเหตุ"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        fullWidth
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
        </Box>

    );
}

export default EmployeeManagement;
