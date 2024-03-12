var roleacess = [
    {
        role: "Owner",
        routes: [
            //dashboard
            {
                layout: "dashboard",
            },
            //Sales Management
            {
                layout: "salesdetails",
            },
            {
                layout: "shiftreports",
            },
            {
                layout: "cashreports",
            },
            {
                layout: "productprice",
            },
            {
                layout: "pricechange",
            },

            //Masters
            {
                layout: "access",
            },
            {
                layout: "position",
            },
            {
                layout: "location",
            },
            {
                layout: "employees",
            },
            {
                layout: "materialcost",
            },
            {
                layout: "vendors",
            },
            {
                layout: "payment",
            },
            {
                layout: "pos",
            },
            {
                layout: "branch",
            },
            {
                layout: "products",
            },
            {
                layout: "category",
            },
            {
                layout: "users",
            },

            //Inventory Management
            {
                layout: "productinventory",
            },
            {
                layout: "inventorycount",
            },
            {
                layout: "salesinventoryhistory",
            },
            {
                layout: "inventoryhistory",
            },
            {
                layout: "inventoryvaluationreport",
            },
            {
                layout: "systemlogs",
            },

            //Procurement Management
            {
                layout: "purchaseorder",
            },
            {
                layout: "transferorder",
            },
            {
                layout: "productiontransfer",
            },

            //Procurement Management
            {
                layout: "production",
            },
            {
                layout: "productioninventory",
            },
            {
                layout: "productionmaterials",
            },
            {
                layout: "materialcount",
            },
            {
                layout: "productioncomponents",
            },

            //Procurement Management
            {
                layout: "promo",
            },
            {
                layout: "discount",
            },
            {
                layout: "service",
            },
        ],
    },
    {
        role: "Manager",
        routes: [
            //dashboard
            {
                layout: "dashboard",
            },

            //Sales Management
            {
                layout: "salesdetails",
            },
            {
                layout: "shiftreports",
            },
            {
                layout: "cashreports",
            },
            {
                layout: "productprice",
            },
            {
                layout: "pricechange",
            },

            //Masters
            {
                layout: "access",
            },
            {
                layout: "position",
            },
            {
                layout: "location",
            },
            {
                layout: "employees",
            },
            {
                layout: "materialcost",
            },
            {
                layout: "vendors",
            },
            {
                layout: "payment",
            },
            {
                layout: "pos",
            },
            {
                layout: "branch",
            },
            {
                layout: "products",
            },
            {
                layout: "category",
            },
            {
                layout: "users",
            },

            //Inventory Management
            {
                layout: "productinventory",
            },
            {
                layout: "inventorycount",
            },
            {
                layout: "salesinventoryhistory",
            },
            {
                layout: "inventoryhistory",
            },
            {
                layout: "inventoryvaluationreport",
            },
            {
                layout: "systemlogs",
            },

            //Procurement Management
            {
                layout: "purchaseorder",
            },
            {
                layout: "transferorder",
            },
            {
                layout: "productiontransfer",
            },

            //Procurement Management
            {
                layout: "production",
            },
            {
                layout: "productioninventory",
            },
            {
                layout: "productionmaterials",
            },
            {
                layout: "materialcount",
            },
            {
                layout: "productioncomponents",
            },

            //Procurement Management
            {
                layout: "promo",
            },
            {
                layout: "discount",
            },
            
            {
                layout: "service",
            },
        ],
    },
    {
        role: "User",
        routes: [
            //dashboard
            {
                layout: "dashboard",
            },

            //Sales Management
            {
                layout: "salesdetails",
            },
            {
                layout: "shiftreports",
            },
            {
                layout: "cashreports",
            },
            {
                layout: "productprice",
            },
            {
                layout: "pricechange",
            },

            //Masters
            // {
            //     layout: "access",
            // },
            // {
            //     layout: "position",
            // },
            // {
            //     layout: "location",
            // },
            // {
            //     layout: "employees",
            // },
            // {
            //     layout: "materialcost",
            // },
            // {
            //     layout: "vendors",
            // },
            // {
            //     layout: "payment",
            // },
            // {
            //     layout: "pos",
            // },
            // {
            //     layout: "branch",
            // },
            {
                layout: "products",
            },
            // {
            //     layout: "category",
            // },
            // {
            //     layout: "users",
            // },

            //Inventory Management
            {
                layout: "productinventory",
            },
            {
                layout: "inventorycount",
            },
            {
                layout: "salesinventoryhistory",
            },
            {
                layout: "inventoryhistory",
            },
            {
                layout: "inventoryvaluationreport",
            },
            {
                layout: "systemlogs",
            },

            //Procurement Management
            {
                layout: "purchaseorder",
            },
            {
                layout: "transferorder",
            },
            {
                layout: "productiontransfer",
            },

            //Procurement Management
            {
                layout: "production",
            },
            {
                layout: "productioninventory",
            },
            {
                layout: "productionmaterials",
            },
            {
                layout: "materialcount",
            },
            {
                layout: "productioncomponents",
            },

            //Procurement Management
            {
                layout: "promo",
            },
            {
                layout: "discount",
            },
            {
                layout: "service",
            },
        ],
    },
];

exports.Validator = function (req, res, layout) {
    // if (req.session.accesstype == "User" && layout == "dashboard") {
    //     return res.redirect("/");
    // } else {
    roleacess.forEach((key, item) => {
        var routes = key.routes;

        routes.forEach((value, index) => {
            // console.log(`${key.role} - ${value.layout}`);

            if (key.role == req.session.accesstype && value.layout == layout) {
                return res.render(`${layout}`, {
                    positiontype: req.session.positiontype,
                    accesstype: req.session.accesstype,
                    username: req.session.username,
                    fullname: req.session.fullname,
                    employeeid: req.session.employeeid,
                    branchid: req.session.branchid,
                    usercode: req.session.usercode
                });
            }
        });
    });

    res.redirect("/login");
    // }
};
