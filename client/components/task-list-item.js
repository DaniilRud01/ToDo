import React, { useState } from 'react'
import '../assets/scss/main.scss'

const TaskListItem = (props) => {
  const [editingMode, setEditingMode] = useState(false)
  const [editingName, setEditingName] = useState(props.title)
  return (
    <div className="tasks-name">
      <div key={props.taskId}>
        {editingMode === false ? (
          <div>
            <button className="edit-button" type="button" onClick={() => setEditingMode(true)}>
              Edit
            </button>
            <div className="switch-status">
              <div className="title">{props.title}</div>
              {props.status === 'new' && (
                <div>
                  <button
                    type="button"
                    className="progress-button"
                    onClick={() => props.updateStatus(props.taskId, 'in progress')}
                  >
                    In Progress
                  </button>
                </div>
              )}
              {props.status === 'in progress' && (
                <div>
                  <button className="blocked-button" type="button" onClick={() => props.updateStatus(props.taskId, 'blocked')}>
                    blocked
                  </button>
                  <button
                    type="button"
                    className="ml-2 done-button"
                    onClick={() => props.updateStatus(props.taskId, 'done')}
                  >
                    done
                  </button>
                </div>
              )}
              {props.status === 'done' ? (
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => props.deletedTask(props.taskId)}
                >
                  Delete
                </button>
              ) : (
                ''
              )}
              {props.status === 'blocked' && (
                <button
                  type="button"
                  className="button-unblock"
                  onClick={() => props.updateStatus(props.taskId, 'in progress')}
                >
                  unblock
                </button>
              )}
            </div>
          </div>
        ) : (
          <div>
            <button
              type="button"
              className="save-button"
              onClick={() => {
                setEditingMode(false)
                props.updateTitle(props.taskId, editingName)
              }}
            >
              Save
            </button>
            <input
              type="text"
              className="edit-input"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
export default TaskListItem
