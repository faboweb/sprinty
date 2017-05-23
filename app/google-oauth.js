import config from './config.js';

var CLIENT_ID = config.googleClientId;

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

/**
 *  On load, called to load the auth2 library and API client library.
 */
export function handleClientLoad(googleOAuth$) {
    gapi.load('client:auth2', () => initClient(googleOAuth$));
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient(googleOAuth$) {
        gapi.client.init({
            discoveryDocs: DISCOVERY_DOCS,
            clientId: CLIENT_ID,
            scope: SCOPES
        }).then(function () {
            // Listen for sign-in state changes.
            gapi.auth2.getAuthInstance().isSignedIn.listen(googleOAuth$);

            // Handle the initial sign-in state.
            googleOAuth$(gapi.auth2.getAuthInstance().isSignedIn.get());
        });
}

/**
 *  Sign in the user upon button click.
 */
export function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
export function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}