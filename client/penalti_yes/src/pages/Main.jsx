import React from 'react'
import { useDispatch } from 'react-redux'
import { logOut } from '../redux/authSlice'
import { useSelector } from 'react-redux'

const MainPage = () => {

    const dispatch = useDispatch()

    const token = useSelector((state) => state.auth.token)
    const role = useSelector((state) => state.auth.role)

    return (
        <>
            <button onClick={() => {
                dispatch(logOut())
            }}>log out</button>
        </>
    )
}

export default MainPage