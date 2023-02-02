const express = require("express")
const path = require("path")

const router = express.Router()

router.post("/single", async (req, res) => {
    const file = req.files.image
    const fileName = new Date().getTime().toString() + path.extname(file.name)
    const savePath = path.join("./public", "upload", fileName)
    await file.mv(savePath)
    res.json({message: "File save successfully"})
})

router.post("/single", async (req, res) => {
    const file = req.files.image
    const fileName = new Date().getTime().toString() + path.extname(file.name)
    const savePath = path.join("./public", "upload", fileName)
    await file.mv(savePath)
    res.json({message: "File save successfully"})
})

router.post("/multple", async (req, res) => {
    const files = req.files.image
    let promises= []

    files.forEach(file => {
        const savePath = path.join("./public", "upload", file.name)
        promises.push(file.mv(savePath))
    })

    await Promise.all(promises)

    res.send("File saved")
})

module.exports = router