const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const {nanoid} = require("nanoid");

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async function (value) {
                if(!this.isModified('email')) return true;
                const user = await User.findOne({email: value});
                return !user;
            },
            message: 'This user already registered!'
        }
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true,
    }
});

const SALT_WORK_FACTOR = 10;

UserSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    }
});

UserSchema.methods.checkPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function () {
    this.token = nanoid();
};

const User = mongoose.model('User', UserSchema);

module.exports = User;