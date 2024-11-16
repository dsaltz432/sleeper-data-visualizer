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
    Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles'; // Import useTheme
import { fetchReport } from '../../api/api';
import Spinner from '../Spinner/Spinner';
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

    const theme = useTheme(); // Initialize the theme

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
        { id: 'shortName', label: 'Record' },
        { id: 'pointsFor', label: 'PF' },
        { id: 'pointsAgainst', label: 'PA' },
        { id: 'overallRating', label: 'Rating' },
        { id: 'madePlayoffProbability', label: 'Playoffs' },
    ];

    const playoffsColumns = [
        { id: 'shortName', label: 'Record' },
        { id: 'overallRating', label: 'Rating' },
        { id: 'madePlayoffProbability', label: 'Playoffs' },
        { id: 'championshipProbability', label: 'Champ' },
        { id: 'loserBowlProbability', label: 'Pickles' },
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
                    <Table>
                        <TableHead>
                            <TableRow className="standings-table-head">
                                {columns.map((headCell) => (
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
                                    {columns.map((col) => {
                                        switch (col.id) {
                                            case 'shortName':
                                                return (
                                                    <TableCell className="standings-table-cell" key={col.id}>
                                                        <div className="standings-team-name">
                                                            {team.shortName}
                                                        </div>
                                                        <div>
                                                            {team.wins}-{team.losses}
                                                            {team.streak && (
                                                                <span
                                                                    className="standings-streak"
                                                                    style={{
                                                                        color: team.streak.includes('W')
                                                                            ? theme.palette.success.main
                                                                            : theme.palette.error.main,
                                                                    }}
                                                                >
                                                                    {' '}({team.streak})
                                                                </span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                );
                                            case 'pointsFor':
                                                return (
                                                    <TableCell className="standings-table-cell" key={col.id}>
                                                        {team.pointsFor}
                                                    </TableCell>
                                                );
                                            case 'pointsAgainst':
                                                return (
                                                    <TableCell className="standings-table-cell" key={col.id}>
                                                        {team.pointsAgainst}
                                                    </TableCell>
                                                );
                                            case 'overallRating':
                                                return (
                                                    <TableCell className="standings-table-cell" key={col.id}>
                                                        {team.overallRating !== undefined
                                                            ? `${(team.overallRating * 100).toFixed(1)}`
                                                            : 'N/A'}
                                                    </TableCell>
                                                );
                                            case 'madePlayoffProbability':
                                                return (
                                                    <TableCell
                                                        className="standings-table-cell"
                                                        onClick={() => handleOpen(team)}
                                                        key={col.id}
                                                        style={{
                                                            cursor: 'pointer',
                                                            color: '#1976d2',
                                                            textDecoration: 'underline',
                                                        }}
                                                    >
                                                        {team.madePlayoffProbability !== undefined
                                                            ? `${(team.madePlayoffProbability * 100).toFixed(1)}%`
                                                            : 'N/A'}
                                                    </TableCell>
                                                );
                                            case 'championshipProbability':
                                                return (
                                                    <TableCell className="standings-table-cell" key={col.id}>
                                                        {team.championshipProbability !== undefined
                                                            ? `${(team.championshipProbability * 100).toFixed(1)}%`
                                                            : 'N/A'}
                                                    </TableCell>
                                                );
                                            case 'loserBowlProbability':
                                                return (
                                                    <TableCell className="standings-table-cell" key={col.id}>
                                                        {team.loserBowlProbability !== undefined
                                                            ? `${(team.loserBowlProbability * 100).toFixed(1)}%`
                                                            : 'N/A'}
                                                    </TableCell>
                                                );
                                            default:
                                                return null;
                                        }
                                    })}
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
                            width: 220,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            borderRadius: '10px',
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
                                    From Record:{' '}
                                    {(selectedTeam.madePlayoffFromRecordProbability * 100).toFixed(1)}%
                                </Typography>
                                <Typography sx={{ fontSize: '0.9rem' }}>
                                    From Jordan Rule:{' '}
                                    {(selectedTeam.madePlayoffFromJordanRuleProbability * 100).toFixed(1)}%
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
