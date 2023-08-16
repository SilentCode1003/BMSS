exports.MasterAccessType = (data) => {
    let dataResult = []; 

    data.forEach((key, item) => {

        dataResult.push({
            accesscode: key.mat_accesscode,
            accessname: key.mat_accessname,
            status: key.mat_status,
            createdby: key.mat_createdby,
            createddate: key.mat_createddate,
        })
    });
 
    return dataResult;
} 

exports.MasterPositionType = (data) => {
    let dataResult = []; 

    data.forEach((key, item) => {

        dataResult.push({
            positioncode: key.mpt_positioncode,
            positionname: key.mpt_positionname,
            status: key.mpt_status,
            createdby: key.mpt_createdby,
            createddate: key.mpt_createddate,
        })
    });
 
    return dataResult;
} 

exports.MasterUser = (data) => {
    let dataResult = []; 

    data.forEach((key, item) => {

        dataResult.push({
            usercode: key.mu_usercode,
            employeeid: key.mu_employeeid,
            accesstype: key.mu_accesstype,
            positiontype: key.mu_positiontype,
            username: key.mu_username,
            password: key.mu_password,
            status: key.mu_status,
            createdby: key.mu_createdby,
            createddate: key.mu_createddate,
        })
    });
 
    return dataResult;
} 

exports.MasterEmployees = (data) => {
    let dataResult = []; 

    data.forEach((key, item) => {
        dataResult.push({
            employeeid: key.me_employeeid,
            fullname: key.me_fullname,
            position: key.me_position,
            contactinfo: key.me_contactinfo,
            datehired: key.me_datehired,
            status: key.me_status,
            createdby: key.me_createdby,
            createddate: key.me_createddate,
        })
    });
 
    return dataResult;
} 

exports.MasterProduct = (data) => {
    let dataResult = []; 

    data.forEach((key, item) => {
        dataResult.push({
            productid: key.mp_productid,
            description: key.mp_description,
            productimage: key.mp_productimage,
            price: key.mp_price,
            barcode: key.mp_barcode,
            status: key.mp_status,
            createdby: key.mp_createdby,
            createddate: key.mp_createddate,
        })
    });
 
    return dataResult;
} 

exports.MasterCategory = (data) => {
    let dataResult = []; 

    data.forEach((key, item) => {
        dataResult.push({
            categorycode: key.mc_categorycode,
            categoryname: key.mc_categoryname,
            status: key.mc_status,
            createdby: key.mc_createdby,
            createddate: key.mc_createddate,
        })
    });
 
    return dataResult;
} 

exports.MasterPos = (data) => {
    let dataResult = []; 

    data.forEach((key, item) => {

        dataResult.push({
            posid: key.mp_posid,
            posname: key.mp_posname,
            serial: key.mp_serial,
            min: key.mp_min,
            ptu: key.mp_ptu,
            status: key.mp_status,
            createdby: key.mp_createdby,
            createddate: key.mp_createddate,
        })
    });
 
    return dataResult;
} 

exports.MasterBranch = (data) => {
    let dataResult = []; 

    data.forEach((key, item) => {
        dataResult.push({
            branchid: key.mb_branchid,
            branchname: key.mb_branchname,
            tin: key.mb_tin,
            address: key.mb_address,
            logo: key.mb_logo,
            status: key.mb_status,
            createdby: key.mb_createdby,
            createddate: key.mb_createddate,
        })
    });
 
    return dataResult;
} 

exports.SalesDetail = (data) => {
    let dataResult = []; 

    data.forEach((key, item) => {
        dataResult.push({
            detailid: key.st_detail_id,
            date: key.st_date,
            posid: key.st_pos_id,
            shift: key.st_shift,
            paymenttype: key.st_payment_type,
            description: key.st_description,
            total: key.st_total,
            cashier: key.st_cashier,
        })
    });
 
    return dataResult;
} 

exports.SalesItem = (data) => {
    let dataResult = []; 

    data.forEach((key, item) => {
        dataResult.push({
            detailid: key.si_detail_id,
            date: key.si_date,
            item: key.si_item,
            price: key.si_price,
            quantity: key.si_quantity,
            total: key.si_total,
        })
    });
 
    return dataResult;
} 

exports.ShiftReport = (data) => {
    let dataResult = []; 

    data.forEach((key, item) => {
        dataResult.push({
            date: key.sr_date,
            pos: key.sr_pos,
            shift: key.sr_shift,
            cashier: key.sr_cashier,
            floating: key.sr_floating,
            cashfloat: key.sr_cash_float,
            salesbeginning: key.sr_sales_beginning,
            salesending: key.sr_sales_ending,
            totalsales: key.sr_total_sales,
            receiptbeginning: key.sr_receipt_beginning,
            receiptending: key.sr_receipt_ending,
            status: key.sr_status,
            approvedby: key.sr_approvedby,
            approveddate: key.sr_approveddate,
        })
    });
 
    return dataResult;
} 


exports.CashReport = (data) => {
    let dataResult = []; 

    data.forEach((key, item) => {
        dataResult.push({
            reportid: key.cr_report_id,
            date: key.cr_date,
            shift: key.cr_shift,
            pos: key.cr_pos,
            cashier: key.cr_cashier,
            type: key.cr_type,
            status: key.cr_status,
        })
    });
 
    return dataResult;
} 

exports.ProductPrice = (data) => {
    let dataResult = []; 

    data.forEach((key, item) => {
        dataResult.push({
            productpriceid: key.pp_product_price_id,
            productid: key.pp_product_id,
            description: key.pp_description,
            barcode: key.pp_barcode,
            productimage: key.pp_product_image,
            price: key.pp_price,
            category: key.pp_category,
            previousprice: key.pp_previous_price,
            pricechange: key.pp_price_change,
            pricechangedate: key.pp_price_change_date,
            status: key.pp_status,
            createdby: key.pp_createdby,
            createddate: key.pp_createddate,
        })
    });
 
    return dataResult;
} 

exports.PriceChange = (data) => {
    let dataResult = []; 

    data.forEach((key, item) => {
        dataResult.push({
            pricechangeid: key.pc_price_change_id,
            productcode: key.pc_product_code,
            price: key.pc_price,
            status: key.pc_status,
            createdby: key.pc_createdby,
            createddate: key.pc_createddate,
        })
    });
 
    return dataResult;
} 