# Solidgate API

[![npm](https://img.shields.io/npm/v/@solidgate/node-sdk?maxAge=1000)](https://www.npmjs.com/package/@solidgate/node-sdk)

Node.js SDK provides API options for integrating Solidgate’s payment orchestrator into your Node.js applications.

Check our
* <a href="https://docs.solidgate.com/" target="_blank">Payment guide</a> to understand business value better
* <a href="https://api-docs.solidgate.com/" target="_blank">API Reference</a> to find more examples of usage

## Structure

<table style="width: 100%; background: transparent;">
  <colgroup>
    <col style="width: 50%;">
    <col style="width: 50%;">
  </colgroup>
  <tr>
    <th>SDK for Node.js contains</th>
    <th>Table of contents</th>
  </tr>
  <tr>
    <td>
      <code>src/solidgate/</code> – main library source code for development<br>
      <code>package.json</code> – script for managing dependencies and library imports<br>
      <code>index.js</code> – entry point for the SDK
    </td>
    <td>
      <a href="https://github.com/solidgate-tech/nodejs-sdk?tab=readme-ov-file#requirements">Requirements</a><br>
      <a href="https://github.com/solidgate-tech/nodejs-sdk?tab=readme-ov-file#installation">Installation</a><br>
      <a href="https://github.com/solidgate-tech/nodejs-sdk?tab=readme-ov-file#usage">Usage</a><br>
      <a href="https://github.com/solidgate-tech/nodejs-sdk?tab=readme-ov-file#errors">Errors</a>
    </td>
  </tr>
</table>

## Requirements

* **Node.js**: 12 or later
* **npm**: Node.js package manager
* **Solidgate account**: Public and secret key (request via <a href="mailto:sales@solidgate.com">sales@solidgate.com</a>)

<br>

## Installation

To install the Node.js SDK:

1. Ensure you have your public and secret key.
2. Run:
   ```bash
   npm install @solidgate/node-sdk
   ```
3. Import the SDK into your Node.js application:
   ```js
   const solidGate = require('@solidgate/node-sdk');
   ```
4. Use test credentials to validate your integration before deploying to production.

<br>

## Usage

### Charge a payment

Returns a Promise.

```js
const solidGate = require('@solidgate/node-sdk');

let api = new solidGate.Api("merchant", "private_key", "base_solidgate_url");

let promise = api.charge({
    'amount': 10000,
    'currency': 'USD',
    'customer_email': 'test@testmail.com',
    'order_description': 'Premium package',
    'order_id': "213",
    'platform': 'WEB',
    'geo_country': 'ESP',
    'form_design_name': 'form-design',
});

promise.then((res) => {
//do smth
})

```

### Payment form URL

Returns a `FormInitDTO` class.

```js
const solidGate = require('@solidgate/node-sdk');

let api = new solidGate.Api("merchant", "private_key");

let merchantData = api.formMerchantData({
  'amount': 10000,
  'currency': 'USD',
  'customer_email': 'test@testmail.com',
  'order_description': 'Premium package',
  'order_id': "213",
  'platform': 'WEB',
  'geo_country': 'ESP',
  'form_design_name': 'form-design',
});

const dataToFront = merchantData.toObject()
```

### Payment form DTO

Return `FormInitDTO` class.

```js
const solidGate = require('@solidgate/node-sdk');

let api = new solidGate.Api("merchant", "private_key");

let dto = api.formMerchantData({
  'amount': 10000,
  'currency': 'USD',
  'customer_email': 'test@testmail.com',
  'order_description': 'Premium package',
  'order_id': "213",
  'platform': 'WEB',
  'geo_country': 'ESP',
});

const dataToFront = dto.toObject()
```

These values should be applied on the FrontEnd in the following way.

```js
const form = PaymentFormSdk.init({
    merchantData: dataToFront // from backend
})
```

### Payment form update

Return `FormUpdateDTO` class

```js
const solidGate = require('@solidgate/node-sdk');

let api = new solidGate.Api("merchant", "private_key");

let dto = api.formUpdate({
  'amount': 10000,
  'currency': 'USD',
  'customer_email': 'test@testmail.com',
  'order_description': 'Premium package',
  'platform': 'WEB',
  'geo_country': 'ESP',
});

const dataToFront = dto.toObject()
```

These values should be applied on the FrontEnd in the following way.

```js
const form.update(dataToFront)
```

### Payment form resign

Return `FormResignDTO` class.

```js
const solidGate = require('@solidgate/node-sdk');

let api = new solidGate.Api("merchant", "private_key");

let dto = api.formResign({
  'amount': 10000,
  'currency': 'USD',
  'customer_email': 'test@testmail.com',
  'order_description': 'Premium package',
  'order_id': "213",
  'platform': 'WEB',
  'geo_country': 'ESP',
  'recurring_token': 'some_token',
});

const dataToFront = dto.toObject();
```

These values should be applied on the FrontEnd in the following way.

```js
const form = PaymentFormSdk.resign(dataToFront);
```

<br>

## Errors

Handle <a href="https://docs.solidgate.com/payments/payments-insights/error-codes/" target="_blank">errors</a>.

```js
api.charge({...}).catch((error) => console.error(error));
```