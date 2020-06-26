import React, { useEffect, useState } from 'react'
import { Route, useParams } from 'react-router-dom'
import axios from 'axios'
import Main from './main'
import TaskList from './task-list'

const Home = () => {
  const { category, timespan } = useParams()
  const [categoryes, setCategoryes] = useState([])
  const [tasks, setTasks] = useState([])
  const [alert, setAlert] = useState('')
  const alertMessage = (message) => {
    setAlert(message)
    setTimeout(() => {
      setAlert('')
    }, 3000)
  }
  const addTask = (taskTitle) => {
    if (taskTitle) {
      axios
        .post(`/api/v1/tasks/${category}`, { title: taskTitle })
        .then(({ data }) => setTasks([...tasks, data.newTasks]))
    } else {
      alertMessage('Enter name task')
    }
  }
  const addCategory = (newTask) => {
    if (newTask) {
      axios.post(`/api/v1/tasks/${newTask}`)
      setCategoryes([...categoryes, newTask])
    } else {
      alertMessage('Enter name category')
    }
  }
  const updateStatus = (id, status) => {
    axios.patch(`/api/v1/tasks/${category}/${id}`, { status })
    setTasks(tasks.map((el) => (el.taskId === id ? { ...el, status } : el)))
  }
  const updateTitle = (id, title) => {
    axios.patch(`/api/v1/tasks/${category}/${id}`, { title })
    setTasks(tasks.map((el) => (el.taskId === id ? { ...el, title } : el)))
  }
  const deletedTask = (id) => {
    axios.delete(`/api/v1/tasks/${category}/${id}`)
    setTasks(tasks.filter((el) => el.taskId !== id))
  }
  useEffect(() => {
    axios('/api/v1/category').then(({ data }) => setCategoryes(data))
  }, [])
  useEffect(() => {
    if (category !== undefined && timespan === undefined) {
      axios(`/api/v1/tasks/${category}`).then(({ data }) => setTasks(data))
    }
    if (typeof timespan !== 'undefined') {
      axios(`/api/v1/tasks/${category}/${timespan}`).then(({ data }) => setTasks(data))
    }
  }, [category, timespan])
  return (
    <div className="h-screen flex">
      <div className="m-auto">
        <Route
          exact
          path="/"
          component={() => <Main categoryes={categoryes} addCategory={addCategory} alert={alert} />}
        />
        <Route
          exact
          path="/:category"
          component={() => (
            <TaskList
              category={category}
              tasks={tasks}
              addTask={addTask}
              updateStatus={updateStatus}
              updateTitle={updateTitle}
              deletedTask={deletedTask}
              alert={alert}
            />
          )}
        />
        <Route
          exact
          path="/:category/:timespan"
          component={() => (
            <TaskList
              category={category}
              tasks={tasks}
              addTask={addTask}
              updateStatus={updateStatus}
              updateTitle={updateTitle}
              deletedTask={deletedTask}
              alert={alert}
            />
          )}
        />
      </div>
    </div>
  )
}

Home.propTypes = {}

export default Home
