import { useState, useEffect } from 'react'

function useSearch(items, searchFields = ['title']) {
    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState(items)

    useEffect(() => {
        if (!search) {
            setSearchResults(items)
            return
        }

        const filteredResults = items.filter(item =>
            searchFields.some(field =>
                item[field].toLowerCase().includes(search.toLowerCase())
            )
        )

        setSearchResults(filteredResults)
    }, [search, items, searchFields])

    return { search, setSearch, searchResults }
}

export default useSearch
