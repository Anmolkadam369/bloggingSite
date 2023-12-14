const authorModel = require("../Models/AuthorModel");
 let jwt=require('jsonwebtoken')
const blogModel = require("../Models/BlogsModel");
const validator=require("../middlewares/commonMiddleware")

const creaData = async function (req, res) {
try {
	  let data = req.body;

	  if(!data) return res.status(400).send({ msg: "body is mandatory" });
	
	  const { fname, lname,title, password,email }=data
     //fname
	  if (!data.fname) return res.status(400).send({ msg: " First name is required " });
	  if (!validator.isValidName(fname)) return res.status(400).send({ msg: "fname must be string" });
     //lname
	  if (!data.lname) return res.status(400).send({ msg: " Last name is required " });
	  if (!validator.isValidName(lname)) return res.status(400).send({ msg: "lname must be string" }); 
     //title
	  if (!title) {
	    return res.status(404).send({ msg: "title in mandatory" });
	  } else {
	    if (title.trim() != "Mr" && title.trim() != "Mrs" && title.trim() != "Miss")
	      return res.status(404).send({ msg: "title can only be Mr ,Mrs or Miss" });
	  }
      //email
	  
	  if (!data.email) return res.status(400).send({ msg: " email is required " });
	  if(!validator.isValidEmail(email))  return res.status(400).send({msg:"invalid email"})
	  const isEmailUnique= await authorModel.findOne({email:data.email})
	  if(isEmailUnique)   return res.status(400).send({msg:"email is already used,please use another email"})


	  //password
	  if (!data.password) return res.status(400).send({ msg: " password is required " });

	  if (!validator.isValidPassword(password))
	    return res.status(404).send({ msg: "password  should contain Min 8 character and 1 Special Symbol" });
	
	  //createAuthor
	
  
	  const create = await authorModel.create(data);
	  res.status(201).send({ msg: create });
} catch (error) {
	return res.status(500).send({msg:error.message})
}
};




const login=async function(req,res) {
try {
	  let email=req.body.email
	  let password=req.body.password
	  let data=req.body
	  if(Object.keys(data).length==0) return res.status(400).send({ status: false, msg: "please provide author details" });

	//   if (email.trim().length == 0 || password.trim().length == 0) {
	// 	return res.status(400).send({status: false,msg: "please provide login details"});
	// }
	
	  if(!email)  return res.status(400).send({msg:"email is required"})
	
	  if(!password)  return res.status(400).send({msg:"password is required"})
	
	  const findData=await authorModel.findOne({email:email,password:password})
	
	  if (!findData)  return res.status(401).send({ status: false, msg: "Invalid login credentials" });
	
	//token
	
	  const createToken=jwt.sign({id:findData._id.toString(),name:findData.fname},"new_seceret_key")
	
	  res.header("x-api-key",createToken)
	
	  res.status(201).send({msg:createToken})
} catch (error) {
	return res.status(500).send({msg:error.message})
}
}

module.exports.creaData = creaData;
module.exports.login=login















