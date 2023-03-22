import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.scss'
import '../../tools/fonts/iconfont.css'
import { getCurrentCity } from '../../utils'

const MyNavigate = () => {
  // 页面加载时获取当前城市位置
  useEffect(() => {
    const loadData = async () => {
      const CrueentCity = await getCurrentCity()
      setCurrentCity(CrueentCity.label)
    }
    loadData()
  }, [])
  const navigate = useNavigate()
  const [currentCity, setCurrentCity] = useState('北京')
  const toMap = () => {
    navigate('/map')
  }
  const getCityList = () => {
    navigate('/citylist', {
      state: { currentCity },
    })
  }
  return (
    <div className="navwrapper">
      {/* 我的位置 */}
      <div className="mylocation" onClick={getCityList}>
        <span className="address">{currentCity}</span>
        <i className="iconfont icon-bottom" />
      </div>
      {/* 搜索框 */}
      <div className="search">
        <i className="iconfont icon-search " />
        <input type="text" placeholder="请输入要查找的房源" />
      </div>
      {/* 地图 */}
      <div className="map" onClick={toMap}>
        <i className="iconfont icon-location" />
        <div id="container"></div>
      </div>
    </div>
  )
}
export default MyNavigate
