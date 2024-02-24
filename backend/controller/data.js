const dotenv = require('dotenv')
const express = require("express")
const cookieParser = require('cookie-parser')
const User = require("../models/user")
const nodemailer = require('nodemailer')
const cloudinary = require("../config/cloudinary")
const upload = require("../middleware/multer")
const { GoogleGenerativeAI } = require("@google/generative-ai");


const app = express()

app.use(express.json())
app.use(cookieParser())
dotenv.config()


const { TOKEN_KEY, SMTP_EMAIL, SMTP_PASS } = process.env

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASS,
    },
})



app.post("/register", async (req, res) => {
    try {
        const {
            username, uid, email
        } = req.body

        if (!username || !uid || !email) {
            return res.status(400).json({ msg: 'Please fill the form completely', status: false })
        }

        // const chkuser = await User.findOne({ email })
        // if (chkuser) {
        //     return res.status(400).json({ msg: 'Email already registered with us', status: false })
        // }

        const newUser = await User.create({
            username, uid, email
        })

        const mailOptions = {
            from: SMTP_EMAIL,
            to: email,
            subject: "Hello there",
            html: `<body>
                    <body style="font-family: Arial, sans-serif margin: 0 padding: 0 background-color: #ffffb3">
                        <table role="presentation" cellspacing="0" cellpadding="0"  width="600"
                            style="margin: 0 auto background-color: #fff padding: 20px border-radius: 5px box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3)">
                            <tr>
                                <td>
                                    <h3 style="color: #0838bc font-size: 24px text-align: center margin-bottom: 10px">Welcome to Tap.io</h3>
                                    <h4 style="font-size: 20px color: #333">We are pleased to welcome you ${username}</h4>
                                    <p style="font-size: 16px color: #333 margin: 20px 0">Join the community and contribute towards the betterment of our ecosystem
                                      </p>
                                    <div style="font-size: 16px color: #333 margin-top: 20px text-align: center">
                                        <h5 style="font-size: 18px">Best Regards</h5>
                                        <h5 style="font-size: 18px">Tap.io</h5> 
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </body>
                </body>`,
        }
        transporter
            .sendMail(mailOptions)
            .then(() => {
                console.log("mail sent")
            })
            .catch((err) => {
                console.log(err)
            })
        res.status(200).json({ status: true, msg: 'User registered successfully check mail for further instruction and unique refer code!' })
    } catch (error) {
        console.error('Error registering user:', error)
        res.status(500).json({ status: false, msg: 'Internal server error' })
    }
})


app.post('/upload', async (req, res) => {
    try {
        upload.single('image')(req, res, function (err) {
            if (err) {
                console.log(err)
                return res.status(200).send("Error occured while uploading")
            }
            cloudinary.uploader.upload(req.file.path, function (err, result) {
                if (err) {
                    console.log(err)
                    return res.status(500).send("Error occured with cloudinary")
                }
                return res.status(200).json({ msg: "Uploaded successfully", imageUrl: result.url })
            })
        })
    } catch (error) {
        return res.status(400).json({ msg: "Error occured while uploading the image" })
    }
})

app.post('/post', async (req, res) => {
    try {
        const { uid, cap, img } = req.body
        let user = await User.findOne({ uid: uid })
        if (!user)
        res.status(400).json({ message: 'Username is invalid' })
        user.posts.push({
            cap: cap,
            img: img
        })
        await user.save()
        res.status(200).json({ message: 'Post added successfully!' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'An error occurred', error: error })
    }
})

app.post('/getpost',async(req,res)=>{
    try {
        const {uid}=req.body
        const allposts=await User.findOne({uid:uid})
        res.status(200).json(allposts.posts)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'An error occurred', error: error })
    }
})
app.post('/attractions',async(req,res)=>{
    try {
        const{park}=req.body
        const genAI = new GoogleGenerativeAI(process.env.API_KEY);
        
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});
        
        const prompt = "what are the most famous attractions of "+park+" national park of India"
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        res.status(200).send(text)
        console.log(text);
        
    } catch (error) {
        
        res.status(500).json({ message: 'An error occurred', error: error })
    }
})
app.post('/lifeonland',async(req,res)=>{
    try {
        const{park}=req.body
        const genAI = new GoogleGenerativeAI(process.env.API_KEY);
        
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});
        
        const prompt = "what are the most famous species of animals in "+park+" national park of India"
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(json(text));
        return res.status(200).send(text)
        
    } catch (error) {
        
        return res.status(500).json({ message: 'An error occurred', error: error })
    }
})
app.post('/endangered',async(req,res)=>{
    try {
        const{park}=req.body
        const genAI = new GoogleGenerativeAI(process.env.API_KEY);
        
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});
        
        const prompt = "what are the threatened, endangered and critically endangered species of animals in "+park+" national park of India"
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return res.status(200).send(text)
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'An error occurred', error: error })
    }
})
app.post('/ask',async(req,res)=>{
    try {
        const{question}=req.body
        const genAI = new GoogleGenerativeAI(process.env.API_KEY);
        
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});
        
        const prompt = question+" give the answer in short as this is meant to be a chatbot response"
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return res.status(200).send(text)
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'An error occurred', error: error })
    }
})


module.exports = app