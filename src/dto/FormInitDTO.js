module.exports = class FormInitDTO {
    constructor(paymentIntent, merchant, signature) {
        this.paymentIntent = paymentIntent
        this.signature = signature
        this.merchant = merchant
    }

    getSignature() {
        return this.signature
    }

    getMerchant() {
        return this.merchant
    }

    getPaymentIntent() {
        return this.paymentIntent
    }

    toObject() {
        return {
            'paymentIntent': this.getPaymentIntent(),
            'merchant': this.getMerchant(),
            'signature': this.getSignature()
        }
    }
}
