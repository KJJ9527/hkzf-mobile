import { useEffect } from 'react'
import { Toast } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import MyNavBar from '../../components/MyNavBar'
import './index.scss'
import axios from 'axios'

const Map = () => {
  const BMapGL = window.BMapGL
  const navigate = useNavigate()
  useEffect(() => {
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
          // 获取数据
          const res = await axios.get(
            `http://localhost:8080/area/map?id=${value}`
          )
          // 遍历数据
          res.data.body.forEach((item) => {
            const {
              count,
              label: areaName,
              coord: { latitude, longitude },
            } = item
            // 创建标注
            const content = `${areaName}-${count}套`
            const label = new BMapGL.Label(content, {
              // 创建文本标注
              position: new BMapGL.Point(latitude, longitude),
              offset: new BMapGL.Size(-35, -35),
            })
            map.addOverlay(label) // 将标注添加到地图中
            label.setStyle({
              // 设置label的样式
              color: '#000',
              fontSize: '30px',
              border: '1px solid #1E90FF',
            })
            label.addEventListener('click', function () {
              alert('您点击了标注')
            })
          })
        } else {
          Toast.show({
            icon: 'fail',
            content: '您选择的地址没有解析到结果！',
            afterClose: () => {
              navigate(-1)
            },
          })
        }
      },
      label
    )
  }, [])
  return (
    <>
      <MyNavBar>地图</MyNavBar>
      <div id="container"></div>
    </>
  )
}
export default Map
