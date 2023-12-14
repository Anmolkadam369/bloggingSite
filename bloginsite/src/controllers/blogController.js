const AuthorModel = require("../Models/AuthorModel");
const blogModel = require("../Models/BlogsModel");
var mongoose = require("mongoose");
const validator=require("../middlewares/commonMiddleware")


let jwt = require("jsonwebtoken");
const auth=function(req,res){
	let token = req.headers["x-api-key"];
	let decode = jwt.verify(token, "new_seceret_key")
	return decode
}

//___________createBlog___________
const createBlog = async function (req, res) {
 try {
	 let data = req.body; 
	 //body
	 if(Object.keys(data).length==0)   return res.status(400).send({ msg: "data is mandatory" });

	  
	 
	  if (!data.title) return res.status(404).send({ msg: "title in mandatory" });
	
	  if (!data.body) return res.status(404).send({ msg: "body in mandatory" });
	
	  if (!data.category) return res.status(404).send({ msg: "category in mandatory" });

	//authorId
	  if(!validator.isValidObjectId(data.authorId))  return res.status(400).send({ msg: "authorId is not valid" });
	if(!data.authorId)  return res.status(400).send({msg:"authorId is mandatory"})
	
	  const isauthorIdpresent = await AuthorModel.findById(data.authorId);
	
	  if (!isauthorIdpresent) return res.status(400).send({ msg: "no author found " });
	
	  const createData = await blogModel.create(data);
	  res.status(201).send({ msg: createData });
} catch (error) {
	return res.status(500).send({ status: false, error: error.message });
}
};


//__________getApi______________//
// Returns all blogs in the collection that aren't deleted and are published
// Return the HTTP status 200 if any documents are found. The response structure should be like this
// If no documents are found then return an HTTP status 404 with a response like this
// Filter blogs list by applying filters. Query param can have any combination of below filters.
// By author Id
// By category
// List of blogs that have a specific tag
// List of blogs that have a specific subcategory example of a query url: blogs?filtername=filtervalue&f2=fv2
const getBlog = async function (req, res) {

try {
	    let data = req.query; 
	    console.log(data); 
	    let filter={
	      isDeleted:false,
	      isPublished:true,
	      ...data 
	    }
	    console.log(filter)
	  
	    if (Object.keys(data).includes('authorId')) {
	      if(!validator.isValidObjectId(data.authorId))  return res.status(400).send({ msg: "objectId is not valid" });
	    }
	  
	   
	    const finddata = await blogModel.find(filter);
	    if (Object.keys(finddata).length==0) return res.status(404).send({ msg: "no user found" });
	  
	    res.status(200).send({ msg: finddata })
} catch (error) {
	return res.status(500).send({ status: false, error: error.message });
}

}



//_______postBlog_______________//
//PUT /blogs/:blogId
// Updates a blog by changing the its title, body, adding tags, adding a subcategory. (Assuming tag and subcategory received in body is need to be added)
// Updates a blog by changing its publish status i.e. adds publishedAt date and set published to true
// Check if the blogId exists (must have isDeleted false). If it doesn't, return an HTTP status 404 with a response body like this
// Return an HTTP status 200 if updated successfully with a body like this
// Also make sure in the response you return the updated blog document.
const putData=async function(req,res){
try {
	  let id = req.params.blogId; 
	  let isValid = mongoose.Types.ObjectId.isValid(id);
	  
	  if (!isValid) return res.send({ msg: "blogId is not valid" });

	  if (!id) return res.status(404).send({ msg: "blogId is missing" }); 
	   
      let data = req.body
	  if(Object.keys(data).length==0)  return res.status(400).send({msg:"body is missing"})


        let title = data.title 
        let body = data.body
        let tags = data.tags
        let subcategory = data.subcategory

   //token
       let decodeToken=auth(req,res)

	  const findDataFromId = await blogModel.findOne({_id:id,isDeleted:false});

	  if (!findDataFromId) res.send({ msg: "no data found" }); 

       if(findDataFromId.authorId!=decodeToken.id)   return res.status(403).send({msg:"you are not authorised"})

	
	  
	 //update
	 const updateData=await blogModel.findOneAndUpdate( 
		{_id:id},
		{
			$set:{title:title,body:body},
			$push:{tags:tags,subcategory:subcategory},
		    $set:{isPublished:true,publishedAt:Date.now()}
		},
		{new:true}
		)
		return res.status(200).send({msg:updateData}) 
 
	  
} catch (error) {
	return res.status(500).send({ status: false, error: error.message });
}
}

//_____________deleteBlogs______________//

//Check if the blogId exists( and is not deleted). If it does, mark it deleted and return an HTTP status 200 without any response body.
// If the blog document doesn't exist then return an HTTP status of 404 with a body like this
const deleteData = async function (req, res) {
  try {
	let id = req.params.blogId;
     let decodeToken=auth(req,res)


	  let isValid = mongoose.Types.ObjectId.isValid(id);
	  if (!isValid) return res.send({ msg: "objectId is not valid" });
	  if (!id) return res.status(404).send({ msg: "blogId is missing" });
	  
	  const findDataFromId = await blogModel.findOne({_id:id,isDeleted:false});
	  if (!findDataFromId) res.send({ msg: "no data found" });



	    console.log(decodeToken.id)

       if(decodeToken.id!=findDataFromId.authorId)   return res.send({msg:"you are not authorised"})
       
	
	    const updateWithDeleted = await blogModel.findOneAndUpdate(
			{_id:id,isDeleted:false},
	      { $set: { isDeleted: true, DeletedAt: Date.now() } }, 
	      { new: true } 
	    ); 
	    return res.status(200).send({ updateWithDeleted });
	  
	     
	  
} catch (error) {
	return res.status(500).send({ status: false, error: error.message });
}
};

//Delete blog documents by category, authorid, tag name, subcategory name, unpublished
//
// If the blog document doesn't exist then return an HTTP status of 404 with a body like this
const deleteByquery = async function (req, res) {
try {
	  let data = req.query; 
	  console.log(data);
	  let filter={
	    isDeleted:false,
	    
	
	    ...data
	  }
	//   console.log(filter) 
	
	  if (Object.keys(data).includes('authorId')) {
	    let isValid = mongoose.Types.ObjectId.isValid(data.authorId);
	
	    if (!isValid) return res.send({ msg: "objectId is not valid" });
	  }

	  if(Object.keys(data).includes('isPublished')){
		if(data['isPublished']=='false'){
			data['isPublished']=false
		}}
	
	
	
	
	  const finddata = await blogModel.find(filter).select({authorId:1,_id:0}); 

	  if (finddata.length==0) return res.status(404).send({ msg: "no user found from query" });
	  
	  let decodeToken=auth(req,res)


	  console.log(decodeToken.id)
	  const authOne=finddata.filter(a=>a.authorId==decodeToken.id)

	  if(authOne.length==0)  return res.send({msg:"you are not authorised"})



    
	  const updateData = await blogModel.updateMany({authorId:decodeToken.id}, {
	     $set: { isDeleted: true, DeletedAt: Date.now() },
	   });
	   res.status(200).send({ msg: updateData }); 
} catch (error) { 
	return res.status(500).send({ status: false, error: error.message });
}
   
};

module.exports.createBlog = createBlog;
module.exports.getBlog=getBlog
module.exports.deleteUsingParams = deleteData;
module.exports.deleteByquery = deleteByquery;
module.exports.putData=putData

