import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Fetch from "../fetch/fetch"
import { AiOutlineLoading3Quarters } from 'react-icons/ai'


export default function Register(){
    const navigate = useNavigate()
    const [data, setData] = useState({
        name:'',
        username:'',
        password1:'',
        password2:'',
        email:'',
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [isSuccess, setIsSuccess] = useState(false)
    const handleSubmit = async(e)=>{
        e.preventDefault()
        if (data.password1===data.password2){
            setIsLoading(true)
            setData({...data, password:data.password1})
            try{
                const response = await Fetch({endpoint:'auth/user', data, headers:{'Content-Type':'application/json'}, method:'POST'})
                if (response.status===201){
                    setIsSuccess(true)
                    setIsLoading(false)
                    setData({
                        name:'',
                        username:'',
                        password1:'',
                        password2:'',
                        email:''
                    })
                    setIsLoading(false)
                    navigate('/login')
                }
            }
            catch(e){
                if (e.response && e.response.data && e.response.data.detail){
                    setError({
                        username: e.response.data?.username,
                        email:e.response.data?.email,
                    })
                }
                else{
                    setError('An error occurred while register')
                }
                setIsLoading(false)
            }
        }
    }
    return(
        <div className="w-screen h-screen flex bg-white md:bg-black/90 overflow-y-auto">
            {isLoading&&
                <div className="absolute w-full h-full bg-white/80 backdrop-blur-sm z-50 flex justify-center items-center">
                    <AiOutlineLoading3Quarters size={40}
                        className='animate-spin text-black'
                    />
                </div>
            }
            <div className="w-full md:w-96 mx-auto my-auto p-10 bg-white rounded-md shadow-none md:shadow-md space-y-10">
                <h1 className="text-4xl font-semibold">Register</h1>
                <div className="w-full border-b border-red-600 border-2"></div>
                <form onSubmit={handleSubmit} className="w-full">
                    <input value={data.name} onChange={(e)=>setData({...data,name:e.target.value})} className="outline-none peer w-full p-2 border-b " type="text" placeholder="Name" required/>
                    <div className="w-full mt-2">
                        <input value={data.username} onChange={(e)=>setData({...data,username:e.target.value})} className="mt-5 outline-none peer w-full p-2 border-b " type="text" placeholder="Username" required/>
                        {error?.username?<span className="text-red-500 text-xs">{error.username}</span>:<span className="text-white text-xs">.</span>}
                    </div>
                    <input value={data.password1} onChange={(e)=>setData({...data,password1:e.target.value})} className="outline-none peer w-full p-2 border-b " type="password" placeholder="Password" required/>
                    <div className="w-full mt-5">
                        <input value={data.password2} onChange={(e)=>setData({...data,password2:e.target.value})} className="outline-none peer w-full p-2 border-b " type="password" placeholder="Password Confirmation" required/>
                        {data.password1&&data.password2&&data.password1!==data.password2?<span className="text-red-500 text-xs">Passwords do not match</span>:<span className="text-white text-xs">.</span>}
                    </div>
                    <div className="w-full mt-2">
                        <input value={data.email} onChange={(e)=>setData({...data,email:e.target.value})} className="outline-none peer w-full p-2 border-b" type="email" placeholder="Email" required/>
                        {error?.email?<span className="text-red-500 text-xs">{error.email}</span>:<span className="text-white text-xs">.</span>}
                    </div>
                    <div className="text-center w-full mt-5">
                        <button type="submit" className="w-full rounded bg-black/80 hover:bg-black duration-200 py-2 text-white">Register</button>
                        <span className="text-sm">Already have account?{" "}<Link to={'/login'} className="hover:font-semibold hover:text-blue-500 duration-200">Sign In</Link></span>
                    </div>
                </form>
                <div className="w-full border-t text-center">
                    <span className="text-xs text-gray-500">Powered by</span>
                    <img alt="logo" className="h-10 mx-auto opacity-60" src="https://www.telkomsat.co.id/uploads/n_about_company_page/20231026160745-2023-10-26n_about_company_page160742.png"/>
                </div>
            </div>
        </div>
    )
}