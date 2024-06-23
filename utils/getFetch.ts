


export const getFetch = (method:'GET'|"POST"|"PUT"|"DELETE"|"PATCH") => (url:string,options:RequestInit = {}) => fetch(url,{
  method,
  headers: {
    'Content-Type':'application/json',
    ...options?.headers
  },
  ...options
}).then((response)=>response.json());