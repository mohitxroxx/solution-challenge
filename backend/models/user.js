const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
  cap: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    default:""
  },
}, { _id : false })

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
  },
  uid: {
    type: String,
    required: true,
    min: 3,
    max: 20,
  },
  email: {
    type: String,
    required: true,
    unique:true,
    max: 50,
  },
  createdAt: {
    type: Date, default: Date.now
  },
  posts: [postSchema]
})

module.exports = mongoose.model("tapio user", userSchema)