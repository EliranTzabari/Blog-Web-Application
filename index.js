import express from "express"
import fs from "fs"
import bodyParser from "body-parser"
import path from "path"

var app = express()
var port = 3000

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));

// create txt files array base the txt files in the content directory and parse them to be without ".txt" extention
const directoryPath = './public/content'

function getTxtFiles(dirPath){
    const files = fs.readdirSync(dirPath)
    const txtFiles = files.filter(file => path.extname(file).toLocaleLowerCase() === ".txt")
    return txtFiles
}
function removeFileExtention(fileName){
    return fileName.map(fileName => path.parse(fileName).name)
}
// create txt files based on the createblog.ejs and parse the to be without ".txt" extention


app.get("/", (req, res) => {
    res.render("index.ejs")
})

app.get("/blogs", (req, res) => {
    const txtFilesArray = getTxtFiles(directoryPath) // the name of the txt files with the .txt extention
    const txtFilesNames = removeFileExtention(txtFilesArray) // the name of the txt files without the .txt extention
    console.log(txtFilesNames)
    res.render("blogs.ejs", {
        items: txtFilesNames
    })
})

app.post("/blogs", (req, res) =>{
    const key = req.body.choice

    function readTxtFile(){
        return fs.readFileSync(`./public/content/${key}.txt`, 'utf-8')
    }

    var txtContent = readTxtFile()
    res.render("blogread.ejs", {key, txtContent})
})

app.get("/createblog", (req, res) => {
    res.render("createblog.ejs")
})

app.post("/createblog", (req, res) => {
    var subject = req.body["subject"]
    var content = req.body["content"]
    
    fs.writeFile(`./public/content/${subject}.txt`,content, (err) => {
        if (err) {
            console.error(`Error writing file ${err}!`)
        } else {
            console.log("file created successfully")
            res.redirect("blogs")

        }
    })
    })


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})