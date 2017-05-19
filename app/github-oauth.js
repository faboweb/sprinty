import Octokat from 'octokat';

export function logout(OAUTH_CODE, oauth$) {
    oauth$('');
    document.cookie = OAUTH_CODE + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export function githubOAuthFlow(gitOAuthUrl, clientId) {
    return `${gitOAuthUrl}/authorize`
        + `?client_id=${clientId}`
        + `&scope=repo`;
        // + `&redirect_uri="http://localhost:8080/authenticate"`
}