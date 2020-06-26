import React, { useState } from 'react'
import TaskListItem from './task-list-item'
import TimeTask from './time-task'
import '../assets/scss/main.scss'

const TaskList = (props) => {
  const [newTask, setNewTask] = useState('')
  const [search, setSearch] = useState('')
  const filtered = props.tasks.filter((el) => el.title.includes(search))
  return (
    <div className="task-list">
      <div className="search-input">
        <input type="text" placeholder="Search..." onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div>
        <TimeTask category={props.category} />
        {filtered.map((el) => (
          <TaskListItem
            key={el.title}
            taskId={el.taskId}
            title={el.title}
            status={el.status}
            updateStatus={props.updateStatus}
            updateTitle={props.updateTitle}
            deletedTask={props.deletedTask}
          />
        ))}
        <div className="add-task">
          <input
            type="text"
            placeholder="Enter name task"
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button type="button" onClick={() => props.addTask(newTask)}>
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskList
