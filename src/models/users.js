const mongoose = require("mongoose");
const { Schema } = mongoose;
const crypto = require('crypto');
const { generateToken } = require('../token/token');


function hash(password){
  return crypto.createHmac('sha256', process.env.SECRET_KEY)
  .update(password)
  .digest('hex');
}

exports.hash = hash;

// 스키마
const User = new Schema({
    id: Number,
    username: String,
    password: String,
    email: String,        
    boards : Array,
  });

// 데이터 검색

User.statics.findByUsername = function(username) {
    // 객체에 내장되어있는 값을 사용 할 때는 객체명.키 이런식으로 쿼리하면 됩니다
    return this.findOne({ username }).exec();
};

User.statics.findByEmail = function(email) {
    return this.findOne({ email }).exec();
};

User.statics.findByEmailOrUsername = function({username, email}) {
  console.log("유저이름 :: ", username);
  console.log("이메일 :: ", email);
    return this.findOne({
        // $or 연산자를 통해 둘중에 하나를 만족하는 데이터를 찾습니다
        $or: [
            { username },
            { email }
        ]
    }).exec();
};

User.methods.validatePassword = function(password) {
    // 함수로 전달받은 password 의 해시값과, 데이터에 담겨있는 해시값과 비교를 합니다.
    const hashed = hash(password);
    return this.password === hashed;
};

// 데이터 생성

User.statics.localRegister = function({ username, email, password }) {
    // 데이터를 생성 할 때는 new this() 를 사용합니다.
    const user = new this({
        username,
        email,
        password: hash(password)
    });
            
    return user.save();
};

User.methods.generateToken = function() {
    // JWT 에 담을 내용
    const payload = {
        _id: this._id,
        email: this.email,
        username: this.username,
    };

    return generateToken(payload, 'account');
};

  module.exports = mongoose.model('User', User);