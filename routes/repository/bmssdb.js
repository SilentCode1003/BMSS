const mysql = require('mysql');
const model = require('../model/bmssmodel');
require('dotenv').config();
const crypt = require('./cryptography');

let password = '';
crypt.Decrypter(process.env._PASSWORD, (err, result) => {
    if (err) throw err;

    password = result;
    console.log(`${result}`);
});

const connection = mysql.createConnection({
    host: process.env._HOST,
    user: process.env._USER,
    password: password,
    database: process.env._DATABASE
});

crypt.Encrypter('#Ebedaf19dd0d', (err, result) => {
    if (err) console.error('Error: ', err);

    console.log(result);
})

// crypt.Decrypter('f6a3287039d0d75cb83cb29d35b3dfcb', (err, result) => {
//     if (err) console.error('Error: ', err);

//     console.log(${result});
// });

exports.CheckConnection = () => {
    connection.connect((err) => {
        if (err) {
            console.error('Error connection to MYSQL databases: ', err);
            return;
        }
        console.log('MySQL database connection established successfully!');
    });
}

exports.CheckConnection = () => {
    connection.connect((err) => {
        if (err) {
            console.error('Error connection to MYSQL databases: ', err);
            return;
        }
        console.log('MySQL database connection established successfully!');
    });
}

