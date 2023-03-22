import { useRoutes } from 'react-router-dom'
import { routes } from './routes'
const App = () => {
  const element = useRoutes(routes)
  return (
    <div className="App">{element}</div>
    // 注册路由
  )
}
export default App
