import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FlipMove from 'react-flip-move'
import ReactShadowScroll from 'react-shadow-scroll'
import TaskItem from './taskItem'
import './main.scss'
import SortTasks from './sortTask'

const CategoryView = (props) => {
  const [newTasks, setNewTasks] = useState('')
  return (
    <div className="categoryView relative">
      <SortTasks category={props.category} />
      <ReactShadowScroll>
        <FlipMove
          typeName="ul"
          appearAnimation="fade"
          enterAnimation="fade"
          leaveAnimation="fade"
          className="flex flex-col px-3 rounded-lg shadow-xl"
        >
          {props.taskList.map((el) => (
            <li
              key={el.title}
              className="my-3 ml-5  order-last font-serif text-xl text-blue-1000 shadow-lg"
            >
              <TaskItem
                title={el.title}
                status={el.status}
                taskId={el.taskId}
                updateStatus={props.updateStatus}
                taskNameUpdate={props.taskNameUpdate}
                taskDelete={props.taskDelete}
              />
            </li>
          ))}
        </FlipMove>
      </ReactShadowScroll>

      <div className="inputClass px-2 py-2 ">
        <input
          onKeyPress={(ev) => {
            if (ev.key === 'Enter') {
              props.addTasks(newTasks)
            }
          }}
          type="text"
          id="input-field"
          className="text-black bg-red-200 placeholder-blue-500 focus:outline-none focus:shadow-outline border border-gray-300 py-1 px-1 rounded-full appearance-none leading-normal"
          onChange={(e) => setNewTasks(e.target.value)}
          value={newTasks}
          placeholder="type"
        />
        <button
          type="button"
          className="btnClass mx-2 font-serif bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded"
          onClick={() => props.addTasks(newTasks)}
        >
          Add
        </button>
        <Link to="/">
          <button
            type="button"
            className="btnClass mx-2 font-serif bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded"
          >
            Back
          </button>
        </Link>
      </div>
      {props.alert && <div className="titlee">{props.alert}</div>}
    </div>
  )
}

export default CategoryView
