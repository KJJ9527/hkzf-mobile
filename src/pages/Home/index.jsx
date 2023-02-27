import React, { Component } from 'react'
import { TabBar } from 'antd-mobile'
// 导入路由
import { Route,Switch } from 'react-router-dom'
// 导入样式
import './index.css'
// 导入子组件
import Index from '../Index'
import News from '../News'
import HouserList from '../HouseList'
import Profile from '../Profile'

const tabItems = [
  {
    title:'首页',
    icon: 'icon-home_light',
    path:'/home'
  },
  {
    title:'找房',
    icon: 'icon-search',
    path:'/home/list'
  },
  {
    title:'资讯',
    icon: 'icon-Message',
    path:'/home/news'
  },
  {
    title:'我的',
    icon: 'icon-mine',
    path:'/home/profile'
  },
]


export default class Home extends Component {
  state = {
    selectedTab: this.props.location.pathname
  }

  componentDidUpdate(preprops) {
    // 前一次的路由信息
    const {pathname} = preprops.location
    // 路由发生了切换
    if(pathname !== this.props.location.pathname)
    {
      this.setState({
        selectedTab: this.props.location.pathname
      })
    }
    

  }

  renderTabBarItem() {
    return tabItems.map(item => (
      <TabBar.Item
        title={item.title}
        key={item.title}
        icon={ <i className={`iconfont ${item.icon}`} /> }
        selectedIcon={ <i className={`iconfont ${item.icon}`} /> }
        selected={this.state.selectedTab === item.path}
        onPress={() => {
          this.setState({
            selectedTab: item.path,
          });
          this.props.history.push(item.path)
        }}
      />
    ))
  }

  render() {
    return (
      <div className='home'>
        {/* 渲染子路由 */}
        <Switch>
          <Route exact path='/home' component={Index}></Route>
          <Route path='/home/news' component={News}></Route>
          <Route path='/home/list' component={HouserList}></Route>
          <Route path='/home/profile' component={Profile}></Route>
          {/* <Redirect to='/home/index'/> */}
        </Switch>

        {/* tabbar */}
        <div style={{position: 'fixed',width: '100%',bottom: 0}}>
          <TabBar
            tintColor="#33A3F4"
            barTintColor="white"
            noRenderContent={true}
          >
              {this.renderTabBarItem()}
          </TabBar>
        </div>
      </div>
    )
  }
}
