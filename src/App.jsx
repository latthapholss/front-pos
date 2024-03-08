import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, } from 'react-router-dom';
import Login from './Component/Login';
import Register from './Component/Register';
import AdminCategories from './Admin/AdminCategories';
import EmployeeManagement from './Admin/EmployeeManagement';
import AdminProduct from './Admin/AdminProduct';
import CashierPage from './Admin/CashierPage';
import MemberManagement from './Admin/MemberManagement';
import Login_member from './Member/Login_member';
import MemberProfile from './Member/Member-Profile';
import Memberhistory from './Member/history';
import MemberPromotion from './Member/promotion';
import AddPromotion from './Promotion/promotionadd';
// import Promotionitem from './Promotion/promotiontem';
// import Promotionconfirm from './Promotion/promotionconfirm';
import { useUser } from './context';
// import PromotionITEM from './Promotion/promotiontem';
import Upload from './Admin/testupload';
import SalesDetailPage from './Admin/SalesDetailPage';
import HeaderBar from './layout/Headerbar';
import SidebarAdmin from './layout/SidebarAdmin';
import { CssBaseline } from '@mui/material';
import SidebarEmployee from './layout/SidebarEmployee';
import SidebarMember from './layout/SidebarMember';
import Dashboard from './Dashboard/Dashboard';
import ReceiptDialog from './Component/receipt/receiptDialog';
import ProductLotManage from './Lot/ProductLotManage';
import receiptRefundDialog from './Component/receipt/receiptRefundDialog';
import Promotionitemset from './Promotion/promotionitemset';
import ItemsetPromotionadd from './Promotion/ItemsetPromotionadd';




