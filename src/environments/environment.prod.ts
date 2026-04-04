import pkg from '../../package.json';

export const environment = {
    production: true,
    NAME: pkg.name,
    VERSION: pkg.version,
    FRONT_END: 'https://gestion.ocanabogados.es',
    REST_USER: 'https://gestion.ocanabogados.es/api/goa-user',
    REST_ENGAGEMENT: 'https://gestion.ocanabogados.es/api/goa-engagement',
    REST_BILLING: 'https://gestion.ocanabogados.es/api/goa-billing',
    REST_SUPPORT: 'https://gestion.ocanabogados.es/api/goa-support',
    REST_DOCUMENT: 'https://gestion.ocanabogados.es/api/goa-document',
    SECURE_ROUTES: ['https://gestion.ocanabogados.es/api']
};
