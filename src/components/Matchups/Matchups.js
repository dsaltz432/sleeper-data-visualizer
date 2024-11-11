import React, { useEffect, useState, useRef } from 'react';
import {
    Typography,
    Box,
    Grid2 as Grid,
    Paper,
    LinearProgress,
    Avatar,
    Stack,
    Button
} from '@mui/material';
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

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <Typography>Error: {error}</Typography>;
    }

    const handleWeekChange = (week) => {
        setSelectedWeek(week);
    };

    const currentMatchups = matchups.find((week) => week.week === selectedWeek);

    const getProgressColor = (winProbability) => {
        return winProbability >= 0.5 ? 'primary' : 'secondary';
    };

    return (
        <Box className="matchups-wrapper">
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
                Matchups
            </Typography>
            <Box className="week-buttons-container">
                {Array.from({ length: totalWeeks }, (_, index) => {
                    const weekNumber = index + 1;
                    return (
                        <Button
                            key={weekNumber}
                            variant={weekNumber === selectedWeek ? 'contained' : 'outlined'}
                            onClick={() => handleWeekChange(weekNumber)}
                            size="small"
                            className={`week-button ${weekNumber === currentWeek && weekNumber !== selectedWeek ? 'current-week-outline' : ''}`}
                        >
                            Week {weekNumber}
                        </Button>
                    );
                })}
            </Box>
            {currentMatchups ? (
                <Grid container spacing={2} justifyContent="center">
                    {currentMatchups.matchups.map((matchup, index) => (
                        <Grid item xs={12} key={index}>
                            <Paper className="matchup-container">
                                <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    <Grid item xs={5} className="team-info">
                                        <Stack direction="row" spacing={1} alignItems="center" className="avatar-stack">
                                            <Avatar alt={matchup[0].shortName} src={`/${matchup[0].userId}.png`} />
                                            <Typography variant="subtitle1" className="team-name">
                                                {matchup[0].shortName}
                                            </Typography>
                                        </Stack>
                                        <Typography variant="h6" className="total-points">
                                            {matchup[0].totalPoints.toFixed(2)}
                                        </Typography>
                                        <Typography variant="caption">
                                            Win Probability: {(matchup[0].winProbability * 100).toFixed(1)}%
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={matchup[0].winProbability * 100}
                                            color={getProgressColor(matchup[0].winProbability)}
                                            className="win-probability"
                                        />
                                    </Grid>
                                    <Grid item xs={2} className="vs-text-container">
                                        <Typography className="vs-text">VS</Typography>
                                    </Grid>
                                    <Grid item xs={5} className="team-info">
                                        <Stack direction="row" spacing={1} alignItems="center" className="avatar-stack">
                                            <Avatar alt={matchup[1].shortName} src={`/${matchup[1].userId}.png`} />
                                            <Typography variant="subtitle1" className="team-name">
                                                {matchup[1].shortName}
                                            </Typography>
                                        </Stack>
                                        <Typography variant="h6" className="total-points">
                                            {matchup[1].totalPoints.toFixed(2)}
                                        </Typography>
                                        <Typography variant="caption">
                                            Win Probability: {(matchup[1].winProbability * 100).toFixed(1)}%
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={matchup[1].winProbability * 100}
                                            color={getProgressColor(matchup[1].winProbability)}
                                            className="win-probability"
                                        />
                                    </Grid>
                                </Grid>
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
