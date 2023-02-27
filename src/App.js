import React, { Component } from 'react'
import {Route,Switch,Redirect } from 'react-router-dom'
import Home from './pages/Home'
import citylist from './pages/CityList'

export default class App extends Component {
  render() {
    return (
      <div>
        {/* 注册路由 */}
        <Switch>
          <Route path='/home' component={Home}/>
          <Route path='/citylist' component={citylist}/>
          <Route exact path='/' render={() => <Redirect to='/home'/>}/>
        </Switch>
      </div>
    )
  }
}
