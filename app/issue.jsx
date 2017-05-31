import { h, stream, merge$, ADDED } from 'zliq';
import {getSize, getPriority, if$, class$, PRIORITY} from './utils.js';
import './issue.scss';

const MDLDropdown = ({options, value$, onchange}) => {
    value$ = value$ || stream(options[0].name);
    let id = 'dropdown-' + guid();
    let open$ = stream(false);
    let elems = [
        <button id={id}
                type="button" 
                class="mdl-chip mdl-js-button"
                onclick={()=>open$(!open$())}>
            <span class="mdl-chip__text">{value$}</span>
        </button>,
        <ul class="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect"
            for={id}>
            {
                options.map(option => {
                    return <li class="mdl-menu__item" onclick={()=> {
                        value$(option.name);
                        open$(false);
                        onchange(option.value);
                    }}>{option.name}</li>
                })
            }
        </ul>
    ];
    return elems;
}

export const Issue = ({issue, onpick, onestimate, ondescription, onpriority}) => {
    let open$ = stream(false);

    let elem = <div class='issue--container'>
            <div class={class$("issue mdl-card mdl-shadow--2dp", if$(open$, null, 'mdl-card--closed'))}>
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
                    <MDLDropdown 
                        options={[
                            {value: 'critical', name: 'Critical'},
                            {value: 'now', name: 'Now'},
                            {value: 'next', name: 'Up Next'},
                            {value: 'longterm', name: 'Longterm'},
                        ]}
                        onchange={onpriority} />
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
        </div>;
    elem.addEventListener(ADDED, () => {
        componentHandler.upgradeDom();
        let textarea = elem.querySelector('textarea');
        textarea.style.height = textarea.scrollHeight+'px'; 
    });
    return elem;
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}