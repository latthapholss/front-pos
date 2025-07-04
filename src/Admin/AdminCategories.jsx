import React, { useState, useEffect } from "react";
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
  DialogActions, Input,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import Pagination from "@mui/material/Pagination";
import {
  ADD_PRODUCT_TYPE,
  ADD_UNIT,
  DELETEPROTYPE,
  DELETEUNIT,
  EditedCategory,
  EditedUnit,
  PRODUCT_TYPE,
  UNIT,
  get,
  getImagePath,
  getProductypeImagePath,
  ip,
  post,
  put,
} from "../Static/api";
// Import external CSS file
import axios from 'axios';
import Swal from "sweetalert2";
import { message } from 'antd';

function AdminCategories({ person }) {
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [openUnitDialog, setOpenUnitDialog] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [unitName, setUnitName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // จำนวนรายการที่แสดงต่อหน้า
  const [categoryImage, setCategoryImage] = useState(null);
  const [openEditUnitDialog, setOpenEditUnitDialog] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [editUnitId, setEditUnitId] = useState(null);
  const [openEditCategoryDialog, setOpenEditCategoryDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryImagePath, setCategoryImagePath] = useState('');
  useEffect(() => {
    // Fetch categories and units from API or database
    // and update the state
    handleGetCategory();
    handleGetUnit();
  }, []);
  const handleAddCategory = () => {
    setOpenCategoryDialog(true);
  };


  const handleEditUnit = (unit) => {
    setUnitName(unit.name);
    setEditUnitId(unit.id);
    setOpenEditUnitDialog(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setCategoryImagePath(category.image); // Set the image path state
    setOpenEditCategoryDialog(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImage(file);
    }
  };

  const handleSaveCategory = () => {
    console.log('Starting handleSaveCategory');

    if (categoryName && categoryImage) {
      const formData = new FormData();
      formData.append('product_type', categoryName);
      formData.append('image', categoryImage);

      const url = `${ip}/struct/add_product_type`;

      console.log('Sending request to server:', url, formData);

      axios.post(url, formData)
        .then((res) => {
          console.log('Response from server:', res.data);

          if (res.data.success) {
            const newCategory = {
              id: res.data.result.product_type_id,
              name: categoryName,
            };
            setCategories([...categories, newCategory]);
            setOpenCategoryDialog(false);
            Swal.fire({
              icon: 'success',
              title: 'เพิ่มประเภทสินค้าสำเร็จ',

            });
          } else {
            message(res.data.message);
          }
        })
        .catch((error) => {
          console.error('Error during save category:', error);
          message.error('ข้อผิดพลาดเกิดขึ้นขณะที่บันทึกประเภทสินค้า');
        });
    } else {
      message.error('กรอกข้อมูลให้ครบถ้วน');
    }

    console.log('Exiting handleSaveCategory');
  };






  const handleGetCategory = () => {
    get(PRODUCT_TYPE).then(async (res) => {
      if (res.success) {
        let data = res.result;
        const modifiedData = await data.map((item) => {
          return {
            id: item.product_type_id,
            name: item.product_type,
            image: getProductypeImagePath(item.product_type_image), // Assuming 'product_type_image' is the key for image path
            is_active: item.is_active,
          };
        });
        setCategories(modifiedData);
      }
    });
  };

  const handleDeleteCategory = (categoryId) => {
    post({ product_type_id: categoryId }, DELETEPROTYPE).then((res) => {
      if (res.success) {
        const updatedCategories = categories.map((category) =>
          category.id === categoryId ? { ...category, is_active: 0 } : category
        );
        setCategories(updatedCategories);
        Swal.fire({
          title: "ลบประเภทสินค้าเสร็จสิ้น !",
          text: res.message,
          icon: "success"
        });
  
        // ดึงข้อมูลประเภทสินค้าใหม่และอัปเดต state
        handleGetCategory();
      } else {
        Swal.fire({
          title: "Error!",
          text: res.message,
          icon: "error"
        });
      }
    });
  };
  const handleUpdateUnit = () => {
    if (unitName && editUnitId) {
      const object = {
        unit_id: editUnitId,
        new_unit: unitName
      };
  
      // EditedUnit should be a URL path that does not include a path parameter for the unit_id
      const url = EditedUnit; // Exclude the editUnitId from the URL path
  
      console.log('Sending update unit request:', url, object); // Add console.log() here
  
      put(url, object) // Pass the editUnitId as part of the request body
        .then((res) => {
          console.log('Response from update unit request:', res); // Add console.log() here
          if (res.success) {
            // Update the local state to reflect the changes
            const updatedUnits = units.map((unit) => {
              if (unit.id === editUnitId) {
                return { ...unit, name: unitName };
              }
              return unit;
            });
            setUnits(updatedUnits);
            setOpenEditUnitDialog(false);
            Swal.fire({
              icon: 'success',
              title: 'อัพเดทหน่วยสินค้าสำเร็จ',
            });
          } else {
            message.error(res.message);
          }
        })
        .catch((error) => {
          console.error('Error during update unit:', error);
          message.error('An error occurred while updating the unit.');
        });
    } else {
      message.error('กรุณากรอกข้อมูลให้ครบ');
    }
  };
  
  



  const handleUpdateCategory = () => {
    if (!selectedCategory || !categoryName) {
      message.error('Please select a category and enter a name.');
      return;
    }

    const formData = new FormData();
    formData.append('product_type_id', selectedCategory.id);
    formData.append('new_product_type', categoryName);

    // Only append the image if a new image was selected
    if (categoryImage) {
      formData.append('image', categoryImage);
    }

    // Assuming that the `EditedCategory` constant holds the correct endpoint
    const url = `${ip}${EditedCategory}`; // Construct the full URL

    axios({
      method: 'put',
      url: url,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        if (response.data.success) {
          setOpenEditCategoryDialog(false);
          Swal.fire({
            icon: 'success',
            title: 'อัพเดทข้อมูลเสร็จสิ้น',
          }).then(() => {
            handleGetCategory(); // Refresh the category list
          });
          handleGetCategory(); // Refresh the category list
        } else {
          message.error('Failed to update category: ' + response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error during update category:', error);
        message.error('An error occurred while updating the category.');
      });
  };

  const handleAddUnit = () => {
    setOpenUnitDialog(true);
  };

  const handleSaveUnit = () => {
    if (unitName) {
      post({ unit: unitName }, ADD_UNIT).then(async (res) => {
        if (res.success) {
          const newUnit = {
            name: unitName,
          };
          console.log("เพิ่มประเภทสินค้า:", newUnit);
          setUnits([...units, newUnit]);
          setUnitName("");
          setOpenUnitDialog(false);
          Swal.fire({
            icon: 'success',
            title: 'เพิ่มประเภทสินค้าสำเร็จ',
          });
        } else {
          message.error(res.message);
        }
      });
    } else {
      message.error("กรอกข้อมูลก่อน");
    }
  };

  const handleGetUnit = () => {
    get(UNIT).then(async (res) => {
      if (res.success) {
        let data = res.result;
        const modifiedData = await data.map((item) => {
          return {
            id: item.unit_id,
            name: item.unit,
            is_active: item.is_active,
          };
        });
        setUnits(modifiedData);
      }
    });
  };


  const handleDeleteUnit = (unitId) => {
    post({ unit_id: unitId }, DELETEUNIT).then((res) => {
      if (res.success) {
        const updatedUnits = units.map((unit) =>
          unit.id === unitId ? { ...unit, is_active: 0 } : unit
        );
        setUnits(updatedUnits);
        Swal.fire({
          title: "ลบหน่วยสินค้าเสร็จสิ้น !",
          icon: "success"
        });
  
        // ดึงข้อมูลหน่วยสินค้าใหม่และอัปเดต state
        handleGetUnit();
      } else {
        Swal.fire({
          title: "ผิดพลาด!",
          text: res.message,
          icon: "error"
        });
      }
    });
  };


  // Pagination Logic for Categories
  const indexOfLastCategory = currentPage * itemsPerPage;
  const indexOfFirstCategory = indexOfLastCategory - itemsPerPage;
  const currentCategories = categories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );

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
          จัดการประเภทสินค้าและหน่วยสินค้า
        </Typography>
      </Box>
      <Box
        sx={{
          margin: "15px",
          backgroundColor: "white",
          borderRadius: 3,
          padding: "20px",
        }}
      >
        <Box className="main-container" sx={{ display: "flex" }}>
          {/* Categories */}

          <Box
            className="category-container"
            component="main"
            flexGrow={1}
            p={3}
            sx={{
              "@media (max-width:768px)": {
                paddingLeft: "240px",
              },
            }}
          >
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
                    color: "#333335",
                    marginTop: "0px",
                    fontWeight: "bold",
                    borderBottom: "2px solid #009ae1",
                    fontSize: "20px",
                  }}
                >
                  ประเภทสินค้า
                </Typography>
                <Button
                  sx={{ backgroundColor: "#28bc94" }}
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddCategory}
                >
                  เพิ่มประเภทสินค้า
                </Button>
              </Grid>

              <Paper
                elevation={3}
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  overflow: "hidden",
                  marginBottom: 4,
                }}
              >
                <Table sx={{ borderRadius: 2 }}>
                  <TableHead
                    style={{ backgroundColor: "#009ae1", color: "white" }}
                  >
                    <TableRow>
                      <TableCell style={{ color: "white" }}>NO.</TableCell>
                      <TableCell style={{ color: "white" }}>
                        ชื่อประเภทสินค้า
                      </TableCell>
                      <TableCell style={{ color: "white" }}>
                        icons
                      </TableCell>
                      <TableCell style={{ color: "white" }}>แก้ไข</TableCell>
                      <TableCell style={{ color: "white" }}>ลบ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.map((category, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>
                          {category.image ? (
                            <img
                              src={category.image}
                              alt="Category"
                              style={{ maxWidth: '100px', maxHeight: '100px', width: '50px', height: '50px' }}
                            />
                          ) : (
                            <div style={{ width: '50px', height: '50px', background: 'red' }}></div>
                          )}
                        </TableCell>
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
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              />

              <Dialog
                open={openCategoryDialog}
                onClose={() => setOpenCategoryDialog(false)}
              >
                <DialogTitle>{"เพิ่มประเภทสินค้า"}</DialogTitle>
                <DialogContent>
                  <TextField
                    label="ชื่อประเภทสินค้า"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    fullWidth
                  />
                  <Input
                    type="file"
                    inputProps={{
                      accept: 'image/*',
                      onChange: handleFileChange,
                    }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenCategoryDialog(false)}>
                    ยกเลิก
                  </Button>
                  <Button
                    onClick={handleSaveCategory}
                    variant="contained"
                    color="primary"
                  >
                    บันทึก
                  </Button>
                </DialogActions>
              </Dialog>
            </Container>
          </Box>

          {/* Units */}
          <Box className="unit-container" component="main" flexGrow={1} p={3}>
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
                    color: "#333335",
                    marginTop: "0px",
                    fontWeight: "bold",
                    borderBottom: "2px solid #009ae1",
                    fontSize: "20px",
                  }}
                >
                  หน่วยสินค้า
                </Typography>
                <Button
                  sx={{ backgroundColor: "#28bc94" }}
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddUnit}
                >
                  เพิ่มหน่วยสินค้า
                </Button>
              </Grid>

              <Paper
                elevation={3}
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  overflow: "hidden",
                  marginBottom: 4,
                }}
              >
                <Table sx={{ borderRadius: 2 }}>
                  <TableHead style={{ backgroundColor: "#009ae1" }}>
                    <TableRow>
                      <TableCell style={{ color: "white" }}>NO.</TableCell>
                      <TableCell style={{ color: "white" }}>
                        ชื่อหน่วยสินค้า
                      </TableCell>
                      <TableCell style={{ color: "white" }}>แก้ไข</TableCell>
                      <TableCell style={{ color: "white" }}>ลบ</TableCell>
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
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              />

              <Dialog
                open={openUnitDialog}
                onClose={() => setOpenUnitDialog(false)}
              >
                <DialogTitle>
                </DialogTitle>
                <DialogContent>
                  <TextField
                    label="ชื่อหน่วยสินค้า"
                    value={unitName}
                    onChange={(e) => setUnitName(e.target.value)}
                    fullWidth
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenUnitDialog(false)}>
                    ยกเลิก
                  </Button>

                  <Button
                    onClick={handleSaveUnit}
                    variant="contained"
                    color="primary"
                  >
                    บันทึก
                  </Button>
                </DialogActions>
              </Dialog>
            </Container>
          </Box>
        </Box>
      </Box>
      <Dialog open={openEditUnitDialog} onClose={() => setOpenEditUnitDialog(false)}>
        <DialogTitle>แก้ไขหน่วยสินค้า</DialogTitle>
        <DialogContent>
          <TextField
            label="ชื่อหน่วยสินค้า"
            value={unitName}
            onChange={(e) => setUnitName(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditUnitDialog(false)}>ยกเลิก</Button>
          <Button onClick={handleUpdateUnit} variant="contained" color="primary">
            บันทึก
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditCategoryDialog} onClose={() => setOpenEditCategoryDialog(false)}>
        <DialogTitle>แก้ไขประเภทสินค้า</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="ชื่อประเภทสินค้า"
            type="text"
            fullWidth
            variant="outlined"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <img src={categoryImagePath} alt="Category" style={{ width: '100%', height: 'auto' }} />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'block', marginTop: '10px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditCategoryDialog(false)} color="primary">
            ยกเลิก
          </Button>
          <Button onClick={handleUpdateCategory} color="primary">
            อัปเดต
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AdminCategories;