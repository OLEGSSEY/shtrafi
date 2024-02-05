import postgres from 'postgres'

//подключение к базе данных
export const sql = postgres({
    host: '192.168.147.50',
    port: 5432,
    db: 'alexdb',
    username: 'Alexxx',
    password: '3228bush-'
})