import React from 'react'
import { Route,Routes } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import Dashboard from '../pages/Dashboard'
import ProtectedRoute from './ProtectedRoute'
import DashboardHome from '../pages/Dashboard/DashboardHome'
import MaterialsHome from '../pages/Materials/MaterialsHome'
import Compiler from '../pages/Compilers/Compiler'
import YearTemplate from '../pages/YearTemplate/YearTemplate'
function AppRoutes() {
  return (
    <div>
        <Routes>
            <Route path="/" element={<LoginPage></LoginPage>}></Route>
            <Route path='/dash' element={<ProtectedRoute><DashboardHome></DashboardHome></ProtectedRoute>}></Route>
            <Route path='/materials' element={<ProtectedRoute><MaterialsHome></MaterialsHome></ProtectedRoute>}></Route>
            <Route path="/compilers" element={<ProtectedRoute><Compiler /></ProtectedRoute>} />
            <Route path="/materials/:branch/:year" element={<ProtectedRoute><YearTemplate /></ProtectedRoute>} />
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
    </div>
  )
}

export default AppRoutes