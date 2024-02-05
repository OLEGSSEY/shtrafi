import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import './profile.css'
import check from '/ic_check_48px.svg'
import close from '/ic_close_48px.svg'
import { logOut } from '../redux/authSlice'
import {Order} from '../components/admin_order'

const AdminMain = ()=>{
    const [data, setData] = useState([])
    const id = useSelector((state) => state.auth.id)
    const phone = useSelector((state) => state.auth.phone)
    const token = useSelector((state) => state.auth.token)
    const dispatch = useDispatch()

    

    useEffect(()=>{
        fetch('http://localhost:3002/orders', {
            method: 'GET',
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => setData(data))
    },[])

    
    return (<>
        <header className='Header'>
            <p>ШТРАФАМ ДА!!!!</p>
            <div className='header_link'>
                <button className='logOutBtn' onClick={() => {
                    dispatch(logOut())
                }}>Выйти</button>
                Вы администратор
            </div>
        </header>
        <div className='main_body'>
            <div id='admin_body' className="history_body">
                {data?.map((elem) => {
                    return <Order elem={elem}/>
                })}

            </div>

        </div>
    </>)
}
export default AdminMain