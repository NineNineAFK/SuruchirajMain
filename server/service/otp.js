const otpStore = new Map();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTP(phone) {
  const otp = generateOTP();
  otpStore.set(phone, { otp, expires: Date.now() + 5 * 60 * 1000 });
  console.log(`Sending OTP ${otp} to phone ${phone}`);
  console.log("OTP sent to:", phone);  // No actual SMS
}

function verifyOTP(phone, inputOtp) {
  const entry = otpStore.get(phone);
  if (!entry || entry.expires < Date.now()) return false;
  console.log("OTP received:", otp); 
  return entry.otp === inputOtp;
  
}

module.exports = { sendOTP, verifyOTP };