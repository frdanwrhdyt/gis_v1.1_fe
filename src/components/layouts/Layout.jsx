import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import Fetch from '../../fetch/fetch';
import useAuth from '../hooks/useAuth';
import Logo from '../../assets/logo.png'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'



export default function Layout(){
    const {auth, setAuth} = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [isLoading, setIsLoading] = useState(false)

    const handleLogout = async () => {
        setIsLoading(true);
        const refreshToken = Cookies.get('refresh');
        try {
            await Fetch({
                endpoint: 'auth/logout',
                data: { refresh: refreshToken },
                headers: { 'Content-Type': 'application/json' },
                method: 'POST'
            });
            localStorage.removeItem('access');
            Cookies.remove('refresh');
        } catch (error) {
            console.error('Error logging out:', error);
        } finally {
            setIsLoading(false);
            navigate('/login', { replace: true });
        }
    };
    
    useEffect(()=>{
        const handleRefresh = async()=>{
            const refreshToken = Cookies.get('refresh')
            try{
                const response = await Fetch({
                    endpoint:'auth/refresh',
                    data:{refresh:refreshToken},
                    headers:{'Content-Type':'application/json'}, 
                    method:'POST'
                })
                localStorage.setItem('access', response.data.access)
                Cookies.set('refresh', response.data.refresh, {expires:30})
                fetchData()
            }catch{
                handleLogout()           
            }
        }
        const fetchData = async() =>{
            const access = localStorage.getItem('access')
            try{
                const response = await Fetch({
                    method:'GET', 
                    headers:{
                        'Content-Type':'application/json',
                        Authorization: `Bearer ${access}`
                    }, 
                    endpoint:'auth/user'
                })
                const data = response.data
                setAuth({
                    name: data.name, username: data.username,
                    email: data.email, last_login: data.last_login,
                    role: data.role
                })
            }
            catch{
                await handleRefresh()
            }
        }
        fetchData()
    }, [])
    if(auth){
        return(
            <div className="h-screen w-screen relative bg-gray-100">
                {isLoading&&
                    <div className="absolute w-full h-full bg-white/50 backdrop-blur-sm z-[2000] flex justify-center items-center">
                        <AiOutlineLoading3Quarters size={40}
                            className='animate-spin text-black'
                        />
                    </div>
                }
                <div className="w-full h-12 bg-white flex items-center justify-between px-16 shadow-md">
                    <img alt="logo" className="h-8 " src={Logo}/>
                    {/* <div className='text-white'>asd</div> */}
                    <nav className="flex space-x-10 items-center ">
                        <button type='button' className={location.pathname==='/'?'font-bold underline decoration-4 underline-offset-8 decoration-red-600':'font-normal hover:font-bold hover:underline hover:decoration-4 hover:underline-offset-8 decoration-red-600 duration-200'}>
                            <Link to={'/'}>Dashboard</Link>
                        </button>
                        <button type='button' className={location.pathname==='/data'?'font-bold underline decoration-4 underline-offset-8 decoration-red-600':'font-normal hover:font-bold hover:underline hover:decoration-4 hover:underline-offset-8 decoration-red-600 duration-200'}>
                            <Link to={'/data'}>Data</Link>
                        </button>
                        <button onClick={handleLogout} type='button' className='px-3 py-1 rounded border border-red-600 hover:bg-red-600 hover:text-white duration-200'>
                            Logout
                        </button>
                    </nav>
                </div>
                <div className="w-full h-[calc(100%-48px)] ">
                    <Outlet/>
                </div>
            </div>
        )
    }
    else return null

}