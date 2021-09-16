import React, { useEffect, useState, useRef, useCallback } from 'react'
import './App.css';
import useBookSearch from './useBookSearch';


function App() {

  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const { loading, error, hasMore, books } = useBookSearch(query, page)

  const observer = useRef()
  //this callback function runs everytime the element with ref = 'lastBookElementRef' is mounted on the screen
  const lastBookElementRef = useCallback((node) => {
    // console.log(node)
    if (loading) return
    //if there is anything connected to current instance of observer(by default 'undefined' - in Line 11) we disconnect it, so that we can make a fresh connection(this way the last element is always linked to this ref)
    if (observer.current) observer.current.disconnect()
    //out of all the things that the observer is observing as soon as something becomes visible it goes into the entries array
    observer.current = new IntersectionObserver(entries => {
      //if that entry[0]/node is somewhere on the page
      if (entries[0].isIntersecting && hasMore)
        setPage(prevPage => prevPage + 1)
    })

    //if something is our last element we make sure the observer is observing it
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  const handleChange = (event) => {
    setQuery(event.target.value)
    setPage(1)
  }


  return (
    <div className="App">
      <h1><strong>react-infinite-scrolling</strong></h1>
      <input onChange={handleChange}></input>
      {books.map((book, bookIdx) => {
        if (books.length == bookIdx + 1)
          return <div key={book} ref={lastBookElementRef}>{book}</div>
        else
          return <div key={book}>{book}</div>
      })}
      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error'}</div>
    </div>
  );
}

export default App;
