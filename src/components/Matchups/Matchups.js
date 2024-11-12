import React, { useEffect, useState, useRef } from 'react';
import {
    Typography,
    Box,
    Grid,
    Paper,
    LinearProgress,
    Avatar,
    Stack,
    IconButton
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { fetchReport } from '../../api/api';
import Spinner from '../Spinner/Spinner';
import './Matchups.css';

function Matchups() {
    const [matchups, setMatchups] = useState([]);
    const [currentWeek, setCurrentWeek] = useState(1);
    const [selectedWeek, setSelectedWeek] = useState(1);
    const [totalWeeks, setTotalWeeks] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const effectRan = useRef(false);

    useEffect(() => {
        if (effectRan.current === false) {
            const getData = async () => {
                try {
                    const data = await fetchReport();
                    if (data) {
                        setMatchups(data.matchupsBreakdown);
                        setCurrentWeek(data.currentWeek);
                        setSelectedWeek(data.currentWeek); // Set selectedWeek to currentWeek initially
                        setTotalWeeks(data.matchupsBreakdown.length);
                    } else {
                        setError('Failed to load matchups');
                    }
                } catch (err) {
                    console.error('Error fetching report data:', err);
                    setError('Error fetching data');
                } finally {
                    setLoading(false);
                }
            };

            getData();

            return () => {
                effectRan.current = true;
            };
        }
    }, []);

    const handleWeekChange = (direction) => {
        if (direction === 'prev' && selectedWeek > 1) {
            setSelectedWeek(selectedWeek - 1);
        } else if (direction === 'next' && selectedWeek < totalWeeks) {
            setSelectedWeek(selectedWeek + 1);
        }
    };

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <Typography>Error: {error}</Typography>;
    }

    const currentMatchups = matchups.find((week) => week.week === selectedWeek);

    const getProgressColor = (winProbability) => {
        return winProbability >= 0.5 ? 'success' : 'secondary'; // Use 'success' for green color
    };

    return (
        <Box className="matchups-wrapper">
            <Box className="header-container">
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                    Matchups
                </Typography>
                <Box className="week-navigation-container">
                    <IconButton
                        onClick={() => handleWeekChange('prev')}
                        disabled={selectedWeek <= 1}
                        className="week-navigation-arrow"
                    >
                        <ArrowBackIosIcon />
                    </IconButton>
                    <Typography variant="h6" className="current-week-text">
                        Week {selectedWeek}
                    </Typography>
                    <IconButton
                        onClick={() => handleWeekChange('next')}
                        disabled={selectedWeek >= totalWeeks}
                        className="week-navigation-arrow"
                    >
                        <ArrowForwardIosIcon />
                    </IconButton>
                </Box>
            </Box>
            {currentMatchups ? (
                <Grid container spacing={2} justifyContent="center">
                    {currentMatchups.matchups.map((matchup, index) => (
                        <Grid item xs={12} key={index}>
                            <Paper className="matchup-container">
                                <Box className="matchup-content">
                                    <Box className="team-side">
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar alt={matchup[0].shortName} src={`/${matchup[0].userId}.png`} />
                                            <Box>
                                                <Typography variant="body1" className="team-name">{matchup[0].shortName}</Typography>
                                                <Typography variant="body2" className="win-probability-text">{(matchup[0].winProbability * 100).toFixed(1)}% WIN</Typography>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={matchup[0].winProbability * 100}
                                                    color={getProgressColor(matchup[0].winProbability)}
                                                    className="win-probability-bar"
                                                />
                                            </Box>
                                        </Stack>
                                        <Typography variant="h6" className="total-points">{matchup[0].totalPoints.toFixed(2)}</Typography>
                                    </Box>
                                    <Box className="vs-box">
                                        <Typography variant="h6" className="vs-text">VS</Typography>
                                    </Box>
                                    <Box className="team-side">
                                        <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end">
                                            <Box>
                                                <Typography variant="body1" className="team-name">{matchup[1].shortName}</Typography>
                                                <Typography variant="body2" className="win-probability-text">{(matchup[1].winProbability * 100).toFixed(1)}% WIN</Typography>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={matchup[1].winProbability * 100}
                                                    color={getProgressColor(matchup[1].winProbability)}
                                                    className="win-probability-bar"
                                                />
                                            </Box>
                                            <Avatar alt={matchup[1].shortName} src={`/${matchup[1].userId}.png`} />
                                        </Stack>
                                        <Typography variant="h6" className="total-points">{matchup[1].totalPoints.toFixed(2)}</Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography>No matchups available for this week.</Typography>
            )}
        </Box>
    );
}

export default Matchups;
