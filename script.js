// Existing searchData function
async function searchData() {
    const blockNo = document.getElementById('blockNo').value;
    const partNo = document.getElementById('partNo').value;
    const thickness = document.getElementById('thickness').value;

    if (!blockNo) {
        alert('Block No is required');
        return;
    }

    try {
        const response = await fetch(`/.netlify/functions/fetchData?blockNo=${blockNo}&partNo=${partNo}&thickness=${thickness}`);
        const data = await response.json();
        console.log('API Response:', data); // Log the API response
        displayData(data);
    } catch (error) {
        console.error('Error fetching data:', error); // Log any errors
    }
}

// Existing displayData function
function displayData(data) {
    const tableBody = document.querySelector('#dataTable tbody');
    const colorDisplay = document.getElementById('colorDisplay');
    tableBody.innerHTML = '';

    if (data.length > 0) {
        const [blockNo, partNo, thickness, nos, colour1, colour2] = data[0];
        colorDisplay.innerHTML = `Fac Colour: ${colour1} <br> Sub Colour: ${colour2}`;
        colorDisplay.style.color = colour1;
        colorDisplay.style.backgroundColor = colour2;

        data.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    } else {
        colorDisplay.innerHTML = 'No data found';
        colorDisplay.style.color = 'black';
        colorDisplay.style.backgroundColor = 'transparent';
    }
}

// Existing clearData function
function clearData() {
    document.getElementById('blockNo').value = '';
    document.getElementById('partNo').value = '';
    document.getElementById('thickness').value = '';
    document.getElementById('colorDisplay').innerHTML = '';
    document.querySelector('#dataTable tbody').innerHTML = '';
}

// New sign-up and OTP functions
async function sendOTP() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const mobile = document.getElementById('mobile').value;

    const response = await fetch('/.netlify/functions/auth', {
        method: 'POST',
        body: JSON.stringify({ action: 'generate', email, mobile }),
    });

    const result = await response.json();
    if (response.ok) {
        document.getElementById('signupForm').style.display = 'none';
        document.getElementById('otpForm').style.display = 'block';
        document.getElementById('message').textContent = 'OTP sent to your email and mobile.';
    } else {
        document.getElementById('message').textContent = result.error || 'Failed to send OTP.';
    }
}

async function verifyOTP() {
    const email = document.getElementById('email').value;
    const otp = document.getElementById('otp').value;

    const response = await fetch('/.netlify/functions/auth', {
        method: 'POST',
        body: JSON.stringify({ action: 'verify', email, otp }),
    });

    const result = await response.json();
    if (response.ok) {
        document.getElementById('message').textContent = 'OTP verified! Sign-up successful.';
    } else {
        document.getElementById('message').textContent = result.error || 'Invalid OTP.';
    }
}