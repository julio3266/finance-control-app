
import Constants from 'expo-constants';

const getEnvVar = (key: string, defaultValue: string = ''): string => {
    if (Constants.expoConfig?.extra?.[key]) {
        return Constants.expoConfig.extra[key];
    }
    
    if (typeof process !== 'undefined' && process.env[key]) {
        return process.env[key] || defaultValue;
    }
    
    return defaultValue;
};

const env = getEnvVar('ENV', 'qa');
const isQA = env === 'qa' || env === '';

const defaultApiUrl = isQA 
    ? 'https://www.api-qa.financecontrolapp.com.br' 
    : 'https://www.api.financecontrolapp.com.br';

const apiUrlFromEnv = getEnvVar('API_URL', '');

export const config = {
    apiUrl: apiUrlFromEnv || defaultApiUrl,
    apiTimeout: parseInt(getEnvVar('API_TIMEOUT', '30000'), 10),
    env: isQA ? 'qa' : 'prod',
};


