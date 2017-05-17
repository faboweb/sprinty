import { h, stream, merge$, Router, initRouter } from 'zliq';
import {SprintProgress} from './sprint-progress.jsx';
import {SprintPlaning} from './sprint-planing.jsx';
import {githubOAuthFlow, logout} from './github-oauth.js';
import config from '../config.js';

const OAUTH_TOKEN = 'githubToken';

let router$ = initRouter(),
    gitOAuth$ = stream(getCookie(OAUTH_TOKEN)),
    owner$ = stream('faboweb'),
    project$ = stream('sprinty');

router$.map(({route, params}) => {
    if (params.code!==undefined) {
        gitOAuth$(params.code);
    }
})

let app = <div class="demo-layout-transparent mdl-layout mdl-js-layout">
    <main class="mdl-layout__content">
        <div class="mdl-grid">
            <div class="mdl-cell mdl-cell--4-col">
                {
                    gitOAuth$.map(x => x==''
                        ? <a class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
                            href={githubOAuthFlow(config.clientId)}>GitHub Login</a>
                        : <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
                            onclick={()=>logout(gitOAuth$)}>GitHub Logout</button>)
                }
            </div>
            <div class="mdl-cell mdl-cell--2-col">
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input class="mdl-textfield__input" id="org" onchange={e => owner$(e.target.value)} value={owner$}/>
                    <label class="mdl-textfield__label" for="org">Org</label>
                </div>
            </div>
            <div class="mdl-cell mdl-cell--2-col">
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input class="mdl-textfield__input" id="org" onchange={e => project$(e.target.value)} value={project$}/>
                    <label class="mdl-textfield__label" for="org">Project</label>
                </div>
            </div>
        </div>
        <div class="mdl-grid">
            <div class="mdl-cell mdl-cell--2-col">
                <a class="mdl-button mdl-js-button" href="/">Planing</a>
            </div>
            <div class="mdl-cell mdl-cell--2-col">
                <a class="mdl-button mdl-js-button" href="/report">Report</a>
            </div>
        </div>
        <div class="mdl-grid">
            <Router route='/report' router$={router$}>
                <SprintProgress gitOAuth$={gitOAuth$} owner$={owner$} project$={project$} />
            </Router>
            <Router route='/' router$={router$}>
                <SprintPlaning gitOAuth$={gitOAuth$} owner$={owner$} project$={project$} />
            </Router>
        </div>
    </main>
</div>;

document.querySelector('app').appendChild(app);

function isEmpty(milestone) {
    return Object.keys(milestone).length === 0 && milestone.constructor === Object
}

function toString(obj) {
    if (obj==null||obj.toString===undefined) return '';
    return obj.toString();
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
