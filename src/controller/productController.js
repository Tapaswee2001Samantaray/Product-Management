const productModel = require("../models/productModel");
const { validateName, validateEmail, validateMobileNo, validatePassword, validatePlace, validatePincode, isValidString, isValidProductSize, validatePrice } = require("../validations/validator");
const { uploadFile } = require("../middleware/aws");

let createProduct = async function (req, res) {

    //try {

    let data = req.body;
    if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, message: "Request body doesn't be Empty!" }) }

    let file = req.files;
    // if( file.length == 0 ) { return res.status(400).send({ status: false, message : "ProductImage is Required"}) }


    // if( file && file.length > 0 ) { 
    //     let uploadFileUrl = await uploadFile(file[0]);
    //     data.productImage = uploadFileUrl; };


    //if keys were undefined then in case:
    let dataInBody = Object.keys(data);
    let arr = ["title", "description", "price", "currencyId", "currencyFormat", "isFreeShipping", "style", "availableSizes", "installments", "productImage"];

    for (let i = 0; i < dataInBody.length; i++) {
        const someThing = dataInBody[i];
        if (!arr.includes(someThing)) { return res.status(400).send({ status: false, message: `${someThing} is not a valid Property.` }) }
    }


    let { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments } = data;

    //validation ...
    if (!title) return res.status(400).send({ status: false, message: "title is mandatory." })
    if (!isValidString(title) && !isValidName(title)) { return res.status(400).send({ status: false, message: "Enter valid title." }) }
    title = title.toLowerCase()


    const Check_Title = await productModel.findOne({ title: title })
    if (Check_Title) { return res.status(404).send({ status: false, message: "title already exists. Please enter unique title." }) }

    if (!description) return res.status(400).send({ status: false, message: "description is mandatory." })
    if (!isValidString(description)) { return res.status(400).send({ status: false, message: "Enter some description.." }) }


    
    if (!price) return res.status(400).send({ status: false, message: "price is mandatory." })
    let Price = Number(price)
    if (isNaN(Price)) { return res.status(400).send({ status: false, message: "Invalid Price entry, Price should be a number." }) }
    if(Price < 0) { return res.status(400).send({ status: false, message: "Price must be positive Integer." }) }


   // if (!Number(price)) { return res.status(400).send({ status: false, message: "Invalid price entry, price should be a number." }) }

    //if(typeof price != Number ){return res.status(400).send({ status:false, message: "Invalid price entry, price should be a number."})}
    //if(!validatePrice(price)){ return res.status(400).send({ status: false, message: "price is mandatory."}) }
    //price = JSON.parse(price)
    // console.log(typeof price);

    if (!currencyId) return res.status(400).send({ status: false, message: "currencyId is required." })
    if (currencyId != "INR") { return res.status(400).send({ status: false, message: "Invalid currencyId, currencyId should be INR only" }) }

    if (!currencyFormat) return res.status(400).send({ status: false, message: "currencyFormat is mandatory." })
    if (currencyFormat != "₹") { return res.status(400).send({ status: false, message: "Invalid currencyFormat, currencyFormat should be ₹ only." }) }

    if(isFreeShipping) {
    if (!isFreeShipping) return res.status(400).send({ status: false, message: "isFreeShipping is mandatory." })
    if (isFreeShipping != "true" && isFreeShipping != "false") return res.status(400).send({ status: false, message: "isFreeShipping should be Boolean value." })
    }
    // if(isFreeShipping = JSON.parse(isFreeShipping) ) 
    //if(!Boolean(isFreeShipping)) { return res.status(400).send({ status:false, message: "isFreeShipping should be Boolean value." }) }
    //if(isFreeShipping != "boolean"){ return res.status(400).send({ status:false, message: "isFreeShipping should be Boolean value."}) }
    // console.log(typeof isFreeShipping);
    //if(typeof isFreeShipping != "boolean" ){return res.status(400).send({ status:false, message: "Invalid isFreeShipping entry, isFreeShipping should be a number."})}
    // if(installments){ installments=JSON.parse(installments) }
    // if(isFreeShipping) {isFreeShipping = JSON.parse(isFreeShipping)}

    if(installments) {
    if (!installments) return res.status(400).send({ status: false, message: "installments is mandatory." })
    let Installments = Number(installments)
    if (isNaN(Installments)) { return res.status(400).send({ status: false, message: "Invalid installments entry, installments should be a number." }) }
    if(Installments < 0) { return res.status(400).send({ status: false, message: "installments must be positive Integer." }) }
    }
    //if (!Number(installments)) { return res.status(400).send({ status: false, message: "Invalid installments entry, installments should be a number." }) }
    if(style){
    if (!isValidString(style)) { return res.status(400).send({ status: false, message: "Invalid style input,style must be string." }) }
    }
    if (!isValidProductSize(availableSizes)) { return res.status(400).send({ status: false, message: "availableSizes can only be S, XS, M, X, L, XXL, XL " }) }

    // let arr1 =["S", "XS","M","X", "L","XXL", "XL"]
    // if( availableSizes.length>0 ){
    //     if((!arr1.includes(...availableSizes))) return res.status(400).send({ status:false, message: "availableSizes can only be S, XS, M, X, L, XXL, XL "})
    // }


    //console.log((productModel.Enumerator.includes(...availableSizes)));
   
    
    // if((productModel.Enumerator.includes(...availableSizes))) return res.status(400).send({ status:false, message: "availableSizes can only be S, XS, M, X, L, XXL, XL "})
    


    // const Check_Title = await productModel.findOne({title: title})
    // if(Check_Title){ return res.status(400).send({status : false, message : "title already exists. Please enter unique title."}) }

    //if( data.isFreeShipping != "true" || data.isFreeShipping != "false" ) { console.log(data.isFreeShipping); return res.status(400).send({status:false, message: "please enter true/false"}) }
    // if(data.isFreeShipping== true){
    //     //data.isFreeShipping = Boolean(1)
    // }
    // if(data.isFreeShipping == "false") { data.isFreeShipping = undefined }

    data.productImage = req.profileImage;

    let create_Data = await productModel.create(data);

    if (!create_Data) { return res.status(400).send({ status: false, message: "Data could not be created." }) }

    return res.status(201).send({ status: true, message: "Success", data: create_Data })

    // } catch (error) {
    //    return res.status(500).send({ status:false, message:error.message, type: error.type, name: error.name})
    // }

}


module.exports = { createProduct }




