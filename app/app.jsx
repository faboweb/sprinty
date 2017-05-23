import { h, stream, merge$, Router, initRouter } from 'zliq';
import {SprintProgress} from './sprint-progress.jsx';
import {SprintPlaning} from './sprint-planing.jsx';
import {getGitCodeUrl, logout, getGitToken} from './github-oauth.js';
import config from '../config.js';

const OAUTH_CODE = 'githubCode';

let router$ = initRouter(),
    gitOAuthToken$ = stream(getCookie(OAUTH_CODE)),
    owner$ = stream(config.default_org),
    project$ = stream(config.default_repo);

router$.$(['route', 'params']).distinct().map(([route, params]) => {
    if (params.code!==undefined && gitOAuthToken$.value === '') {
        getGitToken(OAUTH_CODE, config.gitProxy + '/gittoken', params.code)
            .then(gitOAuthToken$);
    }
})

let app = <div class="demo-layout-transparent mdl-layout mdl-js-layout mdl-layout--fixed-header mdl-layout--fixed-tabs">
    <header class="mdl-layout__header">
        <div class="mdl-layout__header-row">
            <span class="mdl-layout-title">Sprinty</span>
            <div class="mdl-layout-spacer"></div>
            <div class="mdl-textfield mdl-js-textfield mdl-textfield--expandable mdl-textfield--floating-label mdl-textfield--align-right">
                <input class="mdl-textfield__input" id="org" onchange={e => owner$(e.target.value)} value={owner$}/>
                <label class="mdl-textfield__label" for="org">Org</label>
            </div>
            <div class="mdl-textfield mdl-js-textfield mdl-textfield--expandable mdl-textfield--floating-label mdl-textfield--align-right">
                <input class="mdl-textfield__input" id="org" onchange={e => project$(e.target.value)} value={project$}/>
                <label class="mdl-textfield__label" for="org">Project</label>
            </div>
            {
                gitOAuthToken$.map(x => x==''
                    ? <a class="mdl-button mdl-js-button mdl-button--align-right"
                        href={getGitCodeUrl(config.gitOAuthUrl, config.gitClientId)}>GitHub Login</a>
                    : <button class="mdl-button mdl-js-button mdl-button--align-right"
                        onclick={()=>logout(OAUTH_CODE, gitOAuthToken$)}>GitHub Logout</button>)
            }
        </div>
        <div class="mdl-layout__tab-bar">
            <a class={router$.$('route').map(route => "mdl-layout__tab" + (route === '/' ? ' is-active' : ''))}
                href="/">Planing</a>
            <a class={router$.$('route').map(route => "mdl-layout__tab" + (route === '/report' ? ' is-active' : ''))}
                href="/report">Report</a>
        </div>
    </header>
    <main class="mdl-layout__content">
        <div class="mdl-grid">
            <Router route='/report' router$={router$}>
                <SprintProgress gitOAuthToken$={gitOAuthToken$} owner$={owner$} project$={project$} router$={router$} />
            </Router>
            <Router route='/' router$={router$}>
                <SprintPlaning gitOAuthToken$={gitOAuthToken$} owner$={owner$} project$={project$} router$={router$} />
            </Router>
        </div>
    </main>
    <div id="toast-container" class="mdl-js-snackbar mdl-snackbar">
        <div class="mdl-snackbar__text"></div>
        <button class="mdl-snackbar__action" type="button"></button>
    </div>
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
