import { h, stream, merge$ } from 'zliq';
import {MilestoneChart} from './chart.jsx';
import Octokat from 'octokat';
import config from '../config.js';

let octo = new Octokat({
    token: config.token,
    // rootURL: config.host,
    // acceptHeader: 'application/vnd.github.cannonball-preview+json'
});

export const SprintProgress = ({gitOAuth$, owner$, project$}) => {
    let milestones$ = stream([]),
        milestone$ = stream({}),
        events$ = stream([]),
        issues$ = stream([]);
    let milestoneList$ = milestones$.map(milestones =>
        milestones.map(milestone =>
            <li onclick={(() => milestone$(milestone))}>{milestone.title}</li>));
    let issuesList$ = issues$.map(issues =>
        issues.map(issue =>
            <li><a href={issue.htmlUrl}>{issue.title}, {issue.state}</a></li>));

    merge$(owner$, project$)
        .map(([owner, project]) => {
            if (owner != '' && project != '') {
                octo.repos(owner, project).milestones.fetch()
                    .then(res => milestones$(res.items));
            }
        });
    merge$(owner$, project$, milestone$)
        .map(([owner, project, milestone]) => {
            if (isEmpty(milestone)) return;
            octo.repos(owner, project).issues.events.fetch({milestone: milestone.number})
                .then(res => events$(res.items.reverse()));
        });
    merge$(owner$, project$, milestone$)
        .map(([owner, project, milestone]) => {
            if (isEmpty(milestone)) return;
            octo.repos(owner, project).issues.fetch({milestone: milestone.number})
                .then(res => issues$(res.items));
        });

    return <div>
        <h2>Sprint Progress</h2>
        <h3>Milestones</h3>
        <ul>
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
                        From: {milestone$.$('createdAt').map(renderDate)},<br />
                        Until: {milestone$.$('dueOn').map(renderDate)}
                    </p>
                    <h3>Burndown:</h3>
                    <div style="max-height: 300px">
                        {
                            milestone$.$(['createdAt', 'dueOn']).map(([createdAt, dueOn]) => {
                                if (dueOn==null) return <p>Please define a due date to show a burndown chart.</p>;
                                return <MilestoneChart from={createdAt} until={new Date(Date.parse(dueOn))} events$={events$} />;
                            })
                        }
                    </div>
                    <h3>Issues:</h3>
                    <ul>
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
    if (date.substr!==undefined) {
        date = new Date(Date.parse(date));
    }
    var mm = date.getMonth() + 1; // getMonth() is zero-based
    var dd = date.getDate();

    return [
        (dd>9 ? '' : '0') + dd,
        (mm>9 ? '' : '0') + mm,
    ].join('.');
};