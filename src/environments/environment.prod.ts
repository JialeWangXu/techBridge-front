import pkg from '../../package.json';

export const environment = {
    production: true,
    NAME: pkg.name,
    VERSION: pkg.version,
    FRONT_END: 'http://techbridge-front.s3-website-eu-west-1.amazonaws.com',
    BACK_END: 'http://34.240.99.239:8080',
    REST_USER: 'http://34.240.99.239:8080/api/techbridge-user',
    SECURE_ROUTES: [
    'http://34.240.99.239:8080/api/techbridge-user/users',
    'http://34.240.99.239:8080/api/techbridge-helprequest',
    'http://34.240.99.239:8080/api/techbridge-aitutorial',
    ],
};
