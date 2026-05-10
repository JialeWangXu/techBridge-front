import pkg from '../../package.json';

export const environment = {
  production: false,
  NAME: pkg.name,
  VERSION: pkg.version,
  FRONT_END: 'http://localhost:4200',
  BACK_END: 'http://localhost:8080',
  REST_USER: 'http://localhost:8080/api/techbridge-user',
  SECURE_ROUTES: [
    'http://localhost:8080/api/techbridge-user/users',
    'http://localhost:8080/api/techbridge-helprequest',
    'http://localhost:8080/api/techbridge-aitutorial',
  ],
};
