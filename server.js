const express = require('express');
const { google } = require('googleapis');
const app = express();
const port = 3000;
const cors = require('cors');
// Enable CORS for all routes
app.use(cors());


const sheets = google.sheets('v4');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const spreadsheetId = '1aJEVYDgVxhXVpOZrc8-JvHtwDXrX3v77jNZwPOad0vY';
const sheetName = 'Data';

const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json', // Path to your JSON key file
    scopes: SCOPES,
});

app.get('/api/data', async (req, res) => {
    const { blockNo, partNo, thickness } = req.query;

    try {
        const authClient = await auth.getClient();
        const response = await sheets.spreadsheets.values.get({
            auth: authClient,
            spreadsheetId,
            range: `${sheetName}!A:G`,
        });

        const rows = response.data.values;
        let filteredData = rows.filter(row => row[0] === blockNo);

        if (partNo) {
            filteredData = filteredData.filter(row => row[1] === partNo);
        }
        if (thickness) {
            filteredData = filteredData.filter(row => row[2] === thickness);
        }

        res.json(filteredData);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});