import axios from 'axios';

const AxiosConfig = axios.create({
    baseURL: 'http://192.168.0.24:5000',
});

export default AxiosConfig;
