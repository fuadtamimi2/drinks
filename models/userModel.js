// user model
const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const schema = new mongoose.Schema({
  name:String,
  email:String,
  password:String
})

exports.UserModel = mongoose.model("users",schema);

exports.createToken = (_user_id) => {
  // יצירת טוקן , מקבל 3 פרמטרים
  // התכולה של הטוקן כפרמטר ראשון , בדרך כלל נשים לפחות את האיי די של המשתמש
  // הפמטר השני- מילה סודית, שאסור לחשוף אותה
  // פרמטר שלישי - תוקף של הטוקן
  const token = jwt.sign({_id:_user_id},process.env.TOKEN_KEY,{expiresIn:"600mins"});
  return token;
}

exports.validUser = (_reqBody) => {
  const joiSchema = Joi.object({
    name:Joi.string().min(2).max(99).required(),
    email:Joi.string().min(2).max(99).email().required(),
    password:Joi.string().min(3).max(99).required(),
  })
  return joiSchema.validate(_reqBody);
}
// וולדזציה של התחברות צריכה רק מייל וסיסמא
exports.validLogin = (_reqBody) => {
  const joiSchema = Joi.object({
    email:Joi.string().min(2).max(99).email().required(),
    password:Joi.string().min(3).max(99).required(),
  })
  return joiSchema.validate(_reqBody);
}