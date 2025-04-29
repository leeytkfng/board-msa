import axios  from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:8080/api/users",
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

const apiClient1 = axios.create({
    baseURL: "http://localhost:8080/api/board" ,
    headers: {
        'Content-Type' : 'application/json',
    },
    withCredentials: true
})

export default apiClient;
