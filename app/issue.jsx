import { h, stream, merge$ } from 'zliq';
import {getSize, if$} from './utils.js';

export const Issue = ({issue, onpick, onestimate}) => {
    let open$ = stream(false);

    return <div class="mdl-card mdl-shadow--2dp">
            <div class="mdl-card__title" onclick={()=>open$(!open$())}>
                <h2 class="mdl-card__title-text">
                    {issue.title}
                    <span class="mdl-chip mdl-chip--align-right">
                        <span class="mdl-chip__text">{issue.state}</span>
                    </span>
                </h2>
            </div>
            <div class="mdl-card__supporting-text" style={{height: if$(open$, 'auto', 0)}}>
                {issue.description}
            </div>
            <div class="mdl-card__menu">
                <a href={issue.html_url} class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
                    <i class="material-icons">open in browser</i>
                </a>
                <button onclick={()=>onpick()} class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
                    <i class="material-icons">add</i>
                </button>
            </div>
        </div>
    /*return <tr class="issue">
        <td class="mdl-data-table__cell--non-numeric">{issue.title}</td>
        <td class="mdl-data-table__cell--non-numeric">
            <span class="mdl-chip">
                <span class="mdl-chip__text">{issue.state}</span>
            </span>
        </td>
        <td class="mdl-data-table__cell--non-numeric">
            <div class="mdl-textfield mdl-js-textfield">
                <input class="mdl-textfield__input" id="estimate" onchange={e=>onestimate(e.target.value)} value={getSize(issue)} />
            </div>
        </td>
        <td>
            <button onclick={()=>onpick()} class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored">
                <i class="material-icons">add</i>
            </button>
        </td>
    </tr>;*/
}
