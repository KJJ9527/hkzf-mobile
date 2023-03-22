import axios from 'axios'
// 1 在utils目录中，新建目录.
// 2.创建并导出获取定位城市的函数

export const getCurrentCity = () => {
  // 3.判断 localstorage中是否有该城市
  const localCity = JSON.parse(localStorage.getItem('hkzf_city'))
  // 4.如果没有，存储到本地存储中，然后返回该城市数据
  if (!localCity) {
    return new Promise((resolve, reject) => {
      // 创建实例实例对象
      const myCity = new window.BMapGL.LocalCity()
      myCity.get(async (res) => {
        try {
          const result = await axios.get(
            `http://localhost:8080/area/info?name=${res.name}`
          )
          // 存储到本地localStorage
          localStorage.setItem('hkzf_city', JSON.stringify(result.data.body))
          // 返回该城市数据
          resolve(result.data.body)
        } catch (e) {
          // 获取定位城市失败
          reject(e)
        }
      })
    })
  } else {
    // 5.如果有，直接返回本地存储中的城市数据
    // 注意：因为上面为了处理异步操作，使用了Promise，因此，为了该函数返回值的统一，此处，也应该使用Promise
    // 因为此处的Promise不会失败，所以此处只要返回一个成功的Promise即可
    return Promise.resolve(localCity)
  }
}
