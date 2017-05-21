import Octokat from 'octokat';
import {fetchy} from 'zliq';

export function logout(OAUTH_CODE, oauth$) {
    oauth$('');
    document.cookie = OAUTH_CODE + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export function getGitCodeUrl(gitOAuthUrl, clientId) {
    return `${gitOAuthUrl}/authorize`
        + `?client_id=${clientId}`
        + `&scope=repo`;
        // + `&redirect_uri="http://localhost:8080/authenticate"`
}

export function getGitToken(OAUTH_CODE, gitTokenUrl, code) {
    return fetch(`${gitTokenUrl}?code=${code}`, { method: 'POST' })
        .then(res => res.text())
        .then(access_token => {
            document.cookie = OAUTH_CODE + '=' + access_token + ';';
            return access_token;
        });
}