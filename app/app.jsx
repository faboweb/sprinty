import {h, stream, merge$} from 'zliq';
import Octokat from 'octokat';
import config from '../config.js';
import {initGitHub, getProjects} from '../src/github-projects.js';

let org$ = stream(''),
    project$ = stream(''),
    milestones$ = stream([]);
let milestoneList$ = milestones$.map(mS => mS.length > 0 ? <li onclick={(()=>alert('selected ', mS.url))}>{mS.name}</li> : null);

merge$(org$, project$)
    .map(([org, project]) => {
        if (org!='' && project!='') {
            octo.orgs('ais').projects.fetch()
                .then(milestones$);}});

let app = <div>
    Org: <input onchange={e=>org$(e.target.value)} />
    Project: <input onchange={e=>project$(e.target.value)} />
    <ul>
        {milestoneList$}
    </ul>
</div>;

let octo = new Octokat({
    token:config.token,
    rootURL: config.host,
    acceptHeader: 'application/vnd.github.cannonball-preview+json'
});

document.querySelector('app').appendChild(app);