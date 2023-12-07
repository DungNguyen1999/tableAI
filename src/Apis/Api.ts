import axiosInstance from '../utils/axios';

export const PostLogin = (params: any) => axiosInstance.post('/login', params)
