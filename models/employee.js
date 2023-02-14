import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, 'Employee first name is required'],
        trim: true,
        maxLength: [100, 'First name length must be less than 100 characters']
    },
    last_name: {
        type: String,
        required: [true, 'Employee last name is required'],
        trim: true,
        maxLength: [100, 'Last name length must be less than 100 characters']
     },
    email: {
        type: String,
        required: [true, 'Employee email is required'],
        unique: [true, 'Employee email already registered'],
        trim: true,
        lowercase: true,
        validate: {
            validator: (v) => /(?!.*[-_.]{2}.*)^[a-zA-Z\d][a-zA-Z\d._-]+[a-zA-Z\d]@([a-zA-Z\d][a-zA-Z\d-]*[a-zA-Z\d]\.){1,}[a-z]{2,}$/.test(v),
            message: 'Invalid email address'
        }
    },
    gender: {
        type: String,
        required: [true, 'Employee gender is required'],
        enum: {
            values: ['Male', 'Female', 'Other'],
            message: '{VALUE} is not a valid gender option'
        }
    },
    salary: {
        type: Number,
        required: [true, 'Employee salary is required'],
        min: [0, 'Employee salary must be greater than zero']
    },
});

export const Employee = mongoose.model('Employee', employeeSchema);