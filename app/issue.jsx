import { h, stream, merge$ } from 'zliq';
import {getSize, if$, class$} from './utils.js';
import './issue.scss';

export const Issue = ({issue, onpick, onestimate, ondescription}) => {
    let open$ = stream(false);

    return <div class={class$("issue mdl-card mdl-shadow--2dp", if$(open$, null, 'mdl-card--closed'))}>
            <div class="mdl-card__title"
                onclick={()=>open$(!open$())}>
                <h2 class="mdl-card__title-text">
                    <i class="material-icons">{if$(open$,'keyboard_arrow_down','keyboard_arrow_up')}</i>
                    {issue.title}
                </h2>
            </div>
            <div class="mdl-card__supporting-text">
                <div class="mdl-textfield mdl-js-textfield">
                    <textarea
                        class="mdl-textfield__input"
                        type="text"
                        onchange={e=>ondescription && ondescription(e.target.value)}
                    >{issue.body}</textarea>
                </div>
            </div>
            <div class="mdl-card__menu">
                <div class="mdl-textfield mdl-js-textfield">
                    <input class="mdl-textfield__input" id="estimate" onchange={e=>onestimate(e.target.value)} value={getSize(issue)} />
                </div>
                <span class="mdl-chip">
                    <span class="mdl-chip__text">{issue.state}</span>
                </span>
                <a href={issue.html_url} class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
                    <i class="material-icons">open_in_browser</i>
                </a>
                <button onclick={()=>onpick()} class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
                    <i class="material-icons">add</i>
                </button>
            </div>
        </div>
}
