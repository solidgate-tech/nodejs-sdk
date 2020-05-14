const fetch = require("node-fetch");
const CryptoJS = require("crypto-js");
const crypto = require("crypto");
const sprintf = require('sprintf-js').sprintf

module.exports = class Api {
    static IV_LENGTH = 16;
    static KEY_LENGTH = 32;
    static BASE_SOLID_GATE_API_URI = 'https://pay.solidgate.com/api/v1/';

    static FORM_PATTERN_URL = 'form?merchant=%s&form_data=%s&signature=%s';
    static RESIGN_FORM_PATTERN_URL = 'form/resign?merchant=%s&form_data=%s&signature=%s';

    constructor(merchantId, privateKey, baseSolidGateUri = Api.BASE_SOLID_GATE_API_URI) {
        this.merchantId = merchantId;
        this.privateKey = privateKey;
        this.baseSolidGateUri = baseSolidGateUri;
    }

    charge(attributes) {
        return this._baseRequest('charge', attributes)
    }

    auth(attributes) {
        return this._baseRequest('auth', attributes)
    }

    recurring(attributes) {
        return this._baseRequest('recurring', attributes)
    }

    refund(attributes) {
        return this._baseRequest('refund', attributes)
    }

    status(attributes) {
        return this._baseRequest('status', attributes)
    }

    initPayment(attributes) {
        return this._baseRequest('init-payment', attributes)
    }

    settle(attributes) {
        return this._baseRequest('settle', attributes)
    }

    void(attributes) {
        return this._baseRequest('void', attributes)
    }

    resign(attributes) {
        return this._baseRequest('resign', attributes)
    }

    arnCode(attributes) {
        return this._baseRequest('arn-code', attributes)
    }

    applePay(attributes) {
        return this._baseRequest('apple-pay', attributes)
    }

    googlePay(attributes) {
        return this._baseRequest('google-pay', attributes)
    }

    formUrl(attributes) {
        let data = JSON.stringify(attributes);
        let payloadEncrypted = this._encryptPayload(data);

        return this.baseSolidGateUri + sprintf(
            Api.FORM_PATTERN_URL,
            this.merchantId,
            payloadEncrypted,
            this._generateSignature(payloadEncrypted)
        );
    }

    resignFormUrl(attributes) {
        let data = JSON.stringify(attributes);
        let payloadEncrypted = this._encryptPayload(data);

        return this.baseSolidGateUri + sprintf(
            Api.RESIGN_FORM_PATTERN_URL,
            this.merchantId,
            payloadEncrypted,
            this._generateSignature(payloadEncrypted)
        );
    }

    _encryptPayload(attributes) {
        let key = this.privateKey

        let iv = crypto.randomBytes(Api.IV_LENGTH);
        let cipher = crypto.createCipheriv('aes-256-cbc', key.substr(0, Api.KEY_LENGTH), iv);
        let encrypted = cipher.update(attributes);

        encrypted = Buffer.concat([iv, encrypted, cipher.final()]);
        return  encrypted.toString('base64').replace(/\+/g, '-').replace(/\//g, '_')
    }

    _baseRequest(path, attributes) {
        let data = JSON.stringify(attributes);

        return new Promise(((resolve, reject) => {
            fetch(this.baseSolidGateUri + path, {
                method: 'POST',
                headers: {
                    'Merchant': this.merchantId,
                    'Signature': this._generateSignature(data),
                    'Content-Type': 'application/json'
                },
                body: data
            })
                .then(res => resolve(res.json()))
                .catch(err => reject(err))
        }));
    }

    _generateSignature(attributes) {
        var hashed = CryptoJS.HmacSHA512(this.merchantId + attributes + this.merchantId, this.privateKey);

        return Buffer.from(hashed.toString()).toString('base64')
    }
}