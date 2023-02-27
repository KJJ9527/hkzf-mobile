import {createRoot} from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

// 导入antd-mobile的样式
import 'antd-mobile/dist/antd-mobile.css'
// 导入index.css
import './index.css'
// 导入字体图标
import './assets/iconfont/iconfont.css'

const root = createRoot(document.getElementById('root'))
root.render(<BrowserRouter><App/></BrowserRouter>)
