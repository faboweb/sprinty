import { h, stream, merge$ } from 'zliq';
import {Issue} from './issue.jsx';
import Octokat from 'octokat';
import config from '../config.js';
import './planing.scss';
var generate = require('project-name-generator');

export const SprintPlaning = ({gitOAuthCode$, owner$, project$}) => {
    let issues$ = stream([]),
        pickedIssues$ = stream({}),
        startDate$ = stream(new Date()),
        endDate$ = stream(new Date(+new Date + 1000 * 60 * 60 * 24 * 14)),
        sprintName$ = stream(randomName());

    let pickedIssuesList$ = merge$(issues$, pickedIssues$).map(([issues, picked]) =>
        issues
            .filter(issue => picked[issue.id])
            .map(issue => <Issue issue={issue}
                onpick={pickIssue(issue, pickedIssues$)}
                onestimate={updateEstimate(owner$(), project$(), issue)} />));
    let unpickedIssuesList$ = merge$(issues$, pickedIssues$).map(([issues, picked]) =>
        issues
            .filter(issue => !picked[issue.id])
            .map(issue =>
                <Issue issue={issue}
                    onpick={pickIssue(issue, pickedIssues$)}
                    onestimate={updateEstimate(gitClient$(), owner$(), project$(), issue)} />));
    unpickedIssuesList$.map(console.log);

    merge$(owner$, project$)
        .map(([owner, repo]) => {
            fetch(`${config.gitProxy}/repos/${owner}/${repo}/issues?code=${gitOAuthCode$()}&state=open`)
                .then(
                    res => res.json(),
                    ()=>gitOAuthCode$('')
                )
                .then(data => issues$(data.items))
        });

    return <div>
        <h3>New Sprint</h3>
        <div class="mdl-grid">
            <div class="mdl-cell mdl-cell--3-col">
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input class="mdl-textfield__input" id="name" onchange={e => sprintName$(e.target.value)} value={sprintName$}/>
                    <label class="mdl-textfield__label" for="name">Sprint Name</label>
                </div>
            </div>
            <div class="mdl-cell mdl-cell--1-col">
                <button onclick={()=>sprintName$(randomName())} class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab">
                    <i class="material-icons">shuffle</i>
                </button>
            </div>
            <div class="mdl-cell mdl-cell--2-col">
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input class="mdl-textfield__input" type="date"
                        onchange={e=>startDate$(e.target.value)}
                        value={startDate$.map(formatDateInput)} />
                    <label class="mdl-textfield__label" for="org">Start Date</label>
                </div>
            </div>
            <div class="mdl-cell mdl-cell--2-col">
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input class="mdl-textfield__input" type="date"
                        onchange={e=>endDate$(e.target.value)}
                        value={endDate$.map(formatDateInput)} />
                    <label class="mdl-textfield__label" for="org">End Date</label>
                </div>
            </div>
        </div>
        <h4>Sprint:</h4>
        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
            <thead>
                <tr>
                    <th class="mdl-data-table__cell--non-numeric">Title</th>
                    <th class="mdl-data-table__cell--non-numeric"></th>
                    <th class="mdl-data-table__cell--non-numeric">Estimate</th>
                    <th class="mdl-data-table__cell--non-numeric"></th>
                </tr>
            </thead>
            <tbody>
                {pickedIssuesList$}
            </tbody>
        </table>
        <h4>Backlog:</h4>
        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
            <thead>
                <tr>
                    <th class="mdl-data-table__cell--non-numeric">Title</th>
                    <th class="mdl-data-table__cell--non-numeric"></th>
                    <th class="mdl-data-table__cell--non-numeric">Estimate</th>
                    <th class="mdl-data-table__cell--non-numeric"></th>
                </tr>
            </thead>
            <tbody>
            {unpickedIssuesList$}
            </tbody>
        </table>
    </div>;
}

function formatDateInput(date) {
    return date.toISOString().substr(0, 10);
}

function randomName() {
    return generate({ words: 3 }).spaced;
}

const pickIssue = (issue, pickedIssues$) => () => {
    let patch = {};
    patch[issue.id] = !pickedIssues$.value[issue.id];
    pickedIssues$.patch(patch);
}

const updateEstimate = (octo, code, owner, project, issue) => (estimate) => {
    issue.labels = issue.labels
        .filter(label => !label.name.startsWith('size '))
        .concat({
            "name": `size ${estimate}`,
            "color": "f29513"
            });
    octo.repos(owner, project).issues(issue.number).update(issue);
}