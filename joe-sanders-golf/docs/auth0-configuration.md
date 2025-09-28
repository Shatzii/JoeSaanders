# 🔐 Auth0 Application Configuration - Stones Golf

## 📋 Basic Information
- **Application Name**: Cool Stones
- **Domain**: dev-hi54vhznvyubj5yv.us.auth0.com
- **Client ID**: FOh5eGvLUyaw2YsJzEhVZxi4TJyMy7Rc
- **Client Secret**: ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

*Note: The Client Secret is not base64 encoded.*

## 🎨 Application Properties
- **Description**: A free text description of the application. Max character count is 140.
- **Logo URL**: https://path.to/my_logo.png
  - Recommended size: 150x150 pixels
  - If none is set, the default badge for this type of application will be shown.

## 🌐 Application URIs

### Application Login URI
```
https://stonesgolf.com
```
*In some scenarios, Auth0 will need to redirect to your application's login page. This URI needs to point to a route in your application that should redirect to your tenant's /authorize endpoint.*

### Allowed Callback URLs
*Comma-separated list of allowed callback URLs for redirecting users after login. Unlisted URLs will be rejected.*

```
https://stonesgolf.com/api/auth/callback/auth0
```

*You can use Organization URL parameters in these URLs.*

### Allowed Logout URLs
*Comma-separated list of allowed logout URLs for redirecting users post-logout. You can use wildcards at the subdomain level (*.google.com). Query strings and hash information are not taken into account when validating these URLs.*

```
https://stonesgolf.com
```

### Allowed Web Origins
*Comma-separated list of allowed origins for use with Cross-Origin Authentication, Device Flow, and web message response mode, in the form of `<scheme>://<host>[:<port]>`, such as `https://login.mydomain.com` or `http://localhost:3000`. You can use wildcards at the subdomain level (e.g.: `https://*.contoso.com`). Query strings and hash information are not taken into account when validating these URLs.*

```
https://stonesgolf.com
```

## 🔄 OpenID Connect Back-Channel Logout
- **Logout URI**: https://myapp.org/backchannel-logout
- **Selected Initiators Only**: All supported initiators

### Logout Initiators:
- ✅ **IdP-Logout**: Required
- ✅ **RP-Logout**: Required
- ✅ **Password Changed**
- ✅ **Session Expired**
- ✅ **Account Deleted**
- ✅ **Email Changed**
- ✅ **Session Revoked**
- ✅ **Account Deactivated**

## 🌍 Cross-Origin Authentication
*When allowed, cross-origin authentication allows applications to make authentication requests when the Lock widget or custom HTML is used.*

### Additional Origins for CORS
*List additional origins allowed to make cross-origin resource sharing (CORS) requests. Allowed callback URLs are already included in this list.*

```
https://stonesgolf.com
```

*URLs can be comma-separated or added line-by-line. Use wildcards (*) at the subdomain level (e.g. https://*.contoso.com). Query strings and hash information are ignored. Organization URL placeholders are supported.*

## ⏰ Token Expiration Settings

### ID Token Expiration
- **Expiration Time**: 36000 seconds (10 hours)

*Time until an id_token expires regardless of activity.*

### Refresh Token Expiration
- **Inactivity Expiration**: 2592000 seconds (30 days)
- **Absolute Expiration**: 31557600 seconds (1 year)

*Require refresh tokens to expire after a set period of inactivity/absolute time. Required for refresh token rotation.*

## 🔄 Refresh Token Rotation
*When allowed, refresh tokens will automatically be invalidated after use and exchanged for new tokens to prevent replay attacks. Requires a maximum refresh token lifetime.*

- **Rotation Reuse Interval**: 0 seconds

*Period of time the most recently-used refresh token can be reused without triggering breach detection.*

## 🔒 Security Settings

### Token Sender-Constraining
*When required, access tokens must be constrained to this application to prevent unauthorized use of leaked or stolen tokens.*

### Authorization Requests
- **Pushed Authorization Requests (PAR)**: When required, authorization request parameters must be sent using back-channel communication for confidentiality and integrity protection. Requires tenant to allow PAR.
- **JWT-Secured Authorization Requests (JAR)**: When required, authorization request parameters must be wrapped in a signed JSON Web Token (JWT) for cryptographically confirmed non-repudiation.

---

## 📝 Production Environment Variables

Add these to your Netlify/Vercel environment variables:

```bash
# Auth0 Configuration
AUTH0_SECRET=[Your Auth0 App Secret]
AUTH0_ISSUER_BASE_URL=https://dev-hi54vhznvyubj5yv.us.auth0.com
AUTH0_BASE_URL=https://stonesgolf.com
AUTH0_CLIENT_ID=FOh5eGvLUyaw2YsJzEhVZxi4TJyMy7Rc
AUTH0_CLIENT_SECRET=[Your Auth0 Client Secret]

# NextAuth Configuration
NEXTAUTH_SECRET=[Generate a secure random string]
NEXTAUTH_URL=https://stonesgolf.com
```

## ✅ Verification Checklist

- [ ] Auth0 application configured with stonesgolf.com domain
- [ ] Callback URLs include: `https://stonesgolf.com/api/auth/callback/auth0`
- [ ] Logout URLs include: `https://stonesgolf.com`
- [ ] Web Origins include: `https://stonesgolf.com`
- [ ] Environment variables set in hosting platform
- [ ] Authentication tested on production site

---

*Last Updated: September 28, 2025*
*Application: Cool Stones*
*Domain: stonesgolf.com*</content>
<parameter name="filePath">/workspaces/JoeSaanders/joe-sanders-golf/docs/auth0-configuration.md