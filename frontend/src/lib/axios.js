import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'https://uy70toskp9.execute-api.ap-southeast-1.amazonaws.com/Stage/api'
})