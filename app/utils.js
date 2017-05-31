import { stream, merge$ } from 'zliq';

export function getSize(issue) {
    let label = issue.labels
        .map(label => label.name)
        .filter(label => label.startsWith('size '))[0];
    return label.substr(5);
}

export const PRIORITY = {
    critical: 0,
    now: 1,
    next: 2,
    longterm: 3
}
export function getPriority(issue) {
    return issue.labels
        .map(label => label.name)
        .filter(label => label.startsWith('priority '))
        .map(label => parseFloat(label.substr(9)))
        .map(priority => PRIORITY[priority]);
}

// TODO move to zliq
export function if$(stream, onTrue, onFalse) {
    return stream.map(x=>x?(onTrue||null):(onFalse||null));
}

// TODO move to zliq
export function class$(...arr) {
    let $arr = arr.map(item => {
        if (item === null || item === undefined) {
            return stream('');
        }
        if (item.IS_STREAM) {
            return item;
        }
        return stream(item);
    });
    return merge$(...$arr).map(arr => arr.join(' '));
}