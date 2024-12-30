const Razorpay = require("razorpay")
const paymentModel = require("../Models/paymentModel")
const PDFDocument = require('pdfkit');


exports.paymentController = async(req,res)=>{
    const {amount} = req.body

    try {
        const razorpay = new Razorpay({
            key_id : process.env.RAZORPAY_KEY_ID,
            key_secret : process.env.RAZORPY_SECRET_KEY
        })
    
        const options ={
            amount,
            currency:'INR'
        }
        const response = await razorpay.orders.create(options)
        res.status(200).send(response)
    } catch (error) {
        res.status(500).send('Internal Server error')
        console.log(err); 
    }
}

//place order

exports.placeOrderController = async (req, res) => {
    const userID = req.payload
    const {
        productID,
        ShippingAddress,
        City,
        State,
        Pincode,
        phoneNumber,
        PaymentID,
        amount
    } = req.body;
    console.log(req.body);
    

    if (!userID || !productID || !ShippingAddress || !City || !State || !Pincode || !phoneNumber || !PaymentID || !amount) {
        return res.status(400).send({ message: "All fields are required" });
    }

    try {
        const newPayment = new paymentModel({
            userID,
            productID,
            ShippingAddress,
            City,
            State,
            Pincode,
            phoneNumber,
            PaymentID,
            amount
        });

        const savedPayment = await newPayment.save();
        res.status(201).send(savedPayment);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to place order" });
    }

};

// get order

exports.getOrders = async (req, res) => {
    const userID = req.payload

    try {
        const orders = await paymentModel.find({userID}).populate('productID', 'productname productImage')
        if (!orders || orders.length === 0) {
            return res.status(404).send({ message: "orders not found" });
        }
        res.status(200).send(orders);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error')
    }
};

//get order for admin

exports.getOrdersadmin = async (req, res) => {
    const userID = req.payload

    try {
        const orders = await paymentModel.find().populate('productID', 'productname productImage').populate('userID','email firstname')
        if (!orders || orders.length === 0) {
            return res.status(404).send({ message: "orders not found" });
        }
        res.status(200).send(orders);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error')
    }
};

// invoice create
exports.pdfGeneration = async(req,res)=>{
    console.log("Inside pdf ");
    
    const {id} = req.body

   try {
     const orderDetails = await paymentModel.findById(id).populate('userID', 'email')
    //  console.log(orderDetails);
     
 
       // Generate PDF in memory using PDFKit
       const doc = new PDFDocument();
         
       // Set response headers to indicate file download
       res.setHeader('Content-Type', 'application/pdf');
       res.setHeader('Content-Disposition', `attachment; filename=receipt-${id}.pdf`);
   
       // Pipe the PDF directly to the response
       doc.pipe(res);
   
       // Add content to the PDF
       doc.fontSize(20).text('Payment Receipt', { align: 'center' });
       doc.moveDown();
       doc.fontSize(12).text(`Order ID: ${orderDetails._id}`);
       doc.text(`Payment ID: ${orderDetails.PaymentID}`);
       doc.text(`Amount: ₹${orderDetails.amount / 100}`); // Razorpay stores amount in paise
       doc.text(`Status: ${orderDetails.status}`);
       doc.text(`Shipping Address: ${orderDetails.ShippingAddress}`);
       doc.text(`Email: ${orderDetails.userID.email}`);
       doc.text(`Contact: ${orderDetails.phoneNumber}`);
       doc.text(`Date: ${orderDetails.Date}`)
   
       // Finalize the PDF and end the stream
       doc.end();
 
   } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).send('Error fetching payment details');

   }

}