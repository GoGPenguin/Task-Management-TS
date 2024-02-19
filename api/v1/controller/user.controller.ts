import User from '../models/user.model'
import { Request, Response } from "express"
const ForgotPassword = require('../models/forgot-password.model')
import md5 from "md5"
const {
    generateRandomNumber,
    generateRandomString,
} = require('../../../helper/generate')
const {
    sendMail
} = require('../../../helper/sendMail')


// [POST] /api/v1/users/register
export const register = async (req: Request, res: Response) => {
    req.body.password = md5(req.body.password)

    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    })

    if (existEmail) {
        res.json({
            code: 400,
            message: 'Đã tồn tại người dùng'
        })
    } else {
        req.body.token = generateRandomString(30)
        const user = new User(req.body)
        await user.save()

        const token = user.token
        res.cookie("token", token)

        res.json({
            code: 200,
            message: 'Thành công',
            token: token
        })
    }
}

// [POST] /api/v1/users/login
export const login = async (req: Request, res: Response) => {
    req.body.password = md5(req.body.password)

    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    })

    if (!existEmail) {
        res.json({
            code: 400,
            message: 'Người dùng không tồn tại'
        })
    } else if (req.body.password != existEmail.password) {
        res.json({
            code: 400,
            message: 'Sai mật khẩu'
        })
    } else {
        res.cookie("token", existEmail.token)

        res.json({
            code: 200,
            message: 'Đăng nhập thành công',
            token: existEmail.token
        })
    }
}

// [POST] /api/v1/users/password/forgot
export const forgotPassword = async (req, res) => {
    const email = req.body.email

    const existEmail = await User.findOne({
        email: email,
        deleted: false
    })

    if (!existEmail) {
        res.json({
            code: 400,
            message: 'Không tồn tại người dùng'
        })
    } else {
        const otp = generateRandomNumber(6)


        const objectForgotPassword = {
            email: email,
            otp: otp,
            expireAt: Date.now()
        }

        const forgotPassword = new ForgotPassword(objectForgotPassword)
        await forgotPassword.save()

        // Gửi email thành công rồi
        // sendMail(email, "Quên mật khẩu", `
        //     Mã otp của bạn là <b>${otp}</b>. Sử dụng trong 3 phút. 
        //     Vui lòng không gửi cho người khác!
        // `)

        console.log(otp)

        res.json({
            code: 200,
            message: 'Đã gửi mã otp qua email'
        })
    }

}

// [POST] /api/v1/users/password/otp
export const otp = async (req, res) => {
    const email = req.body.email
    const otp = req.body.otp

    const forgotPassword = await ForgotPassword.findOne({
        email: email,
        otp: otp
    })

    if (forgotPassword) {
        const user = await User.findOne({
            email: email
        })

        res.cookie("token", user.token)

        res.json({
            code: 200,
            token: user.token,
            message: 'Xác thực thành công'
        })
    } else {
        res.json({
            code: 400,
            message: 'Mã OTP không hợp lệ'
        })
    }

}

// [PATCH] /api/v1/users/password/change
export const change = async (req, res) => {
    const token = req.cookies.token
    const password = md5(req.body.password)

    const user = await User.findOne({
        token: token,
        password: password
    })

    if (user) {
        res.json({
            code: 400,
            message: 'Vui lòng nhập mật khẩu mới khác mật khẩu cũ',
        })
        return
    }

    await User.updateOne({
        token: token
    }, {
        password: password
    })

    res.json({
        code: 200,
        message: 'Đổi mật khẩu thành công',
    })
}

// [GET] /api/v1/users/detail
export const detail = async (req: Request, res: Response) => {
    res.json({
        code: 200,
        message: 'Thành công',
        info: req["user"]
    })
}

// [GET] /api/v1/users/list
export const list = async (req, res) => {
    const users = await User.find({
        deleted: false
    }).select('fullName email')


    res.json({
        code: 200,
        message: 'Thành công',
        users: users
    })
}

