import React, { useState, useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import ProductCard from "./ProductCard";
import SelectedProducts from "./SelectedProducts";
import { PRODUCT, PRODUCTSALES, get, getImagePath } from "../Static/api";
import MenuItem from "@mui/material/MenuItem";
import { TextField } from "@mui/material";
import { PRODUCT_TYPE } from "../Static/api";
import { Button } from "@mui/material";
import CashierPageDialog from "./CashierPageDialog";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Divider from "@mui/material/Divider";
import { UNIT } from "../Static/api"; // ต้องแทนที่ด้วยพาธที่ถูกต้อง
import { localStorageKeys } from "../Static/LocalStorage";

const CashierPage = ({ person }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const [userId, setUserId] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedPromotionId, setselectedPromotionId] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const [filteredAndSearchedProducts, setFilteredAndSearchedProducts] =
    useState([]);

  const [filterCategory, setFilterCategory] = useState("");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(PRODUCT_TYPE) // หรือเป็น API ที่ใช้งานเพื่อดึงข้อมูลประเภทสินค้า
      .then((response) => response.json())
      .then((data) => setCategories(data.result)) // อัปเดต state 'categories' ด้วยข้อมูลที่ได้รับจาก API
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleGetPromotion = async () => {
    // ... (โค้ดของ handleGetPromotion)
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    const filteredProducts = products.filter((product) => {
      return product.name.toLowerCase().includes(searchValue.toLowerCase());
    });
    setFilteredAndSearchedProducts(filteredProducts);
    setSearchQuery(searchValue);
  };
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const [units, setUnits] = useState([]); // เพิ่ม state เพื่อเก็บข้อมูลหน่วยสินค้า

  useEffect(() => {
    // Fetching data from the API to get unit information
    fetch(UNIT)
      .then((response) => response.json())
      .then((data) => setUnits(data))
      .catch((error) => console.error("Error fetching units:", error));

    // Handling various tasks when the component mounts
    handleGetProduct();
    HandleUserDetail(); // เรียกใช้ฟังก์ชั่น HandleUserDetail เพื่อดึง userId และพิมพ์ค่าของ userId ออกมา
    handleGetCategories();
    setSelectedProducts(getSelectedProductsFromLocalStorage());
    handleGetPromotion(); // Adding a call to handleGetPromotion
  }, []);

  const handleGetCategories = async () => {
    try {
      // Make an asynchronous request to get categories
      const res = await get(PRODUCT_TYPE);

      // Check if the request was successful
      if (res.success) {
        // Log the response data in the console
        console.log("Categories response:", res.result);
        console.log(
          "Image URLs:",
          res.result.map((item) => item.product_type_image)
        );

        // Modify the received data to include image URLs
        const modifiedData = res.result.map((item) => ({
          id: item.product_type_id,
          type: item.product_type,
          image: item.product_type_image
            ? `http://localhost:4000/static/product_type/${encodeURIComponent(
                item.product_type_image
              )}`
            : "http://localhost:4000/placeholder-for-missing-image.jpg",
          isActive: item.is_active,
        }));

        console.log("111", modifiedData);

        // Set the modified data in the state
        setCategories(modifiedData);
      }
    } catch (error) {
      // Handle errors that may occur during the request
      console.error("Error fetching categories:", error);
    }
  };

  const HandleUserDetail = async () => {
    try {
      const storedUserData = JSON.parse(
        localStorage.getItem(localStorageKeys.loginSession)
      );
      const userId = storedUserData.user_id; // Changed from member_id to user_id
      console.log("userID:", userId); // แก้จาก console.log(data); เป็น console.log('userID:', userId);
      setUserId(userId); // Update state with fetched userId
    } catch (error) {
      console.error("Error fetching user detail:", error);
    }
  };

  const handleGetProduct = async () => {
    try {
      const res = await get(PRODUCTSALES);
      console.log("Product Sales Data:", res);
      if (res.success) {
        const data = res.result;

        const modifiedData = data.map((item) => {
          // Assuming each item now contains an array of lot details
          const lots = item.lots; // Directly using the array of lot objects

          // Initialize variables for selecting the lot
          let selectedLotIndex = 0; // Index of the lot to be used for selling
          let minLotId = lots[0]?.product_lot_id || 0; // Initialize minimum lot ID

          lots.forEach((lot, i) => {
            if (lot.product_lot_id < minLotId) {
              minLotId = lot.product_lot_id; // Update minimum lot ID

              selectedLotIndex = i; // Update selected lot index to the lot with the minimum ID
            }
          });

          let maxPrice = lots[0]?.product_lot_price || 0; // Initialize with the first lot's price

          lots.forEach((lot, i) => {
            if (lot.product_lot_price > maxPrice) {
              maxPrice = lot.product_lot_price; // Update to the new maximum price

              selectedLotIndex = i; // Update selected lot index to the lot with the maximum price
            }
          });

          let totalQuantity = 0;

          lots.forEach((lot) => {
            totalQuantity += lot.product_lot_qty; // Add the quantity of each lot to the total
          });

          // Selected lot details
          const selectedLot = lots[selectedLotIndex] || {};

          return {
            id: item.product_id,
            name: item.product_name,
            selectedLotId: selectedLot.product_lot_id,
            selectedPrice: maxPrice,
            selectedCost: selectedLot.product_lot_cost,
            selectedQuantity: selectedLot.product_lot_qty,
            product_width: item.product_width,
            product_length: item.product_length,
            product_thickness: item.product_thickness,
            item_id: item.itemset_id,
            quantity: totalQuantity,
            description: item.product_detail,
            category: item.product_type,
            unit: item.unit,
            image: getImagePath(item.product_image),
            is_active: item.is_active,
            product_lot_id: selectedLot.product_lot_id,
            costPrice: selectedLot.product_lot_cost,
            sellingPrice: selectedLot.product_lot_price,
          };
        });

        setProducts(modifiedData.filter((product) => product.is_active === 1));
        setFilteredAndSearchedProducts(
          modifiedData.filter((product) => product.is_active === 1)
        );
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    saveSelectedProductsToLocalStorage(selectedProducts);
  }, [selectedProducts]);

  const totalAmount = selectedProducts.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  const saveSelectedProductsToLocalStorage = (selectedProducts) => {
    localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
  };

  const getSelectedProductsFromLocalStorage = () => {
    const storedSelectedProducts = localStorage.getItem("selectedProducts");
    return storedSelectedProducts ? JSON.parse(storedSelectedProducts) : [];
  };

  const removeSelectedProduct = (productId) => {
    setSelectedProducts([]);
  };
  const handleClearCart = (productId) => {
    const updatedSelectedProducts = selectedProducts.filter(
      (product) => product.id !== productId
    );
    setSelectedProducts(updatedSelectedProducts);
  };

  const selectProduct = (product) => {
    // Check if the product category is 'กระจก' (glass).
    if (
      product.category === "กระจก" ||
      product.category === "อะลูมิเนียม" ||
      product.category === "กระจกแยกชิ้น"
    ) {
      // Create a new product object with a unique identifier to ensure it's added as a new item.
      // You might use a combination of the original product ID and a timestamp or a counter for uniqueness.
      const newProduct = {
        ...product,
        id: `${product.id}-${new Date().getTime()}`, // Example of making the ID unique.
        product_cost2: product.price * product.quantity,
      };

      setSelectedProducts([...selectedProducts, newProduct]);
    } else {
      // For products not in the 'กระจก' category, add them to the cart as usual.
      setSelectedProducts([...selectedProducts, { ...product }]);
    }

    console.log("Selected Product:", selectedProducts);
  };

  const handleConfirmPayment = () => {
    setSelectedProducts([]);
    groupedProducts.splice(0);
    groupedProducts.length = 0;
    selectedProducts.length = 0;
    selectedProducts.splice(0);
  };

  const groupedProducts = [];
  selectedProducts.forEach((product) => {
    // สมมติว่าแต่ละสินค้ามี 'id' ที่ไม่ซ้ำกัน แม้ว่าจะเป็นสินค้าประเภทเดียวกันก็ตาม
    const isGlassProduct =
      product.type === "กระจก" || product.type === "กระจกแยกชิ้น"; // ตรวจสอบว่าเป็นสินค้ากระจกหรือไม่
    if (isGlassProduct) {
      // ถ้าเป็นสินค้ากระจก ให้เพิ่มเป็นสินค้าแยกโดยไม่ต้องตรวจสอบชื่อ
      groupedProducts.push({ ...product, quantity: 7 }); // กำหนด quantity เป็น 1 สำหรับแต่ละชิ้น
    } else {
      // สำหรับสินค้าอื่นๆ ใช้โลจิกเดิมในการรวมกลุ่ม
      const existingGroup = groupedProducts.find(
        (group) => group.name === product.name
      );
      if (existingGroup) {
        existingGroup.quantity += product.quantity;
      } else {
        groupedProducts.push({ ...product });
      }
    }
  });

  const handleFilterCategory = (event) => {
    const selectedCategoryId = event.target.value;
    setFilterCategory(selectedCategoryId);
    setCurrentPage(1);

    if (selectedCategoryId === "") {
      setFilteredAndSearchedProducts(products);
    } else {
      const filteredByCategory = products.filter(
        (product) => product.category === selectedCategoryId
      );
      setFilteredAndSearchedProducts(filteredByCategory);
    }
  };

  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategoryButtonClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);

    if (categoryId === "") {
      setFilteredAndSearchedProducts(products);
    } else {
      const filteredByCategory = products.filter(
        (product) => product.category === categoryId
      );
      setFilteredAndSearchedProducts(filteredByCategory);
    }
  };

  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === "asc" ? "desc" : "asc"));
  };

  const sortedProducts = [...filteredAndSearchedProducts]
    .filter((product) => product.is_active > 0)
    .sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

  console.log("Categories:", categories);

  /* <Button
          size="small"
          onClick={handleSort}
          sx={{
            alignSelf: 'flex-end',
            color: 'black',
            backgroundColor: 'transparent',
            fontSize: '18px', // Adjust the font size as needed
            textAlign: 'right', // Align the text to the right
            margin:'20px 0px',
            backgroundColor:'#e8e8e8',
            textAlign:'right',
            marginRight: 'auto', // Push the button to the right
  
          }}
        >
          Sort ก-ฮ {sortOrder === 'asc' ? '▲' : '▼'}
        </Button>*/

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
          gutterBottom
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
          สินค้า
        </Typography>
        <Button
          sx={{
            backgroundColor: "#28bc94",
            color: "white",
            padding: "14px", // Adjusted padding
            borderRadius: "2",
            "&:hover": {
              backgroundColor: "#00994d",
              cursor: "pointer",
            },
            marginRight: "20px",
            width: "250px", // Adjusted width
            height: "50px",
          }}
          variant="contained"
          color="primary"
          onClick={openDialog}
        >
          <ShoppingCartIcon sx={{ marginRight: "5px", marginTop: "10px" }} />
          ตะกร้าสินค้า ({selectedProducts.length} รายการ)
        </Button>
      </Box>

      <Box
        sx={{
          margin: "15px",
          backgroundColor: "white",
          borderRadius: 3,
          padding: "20px",
        }}
      >
        <Grid container>
          <Typography
            variant="h4"
            align="left"
            fullWidth
            sx={{
              fontSize: "20px",
              borderBottom: "2px solid #009ae1",
              paddingBottom: "5px",
              color: "#333335",
              fontWeight: "bold",
            }}
          >
            รายการสินค้า
          </Typography>
          <Divider />
          <Grid item xs={12} md={12} sx={{ width: "100%", height: "100%" }}>
            <Box p={1} sx={{ height: "100%" }}>
              <Grid container spacing={1} mb={3}>
                {" "}
                {/* Adjusted mb to reduce spacing */}
                <Grid item xs={12} sm={6} md={6}>
                  {" "}
                  {/* Adjusted width for filtering */}
                </Grid>
                <Grid item xs={24} sm={12} md={12}>
                  {" "}
                  {/* Adjusted width for search */}
                  <TextField
                    value={searchQuery}
                    onChange={handleSearch}
                    label="ค้นหาสินค้า"
                    fullWidth
                  />
                </Grid>
              </Grid>
              {/* ... existing code ... */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  flexWrap: "wrap",
                  marginTop: "1rem",
                }}
              >
                <Button
                  key="all-products"
                  onClick={() => handleCategoryButtonClick("")}
                  sx={{
                    backgroundColor:
                      selectedCategory === "" ? "#009ae1" : "white",
                    color: selectedCategory === "" ? "white" : "black",
                    padding: "8px 16px",
                    fontWeight: "bold",
                    width: "190px",
                    height: "100px",
                    border: "1px solid #d6d6d6",
                    "&:hover": {
                      backgroundColor:
                        selectedCategory === "" ? "#009ae1" : "#009ae1",
                    },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img
                    src="http://10.199.7.12:4000/static/product_type/product_type_1_1710190378258.png"
                    alt="Category Image"
                    style={{
                      marginBottom: "8px",
                      width: "50px",
                      height: "50px",
                    }}
                  />{" "}
                  ทั้งหมด
                </Button>
                {categories.map((category) => (
                  <div key={category.type}>
                    <Button
                      onClick={() => handleCategoryButtonClick(category.type)}
                      sx={{
                        backgroundColor:
                          selectedCategory === category.type
                            ? "#009ae1"
                            : "white",
                        color:
                          selectedCategory === category.type
                            ? "white"
                            : "black",
                        padding: "8px 16px",
                        fontWeight: "bold",
                        width: "190px",
                        height: "100px",
                        border: "1px solid #d6d6d6",
                        "&:hover": {
                          backgroundColor:
                            selectedCategory === category.type
                              ? "#009ae1"
                              : "#009ae1",
                        },
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.type}
                          style={{
                            marginBottom: "8px",
                            width: "50px",
                            height: "50px",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "50px",
                            height: "50px",
                            background: "red",
                          }}
                        ></div>
                      )}
                      {category.type}
                    </Button>
                  </div>
                ))}
              </div>

              <Box>
                <Grid container spacing={2} justifyContent="flex-start">
                  {sortedProducts.map((product) => (
                    <Grid
                      item
                      xs={16}
                      sm={8}
                      md={2}
                      key={product.id}
                      sx={{ display: "flex" }}
                    >
                      <ProductCard
                        id={product.id}
                        name={product.name}
                        price={product.sellingPrice}
                        category={product.category}
                        shouldShowDimensions={
                          product.category === "กระจก" ||
                          product.category === "กระจกแยกชิ้น"
                        }
                        image={product.image}
                        product_cost={product.costPrice}
                        product_qty={product.quantity}
                        lot={product.lot}
                        selectedLotId={product.selectedLotId} // ID of the selected lot
                        selectedPrice={product.selectedPrice} // Price of the selected lot
                        selectedCost={product.selectedCost} // Cost of the selected lot
                        selectedQuantity={product.selectedQuantity} // Quantity of the selected lot
                        product_width={product.product_width}
                        product_length={product.product_length}
                        product_thickness={product.product_thickness}
                        itemset_id={product.item_id}
                        product_detail={product.description}
                        product_lot_id={product.product_lot_id}
                        onSelect={(selectedProduct) =>
                          selectProduct({
                            ...selectedProduct,
                            product_cost2:
                              product.price * selectedProduct.quantity,
                          })
                        }
                        sx={{ width: "100%" }}
                        products={products}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            md={5}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              mt: "50px",
              ml: 3, // Adjusted left margin
              height: "1000px",
            }}
          >
            {/* Add any additional components or content here */}
          </Grid>
          <CashierPageDialog
            open={isDialogOpen}
            onClose={closeDialog}
            selectedProducts={selectedProducts}
            totalAmount={totalAmount}
            removeProduct={removeSelectedProduct}
            selectedPromotionId={selectedPromotionId}
            handleGetProduct={handleGetProduct}
            handleConfirmPayment={handleConfirmPayment}
            removeProducts={handleClearCart}
            userId={userId} // เพิ่ม userId เข้าไปใน props
          />
        </Grid>
      </Box>
    </div>
  );
};

export default CashierPage;
