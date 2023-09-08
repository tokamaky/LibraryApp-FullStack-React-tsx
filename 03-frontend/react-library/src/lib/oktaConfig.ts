export const oktaConfig = {
    clientId: '0oab0tgquocBadzGC5d7',
    issuer: 'https://dev-72128783.okta.com/oauth2/default',
    redirectUri: 'https://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
}