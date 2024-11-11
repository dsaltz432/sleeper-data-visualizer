import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Navbar from './components/Navbar/Navbar';
import Standings from './components/Standings/Standings';
import Matchups from './components/Matchups/Matchups';
import Methodology from './components/Methodology';
import NotFound from './components/NotFound';

function App() {
    return (
        <>
            <Navbar />
            <Container sx={{ marginTop: 4 }}>
                <Routes>
                    <Route path="/" element={<Standings />} />
                    <Route path="/standings" element={<Standings />} />
                    <Route path="/matchups" element={<Matchups />} />
                    <Route path="/methodology" element={<Methodology />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Container>
        </>
    );
}

export default App;
