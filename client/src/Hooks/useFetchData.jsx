import { useState, useEffect, useCallback } from 'react'
import * as AuthService from '../../util/validate.js'

function useFetchData(url, options = {}) {
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchData = useCallback(async () => {
        if (!AuthService.Authenticated()) {
            setError('User is not authenticated.')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const token = localStorage.getItem('accessToken')
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    ...options.headers,
                },
                ...options,
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()
            setData(result.metadata || result)
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }, [url, options])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const refreshData = useCallback(() => {
        fetchData()
    }, [fetchData])

    return { data, isLoading, error, refreshData }
}

export default useFetchData
