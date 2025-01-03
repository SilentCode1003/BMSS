const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const { SetMongo } = require('./routes/controller/mongoose')
const { logger, eventlogger } = require('./middleware/logger')

const productsRouter = require('./routes/products')
const posRouter = require('./routes/pos')
const branchRouter = require('./routes/branch')
const salesDetailsRouter = require('./routes/salesdetails')
const salesItemsRouter = require('./routes/salesitems')
const shiftReportsRouter = require('./routes/shiftreports')
const cashReportsRouter = require('./routes/cashreports')
const productPriceRouter = require('./routes/productprice')
const priceChangeRouter = require('./routes/pricechange')
const categoryRouter = require('./routes/category')
const loginRouter = require('./routes/login')
const locationRouter = require('./routes/location')
const vendorRouter = require('./routes/vendors')
const materialcostRouter = require('./routes/materialcost')
const systemlogsRouter = require('./routes/systemlogs')
const purchaseorderRouter = require('./routes/purchaseorder')
const transferorderRouter = require('./routes/transferorder')
const inventorycountRouter = require('./routes/inventorycount')
const productionMaterialsRouter = require('./routes/productionmaterials')
const productionCountRouter = require('./routes/materialcount')
const productionComponentRouter = require('./routes/productioncomponents')
const POSShiftLogRouter = require('./routes/posshiftlog')
const productionRouter = require('./routes/production')
const promoRouter = require('./routes/promo')
const discountRouter = require('./routes/discount')
const productInventoryRouter = require('./routes/productinventory')
const salesInventoryHistoryRouter = require('./routes/salesinventoryhistory')
const inventoryHistoryRouter = require('./routes/inventoryhistory')
const productionInventoryRouter = require('./routes/productioninventory')
const paymentRouter = require('./routes/payment')
const productionTransferRouter = require('./routes/productiontransfer')
const inventoryvaluationreportRouter = require('./routes/inventoryvaluationreport')
const pdfRouter = require('./routes/pdf')
const serviceRouter = require('./routes/service')
const servicepackageRouter = require('./routes/servicepackage')
const addonRouter = require('./routes/addon')
const addontypeRouter = require('./routes/addontype')
const productionhistoryRouter = require('./routes/productionhistory')
const reportsRouter = require('./routes/reports')
const mobileAPIRouter = require('./routes/mobile-api')
const stockAdjustmentRouter = require('./routes/stockadjustment')
const materialhistoryRouter = require('./routes/materialhistory')
const materialstockadjustmentRouter = require('./routes/materialstockadjustment')
const { errorMonitor } = require('stream')
const verifyJWT = require('./middleware/authenticator')
const checkhealthRouter = require('./routes/checkhealth')
const purchaseorderhistoryRouter = require('./routes/purchaseorderhistory')
const transferorderhistoryRounter = require('./routes/transferorderhistory')

const app = express()

SetMongo(app)


// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(morgan('dev'))

app.use(express.json())
app.use(
  express.urlencoded({
    limit: '100mb',
    extended: true,
    parameterLimit: 100000000,
  })
)
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json({ limit: '25mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(cors())

app.use((req, res, next) => {
  eventlogger(req, res, next)
})

app.use('/', loginRouter)
app.use('/pos', posRouter)
app.use('/branch', branchRouter)
app.use('/checkhealth', checkhealthRouter)
app.use(verifyJWT)
app.use('/dashboard', require('./routes/dashboard'))
app.use('/access', require('./routes/access'))
app.use('/position', require('./routes/position'))
app.use('/users', require('./routes/users'))
app.use('/employees', require('./routes/employees'))
app.use('/products', productsRouter)
app.use('/salesdetails', salesDetailsRouter)
app.use('/salesitems', salesItemsRouter)
app.use('/shiftreports', shiftReportsRouter)
app.use('/cashreports', cashReportsRouter)
app.use('/productprice', productPriceRouter)
app.use('/pricechange', priceChangeRouter)
app.use('/category', categoryRouter)
app.use('/location', locationRouter)
app.use('/vendors', vendorRouter)
app.use('/materialcost', materialcostRouter)
app.use('/systemlogs', systemlogsRouter)
app.use('/purchaseorder', purchaseorderRouter)
app.use('/transferorder', transferorderRouter)
app.use('/inventorycount', inventorycountRouter)
app.use('/productionmaterials', productionMaterialsRouter)
app.use('/materialcount', productionCountRouter)
app.use('/posshiftlog', POSShiftLogRouter)
app.use('/productioncomponents', productionComponentRouter)
app.use('/production', productionRouter)
app.use('/promo', promoRouter)
app.use('/discount', discountRouter)
app.use('/productinventory', productInventoryRouter)
app.use('/salesinventoryhistory', salesInventoryHistoryRouter)
app.use('/inventoryhistory', inventoryHistoryRouter)
app.use('/productioninventory', productionInventoryRouter)
app.use('/payment', paymentRouter)
app.use('/productiontransfer', productionTransferRouter)
app.use('/inventoryvaluationreport', inventoryvaluationreportRouter)
app.use('/pdf', pdfRouter)
app.use('/service', serviceRouter)
app.use('/servicepackage', servicepackageRouter)
app.use('/addon', addonRouter)
app.use('/addontype', addontypeRouter)
app.use('/productionhistory', productionhistoryRouter)
app.use('/reports', reportsRouter)
app.use('/mobile-api', mobileAPIRouter)
app.use('/stockadjustment', stockAdjustmentRouter)
app.use('/materialhistory', materialhistoryRouter)
app.use('/materialstockadjustment', materialstockadjustmentRouter)
app.use('/purchaseorderhistory', purchaseorderhistoryRouter)
app.use('/transferorderhistory', transferorderhistoryRounter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  logger.error(err)

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
