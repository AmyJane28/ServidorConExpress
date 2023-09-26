//importamos express
import express from 'express'

//importamos ProductManager.js
import {manager} from './ProductManager.js'

//creamos servidor
const app= express();

//Leer archivo de productos y devolverlo
app.get('/products', async(req,res)=>{
    console.log("query", req.query)
    const products = await manager.getProduct(req.query)
    res.json({message: 'Products Found', products})
})

//Recibir parámetro y devolver solo el producto solicitado
app.get('/products/:id',async(req,res)=>{
    console.log(req.params)
    const {id} = req.params
    const products = await manager.getProductById(+id)
    res.json({message: 'Product Found',products})
})

//Asignamos puerto
app.listen(8080, ()=>{
    console.log('Escuchando puerto 8080')
})