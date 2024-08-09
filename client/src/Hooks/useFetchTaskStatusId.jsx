import { useEffect, useState } from 'react'
import * as AuthService from '../util/validate.js'

const useFetchTaskStatusId = valueId => {
    const [taskStatusId, setTaskStatusId] = useState([])

    useEffect(() => {
        const fetchTaskStatusId = async () => {
            if (!AuthService.Authenticated()) {
                console.error('User is not authenticated.')
                return
            }
            try {
                const token = localStorage.getItem('accessToken')
                const response = await fetch(
                    `https://task-management-be-ssq1.onrender.com/v1/taskStatus/getAllTaskStatuss/?filterField=task_id&operator==&value=${valueId}`,
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
                    setTaskStatusId(data.metadata)
                    console.log(data.metadata)
                } else {
                    console.error(
                        'Expected an array of task id, but received:',
                        data
                    )
                }
            } catch (error) {
                console.error('Error fetching task id:', error)
            }
        }

        fetchTaskStatusId()
    }, [valueId])

    return taskStatusId
}

export default useFetchTaskStatusId
