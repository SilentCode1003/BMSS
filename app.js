var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

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
var priceChangeRouter = require('./routes/pricechange')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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