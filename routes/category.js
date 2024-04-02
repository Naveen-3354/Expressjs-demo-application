const ex = require('express')
const route = ex.Router()
const Category = require('../models/category')


route.get("/", async (req,res)=>{
    const result = await Category.find().populate("users")

    res.send(result)
})

route.post("/",async (req,res)=>{
    const result = Category({
        categoryName : "greens",
        categoryCode :"ca001",
        // userid:"659e3505987faa51b02aac77"
    })

    await result.save()
    res.send("saved")
})

module.exports = route