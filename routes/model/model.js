//#region  SQL DATA MODEL

class ProductPriceModel {
    constructor(productpriceid,
        productid,
        description,
        barcode,
        productimage,
        price,
        category,
        previousprice,
        pricechange,
        pricechangedate,
        status,
        createdby,
        createddate) {
        this.productpriceid = productpriceid;
        this.productid = productid;
        this.description = description;
        this.barcode = barcode;
        this.productimage = productimage;
        this.price = price;
        this.category = category;
        this.previousprice = previousprice;
        this.pricechange = pricechange;
        this.pricechangedate = pricechangedate;
        this.status = status;
        this.createdby = createdby;
        this.createddate = createddate;
    }
}

//#endregion


//#region DATA MODEL
class ProductCategoryModel {
    constructor(category) {

        this.category = category;

    }
}

//#endregion

module.exports = {
    ProductPriceModel,
    ProductCategoryModel
}