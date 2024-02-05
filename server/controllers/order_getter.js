import { sql } from "../db.js"

const photos_get = async (order_id) => {
    const photos = sql`select * from Photos where order_id = ${order_id}`;
    return photos;
}

export const order_get = async (req, res) =>{
    const { user_id } = req.params
    if (user_id){
        const orders = await sql`select * from Orders where user_id = ${user_id}`
        const result = []
        for (var order in orders){
            const current_order_id = orders[order].id;
            const photos = await photos_get(current_order_id);
            result.push({'order': orders[order], 'photos': photos})
            //console.log(orders[order].id)
        }
        return res.json(result)
    }else{
        const orders = await sql`select * from Orders`
        const result = []
        for (var order in orders){
            const current_order_id = orders[order].id;
            const photos = await photos_get(current_order_id);
            result.push({'order': orders[order], 'photos': photos})
            //console.log(orders[order].id)
        }
        return res.json(result)
    }
    
}