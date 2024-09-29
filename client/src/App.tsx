import React, { useState, useEffect } from 'react'
// import RepoList from './repository'
import { fetchRepositories } from './services/api'
import './App.css'


interface Repo {
  id: string;
  name: string;
  html_url: string;
  language: string;
  branches: number;
}

function App() {
  const [page, setPage] = useState(1)

  const [repos, setRepos] = useState<Repo[]>([]);
  const [org, setOrg] = useState("")

  function handleInput(e: React.FormEvent) {
    e.preventDefault()
    fetchRepositories(org, page).then(data => { setRepos(prev => [...prev, ...data]) });
  }

  useEffect(() => {
    if (page == 1) return;
    if (page) {
      fetchRepositories(org, page).then(data => setRepos(prev => [...prev, ...data]));
    }
  }, [org, page]);

  return (
    // <h1>GitHub Organization Repositories</h1>
    <div className="App">
      <h1 className="repo-list-heading">GitHub Repositories</h1>
      <form onSubmit={handleInput}>
        <label htmlFor="org name">Organisation Name </label>
        <input
          id="org name"
          value={org}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPage(1)
            setRepos([])
            setOrg(e.target.value)
          }}
          placeholder="Enter GitHub org name"
        />
        <button>submit</button>
        <p></p>
      </form>
      <ul className='repos'>
        {repos.map(repo => (
          <li key={repo.id} className="details">
            <input type="checkbox" />
            <span>Name: {repo.name}</span>
            <a href={repo.html_url}>URL</a>
            <span>Language: {repo.language}</span>
            <span>Branches: {repo.branches}</span></li>
        ))}
      </ul>
      <button onClick={() => setPage(page => page + 1)}>Load more</button>
    </div>
    // <p className="read-the-docs">
    //   Click on the Vite and React logos to learn more
    // </p>
  )
}

export default App
