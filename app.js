var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const { SetMongo } = require("./routes/controller/mongoose");
const { logger } = require("./middleware/logger");

var productsRouter = require("./routes/products");
var posRouter = require("./routes/pos");
var branchRouter = require("./routes/branch");
var salesDetailsRouter = require("./routes/salesdetails");
var salesItemsRouter = require("./routes/salesitems");
var shiftReportsRouter = require("./routes/shiftreports");
var cashReportsRouter = require("./routes/cashreports");
var productPriceRouter = require("./routes/productprice");
var priceChangeRouter = require("./routes/pricechange");
var categoryRouter = require("./routes/category");
var loginRouter = require("./routes/login");
var locationRouter = require("./routes/location");
var vendorRouter = require("./routes/vendors");
var materialcostRouter = require("./routes/materialcost");
var systemlogsRouter = require("./routes/systemlogs");
var purchaseorderRouter = require("./routes/purchaseorder");
var transferorderRouter = require("./routes/transferorder");
var inventorycountRouter = require("./routes/inventorycount");
var productionMaterialsRouter = require("./routes/productionmaterials");
var productionCountRouter = require("./routes/materialcount");
var productionComponentRouter = require("./routes/productioncomponents");
var POSShiftLogRouter = require("./routes/posshiftlog");
var productionRouter = require("./routes/production");
var promoRouter = require("./routes/promo");
var discountRouter = require("./routes/discount");
var productInventoryRouter = require("./routes/productinventory");
var salesInventoryHistoryRouter = require("./routes/salesinventoryhistory");
var inventoryHistoryRouter = require("./routes/inventoryhistory");
var productionInventoryRouter = require("./routes/productioninventory");
var paymentRouter = require("./routes/payment");
var productionTransferRouter = require("./routes/productiontransfer");
var inventoryvaluationreportRouter = require("./routes/inventoryvaluationreport");
var pdfRouter = require("./routes/pdf");
var serviceRouter = require("./routes/service");
var servicepackageRouter = require("./routes/servicepackage");
var addonRouter = require("./routes/addon");
var addontypeRouter = require("./routes/addontype");
var productionhistoryRouter = require("./routes/productionhistory");
var reportsRouter = require("./routes/reports");
var mobileAPIRouter = require("./routes/mobile-api");
var stockAdjustmentRouter = require("./routes/stockadjustment");
const verifyJWT = require("./middleware/authenticator");

var app = express();

SetMongo(app);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(morgan("dev"));

app.use(express.json());
app.use(
  express.urlencoded({
    limit: "100mb",
    extended: true,
    parameterLimit: 100000000,
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "25mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());

app.use("/", require("./routes/dashboard"));
app.use("/access", require("./routes/access"));
app.use("/position", require("./routes/position"));
app.use("/users", require("./routes/users"));
app.use("/employees", require("./routes/employees"));
app.use("/products", productsRouter);
app.use("/pos", posRouter);
app.use("/branch", branchRouter);
app.use("/salesdetails", salesDetailsRouter);
app.use("/salesitems", salesItemsRouter);
app.use("/shiftreports", shiftReportsRouter);
app.use("/cashreports", cashReportsRouter);
app.use("/productprice", productPriceRouter);
app.use("/pricechange", priceChangeRouter);
app.use("/category", categoryRouter);
app.use("/login", loginRouter);
app.use("/location", locationRouter);
app.use("/vendors", vendorRouter);
app.use("/materialcost", materialcostRouter);
app.use("/systemlogs", systemlogsRouter);
app.use("/purchaseorder", purchaseorderRouter);
app.use("/transferorder", transferorderRouter);
app.use("/inventorycount", inventorycountRouter);
app.use("/productionmaterials", productionMaterialsRouter);
app.use("/materialcount", productionCountRouter);
app.use("/posshiftlog", POSShiftLogRouter);
app.use("/productioncomponents", productionComponentRouter);
app.use("/production", productionRouter);
app.use("/promo", promoRouter);
app.use("/discount", discountRouter);
app.use("/productinventory", productInventoryRouter);
app.use("/salesinventoryhistory", salesInventoryHistoryRouter);
app.use("/inventoryhistory", inventoryHistoryRouter);
app.use("/productioninventory", productionInventoryRouter);
app.use("/payment", paymentRouter);
app.use("/productiontransfer", productionTransferRouter);
app.use("/inventoryvaluationreport", inventoryvaluationreportRouter);
app.use("/pdf", pdfRouter);
app.use("/service", serviceRouter);
app.use("/servicepackage", servicepackageRouter);
app.use("/addon", addonRouter);
app.use("/addontype", addontypeRouter);
app.use("/productionhistory", productionhistoryRouter);
app.use("/reports", reportsRouter);
app.use("/mobile-api", mobileAPIRouter);
app.use("/stockadjustment", stockAdjustmentRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
