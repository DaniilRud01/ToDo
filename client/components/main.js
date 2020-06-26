import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../assets/scss/main.scss'

const Main = (props) => {
  const [newCategory, setNewCategory] = useState('')
  const [search, setSearch] = useState('')
  const filtered = props.categoryes.filter((el) => el.includes(search))
  return (
    <div className="main">
      <div className="search-input">
        <input
          type="text"
          className="search"
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {filtered.map((el) => (
        <div className="main-nav" key={el}>
          <Link to={`${el}`}>{el}</Link>
        </div>
      ))}
      <div className="add-category">
        <input
          type="text"
          placeholder="Enter name category"
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button type="button" onClick={() => props.addCategory(newCategory)}>
          Add
        </button>
      </div>
    </div>
  )
}

export default Main
