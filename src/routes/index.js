import { Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import Search from '../pages/Search'
import News from '../pages/News'
import Mine from '../pages/Mine'
import Map from '../pages/Map'
import CityList from '../pages/CityList'
export const routes = [
  {
    path: '/Home',
    element: <Home />,
  },
  {
    path: '/Search',
    element: <Search />,
  },
  {
    path: '/News',
    element: <News />,
  },
  {
    path: '/Mine',
    element: <Mine />,
  },
  {
    path: '/Map',
    element: <Map />,
  },
  {
    path: '/CityList',
    element: <CityList />,
  },
  {
    path: '/',
    element: <Navigate to="/home" />,
  },
]
