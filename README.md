# Scheduler

## Run locally

This application requires [Node.js](https://nodejs.org/) and [MongoDB](https://docs.mongodb.com/manual/installation/) to run

### Installation
Install mongoDB, open a new terminal and run 

`$ mongod`

Open another terminal window and navigate to project directory and run

`$ npm install`

Create a .env file with and add the code below (not strings)

``` 
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://YOUR_DOMAIN/auth/google/callback
    
LINKEDIN_ID=
LINKEDIN_SECRET=
LINKEDIN_CALLBACK=http://YOUR_DOMAIN/auth/linkedin/callback

ZOOM_API_KEY=
ZOOM_API_SECRET=
ZOOM_USER_ID=

ADMIN_PASSWORD=
```

If you dont want to go through the trouble of creating the API keys, put in dummy numbers/text and the app should still work, however passport social login will not.

### Run App

`$ npm run build`

`$ npm start`


Open a browser and go to [http://localhost:8080](http://localhost:8080)