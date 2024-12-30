

const express = require('express')
const router = new express.Router()
const userController = require('../Controllers/userController')
const multerConfig = require('../middlewares/multerMiddleware')
const jwtMiddleware = require('../middlewares/jwtMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')
const productController = require('../Controllers/productController')
const cartController = require('../Controllers/cartController')
const dealeradmin = require('../middlewares/dealeradmin')
const orderController = require('../Controllers/orderController')


// register
router.post('/register',userController.register)
// login
router.post('/login',userController.login)
// dealer register
router.post('/dealer-register',multerConfig.single('license'),userController.dealeRegister)
//get dealer
router.get('/dealer-get',jwtMiddleware,adminMiddleware, userController.getDealer)
//approve or reject
router.put('/dealer-status-update/:id',jwtMiddleware,adminMiddleware,userController.manageDealer)
//product addd
router.post('/addproduct',jwtMiddleware,dealeradmin,multerConfig.single('productImage'),productController.addproduct)
//get Product
router.get('/getProduct-dealer',jwtMiddleware,dealeradmin,productController.getProduct)
// delete product - dealer
router.delete('/delete-product-dealer/:id',jwtMiddleware,dealeradmin,productController.deleteProduct)
//Edit product -dealer
router.put('/update-product-dealer/:id',jwtMiddleware,dealeradmin,multerConfig.single('productImage'),productController.editProduct)
// get product based on category
router.get('/get-products/:category',productController.getCategory)
// get product deatils
router.get('/getDeatileProduct/:id',productController.getProductDeatils)
// add to cart
router.post('/addtocart/:userId',jwtMiddleware,cartController.addCart)
//get product from cart
router.get('/get-product-from-cart/:userId',jwtMiddleware,cartController.getCartproduct)
//delet from cart
router.delete('/delete-from-cart/:productId',jwtMiddleware,cartController.deletecart)
//delet dealer
router.delete('/delete-dealer/:id',jwtMiddleware,adminMiddleware,userController.deleteDealer)
// verify otp
router.post('/verify-otp',userController.otpVerification)
//resend otp
router.post('/resend-otp',userController.resendOtp)
//forgotpassword
router.post('/forgotpassword',userController.forgotPassword)
//update password
router.put('/updatedpassword',userController.updatedPassword)
//Google signIn
router.post('/google_signIn',userController.googleSignIn)
//payment
router.post('/payment',jwtMiddleware,orderController.paymentController)
//place Order
router.post('/placeOrder',jwtMiddleware,orderController.placeOrderController)
//get order
router.get('/get-Orders',jwtMiddleware,orderController.getOrders)
//get order for admin
router.get('/getOrder-admin',jwtMiddleware,adminMiddleware,orderController.getOrdersadmin)
//get product admin
router.get('/getProductAdmin',jwtMiddleware,adminMiddleware,productController.getProductsadmin)
//invoice generation
router.post('/invoice',jwtMiddleware,orderController.pdfGeneration)
// product review
router.put('/product-review',jwtMiddleware,productController.review)
//get users admin side
router.get('/getUsersAdmin',jwtMiddleware,adminMiddleware,userController.getUsersAdmin)
//delete user
router.delete('/delete-user/:id',jwtMiddleware,adminMiddleware,userController.deleteUser)
//app review
router.post('/app-Review',jwtMiddleware,userController.appReview)
//get app review
router.get('/getreview',jwtMiddleware,adminMiddleware,userController.getReview)
//update profile
router.put('/updateprofile/:id',jwtMiddleware,userController.userProfile)

module.exports = router
  