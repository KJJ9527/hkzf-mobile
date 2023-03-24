import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { List, AutoSizer } from 'react-virtualized'
import { Toast } from 'antd-mobile'
import axios from 'axios'
import MyNavBar from '../../components/MyNavBar'
import './index.scss'
import { getCurrentCity } from '../../utils'

const http = axios.create({
  baseURL: 'http://localhost:8080/area',
})
// 转换字母格式
const formatLetter = (letter) => {
  switch (letter) {
    case '#':
      return '当前城市'
    case 'hot':
      return '热门城市'
    default:
      return letter.toUpperCase()
  }
}
// 有数据的城市列表
const MsgCity = ['北京', '广州', '上海', '深圳']

const CityList = () => {
  // 城市列表
  const [cityList, setCityList] = useState({})
  // 右侧索引
  const [cityIndex, setCityIndex] = useState([])
  // 索引选中状态
  const [isActive, setIsActive] = useState(0)
  // 路由导航
  const navigate = useNavigate()
  // 创建List组件的ref对象
  const cityListComponent = useRef(null)
  useEffect(() => {
    getCityData()
  }, [])
  // 城市列表
  const getCityData = async () => {
    const res = await http.get('/city?level=1')
    const cityListBody = res.data.body
    const { cityList, cityIndex } = formatCityList(cityListBody)
    // 1.获取热门城市数据
    const hotRes = await http.get('/hot')
    // 2.将数据添加到 cityList中
    cityList['hot'] = hotRes.data.body
    // 3.将索引添加到cityIndex中
    cityIndex.unshift('hot')
    // 获取当前定位城市
    const currentCity = await getCurrentCity()
    // 注意应存入数组格式
    cityList['#'] = [currentCity]
    cityIndex.unshift('#')
    setCityList(cityList)
    setCityIndex(cityIndex)
  }
  // 调用 measureAllRows，提前计算 List 中每一行的高度，实现 scrollToRow的精确跳转
  // 注意：调用这个方法的时候，需要保证List组件中已经有数据了!如果组件中的数据为空，就会调用方法报错
  // 解决：保证 measureAllRows 方法是在获取到数据之后调用
  // cityListComponent.current.measureAllRows()
  // 待优化，
  setTimeout(() => {
    cityListComponent.current.measureAllRows()
  }, 2000)

  // 响应回的数据，格式化
  const formatCityList = (list) => {
    // 接口返回的数据格式
    // [{label: '北京', value: 'AREA|88cff55c-aaa4-e2e0', pinyin: 'beijing', short: 'bj'}]
    // 渲染城市列表的数据格式为：
    // {a:[{},{}],b:[{},...]}
    // 渲染右侧索引的数据格式为：
    // ['a','b']
    const cityList = {}
    // 遍历原数组
    list.forEach((item) => {
      // 2.获取每一个城市的首字母
      const first = item.short.substr(0, 1)
      // 3.判断 cityList中是否有该分类
      if (cityList[first]) {
        // 4.如果有，直接往该分类中push数据
        cityList[first].push(item)
      } else {
        // 如果没有，就先创建一个数组，然后把当前城市信息添加到数组中
        cityList[first] = [item]
      }
    })
    // 获取索引数据
    const cityIndex = Object.keys(cityList).sort()
    return {
      cityList,
      cityIndex,
    }
  }

  // 左侧城市列表
  // 渲染每行的函数
  const rowRenderer = ({
    key, // Unique key within array of rows
    index, // 当前项下标
    isScrolling, // 当前项是否滚动
    isVisible, // 当前项是否可见
    style, // 样式
  }) => {
    // 获取每一项的索引
    const letter = cityIndex[index]
    // 渲染城市列表
    const renderCityList = () => {
      return cityList[letter].map((item) => (
        <div
          className="name"
          key={item.value}
          onClick={() => {
            onChangeCity(item)
          }}
        >
          {item.label}
        </div>
      ))
    }
    return (
      <div key={key} style={style} className="city">
        {/* 标题 */}
        <div className="title">{formatLetter(letter)}</div>
        {/* 城市列表 */}
        {renderCityList()}
      </div>
    )
  }
  // 设置标题和行高，动态计算城市列表的高度
  const TITLE_HEIGHT = 40
  const NAME_HEIGHT = 52
  // 设置动态的每一行高度
  const getRowHeight = ({ index }) => {
    // 当前行高度 = 标题高度 + 城市数量 * 城市名称
    // TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
    return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
  }
  // 切换城市的回调
  const onChangeCity = ({ label, value }) => {
    if (MsgCity.indexOf(label) !== -1) {
      // 不等于-1说明label在数组数据中,将该城市信息，返回数据存入localstoreage中
      localStorage.setItem('hkzf_city', JSON.stringify({ label, value }))
      // 返回上一级
      navigate(-1)
    } else {
      Toast.show({
        content: '暂无该城市信息',
      })
    }
  }
  // 右侧索引
  const renderCityIndex = () => {
    return cityIndex.map((item, index) => (
      <li
        className="city-index-item"
        key={item}
        onClick={() => {
          cityListComponent.current.scrollToRow(index)
        }}
      >
        <span className={index === isActive ? 'index-active' : ''}>
          {item === 'hot' ? '热' : item.toUpperCase()}
        </span>
      </li>
    ))
  }
  // 更新active状态
  const onRowsRendered = ({ startIndex }) => {
    if (startIndex !== isActive) {
      setIsActive(startIndex)
    }
  }
  return (
    <div className="CityList">
      <MyNavBar>城市选择</MyNavBar>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            rowCount={cityIndex.length}
            rowHeight={getRowHeight}
            rowRenderer={rowRenderer}
            width={width}
            onRowsRendered={onRowsRendered}
            scrollToAlignment="start"
            ref={cityListComponent}
          />
        )}
      </AutoSizer>
      {/* 右侧索引列表 */}
      <ul className="city-index">{renderCityIndex()}</ul>
    </div>
  )
}
export default CityList
