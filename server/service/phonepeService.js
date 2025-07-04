const { StandardCheckoutClient, Env, StandardCheckoutPayRequest } = require('pg-sdk-node');
const { randomUUID } = require('crypto');

class PhonePeService {
    constructor() {
        // Use environment variables with fallback to test credentials
        this.clientId = process.env.PHONEPE_CLIENT_ID || 'TEST-M23Q51DU7KFZ4_25060';
        this.clientSecret = process.env.PHONEPE_CLIENT_SECRET || 'M2Y1ZTA1ZTAtNzY4Yy00ZjlhLWIxNGQtOWYwMTJjOGMwZWY0';
        this.clientVersion = parseInt(process.env.PHONEPE_CLIENT_VERSION) || 1;
        this.env = process.env.NODE_ENV === 'production' ? Env.PRODUCTION : Env.SANDBOX;
        this.redirectUrl = process.env.PHONEPE_REDIRECT_URL || process.env.URL + '/payment/redirect';
        
        // Development mode flag
        this.devMode = process.env.NODE_ENV === 'development' || process.env.PHONEPE_DEV_MODE === 'true';
        
        // Initialize PhonePe client
        if (!this.devMode) {
            this.client = StandardCheckoutClient.getInstance(
                this.clientId, 
                this.clientSecret, 
                this.clientVersion, 
                this.env
            );
        }
    }

    // Generate merchant transaction ID
    generateMerchantTransactionId() {
        return randomUUID();
    }

    // Initiate payment using PhonePe SDK
    async initiatePayment(orderData) {
        try {
            // Development mode - return mock response
            if (this.devMode) {
                console.log('PhonePe DEV MODE: Using mock payment response');
                const merchantTransactionId = this.generateMerchantTransactionId();
                
                return {
                    success: true,
                    redirectUrl: `${process.env.URL}/payment/mock-success?merchantTransactionId=${merchantTransactionId}`,
                    merchantTransactionId: merchantTransactionId,
                    transactionId: 'MOCK_TXN_' + Date.now()
                };
            }

            const merchantOrderId = this.generateMerchantTransactionId();
            const amount = Math.round(orderData.totalAmount * 100); // Convert to paise

            console.log('PhonePe SDK Config:', {
                clientId: this.clientId,
                clientVersion: this.clientVersion,
                env: this.env === Env.SANDBOX ? 'SANDBOX' : 'PRODUCTION',
                merchantOrderId,
                amount,
                redirectUrl: this.redirectUrl
            });

            // Use ngrok URL for redirect and callback
            const redirectUrl = 'https://59bd-163-223-67-3.ngrok-free.app/api/payment/redirect';
            const callbackUrl = 'https://59bd-163-223-67-3.ngrok-free.app/api/payment/callback';
            // Create payment request using SDK
            const request = StandardCheckoutPayRequest.builder()
                .merchantOrderId(merchantOrderId)
                .amount(amount)
                .redirectUrl(redirectUrl)
                // .callbackUrl(callbackUrl) // Uncomment if SDK supports callbackUrl
                .build();

            // Log the final payment request
            console.log('Final Payment Request:', request);

            // Initiate payment
            const response = await this.client.pay(request);
            
            console.log('PhonePe SDK Response:', response);

            if (response && response.redirectUrl) {
                return {
                    success: true,
                    redirectUrl: response.redirectUrl,
                    merchantTransactionId: merchantOrderId,
                    transactionId: response.transactionId || response.orderId || 'TXN_' + Date.now()
                };
            } else {
                throw new Error('Invalid response from PhonePe SDK');
            }

        } catch (error) {
            console.error('PhonePe SDK payment initiation error:', error);
            throw error;
        }
    }

    // Verify payment status using PhonePe SDK
    async verifyPayment(merchantOrderId) {
        try {
            if (this.devMode) {
                return {
                    success: true,
                    state: 'PAYMENT_SUCCESS',
                    message: 'Mock payment verification successful'
                };
            }

            const response = await this.client.getOrderStatus(merchantOrderId);
            
            console.log('PhonePe SDK Status Response:', response);

            return {
                success: true,
                state: response.state,
                message: response.message || 'Payment status retrieved successfully'
            };

        } catch (error) {
            console.error('PhonePe SDK payment verification error:', error);
            throw error;
        }
    }

    // Validate callback using PhonePe SDK
    validateCallback(username, password, authorizationHeader, callbackBody) {
        try {
            if (this.devMode) {
                return {
                    success: true,
                    orderId: 'MOCK_ORDER_ID',
                    state: 'PAYMENT_SUCCESS'
                };
            }

            const callbackResponse = this.client.validateCallback(
                username,
                password,
                authorizationHeader,
                callbackBody
            );

            return {
                success: true,
                orderId: callbackResponse.payload.orderId,
                state: callbackResponse.payload.state
            };

        } catch (error) {
            console.error('PhonePe SDK callback validation error:', error);
            throw error;
        }
    }
}

module.exports = new PhonePeService(); 