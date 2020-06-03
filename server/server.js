/* eslint-disable import/no-duplicates */
import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import shortid from 'shortid'

import cookieParser from 'cookie-parser'
import Html from '../client/html'

const { readdirSync } = require('fs')

const { readFile, writeFile, unlink } = require('fs').promises

const port = process.env.PORT || 3000
const server = express()

server.use(cors())

server.use(express.static(path.resolve(__dirname, '../dist/assets')))
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
server.use(bodyParser.json({ limit: '50mb', extended: true }))

server.use(cookieParser())

const wrFile = async (category, newTasks) => {
  await writeFile(`${__dirname}/tasks/${category}.json`, JSON.stringify(newTasks, 1, 2), {
    encoding: 'utf8'
  })
}

const rFile = (category) => {
  return readFile(`${__dirname}/tasks/${category}.json`, { encoding: 'utf8' })
    .then((data) => JSON.parse(data) /* вернется текст, а не объект джаваскрипта */)
    .catch(() => [])
}

const getData = (tasks) => {
  return tasks.reduce((acc, rec) => {
    // eslint-disable-next-line no-underscore-dangle
    if (rec._isDeleted) {
      return acc
    }
    return [...acc, { taskId: rec.taskId, title: rec.title, status: rec.status }]
  }, [])
}

server.get('/api/v1/tasks/', async (req, res) => {
  const taskList = await readdirSync(`${__dirname}/tasks`).map((el) => el.split('.json')[0])
  res.send(taskList)
})

server.get('/api/v1/tasks/:category', async (req, res) => {
  const { category } = req.params
  const tasks = getData(await rFile(category))
  res.json(tasks)
})

server.get('/api/v1/tasks/:category/:timespan', async (req, res) => {
  const { category, timespan } = req.params
  const tasks = await rFile(category)
  const timespanObj = {
    day: 1000 * 60 * 60 * 24,
    week: 7 * 1000 * 60 * 60 * 24,
    month: 30 * 1000 * 60 * 60 * 24
  }
  let filteredTasks = tasks.filter((el) => {
    // eslint-disable-next-line no-underscore-dangle
    return el._createdAt + timespanObj[timespan] > +new Date()
  })
  filteredTasks = getData(filteredTasks)
  res.json(filteredTasks)
})

server.post('/api/v1/tasks/:category/', async (req, res) => {
  const { category } = req.params
  if (Object.keys(req.body).length === 0) {
    const newTask = []
    await wrFile(category, newTask)
    res.json({ status: 'category added', newTask })
  } else {
    const tasks = await rFile(category)
    const newTask = {
      taskId: shortid.generate(),
      title: req.body.title,
      status: 'new',
      _isDeleted: false,
      _createdAt: +new Date(),
      _deletedAt: null
    }
    const newTasks = [...tasks, newTask]
    await wrFile(category, newTasks)
    res.json({ status: 'success', newTask })
  }
})

server.patch('/api/v1/tasks/:category/:id', async (req, res) => {
  const { category, id } = req.params
  const statuses = ['done', 'new', 'in progress', 'blocked']
  if (!statuses.includes(req.body.status)) {
    res.status(501)
    res.json({ status: 'error', message: 'incorrect status' })
  } else {
    const tasks = await rFile(category)
    const filteredTasks = tasks.map((el) => (el.taskId === id ? { ...el, ...req.body } : el))
    await wrFile(category, filteredTasks)
    res.json({ status: 'Update successfully' })
  }
})

server.delete('/api/v1/tasks/:category/:id', async (req, res) => {
  const { category, id } = req.params
  const tasks = await rFile(category)
  const deletedTask = tasks.map((el) =>
    el.taskId === id ? { ...el, _isDeleted: true, _deletedAt: +new Date() } : el
  )
  await wrFile(category, deletedTask)
  res.json({ status: 'delete success' })
}) // delete tasks

server.delete('/api/v1/tasks/:category/', async (req, res) => {
  const { category } = req.params
  unlink(`${__dirname}/tasks/${category}.json`)
  res.json({ status: 'delete success' })
}) // delete file

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

server.get('/', (req, res) => {
  // const body = renderToString(<Root />);
  const title = 'Server side Rendering'
  res.send(
    Html({
      body: '',
      title
    })
  )
})

server.get('/*', (req, res) => {
  const initialState = {
    location: req.url
  }

  return res.send(
    Html({
      body: '',
      initialState
    })
  )
})

server.listen(port)

console.log(`Serving at http://localhost:${port}`)
