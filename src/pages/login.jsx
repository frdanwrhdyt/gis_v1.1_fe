import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import { AiOutlineLoading3Quarters } from 'react-icons/ai'


import Fetch from "../fetch/fetch"

export default function Login(){
    const [data, setData] = useState({
        username:localStorage.getItem('username')||'', 
        password:''
    })
    const [error, setError] = useState('')

    const [persist, setPersist] = useState(localStorage.getItem('persist'))
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    const handleSubmit = async(e)=>{
        e.preventDefault()
        setIsLoading(true)
        localStorage.setItem('persist', persist)
        if (persist)localStorage.setItem('username', data.username)
        else localStorage.removeItem('username')
        try{
            const response = await Fetch({endpoint:'auth/', data, headers:{'Content-Type':'application/json'}, method:'POST'})
            if (response.status == 200){
                localStorage.setItem('access', response.data.access)
                Cookies.set('refresh', response.data.refresh, {expires:30})
                setData({
                    username:localStorage.getItem('username')||'',
                    password:''
                })
                navigate('/', {replace:true})
            }
        }
        catch(e){
            if(e.response && e.response.data && e.response.data.detail){
                setError('Invalid username or password')
            }
            else setError('An error occured while loggin in')
        }
        setIsLoading(false)
    }
    return (
        <div className="flex w-screen h-screen bg-white md:bg-black/90 items-center relative">
            {isLoading&&
                <div className="absolute w-full h-full bg-white/80 backdrop-blur-sm z-50 flex justify-center items-center">
                    <AiOutlineLoading3Quarters size={40}
                        className='animate-spin text-black'
                    />
                </div>
            }
            <div className="w-full md:w-96 mx-auto my-auto p-10 bg-white rounded-md shadow-none md:shadow-md space-y-10">
                <h1 className="text-4xl font-semibold">Login</h1>
                <div className="w-full border-b border-red-600 border-2"></div>
                <form onSubmit={handleSubmit} className="w-full space-y-5">
                    <input value={data.username} onChange={(e)=>setData({...data,username:e.target.value})} className="outline-none peer w-full p-2 border-b " type="text" placeholder="Username" required/>
                    <input value={data.password} onChange={(e)=>setData({...data,password:e.target.value})} className="outline-none peer w-full p-2 border-b " type="password" placeholder="Password" required/>
                    <div className="w-full flex space-x-2 ">
                        <input checked={Boolean(persist)} type="checkbox" onChange={()=>setPersist(!persist)}/>
                        <span className="text-sm">Remember me</span>
                    </div>
                    <div className="text-center w-full mt-4">
                        <button type="submit" className="w-full rounded bg-black/80 hover:bg-black duration-200 py-2 text-white">Login</button>
                        <span className="text-sm">Don{"'"}t have an account yet?{" "}<Link to={'/register'} className="hover:font-semibold hover:text-blue-500 duration-200">Sign Up</Link></span>
                    </div>
                </form>
                <div className="w-full text-sm text-center">
                    {error?
                    <p className="text-red-600">{error}</p>:<p className="text-white">.</p>
                    }
                </div>
                <div className="w-full border-t text-center">
                    <span className="text-xs text-gray-500">Powered by</span>
                    <img alt="logo" className="h-10 mx-auto opacity-60" src="https://www.telkomsat.co.id/uploads/n_about_company_page/20231026160745-2023-10-26n_about_company_page160742.png"/>
                </div>
            </div>
        </div>
    )
}