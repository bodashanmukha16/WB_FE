import React from 'react'
import { Route,Routes } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import Dashboard from '../pages/Dashboard'
import ProtectedRoute from './ProtectedRoute'
import DashboardHome from '../pages/Dashboard/DashboardHome'

function AppRoutes() {
  return (
    <div>
        <Routes>
            <Route path="/" element={<LoginPage></LoginPage>}></Route>
            <Route path='/dash' element={<ProtectedRoute><DashboardHome></DashboardHome></ProtectedRoute>}></Route>
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
    </div>
  )
}

export default AppRoutes