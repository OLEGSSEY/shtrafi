import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { regThunk } from '../redux/regSlice'
import { useNavigate } from 'react-router-dom'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

const Reg = () => {

    const [FIO, setFIO] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")

    const regState = useSelector((state) => state.reg)
    const dispatch = useDispatch()

    const nav = useNavigate()

    useEffect(() => {
        if (regState.message) {
            nav('/auth')
        }
    }, [regState])

    return (
        regState.error ? <p>{regState.error}</p> :
            regState.loading ? <p>Loading...</p> :
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    gap: '8px',
                }}>
                    <div className='reg'>
                    <input value={FIO} placeholder='ФИО' onChange={(e) => {
                        setFIO(e.target.value)
                    }} type="text" />
                    <div className='phoneInput'>
                        <PhoneInput
                            international
                            defaultCountry='RU'
                            value={phone}
                            rules={{ required: true }}
                            onChange={setPhone}/>
                    </div>
                    <input value={password} placeholder='Пароль' onChange={(e) => {
                        setPassword(e.target.value)
                    }} type="text" />
                    <button className='btn_add' onClick={() => {
                        dispatch(regThunk({
                            FIO: FIO,
                            phone: phone.replace('+7', ''),
                            password: password
                        }))
                    }}>Регистрация</button>
                    <p className='P' onClick={()=>{
                        nav("/auth")
                    }}>Войти</p>
                    </div>
                </div>
    )
}

export default Reg