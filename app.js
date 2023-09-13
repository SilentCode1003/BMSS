var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");
const bodyParser = require("body-parser");

var indexRouter = require('./routes/index');
var accessRouter = require('./routes/access');
var positionRouter = require ('./routes/position')
var usersRouter = require('./routes/users');
var employeesRouter = require('./routes/employees');
var productsRouter = require('./routes/products');
var posRouter = require('./routes/pos');
var branchRouter = require('./routes/branch');
var salesDetailsRouter = require('./routes/salesdetails');
var salesItemsRouter = require('./routes/salesitems');
var shiftReportsRouter = require('./routes/shiftreports');
var cashReportsRouter = require('./routes/cashreports');
var productPriceRouter = require('./routes/productprice');
var priceChangeRouter = require('./routes/pricechange');
var categoryRouter = require('./routes/category');
var loginRouter = require('./routes/login');
var locationRouter = require('./routes/location');
var vendorRouter = require('./routes/vendors');
var materialcostRouter = require('./routes/materialcost');
var systemlogsRouter = require('./routes/systemlogs');
var purchaseorderRouter = require('./routes/purchaseorder')
var transferorderRouter = require('./routes/transferorder')
var inventorycountRouter = require('./routes/inventorycount')
var productionMaterialsRouter = require('./routes/productionmaterials')
var ProductionCountRouter = require('./routes/materialcount')

var app = express();

const session = require('express-session');
const mongoose = require('mongoose');
const MongoDBSession = require('connect-mongodb-session')(session);

const mysql = require('./routes/repository/bmssdb');

//mongodb
mongoose.connect('mongodb://localhost:27017/BMSS')
  .then((res) => {
    console.log("MongoDB Connected!");
  });

const store = new MongoDBSession({
  uri: 'mongodb://localhost:27017/BMSS',
  collection: 'BMSSSessions',
});

//Session
app.use(
  session({
    secret: "5L Secret Key",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
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

app.use('/', indexRouter);
app.use('/index', indexRouter);
app.use('/access', accessRouter)
app.use('/position', positionRouter);
app.use('/users', usersRouter);
app.use('/employees', employeesRouter);
app.use('/products', productsRouter);
app.use('/pos', posRouter);
app.use('/branch', branchRouter);
app.use('/salesdetails', salesDetailsRouter);
app.use('/salesitems', salesItemsRouter);
app.use('/shiftreports', shiftReportsRouter);
app.use('/cashreports', cashReportsRouter);
app.use('/productprice', productPriceRouter);
app.use('/pricechange', priceChangeRouter);
app.use('/category', categoryRouter);
app.use('/login', loginRouter);
app.use('/location', locationRouter);
app.use('/vendors', vendorRouter);
app.use('/materialcost', materialcostRouter);
app.use('/systemlogs', systemlogsRouter);
app.use('/purchaseorder', purchaseorderRouter);
app.use('/transferorder', transferorderRouter);
app.use('/inventorycount', inventorycountRouter);
app.use('/productionmaterials', productionMaterialsRouter);
app.use('/materialcount', ProductionCountRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
