import pkg from '../../package.json';

export const environment = {
    production: true,
    NAME: pkg.name,
    VERSION: pkg.version,
    FRONT_END: 'https://app.jointechbridge.com',
    BACK_END: 'https://app.jointechbridge.com',
    REST_USER: 'https://app.jointechbridge.com/api/techbridge-user',
    SECURE_ROUTES: [
    'https://app.jointechbridge.com/api/techbridge-user/users',
    'https://app.jointechbridge.com/api/techbridge-helprequest',
    'https://app.jointechbridge.com/api/techbridge-aitutorial',
    ],
};
