import { useEffect, useState } from 'react'
import * as AuthService from '../util/validate'

const useFetchTaskTypes = (departmentId, isVisible) => {
    const [taskTypesId, setTaskTypesId] = useState([])

    useEffect(() => {
        const fetchTaskTypes = async () => {
            if (!isVisible || !departmentId) {
                console.error('No department ID provided.')
                return
            }

            if (!AuthService.Authenticated()) {
                console.error('User is not authenticated.')
                return
            }
            try {
                const token = localStorage.getItem('accessToken')
                const response = await fetch(
                    `https://task-management-be-ssq1.onrender.com/v1/taskType/getAllTask_Type?filterField=department_id&operator==&value=${departmentId}`,
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
                    setTaskTypesId(data.metadata)
                    console.log(data.metadata)
                } else {
                    console.error(
                        'Expected an array of task type, but received:',
                        data
                    )
                }
            } catch (error) {
                console.error('Error fetching task type:', error)
            }
        }

        fetchTaskTypes()
    }, [departmentId, isVisible])

    return taskTypesId
}

export default useFetchTaskTypes
