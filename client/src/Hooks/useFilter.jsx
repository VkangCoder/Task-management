import { useState, useEffect } from 'react'

function useFilter(initialItems, filterFunction) {
    const [activeFilter, setActiveFilter] = useState('all')
    const [filteredItems, setFilteredItems] = useState(initialItems)

    useEffect(() => {
        if (activeFilter === 'all') {
            setFilteredItems(initialItems)
        } else {
            const filtered = initialItems.filter(item =>
                filterFunction(item, activeFilter)
            )
            setFilteredItems(filtered)
        }
    }, [activeFilter, initialItems, filterFunction])

    return { activeFilter, setActiveFilter, filteredItems }
}

export default useFilter
