import { h, stream, merge$ } from 'zliq';
import { handleClientLoad, handleAuthClick, handleSignoutClick } from './google-oauth.js';
import moment from 'moment';

export const CapacityPlaning = () => {
    let googleOAuth$ = stream(false),
        calendars$ = stream([]),
        calendarsList$ = calendars$.map(calendars => {
            return calendars.map(calendar => {
                return <li onclick={()=>calendar$(calendar)}>{calendar.summary}</li>
            })
        }),
        calendar$ = stream({}),
        events$ = stream([]),
        startDate$ = stream(new Date()),
        endDate$ = stream(new Date(+new Date + 1000 * 60 * 60 * 24 * 14)),
        teamEmail$ = stream('team-omega@zalando.de');
    let eventsList$ = merge$(events$, teamEmail$).map(([events, email]) => {
            return events
                .filter(event => event.attendees!==undefined && event.attendees.find(attende=>attende.email===email))
                .map(event => {
                    return <li><a href={event.htmlLink}>{event.summary} - {getDuration(event)}</a></li>
                })
        });

    googleOAuth$.map(loggedIn=> {
        loggedIn && getCalendars(calendars$);
    });
    merge$(googleOAuth$, calendar$, startDate$, endDate$).map(([loggedIn, calendar, from, until]) => {
        if (!loggedIn || calendar.id===undefined || from==null || until==null) return;
        getEvents(calendar.id, events$, new Date(Date.parse(from)), new Date(Date.parse(until)))
    });

    return <div>
        <a href="/">Sprint Progress</a>
        <h2>Sprint Planing</h2>
         {
            googleOAuth$.map(x => x==''
                ? <button onclick={handleAuthClick}>Login</button>
                : <button onclick={handleSignoutClick}>Logout</button>)
        }
        <script async defer src="https://apis.google.com/js/api.js"
            onload={() => handleClientLoad(googleOAuth$)}>
        </script>
        <p>Calendar List</p>
        <ul>
            {calendarsList$}
        </ul>
        <p>Calendar: {calendar$.$('summary')}</p>
        <p>Team-Email: <input type="email" onchange={e=>teamEmail$(e.target.value)} value={teamEmail$} /></p>
        <p>Start: <input type="date" onchange={e=>startDate$(e.target.value)} /></p>
        <p>End: <input type="date" onchange={e=>endDate$(e.target.value)} /></p>
        <p>Team events:</p>
        <ul>
            {eventsList$}
        </ul>

    </div>
}

function getEvents(calendarId, events$, from, until) {
    gapi.client.request({
            'path': `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`
                + `?timeMin=${from.toISOString()}`
                + `&timeMax=${until.toISOString()}`
        })
        .then(res=>res.result.items)
        .then(events$);
}
/**
 * Load Google Calendar client library. List upcoming events
 * once client library is loaded.
 */
function loadCalendarApi(calendars$) {
    gapi.client.load('calendar', 'v3', ()=>getCalendars(calendars$));
}

function getCalendars(calendars$) {
     var request = gapi.client.calendar.calendarList.list();
    request.execute(function(resp) {
        calendars$(resp.items);
    });
}

function getDuration(event) {
    var start = moment(event.start.dateTime);
    var end = moment(event.end.dateTime);
    return end.diff(start, 'minutes') / 60;
}