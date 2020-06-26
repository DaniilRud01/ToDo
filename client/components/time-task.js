import React from 'react'
import { Link } from 'react-router-dom'
import '../assets/scss/main.scss'

const TimeTask = (props) => {
  return (
    <div className="flex time-nav">
      <ul>
        <li className="nav">
          <Link to="/">Back</Link>
        </li>
      </ul>
      <ul>
        <li className="nav">
          <Link to={`/${props.category}`}>All</Link>
        </li>
      </ul>
      <ul>
        <li className="nav">
          {' '}
          <Link to={`/${props.category}/day`}>Day</Link>
        </li>
      </ul>
      <ul>
        <li className="nav">
          <Link to={`/${props.category}/week`}>Week</Link>
        </li>
      </ul>
      <ul>
        <li className="nav">
          <Link to={`/${props.category}/month`}>Month</Link>
        </li>
      </ul>
    </div>
  )
}
export default TimeTask
