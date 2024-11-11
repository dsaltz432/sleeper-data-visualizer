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
} from '@mui/material';
import { fetchReport } from '../../api/api';
import Spinner from '../Spinner/Spinner';
import './Standings.css';

function Standings() {
    const [teams, setTeams] = useState([]);
    const [orderDirection, setOrderDirection] = useState('asc');
    const [valueToOrderBy, setValueToOrderBy] = useState('wins');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            if (b[valueToOrderBy] < a[valueToOrderBy]) {
                return orderDirection === 'asc' ? -1 : 1;
            }
            if (b[valueToOrderBy] > a[valueToOrderBy]) {
                return orderDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    return (
        <div className="standings-wrapper">
            <Paper className="standings-container">
                <Box className="standings-header">
                    <Typography variant="h5">Standings</Typography>
                </Box>
                <Table>
                    <TableHead>
                        <TableRow className="standings-table-head">
                            {[
                                { id: 'shortName', label: 'Team' },
                                { id: 'wins', label: 'Wins' },
                                { id: 'losses', label: 'Losses' },
                                { id: 'pointsFor', label: 'Points For' },
                                { id: 'pointsAgainst', label: 'Points Against' },
                                { id: 'overallRating', label: 'Overall Rating' },
                                { id: 'madePlayoffProbability', label: 'Playoff %' },
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
                                <TableCell className="standings-table-cell">{team.shortName}</TableCell>
                                <TableCell className="standings-table-cell">{team.wins}</TableCell>
                                <TableCell className="standings-table-cell">{team.losses}</TableCell>
                                <TableCell className="standings-table-cell">{team.pointsFor}</TableCell>
                                <TableCell className="standings-table-cell">{team.pointsAgainst}</TableCell>
                                <TableCell className="standings-table-cell">
                                    {team.overallRating !== undefined
                                        ? `${(team.overallRating * 100).toFixed(2)}`
                                        : 'N/A'}
                                </TableCell>
                                <TableCell className="standings-table-cell">
                                    {team.madePlayoffProbability !== undefined
                                        ? `${(team.madePlayoffProbability * 100).toFixed(2)}%`
                                        : 'N/A'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </div>
    );
}

export default Standings;

