import Octokat from 'octokat';

let queryGitHub = (githubUrl, token) => (path) => {
    let octo = new Octokat({token});
    return request
        .get(githubUrl + path)
        .set("Authorization", `token ${token}`);
}

export function getMilestones(githubUrl, project, token) {
    return queryGitHub(githubUrl, token)(`/orgs/${organization}/projects`)
}

export function getProjects(githubUrl, organization, token) {
    return queryGitHub(githubUrl, token)(`/orgs/${organization}/projects`)
}

export function getIssues(organization, project, milestone) {

}