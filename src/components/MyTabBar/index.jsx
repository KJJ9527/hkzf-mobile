import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { TabBar } from 'antd-mobile'
import '../../tools/fonts/iconfont.css'
import './index.scss'
const MyTabBar = () => {
  const navigate = useNavigate()
  // 获取当前路由路径
  const location = useLocation()
  const { pathname } = location
  const tabs = [
    {
      key: '/home',
      title: '首页',
      icon: <i className="iconfont icon-home_light" />,
    },
    {
      key: '/search',
      title: '找房',
      icon: <i className="iconfont icon-search" />,
    },
    {
      key: '/news',
      title: '资讯',
      icon: <i className="iconfont icon-Message" />,
    },
    {
      key: '/mine',
      title: '我的',
      icon: <i className="iconfont icon-mine2" />,
    },
  ]
  return (
    <>
      <TabBar activeKey={pathname} onChange={(value) => navigate(value)}>
        {tabs.map((item) => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </TabBar>
    </>
  )
}
export default MyTabBar
