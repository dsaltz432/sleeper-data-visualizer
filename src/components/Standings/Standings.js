import React, { useEffect, useState, useRef } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    Paper,
    Typography,
    Box,
    Modal,
    Backdrop,
    Fade,
} from '@mui/material';
import { fetchReport } from '../../api/api';
import Spinner from '../Spinner/Spinner';
import './Standings.css';

function Standings() {
    const [teams, setTeams] = useState([]);
    const [orderDirection, setOrderDirection] = useState('desc');
    const [valueToOrderBy, setValueToOrderBy] = useState('shortName'); // Default to 'Record'
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null); // To store the team data for modal
    const [open, setOpen] = useState(false); // To control the modal state

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

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <Typography>Error: {error}</Typography>;
    }

    const handleSortRequest = (property) => {
        const isAsc = valueToOrderBy === property && orderDirection === 'asc';
        setOrderDirection(isAsc ? 'desc' : 'asc');
        setValueToOrderBy(property);
    };

    const sortedTeams = (teamsArray) => {
        return teamsArray.sort((a, b) => {
            if (valueToOrderBy === 'shortName') {
                // Sort by record: primary sort by wins, secondary sort by losses
                const aRecord = a.wins - a.losses;
                const bRecord = b.wins - b.losses;
                if (aRecord === bRecord) {
                    // If records are the same, sort by pointsFor as a secondary criterion
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

    return (
        <div className="standings-wrapper">
            <Paper className="standings-container">
                <Box className="standings-header">
                    <Typography variant="h5">Standings</Typography>
                </Box>
                <div className="standings-table">
                    <Table>
                        <TableHead>
                            <TableRow className="standings-table-head">
                                {[
                                    { id: 'shortName', label: 'Record' },
                                    { id: 'pointsFor', label: 'PF' },
                                    { id: 'pointsAgainst', label: 'PA' },
                                    { id: 'overallRating', label: 'Rating' },
                                    { id: 'madePlayoffProbability', label: 'Playoffs' },
                                ].map((headCell) => (
                                    <TableCell key={headCell.id} className="standings-table-cell">
                                        <TableSortLabel
                                            active={valueToOrderBy === headCell.id}
                                            direction={valueToOrderBy === headCell.id ? orderDirection : 'asc'}
                                            onClick={() => handleSortRequest(headCell.id)}
                                            className="standings-sort-label"
                                        >
                                            {headCell.label}
                                        </TableSortLabel>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedTeams(teams).map((team) => (
                                <TableRow hover key={team.rosterId} className="standings-table-row">
                                    <TableCell className="standings-table-cell">
                                        <div>
                                            <strong>{team.shortName}</strong>
                                        </div>
                                        <div>
                                            {team.wins}-{team.losses} {/* Display combined record */}
                                            {team.streak && (
                                                <span
                                                    style={{
                                                        color: team.streak.includes('W') ? 'green' : '#b22222', // Green for win streaks, red for losing streaks
                                                    }}
                                                >
                                                    {' '}({team.streak})
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="standings-table-cell">{team.pointsFor}</TableCell>
                                    <TableCell className="standings-table-cell">{team.pointsAgainst}</TableCell>
                                    <TableCell className="standings-table-cell">
                                        {team.overallRating !== undefined
                                            ? `${(team.overallRating * 100).toFixed(1)}`
                                            : 'N/A'}
                                    </TableCell>
                                    <TableCell
                                        className="standings-table-cell"
                                        onClick={() => handleOpen(team)}
                                        style={{ cursor: 'pointer', color: '#1976d2', textDecoration: 'underline' }}
                                    >
                                        {team.madePlayoffProbability !== undefined
                                            ? `${(team.madePlayoffProbability * 100).toFixed(1)}%`
                                            : 'N/A'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Paper>

            {/* Modal for Playoff Breakdown */}
            <Modal
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 200,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            'border-radius': '10px',
                            boxShadow: 24,
                            p: 4,
                        }}
                    >
                        {selectedTeam && (
                            <div>
                                <Typography variant="h6" component="h2" sx={{ fontSize: '1rem' }}>
                                    {selectedTeam.shortName} Playoff Breakdown
                                </Typography>
                                <Typography sx={{ mt: 2, fontSize: '0.9rem' }}>
                                    From Record: {(selectedTeam.madePlayoffFromRecordProbability * 100).toFixed(1)}%
                                </Typography>
                                <Typography sx={{ fontSize: '0.9rem' }}>
                                    From Jordan Rule: {(selectedTeam.madePlayoffFromJordanRuleProbability * 100).toFixed(1)}%
                                </Typography>
                            </div>
                        )}
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}

export default Standings;
