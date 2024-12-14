import React, { useEffect, useState } from 'react';
import { Box, Card, Grid, InputAdornment, TextField, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Search = () => {
    const [query, setQuery] = useState("");
    const [posts, setPosts] = useState([]); // Use an empty array as initial state
    const navigate = useNavigate();

    const handleEdit = (id) => {
        navigate("/edit", { state: { id } });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/jobPost/${id}`);
            setPosts((prevPosts) => prevPosts.filter(post => post.postId !== id)); // Remove the deleted post
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/jobPosts/keyword/${query}`);
                console.log('Search Response:', response.data); // Debug log for search
                setPosts(response.data);
            } catch (error) {
                console.error("Error fetching posts with query:", error);
            }
        };

        const fetchInitialPosts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/jobPosts');
                console.log('Initial Posts Response:', response.data); // Debug log for initial fetch
                setPosts(response.data);
            } catch (error) {
                console.error("Error fetching initial posts:", error);
            }
        };

        if (query.length > 2) {
            fetchPosts();
        } else if (query.length === 0) {
            fetchInitialPosts();
        }
    }, [query]); // Dependencies only include `query`

    return (
        <>
            <Grid container spacing={2} sx={{ margin: "2%" }}>
                <Grid item xs={12}>
                    <Box>
                        <TextField
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            placeholder="Search..."
                            sx={{ width: "75%", padding: "2% auto" }}
                            fullWidth
                            onChange={(e) => setQuery(e.target.value)} // Update query state
                        />
                    </Box>
                </Grid>

                {/* If no posts are found, display a message */}
                {posts.length === 0 ? (
                    <Typography sx={{ marginTop: "20px", fontSize: "1.5rem" }}>
                        No posts found.
                    </Typography>
                ) : (
                    posts.map((p) => (
                        <Grid key={p.postId} item xs={12} md={6} lg={4}>
                            <Card sx={{ padding: "3%", overflow: "hidden", width: "84%", backgroundColor: "#ADD8E6" }}>
                                <Typography
                                    variant="h5"
                                    sx={{ fontSize: "2rem", fontWeight: "600", fontFamily: "sans-serif" }}
                                >
                                    {p.postProfile}
                                </Typography>
                                <Typography sx={{ color: "#585858", marginTop: "2%", fontFamily: "cursive" }} variant="body">
                                    Description: {p.postDesc}
                                </Typography>
                                <br />
                                <Typography variant="h6" sx={{ fontFamily: "unset", fontSize: "400" }}>
                                    Experience: {p.reqExperience} years
                                </Typography>
                                <Typography sx={{ fontFamily: "serif", fontSize: "400" }} gutterBottom variant="body">
                                    Skills:
                                </Typography>
                                {p.postTechStack && p.postTechStack.length > 0 ? (
                                    p.postTechStack.map((s, i) => (
                                        <Typography variant="body" gutterBottom key={i}>
                                            {s} .
                                        </Typography>
                                    ))
                                ) : (
                                    <Typography variant="body" gutterBottom>No skills listed</Typography>
                                )}
                                <DeleteIcon onClick={() => handleDelete(p.postId)} sx={{ cursor: 'pointer', marginRight: "10px" }} />
                                <EditIcon onClick={() => handleEdit(p.postId)} sx={{ cursor: 'pointer' }} />
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>
        </>
    );
};

export default Search;
