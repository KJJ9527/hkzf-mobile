import React, { Component } from 'react'
import { Carousel,Flex,Grid } from 'antd-mobile'
import axios from 'axios';
// 引入样式
import './index.css'
// 引入图片
import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'
// nav数据
const navs = [
  {
    id:1,
    img:nav1,
    title:'整租',
    path:'/home/list'
  },
  {
    id:2,
    img:nav2,
    title:'合租',
    path:'/home/list'
  },
  {
    id:3,
    img:nav3,
    title:'地图找房',
    path:'/map'
  },
  {
    id:4,
    img:nav4,
    title:'去出租',
    path:'/rent'
  },
]


export default class Index extends Component {
  state = {
    // 轮播图
    swipers:[],
    isSwiperLoading: false,
    // 租房小组
    groups :[],
    // 最新资讯
    news:[],
  }
  // 轮播图接口
  async getSwipers() {
    const res = await axios.get('http://localhost:8080/home/swiper')
    const {body} = res.data
    this.setState({
      swipers:body,
      isSwiperLoading: true
    })
  }
  // 租房小组接口
  async getGroups() {
    const res = await axios.get('http://localhost:8080/home/groups?area=AREA%7C88cff55c-aaa4-e2e0')
    const {body} = res.data
    this.setState({groups:body})
  }
  // 最新资讯接口
  async getNews() {
    const res = await axios.get('http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0')
    const {body} = res.data
    this.setState({news:body})
  }
  componentDidMount() {
    // 播放轮播图
    this.getSwipers()
    // 租房小组
    this.getGroups()
    // 最新资讯
    this.getNews()
  }
  // 渲染轮播图结构
  renderSwipers() {
    const {swipers} = this.state
    return swipers.map(item => (
      <a
        key={item.id}
        href="#"
        style={{ display: 'inline-block', width: '100%', height: 212 }}
      >
        <img
          src={`http://localhost:8080${item.imgSrc}`}
          alt=""
          style={{ width: '100%', verticalAlign: 'top' }}
        />
      </a>
    ))
  }
  // 渲染nav结构
  renderNavs() {
    return navs.map(item => (
      <Flex.Item key={item.id} onClick={() => this.props.history.push(item.path)}>
        <img src={item.img} />
        <h2>{item.title}</h2>
      </Flex.Item>
    ))
    
  }
  // 渲染最新资讯
  renderNews() {
    const {news} = this.state
    return news.map(item => (
      <Flex key={item.id}>
        <Flex.Item className='img'><img src={`http://localhost:8080${item.imgSrc}`}/></Flex.Item>
        <Flex.Item className='content'>
            <p>{item.title}</p>
            <Flex.Item className='footer'>
              <span className='source'>{item.from}</span>
              <span className='date'>{item.date}</span>
            </Flex.Item>
        </Flex.Item>
      </Flex>
    ))
    
  }
  
  render() {
    return (
      <div className='index'>
        {/* 轮播图 */}
        <div className='swiper'>
          {
            this.state.isSwiperLoading ?
            (<Carousel autoplay infinite>
              {this.renderSwipers()}
            </Carousel>) : ('')
          }
          {/* 搜索框 */}
          <Flex className="search-box">
            {/* 左侧白色区域 */}
            <Flex className="search">
              {/* 位置 */}
              <div
                className="location"
                onClick={() => this.props.history.push('/citylist')}
              >
                <span className="name">上海</span>
                <i className="iconfont icon-bottom" />
              </div>

              {/* 搜索表单 */}
              <div
                className="form"
                onClick={() => this.props.history.push('/search')}
              >
                <i className="iconfont icon-search" />
                <span className="text">请输入小区或地址</span>
              </div>
            </Flex>
            {/* 右侧地图图标 */}
            <i
              className="iconfont icon-location"
              onClick={() => this.props.history.push('/map')}
            />
          </Flex>
        </div>
        {/* 导航 */}
        <Flex className='nav'>
          {this.renderNavs()}
        </Flex>
        {/* 租房小组 */}
        <div className='group'>
          <h3 className='nav_title'>租房小组<span className='more'>更多</span></h3>
          <Grid 
          data={this.state.groups} 
          columnNum={2} 
          square={false}
          activeStyle={false}
          renderItem={(item) => (
            <Flex className='group-item' justify='around' key={item.id}>
              <div className='desc'>
                <p className='title'>{item.title}</p>
                <span className='info'>{item.desc}</span>
              </div>
              <img src={`http://localhost:8080${item.imgSrc}`} />
            </Flex>
          )}/>
        </div>
        {/* 最新资讯 */}
        <div className='news'>
          <h3 className='nav_title'>最新资讯</h3>
          {this.renderNews()}
        </div>
      </div>
    )
  }
}

