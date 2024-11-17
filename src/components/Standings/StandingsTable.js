import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Tooltip } from '@mui/material';
import StandingsTableRow from './StandingsTableRow';

function StandingsTable({ teams, columns, valueToOrderBy, orderDirection, handleSortRequest, sortedTeams, handleOpen }) {
    return (
        <Table>
            <TableHead>
                <TableRow className="standings-table-head">
                    {columns.map((headCell) => (
                        <TableCell key={headCell.id} className="standings-table-cell">
                            <Tooltip title={headCell.explanation} arrow>
                                <TableSortLabel
                                    active={valueToOrderBy === headCell.id}
                                    direction={valueToOrderBy === headCell.id ? orderDirection : 'asc'}
                                    onClick={() => handleSortRequest(headCell.id)}
                                    className="standings-sort-label"
                                >
                                    {headCell.label}
                                </TableSortLabel>
                            </Tooltip>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {sortedTeams(teams).map((team) => (
                    <StandingsTableRow
                        key={team.rosterId}
                        team={team}
                        columns={columns}
                        handleOpen={handleOpen}
                    />
                ))}
            </TableBody>
        </Table>
    );
}

export default StandingsTable;
