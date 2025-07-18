const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;
const client = twilio(accountSid, authToken);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { phone, otp } = req.body;

  try {
    const verificationCheck = await client.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: phone, code: otp });

    if (verificationCheck.status === 'approved') {
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false, message: 'Incorrect OTP' });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

