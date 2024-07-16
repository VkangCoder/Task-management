import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as AuthService from '../../util/validate.js'
const Logout = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const handleLogout = () => {
            AuthService.logout()
            navigate('/')
        }
        handleLogout()
    }, [navigate])

    return null
}

export default Logout
