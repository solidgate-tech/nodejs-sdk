module.exports = class FormUpdateDTO {
    constructor(partialIntent, signature) {
        this.partialIntent = partialIntent
        this.signature = signature
    }

    getSignature() {
        return this.signature
    }

    getPartialIntent() {
        return this.partialIntent
    }

    toObject() {
        return {
            'partialIntent': this.getPartialIntent(),
            'signature': this.getSignature()
        }
    }
}
