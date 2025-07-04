import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  MenuItem,
  Select
} from '@mui/material';
import axios from 'axios';
import jsPDF from 'jspdf';
import { getReceiptData, getReceiptRefundData, ip } from '../../Static/api';
import html2canvas from 'html2canvas';

function ReceiptRefundDialog({ open, handleClose, orderId }) {
  const [receiptData, setReceiptData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const contentRef = useRef(null);
  const [triggerPdfGeneration, setTriggerPdfGeneration] = useState(false);
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    // Reset the trigger to avoid generating the PDF immediately after setting the date
    setTriggerPdfGeneration(false);
  };
  const preparePdfGeneration = () => {
    setTriggerPdfGeneration(true);
  };
  useEffect(() => {
    if (triggerPdfGeneration) {
      generatePdf();
      setTriggerPdfGeneration(false); // Reset the trigger after generating the PDF
    }
  }, [triggerPdfGeneration]); // Make sure to include all dependencies used inside generatePdf

  useEffect(() => {
    const fetchReceiptData = async () => {
      try {
        setError(null);
        setLoading(true);

        if (orderId) {
          const apiUrl = `${ip}${getReceiptRefundData.replace(':order_id', orderId)}`;

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

  const generatePdf = () => {
    if (!contentRef.current) {
      console.error("The content reference is not available.");
      return;
    }

    // Using html2canvas to take a snapshot of the current ref content
    html2canvas(contentRef.current, { scale: 2 }) // Adjust scale as needed for higher quality
      .then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4"
        });

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        // Calculate the height based on the aspect ratio of the image
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // Add the image to the PDF and set it to fit the page
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        // Save the generated PDF
        pdf.save('receiptRefund.pdf');
      })
      .catch(error => {
        // Proper error handling
        console.error("Error generating PDF: ", error);
      });
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

  const formatDateTime = () => {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const formattedDateTime = now.toLocaleDateString('th-TH', options);
    return formattedDateTime;
  };
  const [selectedDate, setSelectedDate] = useState('');



  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h3" sx={{ fontSize: 28 }}>ใบเสร็จคืนสินค้า</Typography>

          <div>
            <Button onClick={preparePdfGeneration} variant="outlined" sx={{ mr: 1 }}>บันทึกเป็น PDF</Button>
            <Button onClick={handlePrint} variant="outlined" sx={{ mr: 1 }}>พิมพ์</Button>
            <Button onClick={handleClose} variant="outlined" sx={{ mr: 1 }}>ปิด</Button>
          </div>
        </div>
      </DialogTitle>
      <DialogContent ref={contentRef} style={{ padding: '100px' }}>
        {/* Your receipt content */}
        {/* Ensure that receiptData is available before rendering */}
        {receiptData && (
          <>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ width: '50%' }}>
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
              <div style={{ width: '50%' }}>
                <Typography variant="body2">
                  วันที่: {formatDateTime()}
                </Typography>
              </div>
            </div>
            {receiptData.result && receiptData.result.length > 0 ? (
              <>
                <Table style={{ width: '100%', marginTop: '20px' }}>
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
              </>
            ) : (
              <p>ไม่มีการคืนสินค้า</p>
            )}
            {/* Additional Footer Section */}
            {receiptData.result && receiptData.result.length > 0 && (
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '50%' }}>
                  {/* <Typography variant="body2">แต้ม: {receiptData.result[0].point}</Typography> */}
                </div>
                <div style={{ width: '50%', textAlign: 'right' }}>
                  <Typography variant="body1">
                    จำนวนเงินที่คืน : {' '}
                    <span style={{ color: 'red' }}>
                      {receiptData.result[0].total_amount}
                    </span>
                  </Typography>
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
          </>
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

          /* Additional CSS styles for the PDF */
          .MuiDialogContent-root {
            padding: 20px;
          }
          .MuiTypography-root {
            margin-bottom: 10px;
          }
          .MuiTable-root {
            border-collapse: collapse;
            width: 100%;
          }
          .MuiTableHead-root,
          .MuiTableBody-root {
            border: 1px solid #ddd;
          }
          .MuiTableCell-root {
            padding: 8px;
            text-align: left;
          }
          .MuiTableRow-root {
            border: 1px solid #ddd;
          }

          /* Additional styling for better appearance */
          .MuiDialogTitle-root {
            padding: 20px;
            background-color: #f0f0f0;
          }
          .MuiDialogTitle-root > div {
            margin-bottom: 20px;
          }
          .MuiDialogContent-root {
            background-color: #fafafa;
            border-radius: 10px;
          }
          .MuiButton-root {
            margin-right: 10px;
          }
        `}
      </style>
    </Dialog>
  );
}

export default ReceiptRefundDialog;
