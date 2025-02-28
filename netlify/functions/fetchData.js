const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const spreadsheetId = '1aJEVYDgVxhXVpOZrc8-JvHtwDXrX3v77jNZwPOad0vY';
const sheetName = 'Data';

const auth = new google.auth.GoogleAuth({
  credentials: {
    type: 'service_account',
    project_id: 'login-451104',
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
  },
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