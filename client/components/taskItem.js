import React, { useState } from 'react'
import './main.scss'

const TaskItem = (props) => {
  const [editingMode, setEditingMode] = useState(false)
  const [value, setValue] = useState(props.title)
  const editTitle = () => {
    setEditingMode(false)
    props.taskNameUpdate(value, props.status, props.taskId)
  }
  const deleteTask = () => {
    props.taskDelete(props.taskId)
  }
  return (
    <div className="flex justify-between content-between">
      {editingMode ? (
        <div className="taskItem">
          <button
            type="button"
            className="btnClass mx-2 font-serif bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded"
            onClick={editTitle}
          >
            Save
          </button>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="btnClass mx-2 font-serif bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded"
          />
        </div>
      ) : (
        <div className="taskItem">
          <button
            type="button"
            className="btnClass mx-2 font-serif bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded"
            onClick={() => setEditingMode(true)}
          >
            Edit
          </button>
          {props.title}
        </div>
      )}
      <div>
        {props.status === 'new' ? (
          <button
            type="button"
            className="btnClass mx-2 font-serif bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded"
            onClick={() => props.updateStatus('in progress', props.taskId)}
          >
            In progress
          </button>
        ) : (
          ''
        )}
        {props.status === 'in progress' ? (
          <div className="flex">
            <button
              type="button"
              className="btnClass mx-2 font-serif bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded"
              onClick={() => props.updateStatus('blocked', props.taskId)}
            >
              Back
            </button>
            <button
              type="button"
              className="btnClass mx-2 font-serif bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded"
              onClick={() => props.updateStatus('done', props.taskId)}
            >
              Done
            </button>
          </div>
        ) : (
          ''
        )}
        {props.status === 'blocked' ? (
          <div>
            <button
              type="button"
              className="btnClass mx-2 font-serif bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded"
              onClick={() => props.updateStatus('in progress', props.taskId)}
            >
              Block
            </button>
          </div>
        ) : (
          ''
        )}
      </div>
      {props.status === 'done' ? (
        <div>
          <button
            type="button"
            className="btnClass mx-2 font-serif bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded"
            onClick={() => props.updateStatus('blocked', props.taskId)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btnClass mx-2 font-serif bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded"
            onClick={deleteTask}
          >
            Delete
          </button>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default React.memo(TaskItem)
