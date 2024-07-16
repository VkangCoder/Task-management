import { Route, Routes } from 'react-router-dom'
import LoginPage from './pages/Login/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import AdminPage from './pages/AdminPage/AdminPage'

function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
                path="/admin/*"
                element={
                    <ProtectedRoute>
                        <AdminPage />
                    </ProtectedRoute>
                }
            />
        </Routes>
    )
}

export default App
