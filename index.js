require("dotenv").config()
require("./database/mongodb")

const cors = require('cors')
const ex = require("express")
const userAuth = require("./routes/auth")
const category = require("./routes/category")
const app = ex();
const port = process.env.PORT
const user = require("./routes/userRoutes")
const tokenVerify = require("./middle/verifyToken");
app.use(cors())
app.use(ex.json())


app.use("/auth", userAuth)
// // app.use("/category", category )
app.use("/users",tokenVerify,user)
app.get("/test",async(req,res)=>{
    res.send("Test Api works.")
})
app.listen(port)