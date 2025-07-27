const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const UserSchema = new Schema({
    username: {type: String, required: true, min: 4, unique: true, lowercase: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: false, default: null},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    nationality: { type: String, required: false, default: null},
    passwordHint: {type: String, required: false, default: null},
    role: {
        type: String,
        enum: ['user', 'contributor', 'admin'],
        default: 'user',
    }
})

const UserModel = model('User', UserSchema);

module.exports = UserModel;