import { stripe, paypal } from '../config/payment.js';
import Payment from '../models/Payment.js';

class PaymentService {
  // Stripe payment
  async processStripePayment(amount, currency = 'usd', description = '') {
    if (!stripe) {
      return {
        success: false,
        error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to your .env file'
      };
    }
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        description
      });

      return {
        success: true,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        paymentIntent
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async confirmStripePayment(paymentIntentId) {
    if (!stripe) {
      return {
        success: false,
        error: 'Stripe is not configured'
      };
    }
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        return {
          success: true,
          paymentIntent
        };
      }

      return {
        success: false,
        error: 'Payment not completed'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // PayPal payment
  async processPayPalPayment(amount, currency = 'USD', description = '') {
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      return {
        success: false,
        error: 'PayPal is not configured. Please add PayPal credentials to your .env file'
      };
    }
    return new Promise((resolve, reject) => {
      const createPaymentJson = {
        intent: 'sale',
        payer: {
          payment_method: 'paypal'
        },
        redirect_urls: {
          return_url: process.env.PAYPAL_RETURN_URL || 'http://localhost:3000/payment/success',
          cancel_url: process.env.PAYPAL_CANCEL_URL || 'http://localhost:3000/payment/cancel'
        },
        transactions: [{
          item_list: {
            items: [{
              name: description || 'Payment',
              sku: 'item',
              price: amount.toString(),
              currency,
              quantity: 1
            }]
          },
          amount: {
            currency,
            total: amount.toString()
          },
          description
        }]
      };

      paypal.payment.create(createPaymentJson, (error, payment) => {
        if (error) {
          resolve({
            success: false,
            error: error.response?.details?.[0]?.issue || error.message
          });
        } else {
          const approvalUrl = payment.links.find(link => link.rel === 'approval_url');
          resolve({
            success: true,
            paymentId: payment.id,
            approvalUrl: approvalUrl?.href
          });
        }
      });
    });
  }

  async confirmPayPalPayment(paymentId, payerId) {
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      return {
        success: false,
        error: 'PayPal is not configured'
      };
    }
    return new Promise((resolve, reject) => {
      const executePaymentJson = {
        payer_id: payerId
      };

      paypal.payment.execute(paymentId, executePaymentJson, (error, payment) => {
        if (error) {
          resolve({
            success: false,
            error: error.response?.details?.[0]?.issue || error.message
          });
        } else if (payment.state === 'approved') {
          resolve({
            success: true,
            payment
          });
        } else {
          resolve({
            success: false,
            error: 'Payment not approved'
          });
        }
      });
    });
  }

  // Local payment (cash, card, etc.)
  async processLocalPayment(amount, paymentMethod, description = '') {
    // For local payments, we just create a payment record
    // No actual payment processing needed
    return {
      success: true,
      paymentId: `local_${Date.now()}`,
      paymentMethod,
      amount,
      description
    };
  }

  // Unified payment processing
  async processPayment(paymentMethod, amount, currency, description, options = {}) {
    switch (paymentMethod) {
      case 'stripe':
        return await this.processStripePayment(amount, currency, description);
      case 'paypal':
        return await this.processPayPalPayment(amount, currency, description);
      case 'local':
      case 'cash':
      case 'card':
        return await this.processLocalPayment(amount, paymentMethod, description);
      default:
        return {
          success: false,
          error: 'Unsupported payment method'
        };
    }
  }

  // Save payment record
  async savePaymentRecord(paymentData) {
    try {
      const payment = await Payment.create(paymentData);
      return {
        success: true,
        payment
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new PaymentService();

