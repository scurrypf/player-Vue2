import axios from "axios";

// const MOCK_URL = 'http://127.0.0.1:4523/m1/2104970-0-default';

// const PRODUCTION_URL = 'http://jisutqybmf.market.alicloudapi.com';

const LOGIN_UAL = 'http://127.0.0.1:3000/api'
const http = axios.create({
    baseURL:LOGIN_UAL,
    timeout:1000,
    // headers:{
    //     Authorization:'APPCODE d686570081264047b8b7aaec01fb82dc',
    //     // token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5bG9hZCI6Imtva29taSIsImV4cCI6MTY3NTg1MDQ4NiwiaWF0IjoxNjc1NzY0MDg2fQ.LbqfyQ6O4zsZ1YWurTQmQHxMVMK2ZqwF9JCicyNKVR0'
    // }
})


// 请求拦截器，在请求里面加上token
http.interceptors.request.use((config) => {
    if (config.url === '/api/login') {
        return config;
    }
    config.headers['token'] = localStorage.getItem('token')
    // console.log('interceptors', config)
    return config;
})

/**发送刷新token的请求 */ 
const refreshToken = function(){
    let refresh_token = localStorage.getItem('refresh_token');
    return http.post('/refresh', { refreshToken: refresh_token });
}

let isRefreshing = false;// 防止多次请求刷新token
// requests数组用于处理同时多次请求时,将第一次之后的请求存储起来，然后一并执行
let requests = [];
// 响应拦截器，拦截token过期的响应
http.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if(!error.response){
        return Promise.reject(error);
    }
    if(error.response.statuscode === 401){
        const { config } = error;
        if(!isRefreshing){
            isRefreshing = true;
            return refreshToken().then((res) => {
                const { token } = res.data;
                localStorage.setItem('token', token);
                config.headers['token'] = token;
                requests.forEach((ele) => {
                    ele(token);
                })
                requests = [];
                return http(config);
            }).catch(() => {
                return Promise.reject(error);
            }).finally(() => {
                isRefreshing = false;
            })
        }else{
            return new Promise((resolve) => {
                requests.push((token) => {
                    config.headers['token'] = token;
                    resolve(http(config));
                })
            })
        }
    }
})

export{
    http
}