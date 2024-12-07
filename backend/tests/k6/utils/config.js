const config = JSON.parse(open('../config.load.json', 'utf8'));

export const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080/api/v1';

export const OPTIONS = {
    vus: __ENV.VUS ? parseInt(__ENV.VUS) : config.vus,
    iterations: __ENV.iterations ? __ENV.iterations : config.iterations,
};``