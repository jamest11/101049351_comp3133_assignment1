import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, 'Username already registered'],
        required: [true, 'Username is required'],
        trim: true,
        maxLength: [100, 'Username length must be less than 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email already registered'],
        trim: true,
        lowercase: true,
        validate: {
            validator: (v) => /(?!.*[-_.]{2}.*)^[a-zA-Z\d][a-zA-Z\d._-]+[a-zA-Z\d]@([a-zA-Z\d][a-zA-Z\d-]*[a-zA-Z\d]\.){1,}[a-z]{2,}$/.test(v),
            message: 'Invalid email address'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true,
    },
});

export const User = mongoose.model('User', userSchema);