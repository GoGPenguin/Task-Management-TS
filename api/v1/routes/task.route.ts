import { Router, Request, Response } from 'express'
const router: Router = Router();

import { Task } from '../../../models/task.model'

// const controller = require('../controller/task.controller')


// router.get('/', controller.index)

// router.get('/detail/:id', controller.detail)

router.get('/', async (req: Request, res: Response) => {
    const tasks = await Task.find({
        deleted: false
    })
    res.json(tasks)
})

router.get('/detail/:id', async (req: Request, res: Response) => {
    const tasks = await Task.findOne({
        deleted: false,
        _id: req.params.id
    })
    res.json(tasks)
})

export const taskRoutes: Router = router;