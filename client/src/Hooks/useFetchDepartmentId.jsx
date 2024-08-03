import { useEffect, useState } from 'react'
import * as AuthService from '../util/validate.js'

const useFetchDepartmentId = () => {
    const [departmentIds, setDepartmentIds] = useState([])

    useEffect(() => {
        const fetchDepartments = async () => {
            if (!AuthService.Authenticated()) {
                console.error('User is not authenticated.')
                return
            }
            try {
                const token = localStorage.getItem('accessToken')
                const response = await fetch(
                    `https://task-management-be-ssq1.onrender.com/v1/departments/getAllListIdDepartments`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `${token}`,
                        },
                    }
                )
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                const data = await response.json()
                if (data && Array.isArray(data.metadata)) {
                    setDepartmentIds(data.metadata)
                    console.log(data.metadata)
                } else {
                    console.error(
                        'Expected an array of department, but received:',
                        data
                    )
                }
            } catch (error) {
                console.error('Error fetching department:', error)
            }
        }

        fetchDepartments()
    }, [])

    return departmentIds
}

export default useFetchDepartmentId
