import React, { useState } from "react";
import { TextField, Button, Container, List, ListItem, Typography, Checkbox, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { fetchRepositories, storeExpanded } from "./services/api";

interface branchesResponse {
    name: string;
    commit: { sha: string; url: string };
    protected: boolean;
}

interface Repo {
    id: number;
    name: string;
    url: string;
    language: string;
    total_branches: number;
    branches: branchesResponse[];
    expanded: boolean;
}

function App() {
    const [org, setOrg] = useState("");
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
    const [repos, setRepos] = useState<Repo[]>([]);
    const [expandedRepos, setExpandedRepos] = useState<number[]>([]);

    const fetchRepos = async () => {
        try {
            const data: Repo[] = await fetchRepositories(org, page);
            setRepos(prev => [...prev, ...data]);
            setMore(true)

            // set previously expanded repos
            data.map(repo => {
                if (repo.expanded) {
                    toggleExpand(repo.id);
                }
                return repo;
            });

            if (data.length === 0) setMore(false);
        } catch (error) {
            console.error("Error fetching repositories:", error);
            setMore(false);
        }
    };

    const toggleExpand = async (id: number, org?: string) => {
        let expanded = true;
        setExpandedRepos(prev => {
            // If the id is in the array, remove it (collapse)
            if (prev.includes(id)) {
                expanded = false;
                return prev.filter(i => i !== id);
            }
            // If the id is not in the array, add it (expand)
            return [...prev, id];
        });

        if (org) {
            await storeExpanded(org, id, expanded);
        }
    };

    return (
        <Container>
            <TextField
                label="GitHub Organization"
                variant="outlined"
                value={org}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    e.preventDefault();
                    setPage(1);
                    setRepos([]);
                    setExpandedRepos([]);
                    setMore(false)
                    setOrg(e.target.value);
                }}
                fullWidth
            />

            {page == 1 && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={async () => {
                        await fetchRepos();
                        setPage(page => page + 1);
                    }}
                    style={{ marginTop: "16px", marginBottom: "16px" }}
                >
                    Search
                </Button>
            )}

            <List>
                {repos.map(repo => (
                    <ListItem key={repo.id}>
                        <Checkbox />
                        <Typography variant="body1" style={{ flex: 1 }}>
                            {repo.name}
                        </Typography>
                        <Typography variant="body2" style={{ flex: 1 }}>
                            <a href={repo.url}> Repo Link</a>
                        </Typography>
                        <Typography variant="body2" style={{ flex: 1 }}>
                            Language: {repo.language}{" "}
                        </Typography>
                        <Typography variant="body2" style={{ flex: 1 }}>
                            Branches: {repo.total_branches}
                        </Typography>
                        <IconButton onClick={() => toggleExpand(repo.id, org)}>
                            <ExpandMoreIcon />
                        </IconButton>

                        {expandedRepos.includes(repo.id) && (
                            <List style={{ marginBottom: "24px" }}>
                                {repo.branches.slice(0, 10).map((branch, i) => (
                                    <ListItem key={i} style={{ display: "block" }}>
                                        <div>
                                            {/* Branch name */}
                                            <Typography variant="body2">
                                                <strong>Branch:</strong> {branch.name}
                                            </Typography>

                                            {/* Protected status */}
                                            <Typography variant="body2" style={{ color: branch.protected ? "green" : "red" }}>
                                                <strong>Status:</strong> {branch.protected ? "Protected" : "Unprotected"}
                                            </Typography>
                                        </div>
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </ListItem>
                ))}
            </List>
            {page > 0 && more && (
                <button
                    onClick={() => {
                        setPage(page => page + 1);
                        fetchRepos();
                    }}
                >
                    Load more
                </button>
            )}
        </Container>
    );
}

export default App;
