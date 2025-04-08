const express = require('express'); 
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express(); const prisma = new PrismaClient();
app.use(cors()); app.use(express.json());

// GET /movies - List all movies 
app.get('/movies', async (req, res) => { 
    try { 
        const movies = await prisma.movie.findMany({ orderBy: { votes: 'desc' } });
        res.json(movies);
    } catch (err) { 
        res.status(500).json({ error: 'Failed to fetch movies' }); 
    } 
});

// POST /movies - Add a new movie 
app.post('/movies', async (req, res) => { 
    const { title } = req.body; 
    if (!title) return res.status(400).json({ error: 'Title is required' });

try { const newMovie = await prisma.movie.create({ data: { title, votes: 0 } }); res.status(201).json(newMovie); } catch (err) { res.status(500).json({ error: 'Failed to add movie' }); } });

// POST /vote/:id - Vote for a movie 
app.post('/vote/:id', async (req, res) => { 
    const movieId = parseInt(req.params.id); 
    if (isNaN(movieId)) 
        return res.status(400).json({ error: 'Invalid movie ID' });
    try { 
        const updatedMovie = await prisma.movie.update({ where: { id: movieId }, data: { votes: { increment: 1 } } });
        res.json(updatedMovie);
    } catch (err) {
        res.status(500).json({ error: 'Failed to vote' }); 
    } 
});

// Start the server 
const PORT = process.env.PORT || 3000; app.listen(PORT, () => { console.log(Server running on http:\/\/localhost:${PORT}); });

