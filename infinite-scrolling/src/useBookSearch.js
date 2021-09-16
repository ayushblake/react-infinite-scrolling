import { useEffect, useState } from 'react'
import axios from 'axios'

export default function useBookSearch(query, page) {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [books, setBooks] = useState([])
    const [hasMore, setHasMore] = useState(false)

    useEffect(() => {
        setBooks([])
    }, [query])

    useEffect(() => {
        let cancel;
        setLoading(true)
        setError(false)
        axios({
            method: 'GET',
            url: 'http://openlibrary.org/search.json',
            params: { q: query, page: page },
            cancelToken: new axios.CancelToken(c => cancel = c)
        })
            .then(res => {
                setBooks(prevState => {
                    return [...new Set([...prevState, ...res.data.docs.map(book => book.title)])]
                })
                setHasMore(res.data.docs.length > 0)
                setLoading(false)
            })
            .catch(err => {
                if (axios.isCancel(err)) return
                console.log(err)
                setError(true)
            })

        return (() => {
            cancel()
        })
    }, [query, page])

    return { loading, error, hasMore, books }
}
