import { h, stream, merge$ } from 'zliq';
import {getSize} from './utils.js';

export const Issue = ({issue, onpick}) => {
    return <tr class="issue">
        <td class="mdl-data-table__cell--non-numeric">{issue.title}</td>
        <td class="mdl-data-table__cell--non-numeric">
            <span class="mdl-chip">
                <span class="mdl-chip__text">{issue.state}</span>
            </span>
        </td>
        <td class="mdl-data-table__cell--non-numeric">
            <div class="mdl-textfield mdl-js-textfield">
                <input class="mdl-textfield__input" id="estimate" oninput={()=>{}} value={getSize(issue)} />
            </div>
        </td>
        <td>
            <button onclick={()=>onpick()} class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored">
                <i class="material-icons">add</i>
            </button>
        </td>
    </tr>;
}
