const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;

const client = twilio(accountSid, authToken);

// Route to send OTP
app.post('/send-otp', async (req, res) => {
  const { phone } = req.body;

  try {
    const verification = await client.verify.v2
      .services(verifySid)
      .verifications.create({ to: phone, channel: 'sms' });

    res.send({ success: true, sid: verification.sid });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

// Route to verify OTP
app.post('/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;

  try {
    const verificationCheck = await client.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: phone, code: otp });

    if (verificationCheck.status === 'approved') {
      res.send({ success: true });
    } else {
      res.status(400).send({ success: false, message: 'Incorrect OTP' });
    }
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

app.listen(5000, () => console.log('OTP Server running on http://localhost:5000'));
app.get('/', (req, res) => {
  res.send('Twilio OTP Server is running!');
});
