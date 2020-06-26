import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'

import cookieParser from 'cookie-parser'
import config from './config'
// eslint-disable-next-line import/extensions
import Html from '../client/html'

const { readFile, writeFile } = require('fs').promises
const { readdirSync } = require('fs')

// eslint-disable-next-line import/no-extraneous-dependencies
const shortid = require('shortid')

const Root = () => ''

try {
  // eslint-disable-next-line import/no-unresolved
  // ;(async () => {
  //   const items = await import('../dist/assets/js/root.bundle')
  //   console.log(JSON.stringify(items))

  //   Root = (props) => <items.Root {...props} />
  //   console.log(JSON.stringify(items.Root))
  // })()
  console.log(Root)
} catch (ex) {
  console.log(' run yarn build:prod to enable ssr')
}

let connections = []

const port = process.env.PORT || 8090
const server = express()

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  bodyParser.json({ limit: '50mb', extended: true }),
  cookieParser()
]

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'yourproject - Become an IT HERO'
}).split('separator')

middleware.forEach((it) => server.use(it))

const read = (category) => {
  return readFile(`${__dirname}/tasks/${category}.json`, { encoding: 'utf8' })
    .then((data) => JSON.parse(data))
    .catch(() => [])
}

const write = async (tasks, category) => {
  await writeFile(`${__dirname}/tasks/${category}.json`, JSON.stringify(tasks), {
    encoding: 'utf8'
  })
}

const filteredKeyTasks = (tasks) => {
  return tasks.reduce((acc, rec) => {
    // eslint-disable-next-line no-underscore-dangle
    if (rec._isDeleted) {
      return acc
    }
    return [...acc, { taskId: rec.taskId, title: rec.title, status: rec.status }]
  }, [])
}

server.get('/api/v1/tasks/:category', async (req, res) => {
  const { category } = req.params
  const tasks = filteredKeyTasks(await read(category))
  res.json(tasks)
})

server.get('/api/v1/category', (req, res) => {
  const category = readdirSync(`${__dirname}/tasks`).map((el) => el.split('.json').join(''))
  res.json(category)
})

server.get('/api/v1/tasks/:category/:timespan', async (req, res) => {
  const { category, timespan } = req.params
  const tasks = await read(category)
  const timesPeriod = {
    day: 1000 * 60 * 60 * 24,
    week: 7 * 1000 * 60 * 60 * 24,
    month: 30 * 1000 * 60 * 60 * 24
  }
  const timesfiltered = filteredKeyTasks(
    // eslint-disable-next-line no-underscore-dangle
    tasks.filter((el) => el._createdAt + timesPeriod[timespan] > +new Date())
  )
  res.json(timesfiltered)
})

server.post('/api/v1/tasks/:category', async (req, res) => {
  const { category } = req.params
  if (Object.keys(req.body).length === 0) {
    await write([], category)
  } else {
    const newTasks = {
      taskId: shortid.generate(),
      title: req.body.title,
      status: 'new',
      _isDeleted: false,
      _createdAt: +new Date(),
      _deletedAt: null
    }
    const tasks = await read(category)
    const Task = [...tasks, newTasks]
    await write(Task, category)
    res.json({ Status: 'success', newTasks })
  }
})

server.patch('/api/v1/tasks/:category/:id', async (req, res) => {
  const { category, id } = req.params
  const statuses = ['done', 'new', 'in progress', 'blocked']
  if (statuses.includes(req.body.status) || req.body.title !== undefined) {
    const tasks = await read(category)
    const updatedStatus = tasks.map((el) => (el.taskId === id ? { ...el, ...req.body } : el))
    await write(updatedStatus, category)
    res.json({ status: 'Success' })
  } else {
    res.status(501)
    res.json({ status: 'invalid' })
  }
})

server.delete('/api/v1/tasks/:category/:id', async (req, res) => {
  const { category, id } = req.params
  const tasks = await read(category)
  const updatedStatus = tasks.map((el) => (el.taskId === id ? { ...el, _isDeleted: true } : el))
  await write(updatedStatus, category)
  res.json({ status: 'Deleted', category })
})

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
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

const app = server.listen(port)

if (config.isSocketsEnabled) {
  const echo = sockjs.createServer()
  echo.on('connection', (conn) => {
    connections.push(conn)
    conn.on('data', async () => {})

    conn.on('close', () => {
      connections = connections.filter((c) => c.readyState !== 3)
    })
  })
  echo.installHandlers(app, { prefix: '/ws' })
}
console.log(`Serving at http://localhost:${port}`)
