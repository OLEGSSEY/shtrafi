import express from "express";
import { sql } from "./db.js";
import { register } from "./controllers/register.js";
import { auth } from "./controllers/auth.js";
import { roleMiddleware } from "./middlewares/roleMiddleware.js";
import cors from 'cors'
import { order_get } from "./controllers/order_getter.js";
import * as fs from 'node:fs';
import multer from "multer";
import path from 'path';


//порт на котором будет работать сервер
const PORT = 3002
//сама переменная сервера
const app = express()

//чтобы сервер понимал json
app.use(express.json());
app.use(cors())
app.use(express.static('photos'));

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './photos/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
  })
  var upload = multer({ storage: storage });
/*
app.get('/', roleMiddleware(["ADMIN"]), async (req, res) => {
    const data = await sql`select * from Users`
    res.send(data)
})
*/

app.get('/user/:id',  async (req, res) => {
    const { id } = req.params
    const data = await sql`select * from Users where id = ${id}`
    res.send(data[0])
})
app.put('/order/change', roleMiddleware(["ADMIN"]), async(req, res)=>{
    const { val, order_id } = req.body
    try {
        const data = await sql`update Orders set status = ${val ? 'Принята' : 'Откланена'} where id = ${order_id}`
        res.sendStatus(200)
    } catch (error) {
        res.send(error)
        res.sendStatus(500)
    }
    const data = await sql`update Orders set status = ${val ? 'Принята' : 'Откланена'} where id = ${order_id}`
    res.sendStatus(200)
})
app.put('/order/comment', roleMiddleware(["ADMIN"]), async(req, res)=>{
    const { comment, order_id } = req.body
    try {
        const data = await sql`update Orders set admin_comment = ${comment} where id = ${order_id}`
        res.sendStatus(200)
    } catch (error) {
        res.send(error)
        res.sendStatus(500)
    }
})
app.put('/user/:id/change', async function (req, res){
    try{
        const { id } = req.params
        const {FIO, phone} = req.body
        const update = await sql`update Users set FIO = ${FIO}, phone = ${phone} where id = ${id}`
        res.sendStatus(200)
    }
    catch(err){
        console.log(err)
        res.send(err)
        res.sendStatus(500)
    }
})
app.get('/orders', order_get)
app.get('/orders/:user_id', order_get)
//ветка регистрации
app.post('/reg', register)
//ветка логина
app.post('/auth', auth)
app.post('/addOrder', upload.array('photo'), async function (req, res) { 
    try{
        if (req.body.user_comment != null || req.body.user_comment != undefined){
            const order = await sql`insert into Orders(date, place, auto_number, user_comment, user_id, status) 
        values(${req.body.date}, ${req.body.place}, ${req.body.auto_number}, ${req.body.user_comment}, ${req.body.user_id}, 'В рассмотрении') RETURNING id;`
            for(const photo of req.files){
                const order_photo = await sql`insert into Photos(photo_url, order_id) values(${`http://localhost:3002/${photo.filename}`}, ${order[0].id});`
            }
        }
        else{
            const order = await sql`insert into Orders(date, place, auto_number, user_id, status) 
        values(${req.body.date}, ${req.body.place}, ${req.body.auto_number}, ${req.body.user_id}, 'В рассмотрении') RETURNING id;`
            console.log(order[0].id)
            for(const photo of req.files){
                const order_photo = await sql`insert into Photos(photo_url, order_id) values(${`http://localhost:3002/${photo.filename}`}, ${order[0].id});`
            }
        }
    }catch(err){
        console.log(err)
        res.send(err)
    } 
})


//функция старта приложения
const start = async () => {

    //создаем таблицы
    await sql`create table if not exists Roles(
        role varchar(100) unique primary key
    )`
    await sql`create table if not exists Statuses(
        status varchar(100) unique primary key
    )`
    await sql`create table if not exists Users(
        id SERIAL PRIMARY KEY NOT NULL,
        FIO varchar(100) NOT NULL,
        phone int NOT NULL,
        role varchar(100) NOT NULL,
        password varchar(100) NOT NULL,
        FOREIGN KEY (role) REFERENCES Roles(role)
    )`
    await sql`create table if not exists Orders(
        id SERIAL PRIMARY KEY NOT NULL,
        date DATE NOT NULL,
        place varchar(100) NOT NULL,
        auto_number varchar(100) NOT NULL,
        user_comment varchar(500),
        admin_comment varchar(500),
        user_id int NOT NULL,
        status varchar(100) NOT NULL,
        FOREIGN KEY (status) REFERENCES Statuses(status),
        FOREIGN KEY (user_id) REFERENCES Users(id)
    )`
    await sql`create table if not exists Photos(
        id SERIAL PRIMARY KEY NOT NULL,
        photo_url varchar(150) NOT NULL,
        order_id int NOT NULL,
        FOREIGN KEY (order_id) REFERENCES Orders(id)
    )`

    //запустить в первый раз и больше не запускать
    //чтобы добавить роли в таблицу ролей

    // await sql`insert into Roles(role) values('USER')`
    // await sql`insert into Roles(role) values('ADMIN')`
    // await sql`insert into Statuses(status) values('В рассмотрении')`
    // await sql`insert into Statuses(status) values('Принята')`
    // await sql`insert into Statuses(status) values('Откланена')`

    //запустить сервак
    //(прослушивать порт на запросы)
    //вторым аргументом функция которая запустится при успешном запуске сервака
    app.listen(PORT, () => {
        console.log(`СЕРВАК ФУРЫЧИТ ТУТ http://localhost:${PORT}`);
    })
}

start()