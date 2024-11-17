import React from 'react';
import { TableCell, TableRow } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function StandingsTableRow({ team, columns, handleOpen }) {
    const theme = useTheme();

    return (
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
    );
}

export default StandingsTableRow;
