import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import './OrderAdd.css'
import { logOut } from '../redux/authSlice'


const OrderAdd= () =>{

    const [date, setDate] = useState("")
    const [place, setPlace] = useState("")
    const [auto_number, setAuto_number] = useState("")
    const [files, setFiels] = useState()
    const [comment, setComment] = useState('')
    const dispatch = useDispatch()
    const user_id = useSelector((state) => state.auth.id)

    

    const order_add = async (_files) => {
        const data = new FormData();

        data.append('date', date)
        data.append('place', place)
        data.append('auto_number', auto_number)
        data.append('user_id', user_id)
        if (comment != ''){
            data.append('user_comment', comment)
        }
        
        for (const file of _files){
            data.append(`photo`, file);
        }
        setDate('')
        setPlace('')
        setAuto_number('')
        setComment('')

        await fetch('http://localhost:3002/addOrder', {
            method: 'POST',
            mode: "cors",
            body: data,
        })
        nav("/profile")
    }

    const nav = useNavigate()
    return(
        <>
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
            <div className='order_body'>
                <h2>Добавить запись</h2>
                <input type='date' required placeholder='дата' value={date} onChange={(e)=>{
                    setDate(e.target.value)
                }}/>
                <input type='text' required placeholder='место' value={place} onChange={(e)=>{
                    setPlace(e.target.value)
                }}/>
                <input type='file' required name='photos' multiple onChange={(e) => {
                    setFiels(e.target.files)
                    //order_add(e.target.files)
                }}/>
                <input type='text' required placeholder='гос. номер' value={auto_number} onChange={(e)=>{
                    setAuto_number(e.target.value)
                }}/>
                <input type='text' placeholder='Введите комментарий' value={comment} onChange={(e)=>{
                    setComment(e.target.value)
                }}></input>
                <button className='btn_add' onClick={ async () => {
                    if (date!='' && place!='' && files!=undefined && auto_number!=''){
                        await order_add(files)
                    }
                }}>Добавить запись</button>
            </div>
        </>
    )
}
export default OrderAdd