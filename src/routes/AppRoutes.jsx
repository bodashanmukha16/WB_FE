import React from 'react'
import { Route, Routes } from 'react-router-dom'

import LoginPage from '../pages/LoginPage'
import DashboardHome from '../pages/Dashboard/DashboardHome'
import MaterialsHome from '../pages/Materials/MaterialsHome'
import Compiler from '../pages/Compilers/Compiler'
import YearTemplate from '../pages/YearTemplate/YearTemplate'
import SemTemplate from '../pages/SemTemplate/SemTemplate'
import Softwares from '../pages/Compilers/Softwares'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import Notifications from '../components/sections/Notifications'
import AIAgentDashboard from '../pages/AIAgent/AIAgentDashboard'
import ProtectedRoute from './ProtectedRoute'

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Protected Routes */}
      <Route
        path="/dash"
        element={
          <ProtectedRoute>
            <DashboardHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/materials"
        element={
          <ProtectedRoute>
            <MaterialsHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/materials/:branch/:year"
        element={
          <ProtectedRoute>
            <YearTemplate />
          </ProtectedRoute>
        }
      />

      <Route
        path="/materials/:regulation/:branch/:year/:sem"
        element={
          <ProtectedRoute>
            <SemTemplate />
          </ProtectedRoute>
        }
      />

      <Route
        path="/compilers"
        element={
          <ProtectedRoute>
            <Compiler />
          </ProtectedRoute>
        }
      />

      <Route
        path="/softwares"
        element={
          <ProtectedRoute>
            <Softwares />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ai-agent"
        element={
          <ProtectedRoute>
            <AIAgentDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  )
}

export default AppRoutes
