const express = require("express");
const Bcrypt = require("bcrypt")
const { UserModel, validUser, validLogin,createToken } = require("../models/userModel")
// const jwt = require("jsonwebtoken");
const {auth} = require("../middlewares/auth");
const router = express.Router();

router.get("/", async(req, res) => {
  res.json({ msg: "users work" });
})


 
router.get("/userInfo",auth,async(req,res) => {
  try{
    const data = await UserModel.findOne({_id:req.tokenData._id},{password:0});
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
  
})



// הרשמה של משתמש חדש
router.post("/",async(req,res) => {
  const validBody = validUser(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    const user = new UserModel(req.body);
    // להצפין את הסיסמא - 10 רמת אבטחה סבירה לחנות קטנה,בינונית
    user.password = await Bcrypt.hash(user.password,10)
    await user.save();
    user.password = "*****"
    res.status(201).json(user)
  }
  catch(err){
    if(err.code == 11000){
      return res.status(400).json({err:"Email aleady system",code:11000})
    }
    console.log(err);
    res.status(502).json({err})
  }
})

router.post("/login",async(req,res) => {
  const validBody = validLogin(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
 try{
  // אם המייל קיים במערכת שמגיע מהבאדי
  const user = await UserModel.findOne({email:req.body.email});
  if(!user){
    return res.status(401).json({err:"Email not found"})
  }
  // לבדוק את הסיסמא אם מתאימה לסיסמא המוצפנת של הרשומה
  const passValid = await Bcrypt.compare(req.body.password,user.password)
  if(!passValid){
    return res.status(401).json({err:"Password worng"})
  }
  // לשלוח בחזרה טוקן
  const token = createToken(user._id)
  res.json({token})
 }
 catch(err){
  console.log(err);
  res.status(502).json({err})
 }
})

module.exports = router;