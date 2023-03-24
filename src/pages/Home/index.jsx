import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Swiper, Grid } from 'antd-mobile'
import MyNavigate from '../../components/MyNavigate'
import MyTabBar from '../../components/MyTabBar'
import './index.scss'

// 导入图片
import nav1 from '../../tools/images/nav-1.png'
import nav2 from '../../tools/images/nav-2.png'
import nav3 from '../../tools/images/nav-3.png'
import nav4 from '../../tools/images/nav-4.png'

// 接口公共路径
const http = axios.create({
  baseURL: 'http://localhost:8080/home',
})
// 导航菜单数据
const navMenuList = [
  {
    key: '/home',
    title: '整租',
    imgSrc: nav1,
  },
  {
    key: '/search',
    title: '合租',
    imgSrc: nav2,
  },
  {
    key: '/map',
    title: '地图找房',
    imgSrc: nav3,
  },
  {
    key: '/mine',
    title: '去出租',
    imgSrc: nav4,
  },
]
const Home = () => {
  const navigate = useNavigate()
  useEffect(() => {
    // 获取当前位置
    const currentData = JSON.parse(localStorage.getItem('hkzf_city'))
    const getHomeData = async () => {
      //获取轮播图
      const wiperRes = await http.get('/swiper')
      const swiperData = wiperRes.data.body
      setSwiperList(swiperData)
      // 获取租房小组
      const rentTeamRes = await http.get(`/groups?area=${currentData.value}`)
      const rentTeamData = rentTeamRes.data.body
      setRentTeamList(rentTeamData)
      // 获取最新资讯
      const newsRes = await http.get(`/news?area=${currentData.value}`)
      const NewsData = newsRes.data.body
      setNewsList(NewsData)
    }
    getHomeData()
  }, [])
  const [swiperList, setSwiperList] = useState([])
  const [rentTeamList, setRentTeamList] = useState([])
  const [newsList, setNewsList] = useState([])
  // 渲染轮播图
  const renderSwiper = () => {
    return swiperList.map((item) => (
      <Swiper.Item key={item.id}>
        <div className="content">
          <img alt="" src={`http://localhost:8080${item.imgSrc}`} />
        </div>
      </Swiper.Item>
    ))
  }
  // 渲染导航菜单
  const renderNavMenu = () => {
    return navMenuList.map((item) => (
      <div key={item.key} onClick={() => toNavMenu(item.key)}>
        <img alt="" src={item.imgSrc} />
        <span>{item.title}</span>
      </div>
    ))
  }
  // 渲染租房小组
  const renderRentTeam = () => {
    return rentTeamList.map((item) => (
      <Grid.Item key={item.id}>
        <div className="grid-item">
          <div className="leftwrapper">
            <div className="title">{item.title}</div>
            <div className="desc">{item.desc}</div>
          </div>
          <div>
            <img alt="" src={`http://localhost:8080${item.imgSrc}`} />
          </div>
        </div>
      </Grid.Item>
    ))
  }
  // 渲染最新资讯
  const renderNews = () => {
    return newsList.map((item) => (
      <div key={item.id} className="news">
        <div className="leftwrapper">
          <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
        </div>
        <div className="rightwrapper">
          <div className="title">
            <p>{item.title}</p>
          </div>
          <div className="bottomwrapper">
            <span className="from">{item.from}</span>
            <span className="date">{item.date}</span>
          </div>
        </div>
      </div>
    ))
  }
  // 跳转路由
  const toNavMenu = (key) => navigate(key)
  return (
    <>
      {/* 顶部导航 */}
      <MyNavigate />
      {/* 轮播图 */}
      <Swiper loop autoplay>
        {renderSwiper()}
      </Swiper>
      {/* 导航菜单 */}
      <div className="navMenu">{renderNavMenu()}</div>
      {/* 租房小组 */}
      <div className="rentTeam">
        <div className="navtitle">
          <p>租房小组</p>
          <p>更多</p>
        </div>
        <Grid columns={2} gap={18}>
          {renderRentTeam()}
        </Grid>
      </div>
      {/* 最新资讯 */}
      <div className="newmessage">
        <div className="navtitle">
          <p>最新资讯</p>
        </div>
        <div className="newswrapper">{renderNews()}</div>
      </div>
      {/* 标签栏 */}
      <MyTabBar />
    </>
  )
}
export default Home
