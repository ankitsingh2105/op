import React from 'react'
import "./index.css"
import { Link } from 'react-router-dom'
export default function Navbar() {
  return (
    <>
        <nav>
          <ul>
            <Link to="/" ><li>Home</li></Link>
            <Link to="/login" ><li>Sign In</li></Link>
          </ul>
        </nav>
    </>
  )
}
