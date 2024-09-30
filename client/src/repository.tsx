import React, { useState } from 'react';
import { TextField, Button, Container, List, ListItem, Typography, Checkbox, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { fetchRepositories } from './services/api';

interface branchesResponse {
    name: string;
    commit: { sha: string; url: string; };
    protected: boolean
}

interface Repo {
    id: string;
    name: string;
    url: string;
    language: string;
    total_branches: number
    branches: branchesResponse[];
}

function App() {
    const [org, setOrg] = useState('');
    const [page, setPage] = useState(1);
    //   const [hasMore, setHasMore] = useState(true);
    const [repos, setRepos] = useState<Repo[]>([]);
    const [expandedRepoIndex, setExpandedRepoIndex] = useState<number | null>(null);

    const fetchRepos = async () => {
        try {
            const data = await fetchRepositories(org, page);
            setRepos((prev) => [...prev, ...data]);
            //   if (data.length === 0) setHasMore(false);
        } catch (error) {
            console.error('Error fetching repositories:', error);
            //   setHasMore(false)
        }
    };

    const toggleExpand = (index: number) => {
        setExpandedRepoIndex(expandedRepoIndex === index ? null : index);
    };

    return (
        <Container>
            {/* <Typography variant="h2" gutterBottom>GitHub Organization Repositories</Typography> */}

            <TextField
                label="GitHub Organization"
                variant="outlined"
                value={org}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setPage(1)
                    setRepos([])
                    setOrg(e.target.value)
                }}
                fullWidth
            />

            <Button
                variant="contained"
                color="primary"
                onClick={fetchRepos}
                style={{ marginTop: '16px', marginBottom: '16px' }}
            >
                Search
            </Button>

            <List>
                {repos.map((repo, index) => (
                    <ListItem key={index}>
                        <Checkbox />
                        <Typography variant="body1" style={{ flex: 1 }}>{repo.name}</Typography>
                        <Typography variant="body2" style={{ flex: 1 }}><a href={repo.url}> Repo Link</a></Typography>
                        <Typography variant="body2" style={{ flex: 1 }}>Language: {repo.language} </Typography>
                        <Typography variant="body1" style={{ flex: 1 }}>Branches: {repo.total_branches}</Typography>
                        <IconButton onClick={() => toggleExpand(index)}>
                            <ExpandMoreIcon />
                        </IconButton>

                        {expandedRepoIndex === index && (
                            <List style={{ marginBottom: '24px' }}>
                                {repo.branches.slice(0, 10).map((branch, i) => (
                                    <ListItem key={i} style={{ display: 'block' }}>
                                        <div>
                                            {/* Branch name */}
                                            <Typography variant="body2">
                                                <strong>Branch:</strong> {branch.name}
                                            </Typography>

                                            {/* Protected status */}
                                            <Typography variant="body2" style={{ color: branch.protected ? 'green' : 'red' }}>
                                                <strong>Status:</strong> {branch.protected ? 'Protected' : 'Unprotected'}
                                            </Typography>
                                        </div>
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </ListItem>
                ))}
            </List>
        </Container>
    );
}

export default App;
