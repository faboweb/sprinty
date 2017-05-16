const Octokat = require('octokat');

let queryGitHub = (githubUrl, token) => (path) => {
    octo
    return request
        .get(githubUrl + path)
        .set("Authorization", `token ${token}`);
}

export function getMilestones(githubUrl, organization, repo, token) {
    let octo = new Octokat({token});
    let gitRepo = octo.repos('philschatz', 'octokat.js')
    return queryGitHub(githubUrl, token)(`/orgs/${organization}/projects`)
}

export function getProjects(githubUrl, organization, token) {
    return queryGitHub(githubUrl, token)(`/orgs/${organization}/projects`)
}

export function getIssues(organization, project, milestone) {

}