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
  },
  uid: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique:true,
  },
  createdAt: {
    type: Date, default: Date.now
  },
  posts: [postSchema]
})

module.exports = mongoose.model("tapio user", userSchema)