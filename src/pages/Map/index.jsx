import { useEffect, useState } from 'react'
import { Toast } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import MyNavBar from '../../components/MyNavBar'
import './index.scss'
const http = axios.create({
  baseURL: 'http://localhost:8080/area',
})
const BMapGL = window.BMapGL
const Map = () => {
  const navigate = useNavigate()
  const [houseList, setHouseList] = useState([])
  const [isShowList, setIsShowList] = useState(false)
  useEffect(() => {
    initMap()
  }, [])

  // 初始化地图
  const initMap = () => {
    // 拿到当前的位置
    const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))
    // 初始化地图实例对象
    const map = new BMapGL.Map('container')
    //创建地址解析器实例
    const myGeo = new BMapGL.Geocoder()
    myGeo.getPoint(
      label,
      async (point) => {
        if (point) {
          // 初始化地图
          map.centerAndZoom(point, 11)
          // 添加控件
          map.addControl(new BMapGL.ScaleControl()) // 添加比例尺控件
          map.addControl(new BMapGL.ZoomControl()) // 添加缩放控件
          // 渲染覆盖物入口
          renderOverlays(value)
        } else {
          Toast.show({
            icon: 'fail',
            content: '您选择的地址没有解析到结果！',
          })
        }
      },
      label
    )
    map.addEventListener('movestart', () => {
      setIsShowList(false)
    })

    // 渲染覆盖物入口
    // 1.接收区域id参数，获取该区域下的房源信息
    // 2.获取房源类型以及下级地图缩放级别
    const renderOverlays = async (id) => {
      try {
        Toast.show({
          icon: 'loading',
          content: '加载中…',
          duration: 0,
        })
        const res = await http.get(`/map?id=${id}`)
        Toast.clear()
        const data = res.data.body
        // 调用 getTypeAndZoom获取当前缩放级别
        const { nextZoom, type } = getTypeAndZoom()
        data.forEach((item) => {
          // 创建覆盖物
          createOverlays(item, nextZoom, type)
        })
      } catch (e) {
        Toast.clear()
      }
    }
    // 计算要绘制的覆盖物类型和下一个缩放级别
    // 区   ->11,范围 >=10, <12
    // 镇   ->13,范围 >=12, <14
    // 小区   ->15,范围 >=14, <16
    const getTypeAndZoom = () => {
      // 调用地图的 getZoom() 方法，来获取当前缩放级别
      const zoom = map.getZoom()
      let nextZoom = null,
        type = null
      if (zoom >= 10 && zoom < 12) {
        // 下一个缩放级别
        nextZoom = 13
        // 区，镇的覆盖物
        type = 'circle'
      } else if (zoom >= 12 && zoom < 14) {
        // 镇
        nextZoom = 15
        type = 'circle'
      } else if (zoom >= 14 && zoom < 16) {
        // 小区
        type = 'rect'
      }
      return {
        nextZoom,
        type,
      }
    }
    // 创建覆盖物
    const createOverlays = (data, zoom, type) => {
      const {
        count,
        label: areaName,
        coord: { longitude, latitude },
        value,
      } = data
      const areaPoint = new BMapGL.Point(longitude, latitude)
      if (type === 'circle') {
        // 区和镇
        createCircle(areaPoint, areaName, count, value, zoom)
      } else {
        // 小区
        createRect(areaPoint, areaName, count, value)
      }
    }
    // 创建区，镇覆盖物
    const createCircle = (point, name, count, id, zoom) => {
      // 创建标注
      const content = `${name}${count}套`
      const label = new BMapGL.Label(content, {
        // 创建文本标注，注意坐标
        position: point,
        offset: new BMapGL.Size(-35, -35),
      })
      label.setStyle({
        // 设置label的样式
        backgroundColor: 'red',
        color: '#fff',
        fontSize: '30rem',
        border: '1px solid #1E90FF',
      })
      label.addEventListener('click', () => {
        // 调用 renderOverlays 方法，获取该区域下的数据
        renderOverlays(id)
        // 重新定位和缩放
        map.centerAndZoom(point, zoom)
        // 清除老的标注
        map.clearOverlays()
      })
      // 将标注添加到地图中
      map.addOverlay(label)
    }
    // 创建小区覆盖物
    const createRect = (point, name, count, id) => {
      // 创建标注
      const content = `${name}${count}套`
      const label = new BMapGL.Label(content, {
        // 创建文本标注，注意坐标
        position: point,
        offset: new BMapGL.Size(-30, -25),
      })
      label.setStyle({
        // 设置label的样式
        backgroundColor: '#bfa',
        color: '#fff',
        fontSize: '20rem',
        border: '1px solid #1E90FF',
      })
      label.addEventListener('click', (e) => {
        getHousesList(id)
        // 获取当前被点击项
        const target = e.domEvent.changedTouches[0]
        map.panBy(
          window.innerWidth / 2 - target.clientX,
          (window.innerHeight - 330) / 2 - target.clientY
        )
      })
      // 将标注添加到地图中
      map.addOverlay(label)
    }
    // 获取小区房源数据
    const getHousesList = async (id) => {
      try {
        Toast.show({
          icon: 'loading',
          content: '加载中…',
          duration: 0,
        })
        const res = await axios.get(`http://localhost:8080/houses?cityId=${id}`)
        Toast.clear()
        setHouseList(res.data.body.list)
        setIsShowList(true)
      } catch (e) {
        Toast.clear()
      }
    }
  }

  // 渲染房源列表
  const renderHouseList = () => {
    return houseList.map((item) => (
      <div className="content" key={item.houseCode}>
        <div className="right">
          <img src={`http://localhost:8080${item.houseImg}`} alt="" />
        </div>
        <div className="left">
          <div className="title">{item.title}</div>
          <div className="desc">{item.desc}</div>
          <div className="tags">{item.tags.map((item) => item)}</div>
          <div className="price">
            <span>{item.price}</span>元/月
          </div>
        </div>
      </div>
    ))
  }
  const toSearch = () => navigate('/search')
  return (
    <>
      {/* 顶部导航栏组件 */}
      <MyNavBar>地图</MyNavBar>
      {/* 地图容器 */}
      <div id="container"></div>
      {/* 房源列表 */}
      <div className={`cityListwrapper ${isShowList ? 'showList' : ''}`}>
        {/* 头部 */}
        <div className="header">
          <p>房屋列表</p>
          <button onClick={toSearch}>更多房源</button>
        </div>
        <div className="contentwrapper">{renderHouseList()}</div>
        {/* 内容 */}
      </div>
    </>
  )
}
export default Map
