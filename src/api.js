const fetch = require("node-fetch");
const CryptoJS = require("crypto-js");
const crypto = require("crypto");
const sprintf = require('sprintf-js').sprintf

const FormInitDTO = require("./dto/FormInitDTO");
const FormUpdateDTO = require("./dto/FormUpdateDTO");
const FormResignDTO = require("./dto/FormResignDTO");

module.exports = class Api {
    static IV_LENGTH = 16;
    static KEY_LENGTH = 32;
    static BASE_SOLID_GATE_API_URI = 'https://pay.solidgate.com/api/v1/';

    constructor(publicKey, secretKey, baseSolidGateUri = Api.BASE_SOLID_GATE_API_URI) {
        this.publicKey = publicKey;
        this.secretKey = secretKey;
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

    formMerchantData(attributes) {
        let data = JSON.stringify(attributes);
        let payloadEncrypted = this._encryptPayload(data);

        return new FormInitDTO(payloadEncrypted, this.publicKey, this._generateSignature(payloadEncrypted));
    }

    formUpdate(attributes) {
        if (attributes['order_id']) {
            console.warn('Deprecation warning: order_id update is forbidden')
        }

        let data = JSON.stringify(attributes);
        let payloadEncrypted = this._encryptPayload(data);

        return new FormUpdateDTO(payloadEncrypted, this._generateSignature(payloadEncrypted));
    }

    formResign(attributes) {
        let data = JSON.stringify(attributes);
        let payloadEncrypted = this._encryptPayload(data);

        return new FormResignDTO(payloadEncrypted, this.publicKey, this._generateSignature(payloadEncrypted));
    }

    _encryptPayload(attributes) {
        let key = this.secretKey

        let iv = crypto.randomBytes(Api.IV_LENGTH);
        let cipher = crypto.createCipheriv('aes-256-cbc', key.substr(0, Api.KEY_LENGTH), iv);
        let encrypted = cipher.update(attributes);

        encrypted = Buffer.concat([iv, encrypted, cipher.final()]);
        return encrypted.toString('base64').replace(/\+/g, '-').replace(/\//g, '_')
    }

    _baseRequest(path, attributes) {
        let data = JSON.stringify(attributes);

        return new Promise(((resolve, reject) => {
            fetch(this.baseSolidGateUri + path, {
                method: 'POST',
                headers: {
                    'Merchant': this.publicKey,
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
        var hashed = CryptoJS.HmacSHA512(this.publicKey + attributes + this.publicKey, this.secretKey);

        return Buffer.from(hashed.toString()).toString('base64')
    }
}
