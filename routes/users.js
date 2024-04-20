const mongoose = require('mongoose');
const plm = require('passport-local-mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/pintrestProject')
.then(()=> console.log("DB Connrcted!!"));

const userSchema = mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  profileImage: String,
  contact: Number,
  boards: {
    type: Array,
    default: []
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post'
  }]
})

userSchema.plugin(plm);

module.exports = mongoose.model("user", userSchema)