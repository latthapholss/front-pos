import React, { useState, useEffect, useRef } from 'react';
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Button,
  TableHead
} from '@mui/material';
import jsPDF from 'jspdf';
import { getReceiptData, ip } from '../../Static/api';
import axios from 'axios';
import './receipt.css';


export default function ReceiptDialog({ open, handleClose, orderId }) {
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);
  
  useEffect(() => {
    const fetchReceiptData = async () => {
      try {
        setError(null);
        setLoading(true);

        if (orderId) {
          const apiUrl = `${ip}${getReceiptData.replace(':order_id', orderId)}`;

          const response = await axios.post(apiUrl);

          if (response.status !== 200) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = response.data;
          setReceiptData(data);
          console.log('Receipt Data:', data);
        }
      } catch (error) {
        console.error('Error fetching receipt data:', error);
        setError('An error occurred while fetching data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (open && orderId) {
      fetchReceiptData();
    }
  }, [open, orderId]);
  const handleSaveAsPDF = () => {
    const pdf = new jsPDF();
    const content = contentRef.current;
  
    // If content is available, generate the PDF
    if (content) {
      pdf.html(content, {
        callback: function (pdf) {
          pdf.save('receipt.pdf');
        },
        margin: [15, 15], // You may need to adjust the margins based on your layout
      });
    }
  };
  
  

  const handlePrint = () => {
    
    window.print();
  };
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString('th-TH', options);
    return formattedDate;
  };
  const formatOrderId = (orderId) => {
    const paddedOrderId = `OID${orderId.toString().padStart(6, '0')}`;
    return paddedOrderId;
  };
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h3" sx={{ fontSize: 28 }}>ใบเสร็จ</Typography>

          <div>
          <Button onClick={handleSaveAsPDF}>บันทึกเป็น PDF</Button>
            <Button onClick={handlePrint}>พิมพ์</Button>
            <Button onClick={handleClose}>ปิด</Button>
          </div>
        </div>
      </DialogTitle>
      <DialogContent style={{ display: 'flex', flexDirection: 'column' }} ref={contentRef}>
        {receiptData && (
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '150px' }}>
              <Typography variant="body3" style={{ whiteSpace: 'nowrap' }}>
              ร้านเมืองทองกระจกอลูมิเนียม

              </Typography>
              <Typography variant="body3" style={{ whiteSpace: 'nowrap' }}>
                เลขที่ใบเสร็จ: {formatOrderId(receiptData.result[0].order_id)} 

              </Typography>

              <Typography variant="body1">
                ชื่อลูกค้า: {receiptData.result[0].member_fname} {receiptData.result[0].member_lname}
              </Typography>
              <Typography variant="body2" style={{ whiteSpace: 'nowrap' }}>
                ที่อยู่: 47 หมู่ 14 ต.เจาทอง อ.ภักดีชุมพล จ.ชัยภูมิ 36260
              </Typography>
            </div>

            <div style={{ width: '150px' }}>
              <Typography variant="body2">
                วันที่: {receiptData.result.length > 0 ? formatDate(receiptData.result[0].order_date) : 'N/A'}
              </Typography>
            </div>
          </div>
        )}

        {receiptData && receiptData.result && receiptData.result.length > 0 ? (
          <Table style={{ width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell style={{ width: '40%' }}>สินค้า</TableCell>
                <TableCell style={{ width: '10%' }}>จำนวน</TableCell>
                <TableCell style={{ width: '10%' }}>หน่วยนับ</TableCell>
                <TableCell style={{ width: '10%' }}>ราคาต่อหน่วย</TableCell>
                <TableCell style={{ width: '10%' }}>รวมเงิน</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {receiptData.result.map((item, index) => (
                <TableRow key={index}>
                  <TableCell style={{ width: '40%' }}>{item.product_name}</TableCell>
                  <TableCell style={{ width: '10%' }}>{item.quantity}</TableCell>
                  <TableCell style={{ width: '10%' }}>{item.unit}</TableCell>
                  <TableCell style={{ width: '10%' }}>{item.unit_price}</TableCell>
                  <TableCell style={{ width: '10%' }}>{item.unit_price * item.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>No items available</p>
        )}

        {/* Additional Footer Section */}
        {receiptData && receiptData.result && receiptData.result.length > 0 && (
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between'}}>
            <div style={{ width: '50%' }}>
              <Typography variant="body2">แต้ม: {receiptData.result[0].point}</Typography>
            </div>

            <div style={{ width: '50%', textAlign: 'right' }}>
              {/* Additional total amount or summary */}
              <Typography variant="body1">
                รวมเงินทั้งสิ้น: {' '}
                <span style={{ color: 'red' }}>
                  {receiptData.result[0].total_amount}
                </span>
              </Typography>
              {/* Add more information as needed */}
            </div>
          </div>
        )}

        {receiptData && (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '50px' }}>
            <div style={{ width: '50%', textAlign: 'right' }}>
              <Typography variant="body2">ผู้รับ:____________________</Typography>
            </div>
            <div style={{ width: '50%', textAlign: 'right', marginLeft: 'auto' }}>
              <Typography variant="body2">ลูกค้า:____________________</Typography>
            </div>
          </div>
        )}
      </DialogContent>

      <style>
        {`
    @media print {
      /* Hide buttons in the dialog title when printing */
      .MuiDialogTitle-root button {
        display: none;
      }

      /* Ensure that table borders are visible when printing */
      table {
        border-collapse: collapse;
        width: 100%;
      }

      th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
    }
    body {
      font-family: 'Sarabun', sans-serif;
    }
  `}
      </style>

    </Dialog>
  );
}
