const is_prod = false

const version = '/api/v1'
export const backend_dns = (is_prod ? '' : 'http://localhost:4000')
export const WEBSITE = is_prod ? '' : 'http://localhost:3000';
export const ip = backend_dns + version;

export const getImagePath = (img_name) => {
    return backend_dns + "/" + img_name
}
export const getProductypeImagePath = (img_name) => {
    return `${backend_dns}/static/product_type/${encodeURIComponent(img_name)}`;
}

export const post = (object, path, token) => new Promise((resolve, reject) => {
    fetch(ip + path, {
        method: 'POST',
        headers: {
            "Access-Control-Allow-Origin": "*",
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': token
        }, body: JSON.stringify(object)
    }).then(res => {
        setTimeout(() => null, 0);
        return res.json()
    }).then(json => {
        resolve(json);
    }).catch((err) => reject(err))
})

  

  
export const get = (path, token) => new Promise((resolve, reject) => {
    fetch(ip + path, {
        method: 'GET',
        headers: {
            "Access-Control-Allow-Origin": "*",
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': token
        },
    }).then(res => {
        setTimeout(() => null, 0);
        return res.json()
    }).then(json => {
        resolve(json);
    }).catch((err) => reject(err))
})

export const put = (path, data, token) => new Promise((resolve, reject) => {
    fetch(ip + path, {
        method: 'PUT', // เปลี่ยนเมธอดเป็น 'PUT'
        headers: {
            "Access-Control-Allow-Origin": "*",
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': token
        },
        body: JSON.stringify(data) // ใส่ข้อมูลที่ต้องการส่งไปใน request body
    }).then(res => {
        setTimeout(() => null, 0);
        return res.json()
    }).then(json => {
        resolve(json);
    }).catch((err) => reject(err))
})

// ################################################## URL ##################################################
export const LOGIN = '/auth/login'
export const LOGIN_MEMBER = '/auth/login_member'
export const REGISTER_MEMBER = '/auth/register_member'
export const UNIT ='/struct/unit'
export const ADD_UNIT='/struct/add_unit'
export const PRODUCT_TYPE='/struct/product_type'
export const ADD_PRODUCT_TYPE='/struct/add_product_type'
export const ADD_PRODUCT='/product/add_product'
export const GETORDERDETAIL='/product/getordetail'
export const UPDATE_PRODUCT= '/product/update_product'
export const ACTIVE_PRODUCT = '/product/active_product'
export const PRODUCT ='/product'
export const PRODUCTSALES ='/product/get_product_sales'
export const FILTERPRODUCT='/product/filter-products'
export const DELETEUNIT='/struct/soft-delete-unit'
export const DELETEPROTYPE='/struct/soft-delete-product-type'
export const PROMOTION='/promotion'
export const PROMOTIONSTATUS='/promotion/update-promotion-status'
export const PROMOTION_ADD='/promotion/addpromotion'
export const DELETEPROMOTION='/promotion/deletepromotion'
export const UPDATE_PROMOTION = '/promotion/updatepromotion/:promotion_id'
export const GETEMPLOYEE ='/employee/get_employee'
export const TOGGLE_PROMOTION = '/promotion/switchactive/:promotion_id'
//productupdate

//employee
export const ADD_EMPLOYEE ='/employee/add_employee/'
export const UPDATE_EMPLOYEE ='/employee/update_employee/:employee_id'
export const DELETEEMPLOYEE='/employee/delete_employee'
//member
export const ADD_MEMBER ='/member/add_member'
export const GETMEMBER ='/member/get_member'
export const DELETEMEMBER='/member/delete_member'
//dashboard

export const employeescount='/dashboard/employees-count'
export const membercount='/dashboard/members-count'
export const profitpromotion='/dashboard/profits-from-promotions'
export const profits='/dashboard/profits-sales'
export const topSellingProduct='/dashboard/top-selling-products'
export const getmonthlysales='/dashboard/monthly-sales'
export const getOrderCount='/dashboard/getordercount'


//receipt
export const getReceiptData='/product/get_receipt/:order_id'
export const getReceiptRefundData='/product/get_receiptrefund/:order_id'

//refund_product
export const refundproduct='/product/return_product'
export const getorderproduct='/product/get_order_products/'
//history
export const getorderhistory='/product/getPurchaseHistory/'
export const getorderhistoryDetail='/product/getPurchaseHistoryDetail/'

//lotproduct
export const getlotprouduct='/product/getlotprouduct'
export const confrimorder= '/product/confirm_order';

export const Get_memberdetail= '/member/get_memberdetail/';
export const DELETELOT='/product/deletelot'
export const EditedLot= '/product/updatelot';
export const EditedUnit= '/struct/update_unit';
export const EditedCategory= '/struct/update_product_type';