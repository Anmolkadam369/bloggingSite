const express = require('express');   
const router = express.Router(); 
const authorController= require("../controllers/authorController")  
const blogController=require("../controllers/blogController") 
// const middleWare=require("./middlewares/commonMiddleware")   
const authMidd=require("../middlewares/auth") 

router.post("/author", authorController.creaData)

router.delete("/blogs/:blogId",authMidd.checkToken,blogController.deleteUsingParams)

router.post("/blogs",authMidd.checkToken,blogController.createBlog)
 
router.delete("/blogs",authMidd.checkToken,blogController.deleteByquery) 


router.post("/login",authorController.login)
  

router.get("/blogs",authMidd.checkToken,blogController.getBlog) 


router.put("/blogs/:blogId",authMidd.checkToken,blogController.putData)
 
module.exports = router;       