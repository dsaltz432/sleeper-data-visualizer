import axios from 'axios';

// const API_BASE_URL = 'http://localhost:3001/api/v1';
const API_BASE_URL = 'https://us-central1-fifth-boulder-274618.cloudfunctions.net/sleeper-data-puller/api/v1';

export const fetchReport = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/report`);
        return response.data;
    } catch (error) {
        console.error('Error fetching report:', error);
        return null;
    }
};
