0. # Caveats

As of right now, the backend API is hosted on Heroku, but the URIs in the API fetches in the clinet app do not reflect this. Also the frontend is not hosted. It will be in the future. This means that in order to run the app localy, you need to set up your own Mongo database to be connected to the server API.

1. # Installation

Download this repo and the one titled [presentplaneraren-front].
run `npm i` to install dependencies and packages and `npm start` to start API server. Make sure to create your own .env file and include the following variables:
    DB_PASSWORD
    COOKIE_SESSION_KEYS
    SESSION_SECRET
    CORS_ORIGIN

In order for the Google OAuth to work (which it doesn't right now anyway), the following need to be included as well:
    GOOGLE_CLIENT_ID
    GOOGLE_CLIENT_SECRET

2. # Known issues and future fixes

    1. The Google OAuth login is not working. This is due to a conflict with the local auth method. Once the conflict is resolved, the method can be enabled in the front again.
    2. There is some restructuring of the database left to be done, since eg. members in groups are saved as object ids only and are presented as such in the front. They need to be remade into objects containing names/emails.
    3. In some cases, the hashed user password is sent back to the front together with other user info. This needs to be adressed.

