import './App.css'
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom'
import Reg from './reg/Reg'
import Log from './auth/Auth'
import { useSelector } from 'react-redux'
import MainPage from './pages/Main'
import OrderAdd from './pages/order_add'
import Profile from './pages/profile'
import AdminMain from './pages/admin_page'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/reg" />
  },
  {
    path: '/reg',
    element: <Reg />
  },
  {
    path: '/auth',
    element: <Log />
  },
  {
    path: '*',
    element: <Navigate to="/reg" />
  },
])

const authRouter = createBrowserRouter([
  {
    path: '/',
    element: <OrderAdd/>
  },
  {
    path: '/profile',
    element: <Profile/>
  },
  {
    path: '/reg',
    element: <Navigate to="/" />
  },
  {
    path: '/auth',
    element: <Navigate to="/" />
  },
  {
    path: '/logOut',
    element: <MainPage/>
  },
  {
    path: '*',
    element: <Navigate to="/" />
  },
])

const authRouterAdmin = createBrowserRouter([
  {
    path: '/',
    element: <AdminMain />
  },
  {
    path: '/reg',
    element: <Navigate to="/" />
  },
  {
    path: '/auth',
    element: <Navigate to="/" />
  },
  {
    path: '/logOut',
    element: <MainPage/>
  },
  {
    path: 'admin',
    element: <>admin</>
  },
  {
    path: '*',
    element: <Navigate to="/" />
  },
])


function App() {
  const token = useSelector((state) => state.auth.token)
  const role = useSelector((state) => state.auth.role)

  console.log(token);

  return (
    token ? role === "ADMIN" ? <RouterProvider router={authRouterAdmin} /> : <RouterProvider router={authRouter} /> :
    <RouterProvider router={router} />
  )
}

export default App
