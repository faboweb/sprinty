import Octokat from 'octokat';

export function logout(oauth$) {
    document.cookie = OAUTH_TOKEN + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export function githubOAuthFlow(clientId) {
    return `https://github.com/login/oauth/authorize`
        + `?client_id=${clientId}`
        + `&scope=repo`;
        // + `&redirect_uri="http://localhost:8080/authenticate"`
}