import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, } from '@mui/material';
import { GETMEMBER, PROMOTION, PROMOTIONSTATUS, PROMOTION_ADD, get, post, } from '../Static/api';
import {
    Button,
    TextField,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';

const SelectedProducts = ({ selectedProducts, totalAmount, removeProduct, setselectedPromotionId, selectedPromotionId, handlePromotionChange }) => {
    const handleRemoveProduct = (productId) => {
        removeProduct(productId);
    };
}
const CashierPageDialog = ({ open, onClose, selectedProducts, totalAmount, selectedPromotionId,person, handleConfirmPayment }) => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);

    const selectedPromotionData = promotions.find(promotionData => promotionData.id === selectedPromotionId);
    useEffect(() => {
        handleGetPromotion();
        handleGetMembers();
    }, []);

    if (person && person.user_type === 0) {
        // Admin user
      } else if (person && person.user_type === 1) {
        // Employee user
      } else if (person && person.user_type === 2) {
        // Member user
      }
  
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

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xl" PaperProps={{ sx: { borderRadius: '20px' } }}>
            <DialogTitle sx={{ width: '600px', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>ชำระสินค้า</DialogTitle>
            <DialogContent sx={{ marginLeft: '135px', marginRight: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {selectedProducts.map((product, index) => (
                        <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <p>
                                {index + 1}. {product.name}
                            </p>
                            <p>
                                ราคา: {product.price} บาท
                            </p>
                        </div>
                    ))}
                    <DialogContent>

                        {selectedPromotionId !== null ? (
                            <div>
                                <p>โปรโมชั่นที่เลือก: {selectedPromotionData?.promotionName}&nbsp;&nbsp;&nbsp;&nbsp;
                                    ส่วนลด: {selectedPromotionData?.discount} %</p>
                            </div>
                        ) : (
                            <p style={{ marginLeft: '40px' }}>ไม่เลือกโปรโมชั่น</p>
                        )}
                        {/* Display list of promotions */}

                    </DialogContent>

                    {selectedPromotionData && selectedPromotionData.discount ? (
                        <p style={{ marginTop: '-30px', textAlign: 'center' }}>
                            ยอดรวมราคาทั้งหมด: {totalAmount} บาท<br />
                            ยอดรวมสุทธิหลังลด: {(totalAmount - (totalAmount * selectedPromotionData.discount / 100)).toFixed(2)} บาท
                            (ลด {((selectedPromotionData.discount / 100) * totalAmount).toFixed(2)} บาท)
                        </p>
                    ) : (
                        <p style={{ marginTop: '-30px', marginLeft: '40px' }}>
                            ยอดรวมราคาทั้งหมด: {totalAmount} บาท
                        </p>
                    )}      </div>
            </DialogContent>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel>เลือกสมาชิก</InputLabel>
                <Select
                    value={selectedMember}
                    onChange={handleMemberChange}
                >
                    <MenuItem value="">ไม่เป็นสมาชิก</MenuItem>
                    {members.map(member => (
                        <MenuItem key={member.id} value={member.id}>
                           {member.id}{':'} {member.name}
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
                </Button>

            </DialogActions>
        </Dialog>
    );
};

export default CashierPageDialog;