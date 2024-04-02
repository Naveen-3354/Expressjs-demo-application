require("dotenv").config()
require("./database/mongodb")

const ex = require("express")
const userAuth = require("./routes/auth")
const category = require("./routes/category")
const app = ex();
const port = process.env.PORT
const user = require("./routes/userRoutes")
const tokenVerify = require("./middle/verifyToken");
app.use(ex.json())


app.use("/auth", userAuth)
// // app.use("/category", category )
app.use("/users",tokenVerify,user)

app.listen(port)