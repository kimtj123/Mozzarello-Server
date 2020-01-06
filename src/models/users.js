let mongoose = require("mongoose");
let { Schema } = mongoose;

function hash(password){
  return crypto.createHmac('sha256', process.env.SECRET_KEY)
  .update(password)
  .digest('hex');
}

let User = new Schema({
    id: Number,
    userName: String,
    password: String,
    email: String,    
  });

  module.exports = mongoose.model('User', User);
