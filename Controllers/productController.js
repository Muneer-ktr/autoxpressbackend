const productModel = require("../Models/productModel")
const userModel = require("../Models/UserModel")

exports.addproduct = async(req,res)=>{
    if(req.fileValidationError){
        return res.status(406).send('Only png and jpg....')
    }
    const {name,category,description,prize} = req.body
    const id = req.payload
    const productImg = req.file.filename

    try {
        if(!name || !category || !description || !prize || !id || !productImg){
            res.status(400).send({message:"Please Enter All Deatils"})
        }else{
            const newProduct = new productModel({
                category,
                productname:name,
                aboutProduct:description,
                price:prize,
                productImage:productImg,
                dealerId:id
            })
            await newProduct.save()
            res.status(200).send({message:"Product Added Successfully",newProduct})
        }
    } catch (err) {
        res.status(500).send('Internal Server Error')
        console.log(err);
    }
}

// get product

exports.getProduct = async(req,res)=>{
    const id = req.payload
  try {
      const products = await productModel.find({dealerId:id})
      res.status(200).send(products)
  } catch (error) {
    res.status(500).send('Internal Server Error')
    console.log(error);
  }
}

// delete product
exports.deleteProduct = async(req,res)=>{
    const {id} = req.params

   try {
     const product = await productModel.findByIdAndDelete(id)
     res.status(200).send({message:'Product Delet successfully...',product})
   } catch (error) {
    res.status(500).send('Internal Server Error')
    console.log(error);
   }
}

// edit product

exports.editProduct = async(req,res)=>{
    if(req.fileValidationError){
        return res.status(406).send('Only png and jpg....')
    }
    const {id} = req.params
    const {name,category,description,prize,productImage,dealerId} = req.body
    const updatedImg = req.file ? req.file.filename : productImage

    try {
        const updatedProduct = await productModel.findByIdAndUpdate(id,{
            category,
            productname:name,
            aboutProduct:description,
            price:prize,
            productImage:updatedImg,
            dealerId
        },{new:true})
        res.status(200).send({message:'Product updated successfully',  })
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
    
}

// get product based on category
exports.getCategory = async(req,res)=>{
    
    const { category } = req.params;
    const searchKey = req.query.search;
    

    const query = {
        category,
    };

    // Add search condition if `searchKey` is provided
    if (searchKey) {
        query.productname = { $regex: searchKey, $options: "i" };
    }

   try {
     const products = await productModel.find(query)
     res.status(200).send(products)
   } catch (error) {
    res.status(500).send('Internal Server error')
    console.log(error);
   }
}

exports.getProductDeatils = async(req,res)=>{
    const {id} = req.params

try {
        const productDeatilas = await productModel.findById(id)
        res.status(200).send(productDeatilas)
} catch (error) {
    res.status(500).send('Internal Server Error')
    console.log(error);
}
}

//get product admin

exports.getProductsadmin = async(req,res)=>{
      try {
        const products = await productModel.find()
        res.status(200).send({message:"Products geted",products})
        } catch (error) {
        res.status(500).send({message:"Internal server Error"})
        console.log(error)
      }
  }

//product review
exports.review = async (req,res)=>{
    const {review,productId} = req.body
    const id = req.payload

    try {
        const userDetails = await userModel.findById(id)
    
        const product = await productModel.findById(productId)
        
    
        product.reviews.push({review,username:userDetails.firstname,secondname:userDetails.secondname})
    
        await product.save()
    
        res.status(200).send(product)
    } catch (error) {
        res.status(500).send({message:"Internal server Error"})
        console.log(error) 
    }
}




