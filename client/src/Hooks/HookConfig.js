import { useState, useEffect } from 'react'

export function useDepartmentData() {
    const [departments, setDepartments] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchDepartments() {
            setLoading(true)
            try {
                const response = await fetch(
                    `https://task-management-be-ssq1.onrender.com/v1/departments/getAllListIdDepartments`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                'accessToken'
                            )}`,
                        },
                    }
                )
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                const data = await response.json()
                setDepartments(data.metadata || [])
            } catch (error) {
                setError(error)
                console.error('Failed to fetch departments', error)
            } finally {
                setLoading(false)
            }
        }

        fetchDepartments()
    }, [])

    return { departments, loading, error }
}

export function useUserData(departmentId) {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!departmentId) return

        async function fetchUsers() {
            setLoading(true)
            try {
                const response = await fetch(
                    `https://task-management-be-ssq1.onrender.com/v1/users/getAllUsersByDepartmentId?filterField=department_id&operator==&value=${departmentId}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                'accessToken'
                            )}`,
                        },
                    }
                )
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                const data = await response.json()
                setUsers(data.metadata || [])
            } catch (error) {
                setError(error)
                console.error('Failed to fetch users', error)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [departmentId])

    return { users, loading, error }
}
