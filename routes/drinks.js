const express = require("express");
const { DrinkModel, validDrink } = require("../models/drinkModel")
const {auth} = require("../middlewares/auth");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit || 5
    const skip = req.query.skip || 0;
    const sort = req.query.sort || "_id"
    // אם נשלח רוורס יתחיל מהקטן לגדול ואם לא
    // מהגדול לקטן
    const reverse  = req.query.reverse == "yes" ? 1 : -1;
    // SELECT * FROM drinks LIMIT 0,3;
    const data = await DrinkModel
    .find({})
    // limit -> כמה רשומות מקסימום להציג
    .limit(limit)
    // על כמה רשומות לדלג
    .skip(skip)
    // למיין את המידע כיצד יגיע
    // 1 - מייצג מהקטן לגדול
    // ומינוס אחד ההפך
    // [sort] - למאפיינים של אובייקט שנרצה שישתמש בערך שלהם נכניס לסוגריים מרובעים
    .sort({[sort]:reverse})
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

router.get("/single/:id",async(req,res) => {
  try {
    const id = req.params.id;
    const data = await DrinkModel.findOne({_id:id});
    res.json(data);
  } catch (error) {
      console.log(err);
    res.status(502).json({ err })
  }
})

// מחזיר את כמות הרשומות בקולקשן במסד
router.get("/count",async(req,res) => {
  try {
    const count = await DrinkModel.countDocuments({});
    res.json({count});
  } catch (error) {
      console.log(err);
    res.status(502).json({ err })
  }
})

router.post("/", auth, async (req, res) => {
  const validBody = validDrink(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const drink = new DrinkModel(req.body);
    // נוסיף לרשומה את האיי די של המשתמש שהוסיף לתיעוד בהמשך
    drink.user_id = req.tokenData._id
    await drink.save();
    res.status(201).json(drink)
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

router.put("/:id", auth,async(req,res) => {
  const validBody = validDrink(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try{
    const id = req.params.id;
    // user_id:req.tokenData._id - מוודא שהמשתמש הרשומה שלו
    const data = await DrinkModel.updateOne({_id:id,user_id:req.tokenData._id},req.body);
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})


router.delete("/:id", auth,async(req,res) => {
  try{
    const id = req.params.id;
    // user_id:req.tokenData._id - מוודא שהמשתמש הרשומה שלו
    const data = await DrinkModel.deleteOne({_id:id,user_id:req.tokenData._id});
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

module.exports = router;