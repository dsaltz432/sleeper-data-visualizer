import React, { useEffect, useState, useRef } from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';
import { fetchReport } from '../../api/api';
import Spinner from '../Spinner/Spinner';
import StandingsTable from './StandingsTable';
import StandingsModal from './StandingsModal';
import './Standings.css';

function Standings() {
    const [teams, setTeams] = useState([]);
    const [orderDirection, setOrderDirection] = useState('desc');
    const [valueToOrderBy, setValueToOrderBy] = useState('shortName');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [open, setOpen] = useState(false);
    const [isPlayoffsView, setIsPlayoffsView] = useState(false);

    const effectRan = useRef(false);

    useEffect(() => {
        if (effectRan.current === false) {
            const getData = async () => {
                try {
                    const data = await fetchReport();
                    if (data) {
                        setTeams(data.teams);
                    } else {
                        setError('Failed to load teams');
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

    const handleOpen = (team) => {
        setSelectedTeam(team);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedTeam(null);
    };

    const handleSortRequest = (property) => {
        const isAsc = valueToOrderBy === property && orderDirection === 'asc';
        setOrderDirection(isAsc ? 'desc' : 'asc');
        setValueToOrderBy(property);
    };

    const sortedTeams = (teamsArray) => {
        return teamsArray.sort((a, b) => {
            if (valueToOrderBy === 'shortName') {
                const aRecord = a.wins - a.losses;
                const bRecord = b.wins - b.losses;
                if (aRecord === bRecord) {
                    return orderDirection === 'asc' ? a.pointsFor - b.pointsFor : b.pointsFor - a.pointsFor;
                }
                return orderDirection === 'asc' ? aRecord - bRecord : bRecord - aRecord;
            } else {
                if (b[valueToOrderBy] < a[valueToOrderBy]) {
                    return orderDirection === 'asc' ? -1 : 1;
                }
                if (b[valueToOrderBy] > a[valueToOrderBy]) {
                    return orderDirection === 'asc' ? 1 : -1;
                }
                return 0;
            }
        });
    };

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <Typography>Error: {error}</Typography>;
    }

    // Define table columns based on the view
    const standingsColumns = [
        { id: 'shortName', label: 'Record', explanation: 'Team name and win-loss record' },
        { id: 'pointsFor', label: 'PF', explanation: 'Total points scored by the team' },
        { id: 'pointsAgainst', label: 'PA', explanation: 'Total points scored against the team' },
        { id: 'overallRating', label: 'Rating', explanation: 'Overall team rating based on performance' },
        { id: 'madePlayoffProbability', label: 'Playoffs', explanation: 'Probability of making the playoffs' },
    ];

    const playoffsColumns = [
        { id: 'shortName', label: 'Record', explanation: 'Team name and win-loss record' },
        { id: 'overallRating', label: 'Rating', explanation: 'Overall team rating based on performance' },
        { id: 'madePlayoffProbability', label: 'Playoffs', explanation: 'Probability of making the playoffs' },
        { id: 'championshipProbability', label: 'Champ', explanation: 'Probability of winning the championship' },
        { id: 'loserBowlProbability', label: 'Pickles', explanation: 'Probability of finishing last' },
    ];

    const columns = isPlayoffsView ? playoffsColumns : standingsColumns;

    return (
        <div className="standings-wrapper">
            <Paper className="standings-container">
                <Box className="standings-header" display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5">{isPlayoffsView ? 'Playoff Odds' : 'Standings'}</Typography>
                    <Button variant="contained" onClick={() => setIsPlayoffsView(!isPlayoffsView)}>
                        {isPlayoffsView ? 'Standings' : 'Playoffs'}
                    </Button>
                </Box>
                <div className="standings-table">
                    <StandingsTable
                        teams={teams}
                        columns={columns}
                        valueToOrderBy={valueToOrderBy}
                        orderDirection={orderDirection}
                        handleSortRequest={handleSortRequest}
                        sortedTeams={sortedTeams}
                        handleOpen={handleOpen}
                    />
                </div>
            </Paper>

            <StandingsModal
                open={open}
                handleClose={handleClose}
                selectedTeam={selectedTeam}
            />
        </div>
    );
}

export default Standings;
