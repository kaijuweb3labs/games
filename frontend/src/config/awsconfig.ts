export default {
  identityPoolId: process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL,
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  identityPoolRegion: process.env.NEXT_PUBLIC_AWS_REGION,
  userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID,
  userPoolWebClientId: process.env.NEXT_PUBLIC_AWS_USER_POOL_CLIENTID,
  oauth: {
    scope: ["email", "profile", "openid"],
    domain: process.env.NEXT_PUBLIC_AWS_OAUTH_DOMAIN,
    redirectSignIn: process.env.NEXT_PUBLIC_AWS_OAUTH_SIGNIN_REDIRECT,
    redirectSignOut: process.env.NEXT_PUBLIC_AWS_OAUTH_SIGNOUT_REDIRECT,
    clientId: process.env.NEXT_PUBLIC_AWS_USER_POOL_CLIENTID,
    responseType: process.env.NEXT_PUBLIC_AWS_OATUH_RESPONSE_TYPE,
  },
};