function App() {
  const { person, updatePerson } = useUser();

  useEffect(() => {
    updatePerson();
  }, []);

  const renderSidebar = () => {
    if (person) {
      if (person.user_type === 1) {
        return <SidebarAdmin />;
      } else if (person.user_type === 0) {
        return <SidebarEmployee />;
      } else if (person.user_type === 2) {
        return <SidebarMember />;
      }
    }
    // หากไม่มี person หรือ user_type ไม่ตรงกับเงื่อนไขที่กำหนด สามารถกำหนด behavior ตามที่คุณต้องการ
    return null;
  };

  return (
    <Router >
      <>
        <CssBaseline />
        <div className='app'>
          {renderSidebar()}
          <main className="content">
            {person && (person.user_type === 0 || person.user_type === 1 || person.user_type === 2) ? (
              <HeaderBar />
            ) : null}
            <div className="content_body">
              <Routes>
                {/* Route for the home page */}
                <Route path="/" element={<Navigate to="/admin/cashier" />} />

                {/* Routes for the login and register pages */}
                <Route
                  path="/login"
                  element={

                    person ? (
                      // หากมี person อยู่แล้ว (เข้าสู่ระบบแล้ว) ให้ตรวจสอบ user_type เพื่อทำการนำทาง
                      <>
                        {person.user_type === 0 ? (
                          // admin ให้ไปที่หน้า /admin/cashier
                          <Navigate to="/admin/dashboard" />
                        ) : person.user_type === 1 ? (
                          // employee ให้ไปที่หน้า /employee
                          <Navigate to="/admin/dashboard" />
                        ) : person.user_type === 2 ? (
                          // member ให้ไปที่หน้า /profile
                          <Navigate to="/member/promotion" />
                        ) : (
                          // กรณีอื่นๆ ให้เด้งกลับไปที่หน้า /login (เหมือนกับการเข้าสู่ระบบใหม่)
                          <Navigate to="/login" />
                        )}
                      </>
                    ) : (
                      // หากไม่มี person (ยังไม่ได้เข้าสู่ระบบ) ให้แสดงคอมโพเนนต์ <Login />
                      <Login />
                    )
                  }
                />

                {/* Routes for the admin pages */}
                {person && person.user_type === 0 ? (

                  <>
                    <Route path="/additemset/:id1/:id2" element={<ItemsetPromotionadd person={person} />} />
                    <Route path="/admin/cashier" element={<CashierPage person={person} />} />
                    <Route path="/admin/adminproduct" element={<AdminProduct person={person} />} />
                    <Route path="/admin/admincategories" element={<AdminCategories person={person} />} />
                    <Route path="/admin/employeemanagement" element={<EmployeeManagement person={person} />} />
                    <Route path="/admin/membermanagement" element={<MemberManagement person={person} />} />
                    <Route path="/promotion/promotionadd" element={<AddPromotion person={person} />} />
                    {/* <Route path="/promotion/promotiontem" element={<PromotionITEM person={person} />} /> */}
                    {/* <Route path="/promotion/promotionconfirm" element={<Promotionconfirm person={person} />} /> */}
                    <Route path="/admin/SalesDetailPage" element={<SalesDetailPage person={person} />} />
                    <Route path="/admin/Lot/ProductLotManage" element={<ProductLotManage person={person} />} />
                    <Route path="/receiptRefund" element={<receiptRefundDialog />} />
                    <Route path="/promotion/promotionitemset" element={<Promotionitemset />} />

                  
                  </>
                ) : (
                  () => <Navigate to="/login" replace state={{ from: '/admin/dashboard' }} />
                )}
                {person && person.user_type === 1 ? (

                  <>
                    <Route path="/additemset/:id1/:id2" element={<ItemsetPromotionadd person={person} />} />
                    <Route path="/admin/cashier" element={<CashierPage person={person} />} />
                    <Route path="/admin/adminproduct" element={<AdminProduct person={person} />} />
                    <Route path="/admin/admincategories" element={<AdminCategories person={person} />} />
                    <Route path="/admin/employeemanagement" element={<EmployeeManagement person={person} />} />
                    <Route path="/admin/membermanagement" element={<MemberManagement person={person} />} />
                    <Route path="/promotion/promotionadd" element={<AddPromotion person={person} />} />
                    {/* <Route path="/promotion/promotiontem" element={<PromotionITEM/>} /> */}
                    {/* <Route path="/promotion/promotionconfirm" element={<Promotionconfirm person={person} />} /> */}
                    <Route path="/admin/SalesDetailPage" element={<SalesDetailPage person={person} />} />
                    <Route path="/admin/dashboard" element={<Dashboard person={person} />} />
                    <Route path="/receipt" element={< ReceiptDialog />} />
                    <Route path="/admin/Lot/ProductLotManage" element={<ProductLotManage person={person} />} />
                    <Route path="/receiptRefund" element={<receiptRefundDialog />} />
                    <Route path="/promotion/promotionitemset" element={<Promotionitemset />} />

                    {/* <Route path="/member/member-Profile" element={<MemberProfile person={person}/>} />
              <Route path="/member/history" element={<Memberhistory person={person}/>} />
              <Route path="/member/promotion" element={<MemberPromotion person={person}/>} /> */}
                  </>
                ) : (
                  () => <Navigate to="/login" replace state={{ from: '/admin/dashboard' }} />
                )}

                {/* Routes for the member pages */}
                {person && person.user_type === 2 ? (

                  <>

                    <Route path="/profile" element={<MemberProfile person={person} />} />
                    <Route path="/member/history" element={<Memberhistory person={person} />} />
                    <Route path="/member/promotion" element={<MemberPromotion person={person} />} />
                    <Route path="/member/member-Profile" element={<MemberProfile />} />
                  </>
                ) : (
                  () => <Navigate to="/login" replace state={{ from: '/member/promotion' }} />
                )}
                <Route path="/promotion/promotionadd" element={<AddPromotion person={person} />} />
                {/* <Route path="/promotion/promotionitem" element={<Promotionitem person={person} />} /> */}
                {/* <Route path="/promotion/promotionconfirm" element={<Promotionconfirm person={person} />} /> */}
                <Route path="/receipt" element={< ReceiptDialog />} />
                {/* Routes for the promotion pages */}
                {/* {person && person.is_user ? (
            <>
              <Route path="/promotion/promotionadd" element={<AddPromotion />} />
              <Route path="/promotion/promotionitem" element={<Promotionitem />} />
              <Route path="/promotion/promotionconfirm" element={<Promotionconfirm />} />
            </>
          ) : (
            () => <Navigate to="/login" replace state={{ from: '/promotion/promotionadd' }} />
          )} */}

                {/* <Route path="/member/history" element={<Memberhistory />} />
                <Route path="/member/promotion" element={<MemberPromotion />} /> */}
                {/* Default route */}
                <Route path="/*" element={<Navigate to="/login" />} />
                {/* <Route path="/member/login_member" element={<Login_member />} /> */}
                <Route path="/register" element={<Register />} />
                {/* Route for the PromotionITEM component */}
                <Route path="/login" element={<Login />} />
                <Route path="/admin/Lot/ProductLotManage" element={<ProductLotManage person={person} />} />
                <Route path="/promotion/promotionitemset" element={<Promotionitemset />} />
                <Route path="/additemset/:id1/:id2" element={<ItemsetPromotionadd person={person} />} />
              </Routes>
            </div>
          </main>
        </div>
      </>
    </Router >

  );
}

export default App;



