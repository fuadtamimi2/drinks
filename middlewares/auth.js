const jwt = require("jsonwebtoken")
require("dotenv").config();

// פונקציות אוטנטיקשן - בדיקת אימות של טוקן
exports.auth = (req,res,next) => {
   // req.body , req.params, req.query , req.header
  const token = req.header("x-api-key");
  // אם נשלח בכלל טוקן
  if(!token){
    return res.status(401).json({error:"You must send token 111"})
  }
  try{
    // בדיקה אם התוקן תקין או בתוקף 
    const tokenData = jwt.verify(token,process.env.TOKEN_KEY)
    // req - פרמטר של אובייקט שקיים בכל הפונקציות בשרשור של הראוטר
    req.tokenData = tokenData
    // לעבור לפונקציה הבאה בתור של השרשור של הראוטר
    next()
  }
  catch(err){
    // אם הטוקן לא עבר תקינות יגיע לקצ'
    return res.status(401).json({msg:"Token invalid or expired 222"})
  }
}