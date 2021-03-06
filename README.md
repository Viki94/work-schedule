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

Can be added some values as numbers/text but social login and zoom meetings will not work.

### Run App

`$ npm run build`

`$ npm start`


Open a browser and go to [http://localhost:8080](http://localhost:8080)