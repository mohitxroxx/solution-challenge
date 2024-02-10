const express=require('express')
const router=express.Router()
const login=require('../controller/data')
const logout=require('../controller/data')
const home=require('../controller/data')
const user=require('../controller/data')
const register=require('../controller/data') 
const upload=require('../controller/data') 
const post=require('../controller/data') 
const getpost=require('../controller/data') 


router.post('/register',register)
router.post('/upload',upload)
router.post('/post',post)
router.post('/getpost',getpost)


router.post('/login',login)
router.get('/home',home)
router.get('/user',user)
router.get('/logout',logout)

module.exports=router