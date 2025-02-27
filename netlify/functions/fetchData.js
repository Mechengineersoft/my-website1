const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const spreadsheetId = '1aJEVYDgVxhXVpOZrc8-JvHtwDXrX3v77jNZwPOad0vY';
const sheetName = 'Data';

const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json', // Path to your JSON key file
  scopes: SCOPES,
});

exports.handler = async (event, context) => {
  const { blockNo, partNo, thickness } = event.queryStringParameters;

  try {
    const authClient = await auth.getClient();
    const sheets = google.sheets('v4');
    const response = await sheets.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId,
      range: `${sheetName}!A:G`,
    });

    const rows = response.data.values;
    let filteredData = rows.filter((row) => row[0] === blockNo);

    if (partNo) {
      filteredData = filteredData.filter((row) => row[1] === partNo);
    }
    if (thickness) {
      filteredData = filteredData.filter((row) => row[2] === thickness);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(filteredData),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};