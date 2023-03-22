import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { NavBar } from 'antd-mobile'
import './index.scss'
const MyNavBar = ({children}) => {
  const navigate = useNavigate()
  const back = () => {
    navigate(-1)
  }
  return (
    <>
      <NavBar className="navbar" onBack={back}>
        {children}
      </NavBar>
    </>
  )
}
MyNavBar.propTypes = {
  children: PropTypes.string.isRequired,
}
export default MyNavBar
