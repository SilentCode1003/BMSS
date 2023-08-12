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
            status: key.mp_status,
            createdby: key.mp_createdby,
            createddate: key.mp_createddate,
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
