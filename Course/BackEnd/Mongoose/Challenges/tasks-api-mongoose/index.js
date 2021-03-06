require('dotenv').config()

const express = require('express')
const app = express()

app.use(require('./cors'))

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const tasksData = new(require('./tasks/TasksData'))

const router = express.Router()

router.route('/tasks')
    .get((req, res) => {
        tasksData.list()
            .then((tasks)=>{
                res.json({
                status: 'OK',
                message: 'tasks listed successfully',
                data: tasks
                })
            })
            .catch((err)=>{
                res.json({
                status: 'KO',
                message: err.message
               })
            })
    })
    .post((req, res) => {
        const { text, done } = req.body

        try {
            const task = tasksData.create(text, done)

            res.json({
                status: 'OK',
                message: 'task created successfully',
                data: task
            })
        } catch (err) {
            res.json({
                status: 'KO',
                message: err.message
            })
        }
    })

router.route('/tasks/:id')
    .get((req, res) => {
        const id = req.params.id

        tasksData.retrieve(id)
            .then((task)=>{
                res.json({
                    status: 'OK',
                    message: 'task retrieved successfully',
                    data: task
                })
            })
            .catch((err)=>{
                res.json({
                    status: 'KO',
                    message: err.message
                })
            })       
    })
    .put((req, res) => {
        const id = req.params.id

        const { text, done } = req.body

        tasksData.update(id, text, done)
            .then((task)=>{
                res.json({
                    status: 'OK',
                    message: 'task updated successfully',
                    data: task
                })
            })
            .catch((err)=>{
                res.json({
                    status: 'KO',
                    message: err.message
                })
            })
    })
    .delete((req, res) => {
        const id = req.params.id

        tasksData.delete(id)
            .then((task)=>{
                res.json({
                    status: 'OK',
                    message: 'task deleted successfully',
                    data: task
                })
            })
            .catch((err)=>{
                res.json({
                    status: 'KO',
                    message: err.message
                })
            })    
    })

app.use('/api', router)

const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/test',{userMongoClient:true})

console.log(`starting Tasks API on port ${process.env.PORT}`)

app.listen(process.env.PORT, () => console.log('Tasks API is up'))

process.on('SIGINT', () => {
    console.log('\nstopping Tasks API...')

    process.exit()
})