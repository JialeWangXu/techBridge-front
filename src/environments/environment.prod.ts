import pkg from '../../package.json';

export const environment = {
    production: true,
    NAME: pkg.name,
    VERSION: pkg.version,
    FRONT_END: 'https://jointechbridge.com',
    BACK_END: 'https://jointechbridge.com',
    REST_USER: 'https://jointechbridge.com/api/techbridge-user',
    SECURE_ROUTES: [
    'https://jointechbridge.com/api/techbridge-user/users',
    'https://jointechbridge.com/api/techbridge-helprequest',
    'https://jointechbridge.com/api/techbridge-aitutorial',
    ],
};
