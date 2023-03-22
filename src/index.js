import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import 'react-virtualized/styles.css'
import './index.scss'
// 设置移动端适配
document.documentElement.style.fontSize = 100 / 750 + 'vw'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
