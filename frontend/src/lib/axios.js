import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'https://edm3z3psle.execute-api.ap-southeast-1.amazonaws.com/Stage/api'
})