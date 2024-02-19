const mongoose = require('mongoose')
import { generateRandomString} from '../../../helper/generate'


const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    token: {
        type: String,
        default: generateRandomString(30)
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema)

export default User;