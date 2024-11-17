import React from 'react';
import { Typography, Box } from '@mui/material';

function Methodology() {
    const commonFontStyle = {
        fontFamily: 'Roboto, sans-serif',
    };

    return (
        <Box sx={{ padding: '16px 8px', lineHeight: 1.6 }}> {}
            <Typography variant="h5" sx={{ marginBottom: 3, ...commonFontStyle }}>
                Calculating Overall Rating
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 2, ...commonFontStyle }}>
                The <strong>Overall Rating</strong> provides a holistic view of the team's overall strength based on multiple factors. The overall rating is calculated as follows:
            </Typography>

            <Box sx={{ marginBottom: 3 }}>
                <Typography variant="h6" sx={{ marginBottom: 1, ...commonFontStyle }}>
                    1. Data Normalization
                </Typography>
                <Typography variant="body1" sx={{ ...commonFontStyle }}>
                    To ensure fair comparisons, metrics such as <code>pointsFor</code> and <code>waiverBudgetUsed</code> are normalized to a scale from 0 to 1. This step ensures consistency in the data by removing bias due to scale differences.
                </Typography>
            </Box>

            <Box sx={{ marginBottom: 3 }}>
                <Typography variant="h6" sx={{ marginBottom: 1, ...commonFontStyle }}>
                    2. Weighting Metrics
                </Typography>
                <Typography variant="body1" sx={{ ...commonFontStyle }}>
                    The overall rating is a weighted average of several normalized metrics:
                </Typography>
                <ul style={{ marginLeft: '20px', marginTop: '8px', fontFamily: 'Roboto, sans-serif' }}>
                    <li><strong>Points For</strong>: Represents 60% of the overall rating, highlighting the team's ability to score.</li>
                    <li><strong>Win Percentage</strong>: Accounts for 35% of the rating, reflecting the team's winning record.</li>
                    <li><strong>Waiver Budget Used</strong>: Contributes 5% to the rating. Teams that use their waiver budget efficiently are rewarded slightly.</li>
                </ul>
            </Box>

            <Typography variant="h5" sx={{ marginTop: 5, marginBottom: 3, ...commonFontStyle }}>
                Calculating Probabilities
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 2, ...commonFontStyle }}>
                We estimate each team's chances of making the playoffs by running 10,000 simulated scenarios of the remaining season. The following steps outline the process used to calculate these probabilities:
            </Typography>

            <Box sx={{ marginBottom: 3 }}>
                <Typography variant="h6" sx={{ marginBottom: 1, ...commonFontStyle }}>
                    1. Data Collection
                </Typography>
                <Typography variant="body1" sx={{ ...commonFontStyle }}>
                    Historical performance metrics are collected for each team, such as <code>pointsFor</code> and win/loss records. The current league standings and matchups are fetched from the Sleeper API to ensure the most up-to-date data.
                </Typography>
            </Box>

            <Box sx={{ marginBottom: 3 }}>
                <Typography variant="h6" sx={{ marginBottom: 1, ...commonFontStyle }}>
                    2. Assigning Win Probabilities
                </Typography>
                <Typography variant="body1" sx={{...commonFontStyle}}>
                    For each future matchup, win probabilities are assigned based on team strength metrics, such as their <code>overallRating</code> and  historical points scored.
                </Typography>
            </Box>

            <Box sx={{ marginBottom: 3 }}>
                <Typography variant="h6" sx={{ marginBottom: 1, ...commonFontStyle }}>
                    3. Simulating Matchups
                </Typography>
                <Typography variant="body1" sx={{ ...commonFontStyle }}>
                    Remaining matchups are simulated using a normal distribution. The simulation uses each team's historical average points scored and standard deviation to model variability. Random points are generated for each team to determine the winner of each matchup.
                </Typography>
            </Box>

            <Box sx={{ marginBottom: 3 }}>
                <Typography variant="h6" sx={{ marginBottom: 1, ...commonFontStyle }}>
                    4. Season Simulation
                </Typography>
                <Typography variant="body1" sx={{ ...commonFontStyle }}>
                    The entire remaining schedule is simulated 10,000 times. Each season updates win/loss records and points totals for every team. The outcomes of each matchup are stored to determine the season's final standings.
                </Typography>
            </Box>

            <Box sx={{ marginBottom: 3 }}>
                <Typography variant="h6" sx={{ marginBottom: 1, ...commonFontStyle }}>
                    5. Determining Playoff Teams
                </Typography>
                <Typography variant="body1" sx={{ ...commonFontStyle }}>
                    After each simulated season, teams are ranked based on their win/loss records and points scored as a tiebreaker. The top 5 teams qualify for the playoffs based on their records, while the 6th spot is awarded to the team with the highest points scored among the non-qualifying teams (the "Jordan Rule").
                </Typography>
            </Box>

            <Box sx={{ marginBottom: 3 }}>
                <Typography variant="h6" sx={{ marginBottom: 1, ...commonFontStyle }}>
                    6. Calculating Probabilities
                </Typography>
                <Typography variant="body1" sx={{ ...commonFontStyle }}>
                    After 10,000 simulations, the number of times each team made the playoffs is divided by the total number of simulations to determine their overall playoff probability. The probabilities of qualifying based on record or through the "Jordan Rule" are also calculated.
                </Typography>
            </Box>
        </Box>
    );
}

export default Methodology;
