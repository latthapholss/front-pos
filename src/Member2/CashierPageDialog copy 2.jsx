import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, } from '@mui/material';
import { GETMEMBER, PROMOTION, PROMOTIONSTATUS, PROMOTION_ADD, get, getImagePath, post, } from '../Static/api';
import {
    Button,
    TextField,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // Import the DeleteIcon
import Autocomplete from '@mui/material/Autocomplete';
import { PRODUCT, } from '../Static/api';
import axios from 'axios'; // Import axios or your preferred HTTP library


const CashierPageDialog = ({ open, onClose, selectedProducts, totalAmount, removeProduct, UPDATE_PRODUCT,person, updateProductQuantities }) => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProductss, setSelectedProductss] = useState([]); // ตัวแปร selectedProducts
    const [products, setProducts] = useState([]);
    const [filteredAndSearchedProducts, setFilteredAndSearchedProducts] = useState([]);
    const [ setGroupedProducts] = useState([]);

    const [selectedPromotionId, setselectedPromotionId] = useState('');
    const handleRemoveProduct = (productId) => {
        const updatedProducts = selectedProductss.filter(product => product.id !== productId);
        setSelectedProductss(updatedProducts);

        // Remove the edited quantity for the deleted product
        setEditedQuantities((prevQuantities) => {
            const updatedQuantities = { ...prevQuantities };
            delete updatedQuantities[productId];
            return updatedQuantities;
        });
    };
    if (person && person.user_type === 0) {
        // Admin user
      } else if (person && person.user_type === 1) {
        // Employee user
      } else if (person && person.user_type === 2) {
        // Member user
      }

    const selectedPromotionData = promotions.find(promotionData => promotionData.id === selectedPromotionId);
    useEffect(() => {
        handleGetPromotion();
        handleGetMembers();
        handleGetProduct(); // เพิ่มบรรทัดนี้

    }, []);

    const [updatedProduct, setUpdatedProduct] = useState({
        product_id: '', // เพิ่ม product_id ใน state
        name: '',
        costPrice: '',
        sellingPrice: '',
        quantity: '',
        description: '',
        category: '',
        unit: '',
        image: '',
    });

    /* const handleConfirmPayment = async () => {
         try {
             const postData = {
                 // ใส่ข้อมูลที่จำเป็นสำหรับ API เพิ่มโปรโมชั่นใหม่
                 // ตัวอย่างเช่น: promotion_name, promotion_detail, discount, ...
             };
     
             const res = await post(PROMOTION_ADD, postData);
     
             if (res.success) {
                 // ทำการดึงโปรโมชั่นใหม่หลังเพิ่มเรียบร้อย
                 handleGetPromotion();
     
                 // ปิดหน้าต่างหลังจากทำการเพิ่มเรียบร้อย
                 onClose();
             } else {
                 console.error('Error adding promotion:', res.error);
             }
         } catch (error) {
             console.error('Error adding promotion:', error);
         }
     };*/

    const [loadingMembers, setLoadingMembers] = useState(true);
    const [selectedMember, setSelectedMember] = useState('');

    const handleMemberChange = (event) => {
        const selectedMember = event.target.value;
        setSelectedMember(selectedMember);  // ตรวจสอบการอัปเดต selectedPromotionId
    };
    const handlePromotionChange = (event) => {
        const selectedPromotionId = event.target.value;
        setselectedPromotionId(selectedPromotionId);
    };
    const [promotionData, setPromotionData] = useState({
        promotion_name: '',
        promotion_detail: '',
        discount: '',
        promotion_start: '',
        promotion_end: '',
        quota: '',
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPromotionData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleCloseDialog = () => {
        setPromotionData({
            promotion_name: '',
            promotion_detail: '',
            discount: '',
            promotion_start: '',
            promotion_end: '',
            quota: '',
        });
    };
    const handleGetPromotion = async () => {
        try {
            // เรียก API เพื่อดึงข้อมูลโปรโมชั่น
            const res = await get(PROMOTION);

            if (res.success) {
                // กรองข้อมูลที่มี is_active เท่ากับ 1
                const activePromotions = res.result.filter(item => item.is_active === 1);

                // ประมวลผลข้อมูลที่ได้รับ
                const modifiedData = activePromotions.map((item) => ({
                    id: item.promotion_id,
                    startDate: item.promotion_start,
                    endDate: item.promotion_end,
                    promotionName: item.promotion_name,
                    detail: item.promotion_detail,
                    discount: item.discount,
                    quota: item.quota,

                    selected: false,
                }));

                setPromotions(modifiedData);
                setLoadingMembers(false); // Move setLoading(false) in case of an error
                console.log('ข้อมูลโปรโมชั่นที่ดึง:', modifiedData);
            }
        } catch (error) {
            console.error('Error fetching promotions:', error);
            setLoadingMembers(false); // Move setLoading(false) in case of an error
        }
    };
    const [members, setMembers] = useState([]);
    ;
    const handleGetProduct = async () => {
        try {
            const res = await get(PRODUCT);
            console.log(res); // แสดงผลข้อมูลที่ได้รับจาก API ในคอนโซล
            if (res.success) {
                const data = res.result;
                const modifiedData = data.map((item) => ({
                    id: item.product_id,
                    name: item.product_name,
                    price: item.product_price,
                    image: getImagePath(item.product_image), // สร้าง URL รูปภาพโดยใช้ URL ของ backend
                    category: item.product_type,
                    is_active: item.is_active, // เพิ่ม property is_active
                    quantity: item.product_qty,

                }));
                setProducts(modifiedData);
                setFilteredAndSearchedProducts(modifiedData); // อัปเดต state ที่ใช้แสดงผลสินค้าที่ผ่านการกรองและค้นหา

            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };
    /*const handleGetMembers = async () => {
        try {
            // เรียก API เพื่อดึงข้อมูลสมาชิก
            const res = await get();

            if (res.success) {
                // กรองข้อมูลที่มี user_type เป็น 2
                const filteredMembers = res.result.filter(member => member.user_type === 2);
                setMembers(filteredMembers);
            }
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    };
      <Autocomplete sx={{ m: 1, minWidth: 120 }}
  value={selectedPromotionId}
  onChange={(event, newValue) => {
    setselectedPromotionId(newValue);
  }}
  options={promotions}
  getOptionLabel={(promotionData) => `${promotionData.promotionName} - ${promotionData.discount} %`}
  renderInput={(params) => <TextField {...params} label="โปรโมชั่น" />}
/>     
*/
    const handleGetMembers = async () => {
        try {
            // Call the API to fetch member data

            const baseUrl = 'http://localhost:4000/api/v1';
            const endpoint = '/auth/get_members';
            const url = `${baseUrl}${endpoint}`;

            // Make the API request using fetch
            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                // Process the received data
                const modifiedData = data.result.members.map((item) => ({
                    id: item.member_id,
                    name: `${item.member_fname} ${item.member_lname}`,
                    // Optionally, you can omit the email property if not needed
                }));

                setMembers(modifiedData);
                setLoading(false);
                console.log('Fetched member data:', modifiedData);
            }
        } catch (error) {
            console.error('Error fetching members:', error);
            setLoading(false);
        }
    };


















    const handleConfirmPayment = async () => {
        try {
            const postData = {
                selectedProducts: selectedProducts.map(product => ({
                    product_id: product.id,
                    quantity: product.quantity,
                    unit_price: product.price,
                    product_qty: product.product_qty
                }))
            };

            console.log(JSON.stringify(postData));
            const response = await fetch('http://localhost:4000/api/v1/product/confirm_order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            const responseData = await response.json();

            if (response.ok) {
                console.log(responseData.message);
                onClose();

                // Clear the selectedProducts array to remove all items
                removeProduct([]);

                // Refresh the product data
                handleGetProduct();
            } else {
                console.error('Error confirming order:', responseData.error);
            }
        } catch (error) {
            console.error('Error confirming order:', error);
        }
    };
    



    const groupedProducts = [];
    selectedProducts.forEach((product) => {
        const existingGroup = groupedProducts.find((group) => group.id === product.id);
        if (existingGroup) {
            existingGroup.quantity += product.quantity;
        } else {
            groupedProducts.push({ ...product });
        }
    });
    const [editedQuantities, setEditedQuantities] = useState({});
    const handleEditQuantity = (productId, newQuantity) => {
        setEditedQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: newQuantity,
        }));
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xl" PaperProps={{ sx: { borderRadius: '20px' } }}>
            <DialogTitle sx={{ width: '600px', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>ชำระสินค้า</DialogTitle>
            <DialogContent sx={{ marginLeft: '135px', marginRight: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>

                    {groupedProducts.map((product, index) => (
                        <div key={product.id} style={{ display: 'flex', marginLeft: '23px', justifyContent: 'space-between', width: '100%' }}>
                            <p>
                                {index + 1}. {product.name}
                            </p>
                            <p>
                                ราคา: {product.price * product.quantity} บาท
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <label>จำนวน: </label>
                                <input
                                    type="number"
                                    value={editedQuantities[product.id] || product.quantity}
                                    onChange={(e) => handleEditQuantity(product.id, e.target.value)}
                                    style={{ width: '40px', marginRight: '10px' }}
                                />
                                <IconButton onClick={() => handleRemoveProduct(product.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        </div>
                    ))}

                    {selectedPromotionData && selectedPromotionData.discount ? (
                        <p style={{ marginTop: '30px', textAlign: 'center' }}>
                            ยอดรวมราคาทั้งหมด: {totalAmount} บาท<br />
                            ยอดรวมสุทธิหลังลด: {(totalAmount - (totalAmount * selectedPromotionData.discount / 100)).toFixed(2)} บาท
                            (ลด {((selectedPromotionData.discount / 100) * totalAmount).toFixed(2)} บาท)
                        </p>
                    ) : (
                        <p style={{ marginTop: '30px', marginLeft: '50px' }}>
                            ยอดรวมราคาทั้งหมด: {totalAmount} บาท
                        </p>
                    )}      </div>
            </DialogContent>
            <Autocomplete sx={{ m: 1, minWidth: 120 }}
                value={selectedMember}
                onChange={(event, newValue) => {
                    setSelectedMember(newValue);
                }}
                options={members}
                getOptionLabel={(member) => member.name}
                renderInput={(params) => <TextField {...params} label="เลือกสมาชิก" />}
            />
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel>โปรโมชั่น</InputLabel>
                <Select
                    value={selectedPromotionId}
                    onChange={handlePromotionChange}
                >
                    <MenuItem value={null}>ไม่เลือกโปรโมชั่น</MenuItem>
                    {promotions.map((promotionData) => (
                        <MenuItem key={promotionData.id} value={promotionData.id}>
                            {promotionData.promotionName} - {promotionData.discount} %
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <DialogActions sx={{ justifyContent: 'center' }}>
                <Button onClick={onClose} variant="contained" color="warning" sx={{ borderRadius: '1%', width: '120px' }}>
                    ย้อนกลับ
                </Button>
                <Button onClick={handleConfirmPayment} variant="contained" color="success" sx={{ borderRadius: '1%', width: '120px' }}>
                    ยืนยัน
                </Button><CashierPageDialog
                    selectedProducts={groupedProducts}
                    totalAmount={totalAmount}
                    selectedPromotionId={selectedPromotionId}
                    handleConfirmPayment={handleConfirmPayment}
                    promotions={promotions} // Pass the promotions state here
                    removeProduct={handleRemoveProduct} // ส่งฟังก์ชัน handleRemoveProduct ไปยังคอมโพเนนต์
                    setSelectedProductss={setSelectedProductss} // Pass the state setter here

                />
            </DialogActions>
        </Dialog>
    );
};

export default CashierPageDialog;