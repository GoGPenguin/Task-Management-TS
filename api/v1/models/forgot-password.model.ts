const mongoose = require('mongoose')


const forgotPasswordSchema = new mongoose.Schema({
    email: String,
    otp: String,
    expireAt: {
        type: Date,
        expires: 180
    }
}, {
    timestamps: true
})

export const ForgotPassword = mongoose.model('Forgot-Password', forgotPasswordSchema)
