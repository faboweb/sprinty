export function getSize(issue) {
    return issue.labels
        .map(label => label.name)
        .filter(label => label.startsWith('size '))
        .map(label => parseFloat(label.substr(5)))
        .reduce((sum, cur) => sum + cur, 0);
}