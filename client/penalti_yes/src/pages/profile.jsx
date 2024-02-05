import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import './profile.css'
import { logOut } from '../redux/authSlice'

const Profile = ()=>{
    const [data, setData] = useState([])
    const [data1, setData1] = useState([])
    const [fio, setFio] = useState('')
    const dispatch = useDispatch()
    const id = useSelector((state) => state.auth.id)
    const _phone = useSelector((state) => state.auth.phone)
    const [phone, setPhone] = useState('')
    var def_fio;
    var def_phone;

    const inputNumber = useRef();

    const handleChange = () => {
        const inputValue = inputNumber.current.value
            .replace('+7','')
            .replace(/\D/g, '')
            .match(/(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            inputNumber.current.value = inputValue[1] ?
            `+7 ${inputValue[2] ? '(': ''}${inputValue[1]}${inputValue[2] ? ')': ''}${(`${inputValue[2] ? ` ${inputValue[2]}` : ''}`)}${(`${inputValue[3] ? `-${inputValue[3]}` : ''}`)}${(`${inputValue[4] ? `-${inputValue[4]}` : ''}`)}`
            : '+7 ';
        const numbers = inputNumber.current.value;
        setPhone(numbers)
        };
        

    useEffect(()=>{
        setFio(data1.fio)
        setPhone(data1.phone)
        console.log('apdate')
    }, [data1])
    useEffect(()=>{
        fetch(`http://localhost:3002/orders/${id}`, {
            method: 'GET',
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => setData(data))
    },[])

    useEffect(()=>{
        fetch(`http://localhost:3002/user/${id}`, {
            method: 'GET',
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => setData1(data))
        },[])

    const changeInfo = () => {
        var Phone = phone
            .replace(/\D/g, '')
            .replace(/7/i, '');
        fetch(`http://localhost:3002/user/${id}/change`,{
            method: 'PUT',
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                'FIO': fio,
                'phone': Phone,
            })
        })
    }
    const nav = useNavigate()
    return(<>
    <header className='Header'>
                    <h2>ШТРАФАМ ДА!!!!</h2>
                <div className='header_link'>
                <div className='link' onClick={()=>{
                        nav("/")
                    }}>
                        <button className='btn_add1'>Заявка</button>
                    </div>
                    <div className='link' onClick={()=>{
                        nav("/profile")
                    }}>
                        <button className='btn_add1'>Профиль</button>
                    </div>
                    <div className='link'>
                    <button className='logOutBtn' onClick={() => {
                    dispatch(logOut())
                }}>Выйти</button>
                </div>
                </div>
            </header>
            <div className='main_body'>
                <div className="history_body">
                    {data?.map((elem) => {
                        return(<>
                        <div className='order_main_container'>
                            <div className='order_container'>
                                <div className='order_info'>
                                    <div className='date_id'>
                                        <p>Дата: {(elem.order.date).slice(0,10)}</p>
                                        <p>Место: {elem.order.place}</p>
                                        <p>Гос. номер: {elem.order.auto_number}</p>
                                    </div>
                                </div>
                                <div className='order_img'>
                                    {elem.photos?.map((elem)=>{
                                        return<>
                                        <img src={elem.photo_url}/>
                                        </>
                                    })}
                                    
                                    
                                </div>
                                <div className='admin_coment'>
                                <p>Статус: {elem.order.status}</p>
                                <p>Коментарий администратора: {elem.order.admin_comment}</p>
                            </div>
                            </div>
                            
                        </div>
                        </>)
                    })}
                    
                </div>
                <div className="profile_body">
                    <div className='ProfileContainer'>
                    <h2>Профиль</h2>
                    <p>ФИО: <input value={fio} onChange={(e)=>{
                        setFio(e.target.value)
                    }}/></p>
                    <p>Телефон: <input ref={inputNumber} value={phone} onChange={handleChange}/></p>
                    <button onClick={() => {
                        if ((fio!= '' && phone!= '') && (fio != def_fio && phone!= def_phone)){
                            changeInfo();
                        }
                    }}>Изменить</button>
                    </div>
                </div>
            </div>
    </>)
}
export default Profile