var db = require('../config/connection')
var collection = require('../config/collections')
var objectId = require('mongodb').ObjectId
const bcrypt = require('bcrypt')
const { response } = require('express')
module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.Password = await bcrypt.hash(userData.Password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {


                resolve(data.ops[0])

            })
        })
    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email })
            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if (status) {
                        console.log("login sucses");
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        console.log("login failed,passwerd error");
                        resolve({ status: false })
                    }
                })
            } else {
                console.log("login failed,user not found");
                resolve({ status: false })
            }

        })
    },
    addToCart: (proId, userId) => {
        return new Promise(async (resolve, reject) => {
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objectId(userId) })
            if (userCart) {
                db.get().collection(collection.CART_COLLECTION).updateOne({ user: objectId(userId) },
                    {

                        $push: {
                            product: objectId(proId)

                        }
                    }).then((response) => {
                        resolve()
                    })
            } else {
                let cartObj = {
                    user: objectId(userId),
                    product: [objectId(proId)]

                }

                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response) => {
                    resolve()
                })

            }
        })
    },
    getCartProduct: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match: { user: objectId(userId) }
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTIONS,
                        let:{prodList:'$product'},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $in:['$_id',"$$prodList"]
                                    }
                                }
                            } 
                        ],
                        as:'cartItems'
                    }
                }
            ]).toArray()
            resolve(cartItems[0].cartItems)
        })
    }
}