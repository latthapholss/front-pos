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
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import SidebarAdmin from '../Component/Sidebar-Employee';
import Pagination from '@mui/material/Pagination';
import { ADD_PRODUCT_TYPE, ADD_UNIT, PRODUCT_TYPE, UNIT, get, post } from '../Static/api';

function EmployeeCategories() {
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [openUnitDialog, setOpenUnitDialog] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [unitName, setUnitName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // จำนวนรายการที่แสดงต่อหน้า

  useEffect(() => {
    // Fetch categories and units from API or database
    // and update the state
    handleGetCategory()
    handleGetUnit()
  }, []);

  const handleAddCategory = () => {
    setOpenCategoryDialog(true);
  };

  const handleSaveCategory = () => {
    // // อัปเดตสถานะหรือทำสิ่งอื่นตามที่ต้องการ
    if(categoryName){
      post({ product_type: categoryName }, ADD_PRODUCT_TYPE).then(async (res) => {
        if (res.success) {
          const newCategory = {
            name: categoryName,
          };
          console.log('เพิ่มประเภทสินค้า:', newCategory);
          setCategories([...categories, newCategory]);
          setOpenCategoryDialog(false);
          alert(res.message)
        } else {
            alert(res.message)
        }
      })
    }else{
      alert("กรอกข้อมูลก่อน")
    }
  };

  const handleGetCategory = () =>{
    get( PRODUCT_TYPE).then(async (res) => {
      if (res.success) {
        let data = res.result
        const modifiedData = await data.map(item => {
          return {
            id: item.product_type_id,
            name: item.product_type,
            is_active: item.is_active
          };
        });
        setCategories(modifiedData);
      }
    })
  }
  const handleDeleteCategory = (categoryId) => {
    // Implement the logic to delete a category
    const updatedCategories = categories.filter((category) => category.id !== categoryId);
    setCategories(updatedCategories);
  };

  const handleEditCategory = (category) => {
    // Set the category to be edited in the state
    setCategoryName(category.name);
    setOpenCategoryDialog(true);
  };

  const handleUpdateCategory = () => {
    // Implement the logic to update a category
    const updatedCategory = {
      name: categoryName,
    };
    // Update the category in the state or make API/database call
    setOpenCategoryDialog(false);
  };

  const handleAddUnit = () => {
    setOpenUnitDialog(true);
  };

  const handleSaveUnit = () => {

    if(unitName){
      post({ unit : unitName }, ADD_UNIT).then(async (res) => {
        if (res.success) {
          const newUnit = {
            name: unitName,
          };
          console.log('เพิ่มประเภทสินค้า:', newUnit);
          setUnits([...units, newUnit]);
          setUnitName('');
          setOpenUnitDialog(false);
          alert(res.message)
        } else {
            alert(res.message)
        }
      })
    }else{
      alert("กรอกข้อมูลก่อน")
    }

  };

  const handleGetUnit =() =>{
    get( UNIT).then(async (res) => {
      if (res.success) {
        let data = res.result
        const modifiedData = await data.map(item => {
          return {
            id: item.unit_id,
            name: item.unit,
            is_active: item.is_active
          };
        });
        setUnits(modifiedData);
      }
    })
  }

  const handleDeleteUnit = (unitId) => {
    // Implement the logic to delete a unit
    const updatedUnits = units.filter((unit) => unit.id !== unitId);
    setUnits(updatedUnits);
  };

  const handleEditUnit = (unit) => {
    // Set the unit to be edited in the state
    setUnitName(unit.name);
    setOpenUnitDialog(true);
  };

  const handleUpdateUnit = () => {
    // Implement the logic to update a unit
    const updatedUnit = {
      name: unitName,
    };
    // Update the unit in the state or make API/database call
    setOpenUnitDialog(false);
  };

  // Pagination Logic for Categories
  const indexOfLastCategory = currentPage * itemsPerPage;
  const indexOfFirstCategory = indexOfLastCategory - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

  const handleChangeCategoryPage = (event, page) => {
    setCurrentPage(page);
  };

  // Pagination Logic for Units
  const indexOfLastUnit = currentPage * itemsPerPage;
  const indexOfFirstUnit = indexOfLastUnit - itemsPerPage;
  const currentUnits = units.slice(indexOfFirstUnit, indexOfLastUnit);

  const handleChangeUnitPage = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Categories */}
      <Box sx={{ width: '240px' }}>
        <SidebarAdmin />
      </Box>
      <Box component="main" flexGrow={1} p={3}>
        <Container maxWidth="xl">
          <Grid container justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h5" sx={{color:'#696CFF'}}>ประเภทสินค้า</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddCategory}
            >
              เพิ่มประเภทสินค้า
            </Button>
          </Grid>

          <Paper elevation={3} sx={{ width: '100%', borderRadius: 5, overflow: 'hidden', marginBottom: 4 }}>
            <Table sx={{ borderRadius: 5 }}>
              <TableHead>
                <TableRow>
                  <TableCell>NO.</TableCell>
                  <TableCell>ชื่อประเภทสินค้า</TableCell>
                  <TableCell>แก้ไข</TableCell>
                  <TableCell>ลบ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentCategories.map((category, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditCategory(category)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDeleteCategory(category.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          <Pagination
            count={Math.ceil(categories.length / itemsPerPage)}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
            sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}
          />

          <Dialog open={openCategoryDialog} onClose={() => setOpenCategoryDialog(false)}>
            <DialogTitle>{'เพิ่มประเภทสินค้า'}</DialogTitle>
            <DialogContent>
              <TextField
                label="ชื่อประเภทสินค้า"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenCategoryDialog(false)}>ยกเลิก</Button>
              <Button onClick={handleSaveCategory} variant="contained" color="primary">
                บันทึก
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>

      {/* Units */}
      <Box component="main" flexGrow={1} p={3}>
        <Container maxWidth="xl">
          <Grid container justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h5" sx={{color:'#696CFF'}}>หน่วยสินค้า</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddUnit}
            >
              เพิ่มหน่วยสินค้า
            </Button>
          </Grid>

          <Paper elevation={3} sx={{ width: '100%', borderRadius: 5, overflow: 'hidden', marginBottom: 4 }}>
            <Table sx={{ borderRadius: 5 }}>
              <TableHead>
                <TableRow>
                  <TableCell>NO.</TableCell>
                  <TableCell>ชื่อหน่วยสินค้า</TableCell>
                  <TableCell>แก้ไข</TableCell>
                  <TableCell>ลบ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentUnits.map((unit, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{unit.name}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditUnit(unit)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDeleteUnit(unit.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          <Pagination
            count={Math.ceil(units.length / itemsPerPage)}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
            sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}
          />

          <Dialog open={openUnitDialog} onClose={() => setOpenUnitDialog(false)}>
            <DialogTitle>{unitName ? 'แก้ไขหน่วยสินค้า' : 'เพิ่มหน่วยสินค้า'}</DialogTitle>
            <DialogContent>
              <TextField
                label="ชื่อหน่วยสินค้า"
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenUnitDialog(false)}>ยกเลิก</Button>
              
                <Button onClick={handleSaveUnit} variant="contained" color="primary">
                  บันทึก
                </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Box>
  );
}

export default EmployeeCategories;
