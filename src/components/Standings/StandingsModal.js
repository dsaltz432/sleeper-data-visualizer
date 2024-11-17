import React from 'react';
import { Box, Modal, Backdrop, Fade, Typography } from '@mui/material';
import './Standings.css';

function StandingsModal({ open, handleClose, selectedTeam }) {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
            aria-labelledby="standings-modal-title"
            aria-describedby="standings-modal-description"
        >
            <Fade in={open}>
                <Box className="standings-modal-box">
                    {selectedTeam && (
                        <>
                            <Typography
                                id="standings-modal-title"
                                variant="h6"
                                component="h2"
                                sx={{ fontSize: '1rem' }}
                            >
                                {selectedTeam.shortName} Playoff Breakdown
                            </Typography>
                            <Typography
                                id="standings-modal-description"
                                sx={{ mt: 2, fontSize: '0.9rem' }}
                            >
                                From Record:{' '}
                                {(selectedTeam.madePlayoffFromRecordProbability * 100).toFixed(1)}%
                            </Typography>
                            <Typography sx={{ fontSize: '0.9rem' }}>
                                From Jordan Rule:{' '}
                                {(selectedTeam.madePlayoffFromJordanRuleProbability * 100).toFixed(1)}%
                            </Typography>
                        </>
                    )}
                </Box>
            </Fade>
        </Modal>
    );
}

export default StandingsModal;
