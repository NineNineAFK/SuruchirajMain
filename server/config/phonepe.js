// PhonePe Configuration (SDK-based)
// Copy this file to phonepe.config.js and update with your actual credentials

module.exports = {
    // Test Environment (Default)
    test: {
        clientId: 'TEST-M23Q51DU7KFZ4_25060',
        clientSecret: 'M2Y1ZTA1ZTAtNzY4Yy00ZjlhLWIxNGQtOWYwMTJjOGMwZWY0',
        clientVersion: 1,
        env: 'SANDBOX',
        redirectUrl: 'http://localhost:3000/api/payment/redirect'
    },
    
    // Production Environment
    production: {
        clientId: process.env.PHONEPE_CLIENT_ID,
        clientSecret: process.env.PHONEPE_CLIENT_SECRET,
        clientVersion: parseInt(process.env.PHONEPE_CLIENT_VERSION) || 1,
        env: 'PRODUCTION',
        redirectUrl: process.env.PHONEPE_REDIRECT_URL
    }
}; 