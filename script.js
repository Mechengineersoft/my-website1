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