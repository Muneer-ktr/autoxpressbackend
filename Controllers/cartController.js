const cartModel = require('../Models/cartmodel')

//add cart

exports.addCart = async(req,res)=>{
    const {userId} = req.params
    const {id,count} = req.body

  try {
      const existinguser = await cartModel.findOne  ({userId})
      if(existinguser){
          const product = existinguser.products.find(p=>p.productId == id)

          if(product){
            product.count +=1
          }else{
            existinguser.products.push({productId:id,count})
          }
          await existinguser.save()
      res.status(200).send({message:"product added to cart...",existinguser})
      }else{
          const cartData = new cartModel({
            userId,
            products:{productId:id,count}
          })
          await cartData.save()
          res.status(200).send("product added to cart...")
      }
  } catch (error) {
    res.status(500).send('internal server error')
    console.log(error);
  }
}

// get cart

exports.getCartproduct= async(req,res)=>{    
    const {userId} = req.params 

try {
        
        const products =await cartModel.findOne({userId}).populate('products.productId','productname productImage price ')
        if(!products){
            return res.status(404).send("Cart not found....")
        }
        res.status(200).send(products)
} catch (error) {
    res.satus(500).send("Internal Server Error...")
    
}
}
//delet cart

exports.deletecart = async(req,res)=>{
    const userid = req.payload

    const{productId} = req.params

   try {
     const cartData = await cartModel.findOne({userId:userid})
 
     if(!cartData){
         return res.status(404).send({message:"cart not fount for this user."})
     }
     cartData.products = cartData.products.filter((p)=>p.productId!=productId)
     await cartData.save()
     res.status(200).send({message : "Item Removed from cart",cartData})
   } catch (error) {
    res.status(500).send("Internal server Error...")
   }
}