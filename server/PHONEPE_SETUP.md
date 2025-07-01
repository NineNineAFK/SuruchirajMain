# PhonePe Integration Setup Guide

## Development Mode (Recommended for Testing)

To use the mock payment system for development:

1. **Set environment variable:**
   ```bash
   # Windows
   set PHONEPE_DEV_MODE=true
   
   # Linux/Mac
   export PHONEPE_DEV_MODE=true
   ```

2. **Or set NODE_ENV to development:**
   ```bash
   set NODE_ENV=development
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

In development mode, the payment system will:
- Skip actual PhonePe API calls
- Return mock payment responses
- Allow you to test the complete payment flow
- Redirect to success page after mock payment

## Production Mode (Real PhonePe Integration)

To use real PhonePe integration:

### 1. Register with PhonePe
- Visit [PhonePe Merchant Portal](https://merchant.phonepe.com/)
- Complete merchant registration
- Get your credentials from PhonePe

### 2. Set Environment Variables
Create a `.env` file in your project root:

```env
# PhonePe Production Credentials (SDK)
PHONEPE_CLIENT_ID=your_actual_client_id
PHONEPE_CLIENT_SECRET=your_actual_client_secret
PHONEPE_CLIENT_VERSION=1
PHONEPE_REDIRECT_URL=https://yourdomain.com/api/payment/redirect

# Environment
NODE_ENV=production

# Disable development mode
PHONEPE_DEV_MODE=false
```

### 3. Update Frontend URLs
Update the redirect URLs in your frontend to match your production domain.

## PhonePe SDK Configuration

The integration now uses the official PhonePe SDK (`pg-sdk-node`) which provides:

- **StandardCheckoutClient**: For payment initiation
- **StandardCheckoutPayRequest**: For building payment requests
- **Order status checking**: For verifying payment status
- **Callback validation**: For secure callback processing

### SDK Features Used:
1. **Payment Initiation**: `client.pay(request)`
2. **Order Status**: `client.getOrderStatus(merchantOrderId)`
3. **Callback Validation**: `client.validateCallback()`

## Current Test Credentials (NOT WORKING)

The current hardcoded credentials are **example values only**:
- Client ID: `TEST-M23Q51DU7KFZ4_25060`
- Client Secret: `M2Y1ZTA1ZTAtNzY4Yy00ZjlhLWIxNGQtOWYwMTJjOGMwZWY0`

These will **always fail** because they're not real credentials.

## Testing the Payment Flow

1. **Add items to cart**
2. **Proceed to checkout**
3. **Select delivery address**
4. **Click "Proceed to Payment"**
5. **In development mode:** You'll be redirected to success page
6. **In production mode:** You'll be redirected to PhonePe payment page

## Troubleshooting

### "Key not found for the merchant" Error
- This means you're using the example credentials
- Switch to development mode or get real PhonePe credentials

### Port 3000 Already in Use
- Kill existing Node.js processes: `taskkill /F /IM node.exe`
- Or change the port in your server configuration

### Payment Callback Issues
- Ensure your callback URLs are accessible from PhonePe's servers
- Check that your server is running and accessible

### SDK Installation Issues
- Make sure `pg-sdk-node` is installed: `npm install pg-sdk-node`
- Check Node.js version compatibility (requires Node.js 14+)

## PhonePe SDK Documentation

For more details, refer to the official PhonePe SDK documentation:
- [PhonePe SDK Node.js Documentation](https://developer.phonepe.com/docs)
- [Standard Checkout Integration](https://developer.phonepe.com/docs/standard-checkout) 