exports.InsertMultiple = async (stmt, todos) => {
    try {
        connection.connect((err) => { return err; })
        // console.log(statement: ${stmt} data: ${todos});

        connection.query(stmt, [todos], (err, results, fields) => {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Row inserted: ${results.affectedRows}`);

            return 1;
        });

    } catch (error) {
        console.log(error);
    }
}

exports.Select = (sql, table, callback) => {
    try {
        connection.connect((err) => { return err; })
        connection.query(sql, (error, results, fields) => {
 
            // console.log(results);

            if (error) {
                callback(error, null)
            }

            if (table == 'MasterAccessType') {
                callback(null, model.MasterAccessType(results));
            }

            if (table == 'MasterPositionType') {
                callback(null, model.MasterPositionType(results));
            }

            if (table == 'MasterUser') {
                callback(null, model.MasterUser(results));
            }

            if (table == 'MasterEmployees') {
                callback(null, model.MasterEmployees(results));
            }

            if (table == 'MasterProduct') {
                callback(null, model.MasterProduct(results));
            }

            if (table == 'MasterPos') {
                callback(null, model.MasterPos(results));
            }

            if (table == 'MasterBranch') {
                callback(null, model.MasterBranch(results));
            }

            if (table == 'EmployeeGovernmentIdDetails') {
                callback(null, model.EmployeeGovernmentIdDetails(results));
            }

            if (table == 'EmployeeDeductionDetails') {
                callback(null, model.EmployeeDeductionDetails(results));
            }

            if (table == 'EmployeeAllowance') {
                callback(null, model.EmployeeAllowance(results));
            }

            if (table == 'EmployeeSalary') {
                callback(null, model.EmployeeSalary(results));
            }

            if (table == 'PayrollDetail') {
                callback(null, model.PayrollDetail(results));
            }

        });

    } catch (error) {
        console.log(error);
    }
}

exports.StoredProcedure = (sql, data, callback) => {
    try {

        connection.query(sql, data, (error, results, fields) => {
            if (error) {
                callback(error.message, null);
            }
            callback(null, results[0])
        });
    } catch (error) {
        callback(error, null);
    }
}

exports.StoredProcedureResult = (sql, callback) => {
    try {

        connection.query(sql, (error, results, fields) => {
            if (error) {
                callback(error.message, null);
            }
            callback(null, results[0])
        });
    } catch (error) {
        callback(error, null);
    }
}

exports.Update = async (sql, callback) => {
    try {
        connection.query(sql, (error, results, fields) => {
            if (error) {
                callback(error, null)
            }
            // console.log('Rows affected:', results.affectedRows);

            callback(null, `Rows affected: ${results.affectedRows}`);
        });
    } catch (error) {
        callback(error, null)
    }
}

exports.UpdateMultiple = async (sql, data, callback) => {
    try {
        connection.query(sql, data, (error, results, fields) => {
            if (error) {
                callback(error, null)
            }
            console.log('Rows affected:', results.affectedRows);

            callback(null, `Rows affected: ${results.affectedRows}`);
        });
    } catch (error) {
        console.log(error);
    }
}

exports.CloseConnect = () => {
    connection.end();
}

exports.Insert = (stmt, todos, callback) => {
    try {
        connection.connect((err) => { return err; })
        // console.log(statement: ${stmt} data: ${todos});

        connection.query(stmt, [todos], (err, results, fields) => {
            if (err) {
                callback(err, null);
            }
            // callback(null, Row inserted: ${results});
            callback(null, `Row inserted: ${results.affectedRows}`);
            // console.log(Row inserted: ${results.affectedRows});
        });

    } catch (error) {
        callback(error, null);
    }
}

exports.SelectResult = (sql, callback) => {
    try {
        connection.connect((err) => { return err; })
        connection.query(sql, (error, results, fields) => {

            // console.log(results);

            if (error) {
                callback(error, null)
            }

            callback(null, results);

        });

    } catch (error) {
        console.log(error);
    }
}

exports.InsertTable = (tablename, data, callback) => {
    if (tablename == 'master_access_type') {
        let sql = `INSERT INTO master_access_type(
            mat_accessname,
            mat_status,
            mat_createdby,
            mat_createddate) VALUES ?`;

        this.Insert(sql, data, (err, result) => {
            if (err) {
                callback(err, null);
            }
            callback(null, result)
        })
    }
 
    if (tablename == 'master_position_type') {
        let sql = `INSERT INTO master_position_type(
            mpt_positionname,
            mpt_status,
            mpt_createdby,
            mpt_createddate) VALUES ?`;

        this.Insert(sql, data, (err, result) => {
            if (err) {
                callback(err, null);
            }
            callback(null, result)
        })
    }

    if (tablename == 'master_user') {
        let sql = `INSERT INTO master_user(
            mu_employeeid,
            mu_accesstype,
            mu_positiontype,
            mu_status,
            mu_createdby,
            mu_createddate) VALUES ?`;

        this.Insert(sql, data, (err, result) => {
            if (err) {
                callback(err, null);
            }
            callback(null, result)
        })
    }

    if (tablename == 'master_employees') {
        let sql = `INSERT INTO master_employees(
            me_employeeid,
            me_fullname,
            me_position,
            me_contactinfo,
            me_datehired,
            me_status,
            me_createdby,
            me_createddate) VALUES ?`;

        this.Insert(sql, data, (err, result) => {
            if (err) {
                callback(err, null);
            }
            callback(null, result)
        })
    }

    if (tablename == 'master_product') {
        let sql = `INSERT INTO master_product(
            mp_productid,
            mp_description,
            mp_status,
            mp_createdby,
            mp_createddate) VALUES ?`;

        this.Insert(sql, data, (err, result) => {
            if (err) {
                callback(err, null);
            }
            callback(null, result)
        })
    }

    if (tablename == 'master_pos') {
        let sql = `INSERT INTO master_pos(
            mp_posid,
            mp_posname,
            mp_serial,
            mp_min,
            mp_ptu,
            mp_status,
            mp_createdby,
            mp_createddate) VALUES ?`;
        this.Insert(sql, data, (err, result) => {
            if (err) {
                callback(err, null);
            }
            callback(null, result)
        })
    }

    if (tablename == 'master_branch') {
        let sql = `INSERT INTO master_branch(
            mb_branchid,
            mb_branchname,
            mb_tin,
            mb_address,
            mb_logo,
            mb_status,
            mb_createdby,
            mb_createddate) VALUES ?`;
        this.Insert(sql, data, (err, result) => {
            if (err) {
                callback(err, null);
            }
            callback(null, result)
        })
    }
}