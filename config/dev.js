'use strict';

/**
 * Configurations for Development Environment
 */
module.exports = {
    port: 7000,
    db: {
        host: 'localhost:27017',
        name: 'cab-booking',
        username: '',
        password: '',
        connectionTimeout: 3000,
    },
    apiUrl: 'http://localhost:3000/api/',
};