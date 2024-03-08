import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Box } from '@mui/material';
import './Dashboard.css'; // Import the CSS file for styling
import { PROMOTION, employeescount, get, getOrderCount, getmonthlysales, ip, membercount, profitpromotion, profits, topSellingProduct, } from '../Static/api';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';
import { Select, FormControl, InputLabel, MenuItem, TableSortLabel, Grid } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { Bar } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
import moment from 'moment';
import 'moment/locale/th'; // ต้องการสำหรับภาษาไทย

const Dashboard = () => {
    const [employeeCount, setEmployeeCount] = useState(0);
    const [memberCount, setMemberCount] = useState(0);
    const [profitsFromPromotions, setProfitsFromPromotions] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [totalUnitPrice, setTotalUnitPrice] = useState(0);
    const [profit, setProfit] = useState(0);
    const [topSellingProducts, setTopSellingProducts] = useState([]);
    const chartRef = useRef(null);
    const [activePromotions, setActivePromotions] = useState([]);
    const [orderCount, setOrderCount] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        handleGetCount();
        handleGetProfitPromotion();
        handleGetTotalSales();
        handleGetTopselling();
        handleGetEmployee(); // Add this line
        handleGetMonthlySales();
        handleGetActivePromotions();
        handlegetOrderCount();
        handleGetsell();
    }, []);
    const [totalSalesForRange, setTotalSalesForRange] = useState(0);
    const [totalSalesForRange2, setTotalSalesForRange2] = useState(0);

    useEffect(() => {
        handleGetsell();
    }, []); // Call handleGetsell when the component mounts

    const [selectedSalesData, setSelectedSalesData] = useState(null);
    const [totalSalesweek, setTotalSalesweek] = useState(0);
    const [totalProfitForWeek, setTotalProfitForWeek] = useState(0);


    const [timeframe, setTimeframe] = useState('weekly');


    function convertToThaiMonthYear(dateString) {
        const [year, month] = dateString.split('-');
        const thaiMonthNames = [
            'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
            'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
        ];

        const thaiMonth = thaiMonthNames[parseInt(month, 10) - 1];
        return `${thaiMonth} ปี ${year}`;
    }

    const originalDateString = "2023-12";
    const thaiMonthYear = convertToThaiMonthYear(originalDateString);

    console.log(thaiMonthYear); // Output: ธันวาคม ปี 2023
    // ใน useEffect
    const handleGetActivePromotions = async () => {
        try {
            const apiUrl = `${ip}${PROMOTION}`;
            const response = await axios.get(apiUrl);

            if (response.data.success) {
                // กรองข้อมูลที่มี active เท่ากับ 1
                const activePromotions = response.data.result.filter(promotion => promotion.is_active === 1);
                setActivePromotions(activePromotions);
                console.log('Active Promotions:', activePromotions);
            } else {
                console.error('Unexpected data format:', response.data);
            }
        } catch (error) {
            console.error('Error fetching active promotions:', error);
        } finally {
        }
    };

    const handleGetCount = async () => {
        try {


            const res = await get(membercount);
            if (res.success) {
                const memberCount = res.result.memberCount;

                setMemberCount(memberCount);
            } else {
                console.error('Unexpected data format:', res);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
        }
    };

    const handleGetEmployee = async () => {
        try {

            const res = await get(employeescount);

            console.log('Employee count API response:', res);

            if (res.success) {
                const employeeCount = res.result.employeeCount;

                setEmployeeCount(employeeCount);
            } else {
                console.error('Unexpected data format:', res);
            }
        } catch (error) {
            console.error('Error fetching employee count:', error);
            console.log('Error response from employee count API:', error.response);
        } finally {
        }
    };


    const handleGetProfitPromotion = async () => {
        try {

            const res = await get(profitpromotion);
            if (res.success) {
                const profitsFromPromotions = res.result.profitsFromPromotions;

                setProfitsFromPromotions(profitsFromPromotions); // Assuming setProfitsFromPromotions is your state-setting function
            } else {
                console.error('Unexpected data format:', res);
            }
        } catch (error) {
            console.error('Error fetching profits from promotions:', error);
        } finally {
        }
    };

    const handleGetTopselling = async () => {
        try {
            const apiUrl = `${ip}${topSellingProduct}`;
            const response = await axios.get(apiUrl);
            console.log('API Response:', response.data); // Log the response data;

            if (response.data.success) {
                const data = response.data.result;
                setTopSellingProducts(data);
                console.log('Top Selling Products:', data);
            } else {
                console.error('Unexpected data format:', response.data);
            }
        } catch (error) {
            console.error('Error fetching top-selling products:', error);
        }
    };




    const handleGetTotalSales = async () => {


        try {

            const res = await get(profits);
            if (res.success) {
                const totalSales = res.result.totalSales;
                const totalUnitPrice = res.result.totalUnitPrice;
                const totalCostPrice = res.result.totalCostPrice;

                // Calculate profit
                const profit = totalUnitPrice - totalCostPrice;

                setTotalSales(totalSales);
                setTotalUnitPrice(totalUnitPrice);

                // Set profit in the state
                setProfit(profit);
            } else {
                console.error('Unexpected data format:', res);
            }
        } catch (error) {
            console.error('Error fetching total sales:', error);
        } finally {



        }

    };
    const handlegetOrderCount = async () => {
        try {
            const res = await get(getOrderCount);
            if (res.success) {
                const orderCount = res.result.orderCount;

                // ตั้งค่า state โดยใช้ setState
                setOrderCount(orderCount);
                console.log('Order count:', orderCount);
            } else {
                console.error('Unexpected data format:', res);
            }
        } catch (error) {
            console.error('Error fetching order count:', error);
        }
    }

    const handleGetMonthlySales = async () => {
        try {
            const apiUrl = `${ip}${getmonthlysales}`;
            const response = await axios.get(apiUrl);

            if (response.data.success) {
                const data = response.data.result;

                // Convert date format for display
                const formattedData = data.map(entry => ({
                    ...entry,
                    monthYear: convertToThaiMonthYear(entry.monthYear),
                }));

                //setMonthlySales(formattedData);

                // Destroy the existing chart instance
                if (chartRef.current) {
                    chartRef.current.destroy();
                }

                // Create a new chart instance
                chartRef.current = new Chart(/* ... */);
            } else {
                console.error('Unexpected data format:', response.data);
            }
        } catch (error) {
            console.error('Error fetching monthly sales data:', error);
        } finally {
        }
    };

    const [stockFilter, setStockFilter] = useState('All'); // State for managing stock filter

    // Your existing useEffects and function implementations

    // New function to handle stock filter change
    const handleStockFilterChange = (event) => {
        setStockFilter(event.target.value);
    };

    const stockStatusEndpoint = '/Dashboard/Dashboard99'; // เชื่อมโยงกับ URL ของ API ที่เรียกข้อมูลยอดขายรายสัปดาห์

    const [stockStatus, setStockStatus] = useState([]);

    useEffect(() => {
        const fetchProductLots = async () => {
            const response = await axios.get(`${ip}${stockStatusEndpoint}`); // Adjust API endpoint as needed

            const productLots = response.data;
            console.log('stockStatusstockStatusstockStatus:', productLots);

            setStockStatus(productLots);
        };

        fetchProductLots();
    }, []);

    const filteredTopSellingProducts = topSellingProducts.filter((product) => {
        if (stockFilter === 'All') return true;
        if (stockFilter === 'In Stock' && product.Product_Lot_Quantity > 1) return true;
        if (stockFilter === 'Low Stock' && product.Product_Lot_Quantity > 1 && product.Product_Lot_Quantity < 50) return true;
        if (stockFilter === 'Out of Stock' && product.Product_Lot_Quantity <= 0) return true;
        return false;
    });
    // const filteredTopSellingProducts = topSellingProducts.filter((product) => {
    //     if (stockFilter === 'All') return true;
    //     if (stockFilter === 'In Stock' && product.Stock > 1) return true;
    //     if (stockFilter === 'Low Stock' && product.Stock > 1&& product.Stock <50) return true;
    //     if (stockFilter === 'Out of Stock' && product.Stock <= 0) return true;
    //     return false;
    // });

    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' for ascending, 'desc' for descending

    // Function to handle sorting
    const handleSort = () => {
        const sortedProducts = [...topSellingProducts].sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.Total_Sales - b.Total_Sales; // For ascending sort
            } else {
                return b.Total_Sales - a.Total_Sales; // For descending sort
            }
        });

        setTopSellingProducts(sortedProducts); // Update the state with sorted data
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle the sort order for next click
    };
    const [sortConfig, setSortConfig] = useState({ field: null, order: 'asc' });

    // Function to handle sorting
    const handleSort2 = (field) => {
        const isAsc = sortConfig.field === field && sortConfig.order === 'asc';
        setSortConfig({
            field: field,
            order: isAsc ? 'desc' : 'asc',
        });

        const sortedProducts = [...topSellingProducts].sort((a, b) => {
            if (field === 'Product_Name') {
                // Sorting by Product Name
                return isAsc ? b.Product_Name.localeCompare(a.Product_Name) : a.Product_Name.localeCompare(b.Product_Name);
            } else if (field === 'Total_Sales') {
                // Sorting by Total Sales
                return isAsc ? b.Total_Sales - a.Total_Sales : a.Total_Sales - b.Total_Sales;
            }
        });

        setTopSellingProducts(sortedProducts);
    };
    const [filteredProductType, setFilteredProductType] = useState('');

    const handleFilterByProductType = (type) => {
        setFilteredProductType(type);
    };
    const displayedProducts = filteredProductType
        ? topSellingProducts.filter(product => product.Product_Type === filteredProductType)
        : topSellingProducts;
    const [selectedProductType, setSelectedProductType] = useState('');
    const [clickedProductType, setClickedProductType] = useState('');
    const handleClickProductType = (productType) => {
        if (clickedProductType === productType) {
            setClickedProductType('');
        } else {
            setClickedProductType(productType);
        }
    };
    const handleTimeframeChange = (event) => {
        setTimeframe(event.target.value);
    };

    function generateRandomColors(n) {
        const colors = [];
        for (let i = 0; i < n; i++) {
            const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
            colors.push(color);
        }
        return colors;
    }

    // Assuming you have a way to determine the number of product types you have
    const numberOfProductTypes = filteredTopSellingProducts.length; // Replace `productTypes.length` with your actual data source's length
    const backgroundColors = generateRandomColors(numberOfProductTypes);
    const hoverBackgroundColors = generateRandomColors(numberOfProductTypes);

    // Then you can use these colors in your chart configuration
    const uniqueProductTypes = filteredTopSellingProducts.reduce((acc, current) => {
        const x = acc.find(item => item.Product_Type === current.Product_Type);
        if (!x) {
            return acc.concat([current]);
        } else {
            return acc;
        }
    }, []);

    // Generate random colors based on the number of unique product types

    // Step 2: Map to chart data
    const mainColors = [
        '#2596be', '#07BB1A', '#7809A0', '#37C7B1', '#132a5e', // Bright and vibrant colors
        '#ADBF00', '#156289', '#33FFD4', '#337BFF', '#9A33FF', // More vibrant colors
        '#FF3333', '#FF33B1', '#33FF87', '#336FFF', '#E033FF', // Intense colors
        '#1f8a16', '#347b27', '#498c38', '#5e9e49', '#73af5a', // Shades of green
        '#007acc', '#0087e6', '#00a0ff', '#33aaff', '#66bbff', // Shades of blue
        '#e6c825', '#e6d833', '#e6e641', '#e6f450', '#f4fa62', // Shades of yellow
    
                ];
    
    const dataaaaa = {
        labels: uniqueProductTypes.map((row) => row.Product_Type),
        datasets: [
            {
                data: uniqueProductTypes.map((row) => row.Total_Sales),
                backgroundColor: mainColors, // ใช้สีหลักๆที่คุณเลือก
                hoverBackgroundColor: mainColors, // ใช้สีเดียวกันสำหรับ hover
            },
        ],
    };
    
    const totalSalesSum = filteredTopSellingProducts.reduce((accumulator, currentProduct) => {
        return accumulator + currentProduct.Total_Sales;
    }, 0); // Initialize the accumulator to 0





    const [dailySales, setDailySales] = useState([]);
    const [weeklySales, setWeeklySales] = useState([]);
    const [monthlySales, setMonthlySales] = useState([]);
    const [yearlySales, setYearlySales] = useState([]);

    const monthlySalesEndpoint = '/Dashboard/Dashboard'; // เชื่อมโยงกับ URL ของ API ที่เรียกข้อมูลยอดขายรายเดือน
    const weeklySalesEndpoint = '/Dashboard/Dashboard2'; // เชื่อมโยงกับ URL ของ API ที่เรียกข้อมูลยอดขายรายสัปดาห์
    const dailySalesEndpoint = '/Dashboard/Dashboard6'; // เชื่อมโยงกับ URL ของ API ที่เรียกข้อมูลยอดขายรายสัปดาห์
    const yearlySalesEndpoint = '/Dashboard/Dashboard4'; // เชื่อมโยงกับ URL ของ API ที่เรียกข้อมูลยอดขายรายสัปดาห์
    const handleGetsell = async () => {
        try {
            const yearlySalesResponse = await axios.get(`${ip}${yearlySalesEndpoint}`);
            const yearlySalesData = yearlySalesResponse.data;
            console.log('ปี:', yearlySalesResponse);
            console.log('ปี:', yearlySalesData);

            const dailySalesResponse = await axios.get(`${ip}${dailySalesEndpoint}`);
            const dailySalesData = dailySalesResponse.data;
            console.log('วัน:', dailySalesResponse);
            console.log('วัน:', dailySalesData);

            // เรียก API เพื่อดึงข้อมูลยอดขายรายเดือน
            const monthlySalesResponse = await axios.get(`${ip}${monthlySalesEndpoint}`);
            const monthlySalesData = monthlySalesResponse.data;
            console.log('เดือนdsdsd:', monthlySalesResponse);
            console.log('เดือน:', monthlySalesData);

            // เรียก API เพื่อดึงข้อมูลยอดขายรายสัปดาห์
            const weeklySalesResponse = await axios.get(`${ip}${weeklySalesEndpoint}`);
            const weeklySalesData = weeklySalesResponse.data;
            console.log('สัปดาห์:', weeklySalesResponse);
            console.log('สัปดาห์:', weeklySalesData);

            // ตรวจสอบว่าการเรียก API สำเร็จหรือไม่
            if (weeklySalesData.success) {
                // ถ้าสำเร็จ นำข้อมูลมาใช้งาน
                setDailySales(dailySalesData.result.map(item => ({
                    day: moment(item.day).format('YYYY-MM-DD'),
                    totalSales: item.totalSales,
                    totalOrders: item.totalOrders,
                    totalProfit: item.totalProfit
                })));

                setMonthlySales(monthlySalesData.result);
                setWeeklySales(weeklySalesData.result);
                setYearlySales(yearlySalesData.result);


                // ทำสิ่งที่ต้องการกับข้อมูลที่ได้
                console.log('วัน:', dailySalesData.result);

                console.log('มีข้อมูล:', monthlySalesData.result);
                console.log('มีข้อมูล:', weeklySalesData.result);

                // สามารถเซ็ตข้อมูลใน state หรือทำงานอื่นต่อไปตามต้องการได้
            } else {
                // ถ้าไม่สำเร็จ พิมพ์ข้อความเกี่ยวกับข้อมูลที่ไม่คาดคิด
                console.error('Unexpected data format:', monthlySalesData, weeklySalesData);
            }
        } catch (error) {
            // หากเกิดข้อผิดพลาดในการเรียก API ให้พิมพ์ข้อความเกี่ยวกับข้อผิดพลาด
            console.error('Error fetching sales data:', error);
        }
    };

    console.log('6564574574574574:', dailySales);
    console.log('6564574574574574:', weeklySales);
    console.log('6564574574574574:', monthlySales);
    console.log('6564574574574574:', yearlySales);




    const currentMonth = moment().format('MMMM');
    const currentDay = moment().format('D');
    const currentDate = moment().format('MMMM D YYYY');
    for (let i = 0; i < 7; i++) {
        const dayDate = moment().day(i).format('dddd, MMMM D YYYY');
    }

    let chartData = {};
    let chartOptions = {};

    let labelsday = [];
    for (let i = 0; i < 1; i++) {
        // ดึงวันที่และเดือนของแต่ละวันในสัปดาห์
        const dayDate = moment().day(i).format('dddd,  D MMMM YYYY');
        const check = moment().day(i).format(' YYYY MM D ');

        labelsday.push(dayDate);
        console.log('6564574574574574:', check);

    }


    useEffect(() => {
        if (startDate && endDate) {
        }
    }, [startDate, endDate]); // Dependency array to trigger effect when these values change
    if (timeframe === 'daily' && selectedSalesData) {
        chartData = {
            labels: [` ${formatThaiDate(selectedSalesData.day)}`], // Use a formatted date
            datasets: [{
                label: 'ยอดขาย (บาท)',
                data: [selectedSalesData.totalSales],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
            }],
        };

        chartOptions = {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'วันที่',
                        color: 'black',
                        font: { weight: 'bold' },
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'ยอดขาย (บาท)',
                        color: 'black',
                        font: { weight: 'bold' },
                    },
                    beginAtZero: true,
                },
            },
        };
    }
    // ตรวจสอบว่า selectedSalesData ไม่เป็น undefined ก่อนใช้งาน
    else if (timeframe === 'weekly') {
        // Calculate the last 7 days range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 6);

        // Generate a list of dates for the last 7 days
        let dates = [];
        for (let i = 0; i <= 6; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            dates.push(moment(date).format('YYYY-MM-DD'));
        }

        // Map over the dates to create chart labels and data
        const labels = dates.map(date => formatThaiDate(date));
        const data = dates.map(date => {
            const sale = dailySales.find(sale => sale.day === date);
            return sale ? sale.totalSales : 0;
        });

        chartData = {
            labels: labels, // Array of labels for each day
            datasets: [
                {
                    label: 'ยอดขาย (บาท)',
                    data: data, // Sales data for each day, including 0 for days without sales
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                },
            ],
        };


    } else if (timeframe === 'weekly2' || timeframe === 'monthly') {
        const labels = [];
        let salesData = [];
        let s = [];

        if (timeframe === 'weekly2') {
            // Populate labels for each day of the week
            for (let i = 0; i < 7; i++) {
                const dayDate = moment().day(i).format('dddd');
                labels.push(dayDate);
            }

            // Populate sales data for each day of the week
            salesData = weeklySales.map(entry => entry.totalSales);
            const dates = weeklySales.map(entry => new Date(entry.order_date));

            // นำวันที่ไปหาวันจันทร์ในสัปดาห์นั้น ๆ
            const mondays = dates.map(date => {
                const day = date.getDay(); // 0 = วันอาทิตย์, 1 = จันทร์, ..., 6 = วันเสาร์
                const diff = date.getDate() - day + (day === 0 ? -6 : 1); // หาวันจันทร์ของสัปดาห์นั้น ๆ
                return new Date(date.setDate(diff));
            });

            // แปลงวันที่ให้กลายเป็นรูปแบบข้อความของวันที่
            const formattedMondays = mondays.map(monday => monday.toLocaleDateString());
            console.log('dateeeeeee:', formattedMondays);

        } else if (timeframe === 'monthly') {
            // Populate labels for each month of the year
            for (let i = 0; i < 12; i++) {
                const show = moment().startOf('year').month(i).format('MMMM');
                labels.push(show);
            }

            // Populate sales data for each month of the year
            salesData = new Array(12).fill(null); // Placeholder for months without sales data
            monthlySales.forEach(entry => {
                const monthIndex = parseInt(entry.month, 10) - 1; // Adjust to 0-based index
                salesData[monthIndex] = entry.totalSales;
            });
        }

        chartData = {
            labels: labels,
            datasets: [
                {
                    label: 'ยอดขาย (บาท)',
                    data: salesData,
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 2,
                },
            ],
        };

        chartOptions = {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: timeframe === 'weekly' ? 'เดือน' : 'เดือน',
                        color: 'black',
                        font: { weight: 'bold' },
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'ยอดขาย (บาท)',
                        color: 'black',
                        font: { weight: 'bold' },
                    },
                    beginAtZero: true,
                },
            },
        };
    } else { // timeframe === 'overall'
        chartData = {
            labels: [yearlySales.map(entry => entry.year)],
            datasets: [
                {
                    label: 'ยอดขายทั้งหมด (บาท)',
                    data: [yearlySales.map(entry => entry.totalSales)],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                },
            ],
        };

        chartOptions = {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'ปี',
                        color: 'black',
                        font: { weight: 'bold' },
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'ยอดขาย (บาท)',
                        color: 'black',
                        font: { weight: 'bold' },
                    },
                    beginAtZero: true,
                },
            },
        };
    }





    useEffect(() => {
        if (timeframe === 'weekly') {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - 6);

            // Generate a list of dates for the last 7 days
            let dates = [];
            for (let i = 0; i <= 6; i++) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + i);
                dates.push(moment(date).format('YYYY-MM-DD'));
            }

            // Calculate total sales and total profit for the week
            let totalSalesweek = 0;
            let totalProfitForWeek = 0;

            dates.forEach(date => {
                const sale = dailySales.find(sale => sale.day === date);
                if (sale) {
                    totalSalesweek += sale.totalSales;
                    totalProfitForWeek += sale.totalProfit; // Assuming sale object has totalProfit property
                }
            });

            // Update the state with the calculated totals
            setTotalSalesweek(totalSalesweek);
            setTotalProfitForWeek(totalProfitForWeek); // Assuming you have a useState for totalProfitForWeek
        }
    }, [dailySales, timeframe]); // Add necessary dependencies




    // Handler for when the date selection changes
    const handleDateSelectionChange = (event) => {
        // Find the sales data for the selected date
        const salesDataForSelectedDate = dailySales.find(salesData => salesData.day === event.target.value);
        setSelectedSalesData(salesDataForSelectedDate);
    };



    moment.locale('th');
    function formatThaiDate(dateString) {
        // ใช้วันที่จากข้อมูลที่ได้รับและจัดรูปแบบตามที่ต้องการ
        return moment(dateString).format('dddd ที่ D MMMM YYYY');
    }
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Set to Sunday of this week
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to Saturday of this week

    const totalSalesForWeek = dailySales
        .filter(sale => new Date(sale.day) >= startOfWeek && new Date(sale.day) <= endOfWeek)
        .reduce((total, sale) => total + sale.totalSales, 0);

    const totalOrdersForWeek = dailySales
        .filter(sale => new Date(sale.day) >= startOfWeek && new Date(sale.day) <= endOfWeek)
        .reduce((total, sale) => total + sale.totalOrders, 0);
    // const totalProfitForWeek = dailySales
    //     .filter(sale => new Date(sale.day) >= startOfWeek && new Date(sale.day) <= endOfWeek) // กรองข้อมูลในช่วงสัปดาห์
    //     .reduce((total, sale) => total + sale.totalProfit, 0); // คำนวณผลรวมของกำไรทั้งหมด

    console.log('fadfSDfzsdfgghrehreshserhesrh', totalProfitForWeek); // แสดงค่า totalProfit ทั้งหมดของรายสัปดาห์นี้





    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography
                    variant="h4"
                    align="left"
                    sx={{
                        color: '#333335',
                        marginTop: '20px',
                        fontSize: '24px',
                        marginLeft: '20px',
                        height: '50px',
                        borderRadius: 2,
                        textAlign: 'center',
                        border: '2px solid #009ae1', // Add border
                        padding: '10px', // Add padding
                    }}
                >
                    Dashboard
                </Typography>
            </Box>
            <Box sx={{ margin: '15px', backgroundColor: 'white', borderRadius: 3, padding: '20px' }}>
                <div className="dashboard-container"  >
                    <Card className="sales-card" style={{ backgroundColor: '#009ae1', color: 'white', borderRadius: '10px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)' }}>
                        <CardContent>
                            <Typography variant="h5">สมาชิก</Typography>
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                <AccountCircleIcon style={{ fontSize: '40px', marginRight: '10px' }} />
                                <Typography variant="h4">{memberCount.toLocaleString()}</Typography>
                            </div>
                        </CardContent>
                    </Card>
                    {timeframe === 'daily' && selectedSalesData ? (
                        <Card className="sales-card" style={{ color: 'white', backgroundColor: '#ffbb00', borderRadius: '10px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)' }}>
                            <CardContent>
                                <Typography variant="h5">จำนวนคำสั่งซื้อ</Typography>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                    <ShoppingCartIcon style={{ fontSize: '40px', marginRight: '10px' }} />
                                    <Typography variant="h4">{selectedSalesData.totalOrders} รายการ</Typography>
                                </div>
                            </CardContent>
                        </Card>
                    ) : timeframe === 'weekly' ? (
                        // Condition for 'weekly' timeframe
                        <Card className="sales-card" style={{ color: 'white', backgroundColor: '#ffbb00', borderRadius: '10px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)' }}>
                            <CardContent>
                                <Typography variant="h5">จำนวนคำสั่งซื้อ</Typography>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                    <ShoppingCartIcon style={{ fontSize: '40px', marginRight: '10px' }} />
                                    <Typography variant="h4">{totalOrdersForWeek} รายการ</Typography>

                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        // Fallback condition
                        <Card className="sales-card" style={{ color: 'white', backgroundColor: '#ffbb00', borderRadius: '10px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)' }}>
                            <CardContent>
                                <Typography variant="h5">จำนวนคำสั่งซื้อ</Typography>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                    <ShoppingCartIcon style={{ fontSize: '40px', marginRight: '10px' }} />
                                    <Typography variant="h4">{yearlySales.reduce((total, entry) => total + entry.totalOrders, 0)} รายการ</Typography>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {timeframe === 'daily' && selectedSalesData ? (
                        <Card className="sales-card" style={{ color: 'white', backgroundColor: '#fa4141', borderRadius: '10px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)' }}>
                            <CardContent>
                                <Typography variant="h5">ยอดขายทั้งหมด</Typography>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                    <AttachMoneyIcon style={{ fontSize: '40px', marginRight: '10px' }} />
                                    {/* หากคุณต้องการแสดงผลรวม, คุณควรใช้ reduce หรือวิธีการอื่นในการคำนวณผลรวม */}
                                    <Typography variant="h4">{selectedSalesData.totalSales}  ฿</Typography>
                                </div>
                            </CardContent>
                        </Card>
                    ) : timeframe === 'weekly' ? (
                        <Card className="sales-card" style={{ color: 'white', backgroundColor: '#fa4141', borderRadius: '10px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)' }}>
                            <CardContent>
                                <Typography variant="h5">ยอดขายทั้งหมด</Typography>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                    <AttachMoneyIcon style={{ fontSize: '40px', marginRight: '10px' }} />
                                    {/* ตรวจสอบให้แน่ใจว่า yearlySales เป็น array และคำนวณผลรวมถูกต้อง */}
                                    <Typography variant="h4">{totalSalesweek} ฿</Typography>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (

                        <Card className="sales-card" style={{ color: 'white', backgroundColor: '#fa4141', borderRadius: '10px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)' }}>
                            <CardContent>
                                <Typography variant="h5">ยอดขายทั้งหมด</Typography>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                    <AttachMoneyIcon style={{ fontSize: '40px', marginRight: '10px' }} />
                                    {/* ตรวจสอบให้แน่ใจว่า yearlySales เป็น array และคำนวณผลรวมถูกต้อง */}
                                    <Typography variant="h4">{yearlySales.reduce((total, entry) => total + entry.totalSales, 0)} ฿</Typography>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {timeframe === 'daily' && selectedSalesData ? (
                        <Card className="sales-card" style={{ color: 'white', backgroundColor: '#28bc94', borderRadius: '10px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)' }}>
                            <CardContent>
                                <Typography variant="h5">กำไร</Typography>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                    <MonetizationOnIcon style={{ fontSize: '40px', marginRight: '10px' }} />
                                    <Typography variant="h4">{selectedSalesData.totalProfit} ฿</Typography>
                                </div>
                            </CardContent>
                        </Card>
                    ) : timeframe === 'weekly' ? (
                        <Card className="sales-card" style={{ color: 'white', backgroundColor: '#28bc94', borderRadius: '10px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)' }}>
                            <CardContent>
                                <Typography variant="h5">กำไร</Typography>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                    <MonetizationOnIcon style={{ fontSize: '40px', marginRight: '10px' }} />
                                    <Typography variant="h4">{totalProfitForWeek} ฿</Typography>
                                </div>
                            </CardContent>
                        </Card>
                    ) : timeframe === 'monthly' ? (
                        <Card className="sales-card" style={{ color: 'white', backgroundColor: '#28bc94', borderRadius: '10px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)' }}>
                            <CardContent>
                                <Typography variant="h5">กำไร</Typography>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                    <MonetizationOnIcon style={{ fontSize: '40px', marginRight: '10px' }} />
                                    <Typography variant="h4">{Math.round(monthlySales.reduce((total, entry) => total + entry.totalProfit, 0))} ฿</Typography>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="sales-card" style={{ color: 'white', backgroundColor: '#28bc94', borderRadius: '10px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)' }}>
                            <CardContent>
                                <Typography variant="h5">กำไร</Typography>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                    <MonetizationOnIcon style={{ fontSize: '40px', marginRight: '10px' }} />
                                    <Typography variant="h4">{Math.round(yearlySales.reduce((total, entry) => total + entry.totalProfit, 0))} ฿</Typography>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                </div>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box
                    sx={{
                        margin: '15px',
                        backgroundColor: 'white',
                        borderRadius: 3,
                        width: '750px', // Set the width to 100%
                        height: '500px', // Set the height as needed
                        overflow: 'auto',
                        padding: '20px',
                    }}
                >
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell colSpan={5} align="left" style={{ fontWeight: 'bold', fontSize: '20px' }}>
                                        สินค้าขายดี
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="left"><strong>รหัสสินค้า</strong></TableCell>
                                    <TableCell align="left">
                                        <strong>
                                            <TableSortLabel
                                                active={sortConfig.field === 'Product_Name'}
                                                direction={sortConfig.field === 'Product_Name' ? sortConfig.order : 'asc'}
                                                onClick={() => handleSort2('Product_Name')}
                                            >
                                                ชื่อสินค้า
                                            </TableSortLabel>
                                        </strong>
                                    </TableCell>
                                    <TableCell align="left"><strong>ประเภทสินค้า</strong></TableCell>
                                    <FormControl sx={{ m: 1, minWidth: 120 }}>

                                        <InputLabel id="stock-filter-select-label">Stock Status</InputLabel>
                                        <Select
                                            labelId="stock-filter-select-label"
                                            id="stock-filter-select"
                                            value={stockFilter}
                                            label="Stock Status"
                                            onChange={handleStockFilterChange}
                                        >
                                            <MenuItem value="All">ทั้งหมด</MenuItem>
                                            <MenuItem value="In Stock">สินค้าในคลัง</MenuItem>
                                            <MenuItem value="Low Stock">ใกล้หมด</MenuItem>
                                            <MenuItem value="Out of Stock">หมด</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <TableCell>
                                    <strong>จำนวนออเดอร์ที่ขายได้</strong>
            
                                    </TableCell>

                                    <TableCell align="left">
                                        <strong>
                                            <TableSortLabel
                                                active={true}
                                                direction={sortOrder}
                                                onClick={handleSort}
                                            >
                                                ยอดขายทั้งหมด
                                            </TableSortLabel>
                                        </strong>
                                    </TableCell>
                                </TableRow>



                            </TableHead>
                            <TableBody>
                                {filteredTopSellingProducts.map((row) => (
                                    <TableRow key={row.Product_ID}>
                                        <TableCell component="th" scope="row">
                                            {row.sNo}
                                        </TableCell>
                                        <TableCell align="left">{row.Product_Name}</TableCell>
                                        <TableCell align="left">
                                            {clickedProductType === row.Product_Type ? (
                                                <strong>{row.Product_Type}</strong>
                                            ) : (
                                                <span onClick={() => handleClickProductType(row.Product_Type)}>{row.Product_Type}</span>
                                            )}
                                        </TableCell>
                                        <TableCell
                                            align="left"
                                            style={{
                                                fontWeight: 'bold',
                                                color: row.Product_Lot_Quantity > 0 ? (row.Product_Lot_Quantity <= 50 ? '#FFA500' : '#44C8A7') : '#E96E5B',
                                                backgroundColor: row.Product_Lot_Quantity > 0 ? (row.Product_Lot_Quantity <= 50 ? '#FFF4E5' : '#E8F8F4') : '#FDEEEB',
                                            }}
                                        >
                                            {row.Product_Lot_Quantity <= 0 ? 'หมด' : row.Product_Lot_Quantity}
                                        </TableCell>

                                        <TableCell
                                            align="left"
                                            style={{
                                                // fontWeight: 'bold',
                                                // color: row.Product_Lot_Quantity > 0 ? (row.Product_Lot_Quantity < 50 ? '#FFA500' : '#44C8A7') : '#E96E5B',
                                                // backgroundColor: row.Product_Lot_Quantity > 0 ? (row.Product_Lot_Quantity < 50 ? '#FFF4E5' : '#E8F8F4') : '#FDEEEB',
                                            }}
                                        >

                                            {row.Stock}

                                        </TableCell>

                                        <TableCell align="left">{row.Total_Sales.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>

                        </Table>
                    </TableContainer>

                </Box>




                <Box
                    sx={{
                        margin: '15px',
                        backgroundColor: 'white',
                        borderRadius: 3,
                        width: '800px',
                        height: 'auto',
                        float: 'right',
                        padding: '25px',
                        overflow: 'auto',
                    }}
                >
                    <Grid container alignItems="center">
                        <Typography variant="h4" fontWeight="bold" fontSize="20px">
                            ยอดขาย
                            {timeframe === 'yearly' && (
                                <span>รายปี</span>
                            )}
                            {/* {timeframe === 'daily' && (
                                <span>รายวัน</span>
                            )} */}
                            {timeframe === 'weekly' && (
                                <span>รายสัปดาห์</span>
                            )}
                            {timeframe === 'monthly' && (
                                <span>รายเดือน</span>
                            )}

                        </Typography>

                        <Select
                            value={timeframe}
                            onChange={(event) => setTimeframe(event.target.value)}
                            sx={{ marginTop: '10px', marginBottom: '20px', marginLeft: '10px' }}
                        >
                            {/* <MenuItem value="daily">ยอดขายรายวัน</MenuItem> */}

                            <MenuItem value="weekly">ยอดขายรายสัปดาห์</MenuItem>
                            <MenuItem value="monthly">ยอดขายรายเดือน</MenuItem>
                            <MenuItem value="yearly">ยอดขายรายปี</MenuItem>
                        </Select>
                        {timeframe === 'daily' && (
                            <div >
                                <Box sx={{ minWidth: 160, marginBottom: 1.3, paddingLeft: 2 }}>
                                    <FormControl fullWidth>
                                        <InputLabel id="daily-sales-select-label">Select Date</InputLabel>
                                        <Select
                                            labelId="daily-sales-select-label"
                                            id="daily-sales-select"
                                            onChange={handleDateSelectionChange}
                                            label="Select Date"
                                            sx={{ height: '55px', width: 280, backgroundColor: '#fff', "& .MuiSvgIcon-root": { color: "#000" } }} // Adjust height and background color here
                                        >
                                            {dailySales.map((entry, index) => (
                                                <MenuItem key={index} value={entry.day}>{formatThaiDate(entry.day)}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>

                            </div>

                        )}
                        {/* {timeframe === 'weekly' && (
                            <div>
                                <Box sx={{ minWidth: 160, marginBottom: 2, display: 'flex', gap: '10px', paddingLeft: 2 }}>
                                    <div>
                                        <label>วันที่เริ่มต้น:</label>
                                        <select
                                            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
                                        >
                                            {dailySales.sort((a, b) => new Date(a.day) - new Date(b.day)).map((entry) => (
                                                <option key={entry.day} value={entry.day}>
                                                    {formatThaiDate(entry.day)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label>วันที่สิ้นสุด:</label>
                                        <select
                                            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
                                        >
                                            {dailySales.sort((a, b) => new Date(a.day) - new Date(b.day)).map((entry) => (
                                                <option key={entry.day} value={entry.day}>
                                                    {formatThaiDate(entry.day)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </Box>
                            </div>
                        )} */}
                        {/* {(startDate && endDate) && (
    <div> {formatThaiDate(startDate)} to {formatThaiDate(endDate)}: {totalSalesForRange}</div>
)} */}


                    </Grid>

                    <Bar
                        data={chartData}
                        options={chartOptions}
                    />







                    {console.log('Chart rendered')}
                </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>

                <Box sx={{
                    margin: '15px',
                    backgroundColor: 'white',
                    borderRadius: 3,
                    width: '670px',
                    height: '500px',
                    float: 'right',
                    overflow: 'auto',
                    padding: '20px', // เพิ่ม padding เพื่อเพิ่มระยะห่าง
                }}>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell colSpan={5} align="left" style={{ fontWeight: 'bold', fontSize: '20px' }}>
                                        โปรโมชั่นที่ใช้งานอยู่
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell><strong>ชื่อโปรโมชั่น</strong></TableCell>
                                    <TableCell><strong>รายละเอียด</strong></TableCell>
                                    <TableCell><strong>ส่วนลด (%)</strong></TableCell>
                                    <TableCell><strong>วันที่เริ่ม</strong></TableCell>
                                    <TableCell><strong>วันที่สิ้นสุด</strong></TableCell>
                                    <TableCell><strong>โควต้า</strong></TableCell>
                                    <TableCell><strong>จำนวนที่ใช้แล้ว</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {activePromotions.map((promotion) => (
                                    <TableRow key={promotion.promotion_id}>
                                        <TableCell component="th" scope="row">
                                            {promotion.promotion_name}
                                        </TableCell>
                                        <TableCell>{promotion.promotion_detail}</TableCell>
                                        <TableCell>{promotion.discount}</TableCell>
                                        <TableCell>{new Date(promotion.promotion_start).toLocaleDateString()}</TableCell>
                                        <TableCell>{new Date(promotion.promotion_end).toLocaleDateString()}</TableCell>
                                        <TableCell>{promotion.quota}</TableCell>
                                        <TableCell>{promotion.used}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <Box sx={{
                    margin: '15px',
                    backgroundColor: 'white',
                    borderRadius: 3,
                    width: '710px',
                    height: '500px',
                    float: 'right',
                    overflow: 'auto',
                    padding: '20px', // เพิ่ม padding เพื่อเพิ่มระยะห่าง
                }}>
                    <Doughnut data={dataaaaa} style={{ width: '700px', height: '600px', margin: 'auto' }} />

                </Box>

            </Box>
            {/* <div className="monthly-sales-chart">
                    <h1>ยอดขายรายเดือน</h1>
                    <ChartContainer
                        series={''}
                        width={500}
                        height={200}  
                        xAxis={[
                            {
                                id: 'years',
                                data: [2010, 2011, 2012, 2013, 2014],
                                scaleType: 'band',
                                valueFormatter: (value) => value.toString(),
                            },
                        ]}
                        yAxis={[
                            {
                                id: 'eco',
                                scaleType: 'linear',
                            },
                            {
                                id: 'pib',
                                scaleType: 'log',
                            },
                        ]}
                    >
                        <BarPlot />
                        <LinePlot />
                        <ChartsXAxis label="Years" position="bottom" axisId="years" />
                        <ChartsYAxis label="Results" position="left" axisId="eco" />
                        <ChartsYAxis label="PIB" position="right" axisId="pib" />
                    </ChartContainer>
                </div> */}


        </div >
    );
};

export default Dashboard;
