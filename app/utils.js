export function getSize(issue) {
    return issue.labels
        .map(label => label.name)
        .filter(label => label.startsWith('size '))
        .map(label => parseFloat(label.substr(5)))
        .reduce((sum, cur) => sum + cur, 0);
}

export function if$(stream, onTrue, onFalse) {
    return stream.map(x=>x?onTrue:onFalse);
}