import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, } from '@mui/material';
import { GETMEMBER, PROMOTION, PROMOTIONSTATUS, PROMOTION_ADD, confrimorder, get, ip, post, } from '../Static/api';
import {
    Button,
    TextField,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Autocomplete from '@mui/material/Autocomplete';
import Helper from '../Static/Helper';
import swal from 'sweetalert2';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { localStorageKeys } from '../Static/LocalStorage';



const CashierPageDialog = ({ open, onClose, selectedProducts, totalAmount, removeProduct, removeProducts, handleGetProduct }) => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [selectedPromotionId, setselectedPromotionId] = useState('');
    const handleRemoveProduct = (productId) => {
        removeProduct(productId);
    };
    const handleClearCart = (productId) => {
        removeProducts(productId);
    };
    const [pointuse, setpointuse] = useState('');

    const selectedPromotionData = promotions.find(promotionData => promotionData.id === selectedPromotionId);
    useEffect(() => {
        handleGetPromotion();
        handleGetMembers();
        HandleUserDetail(); // เรียกใช้ฟังก์ชั่น HandleUserDetail เพื่อดึง userId และพิมพ์ค่าของ userId ออกมา
    }, []);


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

    const groupedProducts = [];
    selectedProducts.forEach((product) => {
        const existingGroup = groupedProducts.find((group) => group.id === product.id);
        if (existingGroup) {
            existingGroup.quantity += product.quantity;

        } else {
            groupedProducts.push({ ...product });
        }
    });

    const dataToSend = {

        totalAmount: totalAmount,
        selectedProducts: groupedProducts.map(product => ({
            product_id: product.id,
            quantity: product.quantity,
            unit_price: product.price,
            product_qty: product.product_qty,
            description: product.product_detail,
            product_lot_id: product.product_lot_id,
        })),
        selectedMember: selectedMember,
        selectedPromotionId: selectedPromotionId,
        point: Helper.point(totalAmount) // คำนวณคะแนนจากยอดรวม
    };

    if (selectedPromotionData && selectedPromotionData.discount) {
        dataToSend.discountedTotalAmount = totalAmount - Helper.discount(totalAmount, selectedPromotionData.discount);
        dataToSend.discountAmount = Helper.discount(totalAmount, selectedPromotionData.discount);
    }

    const [setSelectedProducts] = useState([]);

    const handleConfirmPayment = async (productIds, productId) => {


        const requestData = {
            totalAmountWithGlassCost: calculateTotalAmountWithGlassCost(),
            totalAmountWithAluminumCost: calculateTotalAmountWithAluminumCost(),
            totalAmountText: totalAmountText(),
            totalAmount: totalAmount,

            selectedProducts: groupedProducts.map(product => {
                const newQuantity = editedQuantities[product.id] || product.quantity;
                const isGlassOrAluminum = ['กระจก', 'อลูมิเนียม'].includes(product.name);
                let unit_price;

                let productCost;






                if (product && product.category === 'กระจก') {
                    productCost = totalAmountWithGlassCost;
                    unit_price = totalAmountWithGlassCost
                } else if (product && product.category === 'อลูมิเนียม') {
                    productCost = totalAmountWithAluminumCost;
                    unit_price = totalAmountWithAluminumCost
                } else {
                    productCost = product.product_cost;
                    unit_price = product.price
                }
                return {
                    product_id: product.id,
                    quantity: newQuantity,
                    unit_price: unit_price,
                    product_qty: product.product_qty,
                    description: product.product_detail,
                    product_cost: productCost,
                    product_lot_id: product.product_lot_id,
                };
            }),
            selectedMember: selectedMember.id,
            selectedPromotionId: selectedPromotionId,
            point: Helper.point(totalAmount),
            userId: userId, // Add userId to the request data
        };

        if (selectedPromotionData && selectedPromotionData.discount) {
            requestData.discountedTotalAmount = totalAmount - Helper.discount(totalAmount, selectedPromotionData.discount);
            requestData.discountAmount = Helper.discount(totalAmount, selectedPromotionData.discount);

        }

        console.log('Data to send:', requestData);


        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        };


        try {
            const response = await fetch(`${ip}${confrimorder}`, requestOptions);

            if (response.ok) {
                const responseData = await response.json();
                console.log('Response Data:', responseData);
                removeProduct(productId);
                groupedProducts.forEach((productId) => {
                    removeProduct(productId);
                });

                onClose();
                alert('success')
                handleGetProduct();
            } else {
                console.error('Request failed with status:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const HandleUserDetail = async () => {
        try {
            const storedUserData = JSON.parse(localStorage.getItem(localStorageKeys.loginSession));
            const userId = storedUserData.user_id; // Changed from member_id to user_id
            console.log('userID:', userId); // แก้จาก console.log(data); เป็น console.log('userID:', userId);
            setUserId(userId); // Update state with fetched userId
        } catch (error) {
            console.error('Error fetching user detail:', error);
        }
    }
    const productIds = groupedProducts.map((product) => product.id);
    const handlePointInputChange = (event) => {
        setpointuse(event.target.value);
    };

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
        description: ''
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
            description: ''

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
                setLoadingMembers(false);
                console.log('ข้อมูลโปรโมชั่นที่ดึง:', modifiedData);
            }
        } catch (error) {
            console.error('Error fetching promotions:', error);
            setLoadingMembers(false);
        }
    };
    const [members, setMembers] = useState([]);
    ;



    const handleGetMembers = async () => {
        try {


            const baseUrl = 'http://localhost:4000/api/v1';
            const endpoint = '/auth/get_members';
            const url = `${baseUrl}${endpoint}`;


            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {

                const modifiedData = data.result.members.map((item) => ({
                    id: item.member_id,
                    name: `${item.member_fname} ${item.member_lname}`,
                    point: item.point,

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


    const [editedQuantities, setEditedQuantities] = useState({});
    const handleEditQuantity = (productId, newQuantity) => {
        setEditedQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: newQuantity,
        }));
    };
    const tableHeaderStyle = {
        border: '1px solid #000',
        padding: '8px',
        textAlign: 'center',
        marginLeft: '200px',
        backgroundColor: '#696CFF',
        color: 'white'

    };

    const tableCellStyle = {
        border: '1px solid #000',
        padding: '8px',
        textAlign: 'center',
    };

    const totalAmountStyle = {
        marginTop: '5px',
        textAlign: 'right',
    };

    const tableHeaderStyle2 = {
        border: '1px solid #000',
        padding: '8px',
        textAlign: 'right',
        marginRight: '50px',
        backgroundColor: '#696CFF',
        color: 'white'
    };

    const tableCellStyle2 = {
        border: '1px solid #000',
        padding: '8px',
        textAlign: 'center',
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'row',
        height: '100px',
    };
    const removeSelectedProduct = (productId) => {
        const updatedSelectedProducts = selectedProducts.filter(
            (product) => product.id !== productId
        );
        setSelectedProducts(updatedSelectedProducts);
    };
    const pointConversionRate = 10 / 100; // 1 แต้มเท่ากับ 0.1 บาท
    const pointValue = parseFloat(pointuse) || 0; // Assuming pointuse is the input value representing the points used.
    const [glassDimensions, setGlassDimensions] = useState({
        length: '',
        width: '',
        thickness: '',
        cut: ''

    });
    const [aluminumDimensions, setAluminumDimensions] = useState({
        width2: '',
        cut: ''
    });

    const handleGlassDimensionsChange = (productId, dimensionType, value) => {
        setGlassDimensions((prevDimensions) => ({
            ...prevDimensions,
            [productId]: {
                ...prevDimensions[productId],
                [dimensionType]: value,
            },
        }));
    };
    const handleAluminumDimensionsChange = (productId, dimensionType, value) => {
        console.log('ProductId:11111', productId);
        console.log('Dimension Type:1111', dimensionType);
        console.log('Value:111', value);
        if (parseFloat(value) >= 1) {
            // Handle the change
            // Your existing logic here...
        } else {
            // Display an error message or handle the invalid input as needed
            alert('ค่าต้องมากกว่าหรือเท่ากับ 1');
        }

        setAluminumDimensions((prevDimensions) => ({
            ...prevDimensions,
            [productId]: {
                ...prevDimensions[productId],
                [dimensionType]: value,
            },
        }));
    };

    const shouldRenderGlassDimensions = (category) => {

        return category === 'กระจก';
    };
    const shouldRenderGlassDimensions2 = (category) => {

        return category === 'อลูมิเนียม';
    };

    const calculateGlassPrice = (productId, newQuantity) => {
        const product = groupedProducts.find((product) => product.id === productId);

        if (!product) {
            return 0; // Return 0 if the product is not found
        }

        const { name, product_cost, category } = product;



        if (category === 'กระจก') {
            // Calculate glass cost for 'กระจก'
            const length = glassDimensions[productId]?.length || 0;
            const width = glassDimensions[productId]?.width || 0;
            const cut = glassDimensions[product.id]?.cut || 0

            const area = (length * width) / 144;
            const cost = product.price || 0;
            const newCost = area * cost * newQuantity + parseFloat(cut);

            return parseFloat(newCost.toFixed(2));
        }
    };


    const calculateTotalAmountWithGlassCost = () => {
        const totalAmountWithoutGlassCost = totalAmount - (pointuse / 10);

        // Calculate the total amount including glass cost
        const totalAmountWithGlassCost = groupedProducts.reduce((acc, product) => {
            if (product.category === 'กระจก') {
                // Include the glass cost in the total amount
                const glassCost = calculateGlassPrice(product.id, editedQuantities[product.id] || product.quantity);
                return acc + glassCost;
            } else if (product.category === 'อลูมิเนียม') {
                // ถ้าเป็นสินค้าชื่อ 'กระจก' ให้ราคาต้นทุนเป็น 0
                return acc + 0;
            } else {
                return acc + product.price * (editedQuantities[product.id] || product.quantity);
            }
        }, 0);


        return totalAmountWithGlassCost.toFixed(2);
    };

    const calculateGlassDiscount = () => {
        // Add logic to calculate any discount specific to glass products
        return ''; // Replace with your calculation
    };

    const calculateStandardTotalAmount = () => {
        return totalAmount - (pointuse / 10);
    };

    const calculateStandardDiscount = () => {
        return selectedPromotionData ? Helper.discount(totalAmount, selectedPromotionData.discount) : 0;
    };
    let cost2 = 0; // Define cost2 at a higher scope
    let totalAmount2 = 0; // Define totalAmount2 at a higher scope

    const calculateAluminumPrice = (productId, newQuantity) => {
        const product = groupedProducts.find((product) => product.id === productId);
        let cost2 = 0; // Define cost2 at a higher scope



        if (product && product.category === 'อลูมิเนียม') {
            const cost = (product.price) / 6;
            const dimensions = aluminumDimensions[productId]?.width2 || 0;
            const cut = glassDimensions[product.id]?.cut || 0
            console.log('ชือ่:', product);
            console.log('ราคา:', -product.price);
            console.log('เมตร:', dimensions);
            console.log('New Quantity:', newQuantity);

            const newCost = parseFloat(cost * dimensions) + parseFloat(cut);

            console.log('New Cost:', newCost);

            const calculatedPrice = newCost.toFixed(2);
            console.log('Calculated Price:', calculatedPrice);

            return calculatedPrice;
            return

        } else {
            // Handle the case when the product is not found or is not 'อลูมิเนียม'
            return (''); // or some default value
        }
    };
    const calculateAluminumPrice2 = (productId, newQuantity) => {
        const product = groupedProducts.find((product) => product.id === productId);
        let cost2 = 0; // Define cost2 at a higher scope



        if (product && product.category === 'อลูมิเนียม') {
            const cost = (product.price + 100) / 6;
            const dimensions = parseFloat(product.price) - product.price *
                console.log('ชือ่:35453', dimensions);
            console.log('ราคา:',);
            console.log('เมตร:',);
            console.log('New Quantity:', newQuantity);

            const newCost = product.price - 1000;

            console.log('New Cost:', newCost);

            const calculatedPrice = -product.price;
            console.log('Calculated Price:', calculatedPrice);

            return (-product.price);

        } else {
            // Handle the case when the product is not found or is not 'อลูมิเนียม'
            return (''); // or some default value
        }
    };

    const calculateTotalAmountWithAluminumCost = () => {
        const totalAmountWithoutGlassCost = totalAmount - (pointuse / 10);

        // Calculate the total amount including aluminum cost
        const totalAmountWithAluminumCost = groupedProducts.reduce((acc, product) => {
            if (product.category === 'อลูมิเนียม') {
                // Include the aluminum cost in the total amount

                const aluminumCost = calculateAluminumPrice(product.id, editedQuantities[product.id] || product.quantity);
                console.log('543554543 Price:', aluminumCost);

                return acc + aluminumCost * (editedQuantities[product.id] || product.quantity);

            } else if (product.category === 'กระจก') {
                // ถ้าเป็นสินค้าชื่อ 'กระจก' ให้ราคาต้นทุนเป็น 0
                return acc + 0;
            } else {
                return acc + product.price * (editedQuantities[product.id] || product.quantity);
            }
        }, 0);


        return totalAmountWithAluminumCost.toFixed(2);
    };
    const totalAmountWithAluminumCost = calculateTotalAmountWithAluminumCost();
    const totalAmountWithGlassCost = calculateTotalAmountWithGlassCost();

    const finalTotalAmount = groupedProducts.reduce((acc, product) => {
        if (product.category === 'กระจก') {
            return acc + totalAmountWithGlassCost;
        } else if (product.category === 'อลูมิเนียม') {
            return acc + totalAmountWithAluminumCost;
        } else {
            return acc + product.price * (editedQuantities[product.id] || product.quantity);
        }
    }, 0) - (pointuse / 10);

    const totalAmountText = () => {
        if (groupedProducts.some(product => product.category === 'กระจก') && groupedProducts.some(product => product.category === 'อลูมิเนียม')) {
            return `${(parseFloat(calculateTotalAmountWithAluminumCost()) - (pointuse / 10)) + parseFloat(calculateTotalAmountWithGlassCost())}`;
        } else if (groupedProducts.some(product => product.category === 'กระจก')) {
            return `${(calculateTotalAmountWithGlassCost() || 0) - (pointuse / 10)} บาท ${pointuse && `(ลด ${pointuse / 10} บาท)`} บาท`;
        } else if (groupedProducts.some(product => product.category === 'อลูมิเนียม')) {
            return `${(calculateTotalAmountWithAluminumCost() || 0) - (pointuse / 10)} บาท ${pointuse && `(ลด ${pointuse / 10} บาท)`} บาท`;
        } else {
            return `${finalTotalAmount} บาท ${pointuse && `(ลด ${pointuse / 10} บาท)`}`;
        }
    };



    return (
        <Dialog open={open} onClose={onClose} maxWidth="xl" PaperProps={{ sx: { borderRadius: '20px' } }}>
            <DialogTitle sx={{ width: '600px', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>ชำระสินค้า</DialogTitle>
            <DialogContent sx={{ marginLeft: '0px', marginRight: 'auto', display: 'flex', flexDirection: 'column' }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700, width: '100%' }} aria-label="spanning table">
                        <TableHead>

                            <TableRow >
                                <TableCell align="right" sx={{ padding: '12px', textAlign: 'center' }}>สินค้า</TableCell>

                                {/* <TableCell align="right" sx={{ padding: '12px', textAlign: 'center' }}>สินค้าไอดี</TableCell> */}

                                <TableCell align="right" sx={{ padding: '12px', textAlign: 'center' }}>จำนวน</TableCell>
                                <TableCell align="right" sx={{ padding: '12px', textAlign: 'center' }}>ราคา</TableCell>
                                <TableCell align="right" sx={{ padding: '6px', textAlign: 'center', width: '100px' }}>ลบ</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {groupedProducts.map((product) => (
                                <React.Fragment key={product.id}>
                                    <TableRow>
                                        <TableCell align="right">{`${product.name}`}</TableCell>
                                        {/* <TableCell align="right">{`${product.product_lot_id}`}</TableCell> */}

                                        <TableCell align="right">
                                            <TextField
                                                type="number"
                                                value={editedQuantities[product.id] || product.quantity}
                                                onChange={(e) => handleEditQuantity(product.id, e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            {['กระจก', 'อลูมิเนียม'].includes(product.category)
                                                ? (product.category === 'กระจก'
                                                    ? (calculateGlassPrice(product.id, editedQuantities[product.id] || product.quantity)).toLocaleString()
                                                    : (calculateAluminumPrice(product.id, editedQuantities[product.id] || product.quantity))).toLocaleString()
                                                : (product.price * (editedQuantities[product.id] || product.quantity)).toLocaleString()
                                            }
                                        </TableCell>



                                        <TableCell align="right">
                                            <IconButton onClick={() => handleRemoveProduct(product.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    {shouldRenderGlassDimensions2(product.category) && (
                                        <TableRow>
                                            <TableCell colSpan={4}>
                                                <TableBody>
                                                    <TableCell align="">
                                                        <TextField
                                                            type="number"
                                                            label="ความยาว (เมตร)"
                                                            value={aluminumDimensions[product.id]?.width2 || ''}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                // Use parseFloat to convert the string to a number and check it's >= 1 or empty
                                                                if ((parseFloat(value) >= 1 && parseFloat(value) > 0) || value === '') {
                                                                    handleAluminumDimensionsChange(product.id, 'width2', value);
                                                                } else {
                                                                    // Clear the input and alert if the value is less than 1 or negative
                                                                    handleAluminumDimensionsChange(product.id, 'width2', '');
                                                                    alert('ค่าความยาวต้องมากกว่าหรือเท่ากับ 1 เมตร');
                                                                }
                                                            }}
                                                            sx={{ width: '175px' }}
                                                        />

                                                    </TableCell>
                                                    <TableCell align="">
                                                        <TextField
                                                            type="number"
                                                            label="ค่าตัด"
                                                            value={glassDimensions[product.id]?.cut || ''}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                // Check if the value is numeric and non-negative before allowing the change
                                                                if ((parseFloat(value) >= 1 && parseFloat(value) > 0) || value === '') {
                                                                    handleGlassDimensionsChange(product.id, 'cut', value);
                                                                } else {
                                                                    // Optionally clear the value or keep the last valid value if it's less than 1 or negative
                                                                    // For this example, we'll clear the field and show an alert
                                                                    handleGlassDimensionsChange(product.id, 'cut', '');
                                                                    alert('ค่าต้องมากกว่าหรือเท่ากับ 1 และไม่สามารถเป็นค่าลบ');
                                                                }
                                                            }}
                                                            sx={{ width: '175px' }}
                                                        />

                                                    </TableCell>
                                                </TableBody>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {shouldRenderGlassDimensions(product.category) && (
                                        <TableRow>
                                            <TableCell colSpan={4}>
                                                <TableBody>
                                                    <TableCell align="">
                                                        <TextField
                                                            type="number"
                                                            label="ความยาว (นิ้ว)"
                                                            value={glassDimensions[product.id]?.length || ''}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                if (value >= 0) {
                                                                    // สร้างชุดข้อมูลใหม่เพื่ออัปเดต state โดยใช้ spread operator (...) เพื่อคัดลอกข้อมูลเดิมก่อนที่จะเปลี่ยนแปลง
                                                                    const newGlassDimensions = {
                                                                        ...glassDimensions,
                                                                        [product.id]: {
                                                                            // คัดลอกความยาวและความกว้างเดิม
                                                                            ...glassDimensions[product.id],
                                                                            // อัปเดตความยาวหรือความกว้างตามที่ผู้ใช้ป้อนเข้ามา
                                                                            length: value
                                                                        }
                                                                    };
                                                                    // เรียกใช้ setState เพื่ออัปเดต state ด้วยข้อมูลใหม่ที่ได้จากการป้อนข้อมูล
                                                                    setGlassDimensions(newGlassDimensions);
                                                                } else {
                                                                    // แสดงข้อความผิดพลาดหรือจัดการข้อมูลที่ไม่ถูกต้องตามที่ต้องการ
                                                                    console.log('กรุณาป้อนค่าที่มากกว่าหรือเท่ากับ 0');
                                                                }
                                                            }}

                                                        />
                                                    </TableCell>
                                                    <TableCell align="">
                                                        <TextField
                                                            type="number"
                                                            label="ความสูง (นิ้ว)"
                                                            value={glassDimensions[product.id]?.width || ''}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                if (value >= 0) {
                                                                    const newGlassDimensions = {
                                                                        ...glassDimensions,
                                                                        [product.id]: {
                                                                            ...glassDimensions[product.id],
                                                                            width: value
                                                                        }
                                                                    };
                                                                    setGlassDimensions(newGlassDimensions);
                                                                } else {
                                                                    console.log('กรุณาป้อนค่าที่มากกว่าหรือเท่ากับ 0');
                                                                }
                                                            }}
                                                            sx={{ width: '175px' }}
                                                        />
                                                    </TableCell>


                                                    <TableCell align="">
                                                        <TextField
                                                            type="number"
                                                            label="ค่าตัด"
                                                            value={glassDimensions[product.id]?.cut || ''}
                                                            onChange={(e) =>
                                                                handleGlassDimensionsChange(
                                                                    product.id,
                                                                    'cut',
                                                                    e.target.value
                                                                )
                                                            }
                                                            sx={{ width: '175px' }}
                                                        />
                                                    </TableCell>

                                                </TableBody>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))}















                            <TableRow>
                                <TableCell rowSpan={3} />
                                <TableCell colSpan={2}>ราคาทั้งหมดก่อนหักโปรโมชั่น</TableCell>
                                <TableCell align="right">
                                    {groupedProducts.some(product => product.category === 'กระจก') && groupedProducts.some(product => product.category === 'อลูมิเนียม') ? (


                                        `${((parseFloat(calculateTotalAmountWithAluminumCost()) - (pointuse / 10)) + parseFloat(calculateTotalAmountWithGlassCost())).toLocaleString()}`



                                    ) : groupedProducts.some(product => product.category === 'กระจก') ? (
                                        // If there are only glass products, calculate the total amount including glass cost
                                        `${((calculateTotalAmountWithGlassCost() || 0) - (pointuse / 10)).toLocaleString()} บาท ${pointuse && `(ลด ${pointuse / 10} บาท)`} `
                                    ) : groupedProducts.some(product => product.category === 'อลูมิเนียม') ? (
                                        // If there are only aluminum products, calculate the total amount including aluminum cost
                                        `${((calculateTotalAmountWithAluminumCost() || 0) - (pointuse / 10)).toLocaleString()} บาท ${pointuse && `(ลด ${pointuse / 10} บาท)`} `
                                    ) : (
                                        <span style={{ display: 'inline-block', margin: 0, padding: 0, width: '200px', marginLeft: '-170px' }}>

                                            {totalAmount.toLocaleString()} บาท   <br /><span style={{ color: 'red' }}>{pointuse && `(ลด ${pointuse / 10} บาท)`}</span>
                                        </span>
                                    )}



                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>แต้ม</TableCell>
                                <TableCell align="right"></TableCell>
                                <TableCell align="right">
                                    {Helper.point(totalAmount)} เเต้ม
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}>ราคารวมสุทธิ</TableCell>
                                <TableCell align="right">
                                    {(groupedProducts.some(product => product.category === 'กระจก') && groupedProducts.some(product => product.category === 'อลูมิเนียม')) ? (
                                        <React.Fragment>
                                            {((parseFloat(calculateTotalAmountWithAluminumCost()) - (pointuse / 10)) + parseFloat(calculateTotalAmountWithGlassCost()) - calculateAluminumPrice2()).toLocaleString()}
                                            <span style={{ display: 'inline-block', margin: 0, padding: 0, width: '200px', marginLeft: '-170px', color: 'red' }}>
                                                {' (ลดจากโปรโมชั่น '}
                                                {selectedPromotionData ? Helper.discount(totalAmount, selectedPromotionData.discount) : 0} บาท{') '}
                                            </span>
                                        </React.Fragment>
                                    ) : groupedProducts.some(product => product.category === 'กระจก') ? (
                                        <React.Fragment>
                                            {`${(calculateTotalAmountWithGlassCost() - (pointuse / 10)).toLocaleString()}  ${pointuse && `(ลด ${pointuse / 10} บาท)`} `}
                                            <span style={{ display: 'inline-block', margin: 0, padding: 0, width: '200px', marginLeft: '-170px', color: 'red' }}>
                                                {' (ลดจากโปรโมชั่น '}
                                                {selectedPromotionData ? Helper.discount(totalAmount, selectedPromotionData.discount) : 0} บาท{') '}
                                            </span>
                                        </React.Fragment>
                                    ) : groupedProducts.some(product => product.category === 'อลูมิเนียม') ? (
                                        <React.Fragment>
                                            {`${((calculateTotalAmountWithAluminumCost() || 0) - (pointuse / 10)).toLocaleString()}  ${pointuse && `(ลด ${pointuse / 10} บาท)`} `}
                                            <span style={{ display: 'inline-block', margin: 0, padding: 0, width: '200px', marginLeft: '-170px', color: 'red' }}>
                                                {' (ลดจากโปรโมชั่น '}
                                                {selectedPromotionData ? Helper.discount(totalAmount, selectedPromotionData.discount) : 0} บาท{') '}                                        </span>

                                        </React.Fragment>
                                    ) : (
                                        <React.Fragment>
                                            <span style={{ display: 'inline-block', margin: 0, padding: 0 }}>
                                                {`${(totalAmount - (pointuse / 10)).toLocaleString()} บาท  `}
                                            </span>
                                            <span style={{ display: 'inline-block', margin: 0, padding: 0, width: '200px', marginLeft: '-170px', color: 'red' }}>
                                                {'(ลดจากโปรโมชั่น'} {selectedPromotionData ? `${Helper.discount(totalAmount, selectedPromotionData.discount)} บาท` : '0 บาท)'}
                                            </span>

                                        </React.Fragment>

                                    )}

                                </TableCell>

                            </TableRow>
                        </TableBody>
                    </Table>

                </TableContainer>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <div style={{ paddingRight: '0px', backgroundColor: '', marginLeft: '430px' }}>
                        <Autocomplete
                            sx={{ m: 1, minWidth: 120, marginRight: '10px', overflow: 'hidden', paddingTop: '10px' }}
                            value={selectedMember || null}
                            onChange={(event, newValue) => {
                                setSelectedMember(newValue);
                            }}
                            options={members}
                            getOptionLabel={(member) => member.name}
                            renderInput={(params) => <TextField sx={{ backgroundColor: '', marginLeft: '-0px', paddingLeft: '-10px' }}{...params} label="เลือกสมาชิก" style={{ marginRight: '130px', }} />}
                            renderOption={(props, option) => (
                                <li {...props}>
                                    {option.name}
                                </li>
                            )}
                        />
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel >โปรโมชั่น</InputLabel>
                            <Select
                                style={{ marginRight: '-99px' }}
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

                        {
                            selectedMember && (
                                <FormControl sx={{ m: 1, minWidth: 120, paddingTop: '60px', backgroundColor: '' }}>
                                    <Typography sx={{ color: '#339900', paddingBottom: '0px', marginLeft: '-130px' }}>คะแนนของสมาชิก = {selectedMember.point}</Typography>
                                    <TextField
                                        sx={{ color: '#339900', marginLeft: '-136px' }}
                                        value={pointuse}
                                        onChange={handlePointInputChange}
                                        label="คะแนน"
                                    />
                                </FormControl>
                            )
                        }
                    </div>
                </div>
            </DialogContent >


            <DialogActions sx={{ justifyContent: 'flex-end' }}>
                <Button onClick={onClose} variant="contained" color="warning" sx={{ borderRadius: '1%', width: '120px' }}>
                    ย้อนกลับ
                </Button>
                <Button onClick={() => handleConfirmPayment(productIds)} variant="contained" color="success" sx={{ borderRadius: '1%', width: '120px' }}>
                    ยืนยัน
                </Button>


                <CashierPageDialog
                    selectedProducts={selectedProducts}
                    totalAmount={totalAmount}
                    selectedPromotionId={selectedPromotionId}
                    handleConfirmPayment={handleConfirmPayment}
                    removeProduct={removeProduct}
                    removeProducts={removeProducts}


                />

            </DialogActions>
        </Dialog >
    );
};

export default CashierPageDialog;