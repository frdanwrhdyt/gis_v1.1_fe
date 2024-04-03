import {Routes, Route} from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/register'
import Home from './pages'
import Data from './pages/data'
import Layout from './components/layouts/Layout'

function App() {
    return (
      <Routes>
        <Route path='/login' element={Login()}/>
        <Route path='/register' element={Register()}/>
        <Route element={Layout()}>
          <Route path='/' element={Home()}/>
          <Route path='/data' element={Data()}/>
        </Route>
      </Routes>
    )
}

export default App
