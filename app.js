// ספריית אקספרס 
const express = require("express");
// ספרייה למינפולציה על כתובת יו אר אל כסטרינג
const path = require("path");
// ספרייה להפעלת שרת
const http = require("http");
// ספרייה שדואגת שיהיה ניתן לתקשר עם השרת מדומיין אחר
const cors = require("cors");

const {configRoutes} = require("./routes/configRoutes")

require("./db/mongoConnect")
// משתנה שמקבל את יכולות אקספרס שדרכו נוכל להוסיף יכולות נוספות לאפליקציה
const app = express();
// נגדיר שאקספרס ידע לקבל באדי 
app.use(express.json());

// cors - מאשפר תקשורת עם דומיינים
app.use(cors())

// מגדיר תקייה ציבורית את התקייה פאבליק שהקבצים והתקיות בה יהיו חשופים
app.use(express.static(path.join(__dirname,"public")));
// הגדרת ראוטרים
configRoutes(app)
// app.use("/",(req,res) => {
//   res.json({msg:"Express work 333333"});
// })
// יצירת שרת שמקבל את יכולות אקספרס
const server = http.createServer(app);
// הפעלת השרת בפורט 3001
server.listen(3001);

console.log("http://localhost:3001/")