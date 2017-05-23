import { h, stream, merge$, fetchy } from 'zliq';
import {MilestoneChart} from './chart.jsx';
import config from '../config.js';

export const SprintProgress = ({gitOAuthToken$, owner$, project$}) => {
    let milestones$ = stream([]),
        milestone$ = stream({}),
        events$ = stream([]),
        issues$ = stream([]);
    let milestoneList$ = milestones$.map(milestones =>
        milestones.map(milestone =>
            <li
                class="mdl-list__item"
                onclick={(() => milestone$(milestone))}>{milestone.title}</li>));
    let issuesList$ = issues$.map(issues =>
        issues.map(issue =>
            <li class="mdl-list__item"><a href={issue.html_url}>{issue.title}, {issue.state}</a></li>));

    merge$(owner$, project$, gitOAuthToken$)
        .map(([owner, repo, token]) => {
            if (owner != '' && repo != '' && token!='') {
                fetch(`${config.gitProxy}/repos/${owner}/${repo}/milestones`,
                    {
                        headers: {
                            'Authorization': `token ${token}`
                        }
                    })
                .then(res => res.json())
                .then(data => milestones$(data));
            }
        });
    merge$(owner$, project$, milestone$, gitOAuthToken$)
        .map(([owner, repo, milestone, token]) => {
            if (isEmpty(milestone) || token == '') return;
            fetch(`${config.gitProxy}/repos/${owner}/${repo}/issues/events?milestone=${milestone.number}`,
                {
                    headers: {
                        'Authorization': `token ${token}`
                    }
                })
            .then(res => res.json())
            .then(data => events$(data));
        });
    merge$(owner$, project$, milestone$, gitOAuthToken$)
        .map(([owner, repo, milestone, token]) => {
            if (isEmpty(milestone) || token == '') return;
            fetch(`${config.gitProxy}/repos/${owner}/${repo}/issues?milestone=${milestone.number}`,
                {
                    headers: {
                        'Authorization': `token ${token}`
                    }
                })
            .then(res => res.json())
            .then(data => issues$(data));
        });

    return <div>
        <h2>Sprint Progress</h2>
        <h3>Milestones</h3>
        <ul class="mdl-list">
            {milestoneList$}
            {milestoneList$.map(x => x.length == 0 ? <li>'No milestones in repo'</li> : null)}
        </ul>
        {
            milestone$.map(isEmpty)
            .map(empty => {
                if (empty) return null;
                return <div>
                    <h3>Milestone '{milestone$.$('title')}'</h3>
                    <p>
                        From: {milestone$.$('created_at').map(renderDate)},<br />
                        Until: {milestone$.$('due_on').map(renderDate)}
                    </p>
                    <h3>Burndown:</h3>
                    <div style="max-height: 300px">
                        {
                            milestone$.$(['created_at', 'due_on']).map(([createdAt, dueOn]) => {
                                if (dueOn==null) return <p>Please define a due date to show a burndown chart.</p>;
                                return <MilestoneChart from={new Date(Date.parse(createdAt))} until={new Date(Date.parse(dueOn))} events$={events$} />;
                            })
                        }
                    </div>
                    <h3>Issues:</h3>
                    <ul class="mdl-list">
                        {issuesList$}
                    </ul>
                </div>;
            })
        }
    </div>;
}

function isEmpty(milestone) {
    return Object.keys(milestone).length === 0 && milestone.constructor === Object
}

function renderDate(date) {
    if (date === null || date.substr===undefined) {
        return 'Not terminated'
    }
    date = new Date(Date.parse(date));
    var mm = date.getMonth() + 1; // getMonth() is zero-based
    var dd = date.getDate();

    return [
        (dd>9 ? '' : '0') + dd,
        (mm>9 ? '' : '0') + mm,
    ].join('.');
};