# Generate Rod Licences

A script to generate junior salmon licences quickly. Looking at the [agreed-handler](https://github.com/DEFRA/rod-licensing/blob/v1.61.0/packages/gafl-webapp-service/src/handlers/agreed-handler.js) in rod-licensing it was determined there are 2 calls to the sales-api to generate a license. One call to create the transaction, then another to finalise it (other licences require more calls, because they are paid and require the payment journal to be updated)

## Prerequisites
See .nvmrc for the node version to use. Run `npm i` to install the dependencies. Create a `.env` file (use .env.example is a guide) and add the sales api url

## Running
Just run `npm start`. I would modify the script, at the moment it will create 100 licences
