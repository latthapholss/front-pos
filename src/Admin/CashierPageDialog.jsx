import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box } from '@mui/material';
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



const CashierPageDialog = ({ open, onClose, selectedProducts, totalAmount, removeProduct, removeProducts, handleGetProduct, product_qty ,itemset_id}) => {
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

    const [receivedAmount, setReceivedAmount] = useState('');
    const calculateFinalTotal = () => {
        let finalTotal = totalAmount;
        const discountAmount = selectedPromotionData ? Helper.discount(totalAmount, selectedPromotionData.discount) : 0;
        finalTotal -= discountAmount + (pointuse / 10);

        // Additional logic for glass and aluminum costs adjustments if needed
        if (groupedProducts.some(product => product.category === 'กระจก')) {
            finalTotal += parseInt(calculateTotalAmountWithGlassCost());
        }
        if (groupedProducts.some(product => product.category === 'อลูมิเนียม')) {
            finalTotal += parseInt(calculateTotalAmountWithAluminumCost());
        }

        return finalTotal; // Adjust as per your need
    };
    const calculateDiscount = () => {
        if (selectedPromotionData) {
            return Helper.discount(totalAmount, selectedPromotionData.discount);
        }
        return 0;
    };
    
    const calculateChange = () => {
        let change = 0;
        const discount = calculateDiscount(); // คำนวณค่าส่วนลดจากโปรโมชั่น
    
        if (groupedProducts.some(product => product.category === 'กระจก') && groupedProducts.some(product => product.category === 'อลูมิเนียม')) {
            // For both Glass and Aluminum products
            change = receivedAmount - ((parseInt(calculateTotalAmountWithAluminumCost()) + parseInt(calculateTotalAmountWithGlassCost()) - discount) - (pointuse / 10));
        } else if (groupedProducts.some(product => product.category === 'กระจก')) {
            // For Glass products only
            change = receivedAmount - ((parseInt(calculateTotalAmountWithGlassCost()) - discount) - (pointuse / 10));
        } else if (groupedProducts.some(product => product.category === 'อลูมิเนียม')) {
            // For Aluminum products only
            change = receivedAmount - ((parseInt(calculateTotalAmountWithAluminumCost()) - discount) - (pointuse / 10));
        } else {
            // No specific category
            change = receivedAmount - ((totalAmount - discount) - (pointuse / 10));
        }
    
        // Ensure the change is not negative, indicating insufficient amount received
        return change >= 0 ? change : 'กรุณากรอกเงินที่รับให้ถูกต้อง';
    };
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
            itemset_id: product.itemset_id, // Ensure this is included

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

        const calculateGlassPrice = (product, newQuantity) => {
            if (product.category !== 'กระจก') return;

            const length = glassDimensions[product.id]?.length || 0;
            const width = glassDimensions[product.id]?.width || 0;
            const cut = glassDimensions[product.id]?.cut || 0;
            const area = (length * width) / 144;
            const cost = product.price || 0;
            const newCost = area * cost * newQuantity + parseInt(cut);

            console.log('New Glass Cost:222222', newCost);
            return parseInt(newCost); // Return calculated cost
        };

        const calculateAluminumPrice = (product, newQuantity) => {
            if (product.category !== 'อลูมิเนียม') return;

            // Assume dimensions and cost are retrieved similarly as for glass
            const width = aluminumDimensions[product.id]?.width2 || 0; // Using width2 for aluminum
            const cut = aluminumDimensions[product.id]?.cut || 0; // Cut cost
            // Adjust the calculation as needed for aluminum pricing
            const cost = product.price || 0; // Base cost of the product
            const newCost = ((cost / 6) * width) + parseInt(cut) * newQuantity;

            console.log('New Aluminum Cost:', newCost);
            return parseInt(newCost); // Return calculated cost for aluminum
        };

        const requestData = {
            totalAmountWithGlassCost: calculateTotalAmountWithGlassCost(),
            totalAmountWithAluminumCost: calculateTotalAmountWithAluminumCost(),
            totalAmountText: totalAmountText(),
            totalAmount: totalAmount,
            selectedProducts: groupedProducts.map(product => ({
                product_id: product.id,
                quantity: product.quantity,
                unit_price: product.price,
                itemset_id: product.itemset_id, // Ensure this is correctly included
                // other product details as needed
            })),
    
            selectedProducts: groupedProducts.map(product => {

                const newQuantity = editedQuantities[product.id] || product.quantity;
                const isGlassOrAluminum = ['กระจก', 'อลูมิเนียม'].includes(product.name);
                let unit_price;
                let productCost;
                let totalAmountWithGlassCost;
                let calculatedCost;
                let calculatedCostalu;
                let totalAmountWithAluminumCost;

                if (product && product.category === 'กระจก') {
                    totalAmountWithGlassCost = totalAmountWithGlassCost;
                    calculatedCost = calculateGlassPrice(product, newQuantity);
                    console.log('Data to send1:', totalAmountWithGlassCost);
                    console.log('Data to send2:', calculatedCost);
                    itemset_id=product.itemset_id
                    console.log('itemset_id:', itemset_id);


                } else if (product && product.category === 'อลูมิเนียม') {
                    totalAmountWithAluminumCost = totalAmountWithAluminumCost;
                    calculatedCostalu = calculateAluminumPrice(product, newQuantity);
                    console.log('Data to send1:', totalAmountWithAluminumCost);
                    console.log('Data to send2:', calculatedCostalu);
                    itemset_id=product.itemset_id


                } else {
                    productCost = product.product_cost;
                    unit_price = product.price,
                    itemset_id=product.itemset_id
                    console.log('itemset_id:', itemset_id);

                }
                return {
                    itemset_id:product.itemset_id,
                    product_id: product.id,
                    quantity: newQuantity,
                    unit_price: unit_price,
                    product_qty: product.product_qty,
                    description: product.product_detail,
                    product_cost: productCost,
                    product_lot_id: product.product_lot_id,
                    totalAmountWithGlassCost: totalAmountWithGlassCost,
                    calculatedCost: calculatedCost,
                    calculatedCostalu: calculatedCostalu,
                    totalAmountWithAluminumCost: totalAmountWithAluminumCost
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
        const newQty = parseInt(newQuantity, 10); // Convert the input value to a number
        const product = groupedProducts.find((product) => product.id === productId);
        const availableQty = product ? product.product_qty + 2 : 0; // Assuming `product_qty` is the available stock

        if (newQty >= availableQty) {
            // If the new quantity exceeds available stock, show an error message
            alert("จำนวนที่คุณกรอกเกินกว่าสินค้าที่มีในสต็อก กรุณากรอกจำนวนน้อยลง");
            return; // Prevent the quantity from being updated
        }

        // If the new quantity is valid, update the state
        setEditedQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: newQty,
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
    const pointValue = parseInt(pointuse) || 0; // Assuming pointuse is the input value representing the points used.
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
        if (parseInt(value) >= 1) {
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
        console.log('productIdproductId:', productId);

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
            const newCost = area * cost * newQuantity + parseInt(cut);
            console.log('NeNew Costw Cost:', newCost);

            return parseInt(newCost);
        }
    };
    const calculateAluminumPrice2 = (productId, newQuantity) => {
        const product = groupedProducts.find((product) => product.id === productId);
        let cost2 = 0; // Define cost2 at a higher scope



        if (product && product.category === 'อลูมิเนียม') {
            const cost = (product.price + 100) / 6;
            const dimensions = parseInt(product.price) - product.price *
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


        return totalAmountWithGlassCost;
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



        if (product && product.category === 'อลูมิเนียม') {
            const cost = (product.price) / 6;
            const dimensions = aluminumDimensions[productId]?.width2 || 0;
            const cut = glassDimensions[product.id]?.cut || 0
            console.log('ชือ่:', product);
            console.log('ราคา:', -product.price);
            console.log('เมตร:', dimensions);
            console.log('New Quantity:', newQuantity);

            const newCost = parseInt(cost * dimensions) + parseInt(cut);

            console.log('New Cost:', newCost);

            return parseInt(newCost);

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


        return totalAmountWithAluminumCost;
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
            return `${(parseInt(calculateTotalAmountWithAluminumCost()) - (pointuse / 10)) + parseInt(calculateTotalAmountWithGlassCost())}`;
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
                                                                if ((parseInt(value) >= 1 && parseInt(value) > 0) || value === '') {
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
                                                                if ((parseInt(value) >= 1 && parseInt(value) > 0) || value === '') {
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


                                        `${((parseInt(calculateTotalAmountWithAluminumCost()) - (pointuse / 10)) + parseInt(calculateTotalAmountWithGlassCost())).toLocaleString()}`



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
                                            {(parseInt(calculateTotalAmountWithAluminumCost()) - (pointuse / 10) + parseInt(calculateTotalAmountWithGlassCost()) - calculateAluminumPrice2() - (selectedPromotionData ? Helper.discount(totalAmountWithGlassCost, selectedPromotionData.discount) : 0)).toLocaleString()}
                                            <span style={{ display: 'inline-block', margin: 0, padding: 0, width: '200px', marginLeft: '-170px', color: 'red' }}>
                                                {' (ลดจากโปรโมชั่น '}
                                                {selectedPromotionData ? Helper.discount(totalAmountWithGlassCost, selectedPromotionData.discount) : 0} บาท{') '}
                                            </span>
                                        </React.Fragment>
                                    ) : groupedProducts.some(product => product.category === 'กระจก') ? (
                                        <React.Fragment>
                                            {`${(calculateTotalAmountWithGlassCost() - (pointuse / 10) - (selectedPromotionData ? Helper.discount(totalAmountWithGlassCost, selectedPromotionData.discount) : 0)).toLocaleString()} ${pointuse && `(ลด ${pointuse / 10} บาท)`} `}
                                            <span style={{ display: 'inline-block', margin: 0, padding: 0, width: '200px', marginLeft: '-170px', color: 'red' }}>
                                                {' (ลดจากโปรโมชั่น '}
                                                {selectedPromotionData ? Helper.discount(totalAmountWithGlassCost, selectedPromotionData.discount) : 0} บาท{') '}
                                            </span>
                                        </React.Fragment>
                                    ) : groupedProducts.some(product => product.category === 'อลูมิเนียม') ? (
                                        <React.Fragment>
                                            {`${((calculateTotalAmountWithAluminumCost() || 0) - (pointuse / 10) - (selectedPromotionData ? Helper.discount(totalAmount, selectedPromotionData.discount) : 0)).toLocaleString()} ${pointuse && `(ลด ${pointuse / 10} บาท)`} `}
                                            <span style={{ display: 'inline-block', margin: 0, padding: 0, width: '200px', marginLeft: '-170px', color: 'red' }}>
                                                {' (ลดจากโปรโมชั่น '}
                                                {selectedPromotionData ? Helper.discount(totalAmount, selectedPromotionData.discount) : 0} บาท{') '}
                                            </span>
                                        </React.Fragment>
                                    ) : (
                                        <React.Fragment>
                                            <span style={{ display: 'inline-block', margin: 0, padding: 0 }}>
                                                {`${(totalAmount - (pointuse / 10) - (selectedPromotionData ? Helper.discount(totalAmount, selectedPromotionData.discount) : 0)).toLocaleString()} บาท `}
                                            </span>
                                            <span style={{ display: 'inline-block', margin: 0, padding: 0, width: '200px', marginLeft: '-170px', color: 'red' }}>
                                                {'(ลดจากโปรโมชั่น'} {selectedPromotionData ? `${Helper.discount(totalAmount, selectedPromotionData.discount)} บาท)` : '0 บาท)'}
                                            </span>
                                        </React.Fragment>
                                    )}


                                </TableCell>

                            </TableRow>
                        </TableBody>
                    </Table>

                </TableContainer>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '20px', flexWrap: 'wrap' }}>
                    {/* Autocomplete for selecting a member */}
                    <Autocomplete
                        sx={{ m: 1, minWidth: 120, maxWidth: 300 }}
                        value={selectedMember || null}
                        onChange={(event, newValue) => setSelectedMember(newValue)}
                        options={members}
                        getOptionLabel={(member) => member.name}
                        renderInput={(params) => <TextField {...params} label="เลือกสมาชิก" />}
                    />

                    {/* Promotion select */}
                    <FormControl sx={{ m: 1, minWidth: 120, maxWidth: 300 }}>
                        <InputLabel>โปรโมชั่น</InputLabel>
                        <Select
                            value={selectedPromotionId}
                            onChange={handlePromotionChange}
                        >
                            <MenuItem value={null}>ไม่เลือกโปรโมชั่น</MenuItem>
                            {promotions.map((promotionData) => (
                                <MenuItem key={promotionData.id} value={promotionData.id}>
                                    {promotionData.promotionName} - {promotionData.discount}%
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Points display and input if a member is selected */}


                    {/* Received amount and change display */}
                    <Box sx={{ m: 1, minWidth: 120, maxWidth: 300, display: 'flex', flexDirection: 'column' }}>
                        <TextField
                            label="Received Amount"
                            variant="outlined"
                            type="number"
                            value={receivedAmount}
                            onChange={(e) => setReceivedAmount(parseInt(e.target.value))}
                            onBlur={calculateChange} // Trigger change calculation when the user finishes entering the amount
                        />
                        <Box sx={{ mt: 2, textAlign: 'center', backgroundColor: '#e3f2fd', padding: '10px', borderRadius: '4px' }}>
                            <Typography variant="subtitle1"> ราคารวมสุทธิ{' '}
                                {(groupedProducts.some(product => product.category === 'กระจก') && groupedProducts.some(product => product.category === 'อลูมิเนียม')) ? (
                                    <React.Fragment>
                                        {(parseInt(calculateTotalAmountWithAluminumCost()) - (pointuse / 10) + parseInt(calculateTotalAmountWithGlassCost()) - calculateAluminumPrice2() - (selectedPromotionData ? Helper.discount(totalAmountWithGlassCost, selectedPromotionData.discount) : 0)).toLocaleString()}
                                    </React.Fragment>
                                ) : groupedProducts.some(product => product.category === 'กระจก') ? (
                                    <React.Fragment>
                                        {`${(calculateTotalAmountWithGlassCost() - (pointuse / 10) - (selectedPromotionData ? Helper.discount(totalAmountWithGlassCost, selectedPromotionData.discount) : 0)).toLocaleString()} ${pointuse && `(ลด ${pointuse / 10} บาท)`} `}
                                    </React.Fragment>
                                ) : groupedProducts.some(product => product.category === 'อลูมิเนียม') ? (
                                    <React.Fragment>
                                        {`${((calculateTotalAmountWithAluminumCost() || 0) - (pointuse / 10) - (selectedPromotionData ? Helper.discount(totalAmount, selectedPromotionData.discount) : 0)).toLocaleString()} ${pointuse && `(ลด ${pointuse / 10} บาท)`} `}
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        <span style={{ display: 'inline-block', margin: 0, padding: 0 }}>
                                            {`${(totalAmount - (pointuse / 10) - (selectedPromotionData ? Helper.discount(totalAmount, selectedPromotionData.discount) : 0)).toLocaleString()} บาท `}
                                        </span>
                                    </React.Fragment>
                                )}

                                <br></br> <span>เงินทอน: {calculateChange()} </span>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                {selectedMember && (
                    <Box sx={{ m: 1, minWidth: 120, maxWidth: 200, display: 'flex', flexDirection: 'column', marginTop: -10, paddingLeft: 2.5 }}>
                        <Typography sx={{ mb: 2, }}>คะแนนของสมาชิก = {selectedMember.point}</Typography>
                        <TextField
                            value={pointuse}
                            onChange={handlePointInputChange}
                            label="คะแนน"
                            type="number"
                        />
                    </Box>
                )}
            </DialogContent >


            <DialogActions sx={{ justifyContent: 'flex-end' }}>
                <Button onClick={onClose} variant="contained" color="warning" sx={{ borderRadius: '1%', width: '120px' }}>
                    ย้อนกลับ
                </Button>
                <Button onClick={() => handleConfirmPayment()} variant="contained" color="success" sx={{ borderRadius: '1%', width: '120px' }}>
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