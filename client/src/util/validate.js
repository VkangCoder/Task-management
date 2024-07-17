// Auth Service
const API_URL = 'https://task-management-be-ssq1.onrender.com/v1/auth/login'
// const userUrl  = ""

export const login = async (email, password) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })

        if (response.status === 200) {
            const jsonResponse = await response.json()
            localStorage.setItem(
                'accessToken',
                jsonResponse.metadata.accessToken
            )
            localStorage.setItem(
                'refreshToken',
                jsonResponse.metadata.refreshToken
            )
            return true
        } else {
            alert('Thông tin đăng nhập không đúng')
            return false
        }
    } catch (error) {
        console.error('Có lỗi xảy ra!', error)
        return false
    }
}

export const Authenticated = () => {
    const token = localStorage.getItem('accessToken')
    return !!token
}

// export const AuthenticatedUser = () => {
//     const token = localStorage.getItem('accessToken')
//     return !!token
// }

// export const user = () => {

// }

export const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
}
