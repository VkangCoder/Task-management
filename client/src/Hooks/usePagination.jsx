import { useState, useMemo } from 'react'

function usePagination(totalItems, itemsPerPage = 10) {
    const [currentPage, setCurrentPage] = useState(1)

    const totalPages = useMemo(
        () => Math.ceil(totalItems / itemsPerPage),
        [totalItems, itemsPerPage]
    )

    const goToNextPage = () =>
        setCurrentPage(prev => Math.min(prev + 1, totalPages))
    const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1))
    const goToPage = page =>
        setCurrentPage(Math.min(Math.max(page, 1), totalPages))

    const paginatedIndices = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        return { startIndex, endIndex }
    }, [currentPage, itemsPerPage])

    return {
        currentPage,
        totalPages,
        goToNextPage,
        goToPreviousPage,
        goToPage,
        paginatedIndices,
        itemsPerPage,
    }
}

export default usePagination
