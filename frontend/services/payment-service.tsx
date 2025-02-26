import HttpService from "@/utils/httpService";

export class PaymentService {
    /**
     * Process payment checkout
     */
    static async processPayment(
        paymentData: PaymentRequest
    ): Promise<PaymentResponse> {
        try {
            const response = await HttpService.post('/api/checkout', paymentData);
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message || 'Payment processing failed'
            );
        }
    }

    /**
     * Get payment history
     */
    static async getPaymentHistory() {
        try {
            const response = await HttpService.get('/api/checkout/history');
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message || 'Failed to fetch payment history'
            );
        }
    }

    /**
     * Validate card details
     */
    static validateCardDetails(cardDetails: CardDetails): boolean {
        const { card_number, expiry, cvv } = cardDetails;

        // Remove spaces from card number
        const cleanedCardNumber = card_number.replace(/\s/g, '');

        // Basic validation
        if (cleanedCardNumber.length !== 16) {
            throw new Error('Invalid card number');
        }

        if (!/^\d{3}$/.test(cvv)) {
            throw new Error('Invalid CVV');
        }

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
            throw new Error('Invalid expiry date');
        }

        return true;
    }

    /**
     * Validate address
     */
    static validateAddress(address: Address): boolean {
        const { address: streetAddress, city, postal_code, country } = address;

        if (!streetAddress || !city || !postal_code || !country) {
            throw new Error('All address fields are required');
        }

        return true;
    }

    /**
     * Clear all form fields
     */
    static clearFormFields(formState: PaymentFormState): void {
        formState.setAddress('');
        formState.setCity('');
        formState.setPostalCode('');
        formState.setCountry('');
        formState.setCardNumber('');
        formState.setExpiry('');
        formState.setCvv('');
        formState.setPaymentMethod('credit_card');
    }

    /**
     * Clear only address fields
     */
    static clearAddressFields(formState: PaymentFormState): void {
        formState.setAddress('');
        formState.setCity('');
        formState.setPostalCode('');
        formState.setCountry('');
    }

    /**
     * Clear only payment fields
     */
    static clearPaymentFields(formState: PaymentFormState): void {
        formState.setCardNumber('');
        formState.setExpiry('');
        formState.setCvv('');
    }
}

interface Address {
    address: string;
    city: string;
    postal_code: string;
    country: string;
}

interface CardDetails {
    card_number: string;
    expiry: string;
    cvv: string;
}

interface PaymentRequest {
    amount: number;
    subtotal: number;
    shipping_cost: number;
    tax: number;
    payment_method: 'credit_card' | 'paypal';
    address: string;
    city: string;
    postal_code: string;
    country: string;
    product_id?: string;
    quantity?: number;
    card_number?: string;
    expiry?: string;
    cvv?: string;
}

interface PaymentResponse {
    success: boolean;
    message: string;
    data?: {
        payment_id: string;
        transaction_id: string;
        amount: number;
        status: string;
    };
    error?: string;
}

interface PaymentFormState {
    setAddress: (value: string) => void;
    setCity: (value: string) => void;
    setPostalCode: (value: string) => void;
    setCountry: (value: string) => void;
    setCardNumber: (value: string) => void;
    setExpiry: (value: string) => void;
    setCvv: (value: string) => void;
    setPaymentMethod: (value: 'credit_card' | 'paypal') => void;
}