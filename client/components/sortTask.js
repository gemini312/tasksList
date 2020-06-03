import React from 'react'
import { Link } from 'react-router-dom'

const SortTasks = (props) => {
  return (
    <div className="days mx-6 font-serif text-2xl font-mono text-teal-900 text-center">
      <span className="mr-4	text-purple-900 shadow-lg">
        <Link to={`/${props.category}/day`}>Day</Link>
      </span>
      <span className="mr-4	text-purple-800 shadow-lg">
        <Link to={`/${props.category}/week`}>Week</Link>
      </span>
      <span className="mr-4	text-purple-700 shadow-lg">
        <Link to={`/${props.category}/month`}>Month</Link>
      </span>
      <span className="mr-4	text-purple-600 shadow-lg">
        <Link to={`/${props.category}`}>All</Link>
      </span>
    </div>
  )
}

export default SortTasks
