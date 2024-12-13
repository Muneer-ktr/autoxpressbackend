

const express = require('express')
const router = new express.Router()
const userController = require('../Controllers/userController')
const multerConfig = require('../middlewares/multerMiddleware')
const jwtMiddleware = require('../middlewares/jwtMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')
const productController = require('../Controllers/productController')
const dealeradmin = require('../middlewares/dealeradmin')


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

module.exports = router
  