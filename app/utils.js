import { stream, merge$ } from 'zliq';

export function getSize(issue) {
    return issue.labels
        .map(label => label.name)
        .filter(label => label.startsWith('size '))
        .map(label => parseFloat(label.substr(5)))
        .reduce((sum, cur) => sum + cur, 0);
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