import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { MedicinesProvider } from './context/MedicinesContext'
import { InvoicesProvider } from './context/InvoicesContext'
import MainLayout from './layout/MainLayout'
import Dashboard from './pages/Dashboard'
import Medicines from './pages/Medicines'
import MedicineDetails from './pages/MedicineDetails'
import AddMedicine from './pages/AddMedicine'
import EditMedicine from './pages/EditMedicine'
import PurchaseEntry from './pages/PurchaseEntry'
import Billing from './pages/Billing'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Suppliers from './pages/Suppliers'
import ExpiryAlerts from './pages/ExpiryAlerts'
import Login from './pages/Login'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="medicines" element={<Medicines />} />
        <Route path="medicines/add" element={<AddMedicine />} />
        <Route path="medicines/edit/:id" element={<EditMedicine />} />
        <Route path="medicines/:id" element={<MedicineDetails />} />
        <Route path="purchase-entry" element={<PurchaseEntry />} />
        <Route path="billing" element={<Billing />} />
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="expiry-alerts" element={<ExpiryAlerts />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MedicinesProvider>
          <InvoicesProvider>
            <AppRoutes />
          </InvoicesProvider>
        </MedicinesProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
