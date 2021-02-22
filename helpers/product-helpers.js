var db = require('../config/connection')
var collection = require('../config/collections')
var objectId = require('mongodb').ObjectId
module.exports = {

    addProduct: (product, callback) => {

        db.get().collection('product').insertOne(product).then((data) => {

            callback(data.ops[0]._id)
        })
    },
    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTIONS).find().toArray()
            resolve(products)
        })
    },
    deleteProduct: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTIONS).removeOne({ _id: objectId(proId) }).then((response) => {
                resolve(response)
            })
        })
    },
    getProductDeatails: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTIONS).findOne({ _id: objectId(proId) }).then((product) => {
                resolve(product)
            })

        })
    },
    updateProduct: (proId, productDeatails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTIONS).updateOne({ _id: objectId(proId)},{
                $set: {
                    Name: productDeatails.Name,
                    Category: productDeatails.Category,
                    Discription: productDeatails.Discription,
                    Price: productDeatails.Price,

                }
            }).then((response) => {
                resolve()
            })
        })
    }
}