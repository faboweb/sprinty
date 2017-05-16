export function requestGithubToken(options, code) {
  let data = new FormData()
  data.append('client_id', options.client_id)
  data.append('client_secret', options.client_secret)
  data.append('code', code)

  fetch(`https://github.com/login/oauth/access_token`, {
    method: 'POST',
    body: data
  })
  .then((response) => {
    return response.text()
  })
  .then((paramsString) => {
    let params = new URLSearchParams(paramsString)
    console.log('access_token', params.get('access_token'))
  });
}