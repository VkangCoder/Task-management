import { Navigate } from 'react-router-dom'

// eslint-disable-next-line react/prop-types
function ProtectedRoute({ children }) {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
        return <Navigate to="/" replace />
    }
    return <>{children}</>
}

export default ProtectedRoute
