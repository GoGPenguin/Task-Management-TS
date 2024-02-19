import { Request, Response } from 'express'
import { Task } from '../models/task.model'

import paginationHelper from '../../../helper/pagination'
import searchHelper from '../../../helper/search'


export const index = async (req: Request, res: Response) => {
    const find = {
        deleted: false
    }

    if (req.query.status) {
        find["status"] = req.query.status
    }

    const sort = {}
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey.toString()
        sort[sortKey] = req.query.sortValue
    }

    const object = searchHelper(req.query)
    if (object.regex) {
        find["title"] = object.regex
    }


    const countTasks = await Task.countDocuments(find)
    const objectPagination = paginationHelper(req.query, countTasks)


    const tasks = await Task.find(find).sort(sort)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip)

    res.json(tasks)
}

export const detail = async (req: Request, res: Response) => {
    const tasks = await Task.findOne({
        deleted: false,
        _id: req.params.id
    })
    res.json(tasks)
}


// [PATCH] /api/v1/tasks/change-status/:id
export const changeStatus = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id
        const status: string = req.body.status

        await Task.updateOne({
            _id: id,
        }, {
            status: status
        })

        res.json({
            code: 200,
            message: 'Cập nhật trạng thái thành công'
        })
    } catch (error) {
        res.json({
            code: 400,
            message: 'Không tồn tại'
        })
    }

}

// [PATCH] /api/v1/tasks/change-multi
export const changeMulti = async (req: Request, res: Response) => {
    try {
        const {
            ids,
            key,
            value
        } = req.body

        let updateObject = {}
        if (key != 'delete') {
            updateObject = {
                [key]: value
            };
        } else {
            updateObject = {
                deleted: true,
                deletedAt: new Date()
            };
        }


        await Task.updateMany({
            _id: {
                $in: ids
            },
        }, updateObject)

        res.json({
            code: 200,
            message: 'Cập nhật trạng thái thành công'
        })
    } catch (error) {
        res.json({
            code: 400,
            message: 'Không thành công'
        })
    }

}

// [POST] /api/v1/tasks/create
export const create = async (req: Request, res: Response) => {
    try {
        const task = new Task(req.body)
        const data = await task.save()

        res.json({
            code: 200,
            message: 'Tạo task mới thành công',
            data: data
        })
    } catch (error) {
        res.json({
            code: 400,
            message: 'Lỗi'
        })
    }

}

// [PATCH] /api/v1/tasks/edit/:id
export const edit = async (req: Request, res: Response) => {
    try {
        const id = req.params.id

        await Task.updateOne({
            _id: id
        }, req.body)

        res.json({
            code: 200,
            message: 'Chỉnh sửa task thành công',
        })
    } catch (error) {
        res.json({
            code: 400,
            message: 'Lỗi'
        })
    }

}

// [DELETE] /api/v1/tasks/edit/:id
export const deleteTask = async (req: Request, res: Response) => {
    try {
        const id = req.params.id

        await Task.updateOne({
            _id: id
        }, {
            deleted: true,
            deletedAt: new Date()
        })

        res.json({
            code: 200,
            message: 'Xóa thành công',
        })
    } catch (error) {
        res.json({
            code: 400,
            message: 'Lỗi'
        })
    }

}
