import axios from "axios";
export default async function Fetch({endpoint, headers, data, method}){
    const config = {
        method, 
        url:`${import.meta.env.VITE_BACKEND_BASE_API}/${endpoint}`,
        headers,
        data
    }
    const response = await axios(config)
    return response
}