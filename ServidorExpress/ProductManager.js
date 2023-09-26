import { existsSync, promises } from 'fs';


class ProductManager {
    constructor() {
        this.path = 'Productos.json' 
    }

    //Si existe me lee y lo retorno si no existe regresa un arreglo vacío 
    async getProduct(queryObj) {
        console.log("queryObj", queryObj);
        const {limit} = queryObj;
        try {
            if(existsSync(this.path)) {
                const productsFile = await promises.readFile(this.path, 'utf-8')
                const productsData = JSON.parse(productsFile)
                return limit ? productsData.slice(0, +limit) : productsData;
            } else {
                return []
            }
        } catch (error) {
            return error
        }
    }

    //Método para agregar productos al array inicial
    async addProduct(title, description, price, thumbnail, code, stock) {
        try {
            //Buscamos el arreglo con el método get
            const products = await this.getProduct()

            //Validar que todos los campos sean obligatorios
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                console.log("Faltan datos! Favor de ingresar datos completos")
            }

            //Validar que no se repita el campo code
            for (let i = 0; i < products.length; i++) {
                if (products[i].code === code) {
                    console.log(`El código ${code} ya existe`)
                    break;
                }
            }

            //Incrementar id
            let id
            if (!products.length) {
                id = 1
            }
            else {
                id = products[products.length - 1].id + 1
            }

            //Agregar objetos al arreglo
            products.push({
                id,
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            })

            //Guardamos en el archivo sobreescribiendo si ya existe, si no se va a crear
            await promises.writeFile(this.path, JSON.stringify(products))

        } catch (error) {
            return error
        }
    }//Fin del método

    //Método para buscar producto que coincida con el ID solicitado
    async getProductById(id) {
        try {
            const products = await this.getProduct({})
            const product = products.find((p)=>p.id===id)
            if(!product){
                return 'No found'
            } else{
                return product
            }
        } catch (error) {
            return error
            
        }
    }

    //Método para eliminar producto
    async deleteProduct(id){
        try {
            const products = await this.getProduct({})
            const newArrayProducts = products.filter(p=>p.id!==id)
            await promises.writeFile(this.path, JSON.stringify(newArrayProducts))
        }
        catch (error) {
            return error
        }
    }
}//Fin de la clase


/*async function test(){
    const product = new ProductManager
    await product.addProduct('producto1', 'Este es un producto prueba', 15, 'imagen1', 'c1', 50)
    await product.addProduct('producto2', 'Este es un producto prueba', 10, 'imagen2', 'c2', 50)
    await product.addProduct('producto3', 'Este es un producto prueba', 2, 'imagen3', 'c3', 50)
    await product.addProduct('producto4', 'Este es un producto prueba', 5, 'imagen4', 'c4', 50)
    await product.addProduct('producto5', 'Este es un producto prueba', 50, 'imagen5', 'c5', 50)
    await product.addProduct('producto6', 'Este es un producto prueba', 20, 'imagen6', 'c6', 50)
    await product.addProduct('producto7', 'Este es un producto prueba', 14, 'imagen7', 'c7', 50)
    await product.addProduct('producto8', 'Este es un producto prueba', 10, 'imagen8', 'c8', 50)
    await product.addProduct('producto9', 'Este es un producto prueba', 6, 'imagen9', 'c9', 50)
    await product.addProduct('producto10', 'Este es un producto prueba', 12, 'imagen10', 'c10', 50)
    const products = await product.getProduct()
    console.log(products)
    //await product.deleteProduct(1)
    //await product.getProductById(2)
}
test()*/

//Exportamos para poder usarla desde app.js
export const manager = new ProductManager();