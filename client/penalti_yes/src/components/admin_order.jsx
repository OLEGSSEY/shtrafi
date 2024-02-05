import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import check from '/ic_check_48px.svg'
import close from '/ic_close_48px.svg'

export const Order = (props) => {
    const {elem} = props
    const [comment, setComment] = useState('')
    const [status, setStatus] = useState(elem.order.status == 'В рассмотрении' ? true : false)
    const token = useSelector((state) => state.auth.token)
    


    const changeState = async (val, id) => {
        fetch('http://localhost:3002/order/change', {
            method: 'PUT',
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                'val': val,
                'order_id': id,
            })
        })
        setStatus(false)
    }

    const commentAdd = (comment, id) => {
        fetch('http://localhost:3002/order/comment', {
            method: 'PUT',
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                'comment': comment,
                'order_id': id,
            })
        })
        setComment('')
    }


    return (<>
        <div>
            <div className='order_container'>
                <div className='order_info'>
                    <div className='date_id'>
                        <p>Дата: {(elem.order.date).slice(0, 10)}</p>
                        <p>Место: {elem.order.place}</p>
                        <p>Гос. номер: {elem.order.auto_number}</p>
                    </div>
                </div>
                <div className='order_img'>
                    {elem.photos?.map((elem) => {
                        return <>
                            <img src={elem.photo_url} />
                        </>
                    })}
                </div>
                <div>
                    {
                        status ? <>
                            <img src={check} onClick={() => {
                                changeState(true, elem.order.id)
                            }} />
                            <img src={close} onClick={() => {
                                changeState(false, elem.order.id)

                            }} />
                        </> : <></>
                    }
                </div>
                <div className='admin_coment'>
                    <p>{elem.order.user_comment}</p>
                </div>
            </div>
            <div className='admin_coment'>
                <input type='text' value={comment} placeholder='Введите коментарий' onChange={(e) => {
                    setComment(e.target.value)
                }}></input>
                <button className='btn_comment' onClick={() => {
                    if (comment != '') {
                        commentAdd(comment, elem.order.id)
                    }
                }}>Добавить коментарий</button>

            </div>
        </div>
    </>)
}