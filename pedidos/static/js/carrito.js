'use strict';

class Carrito {

    constructor(str) {
        this.productos = [];
        if (str) {
            str.split(",").forEach(element => {
                let p = element.split("-")
                this.productos.push(new ProductoCarrito(p[0],parseInt(p[1]),p[2]))
            });
        }
    }

    //Metodod para obtener un producto
    obtenerProducto(id,talla) {
        let p = new ProductoCarrito(id,0,talla)
        return this.productos.find(prod => prod.equals(p))
    }

    //Metodo para anyadir un producto
    anyadirProducto(id, cantidad, talla) {
        let producto = this.obtenerProducto(id,talla)
        if (producto) {
            producto.cantidad = cantidad;
        }else{
            this.productos.push(new ProductoCarrito(id, parseInt(cantidad),talla))
        }
    }

    //Metodo para eliminar un producto
    eliminarProducto(id,talla) {
        let prod = new ProductoCarrito(id, 0,talla)
        this.productos = this.productos.filter(producto => !prod.equals(producto));
    }

    //Metodo para anyadir una cantidad a un producto
    agregarCantidad(id, cantidad, talla) {
        let producto = this.obtenerProducto(id,talla);

        if (producto) {
            producto.cantidad += parseInt(cantidad);
        } else {
            //En caso de no encontrarlo lo anyadimos como nuevo
            this.anyadirProducto(id, cantidad,talla);
        }
    }

    // Metodo para eliminar cantidad de un producto
    eliminarCantidad(id, cantidad,talla) {
        let producto = obtenerProducto(id,talla);
        if (producto) {
            producto.setCantidad -= parseInt(cantidad);

            // Si la cantidad se reduce a 0 o menos, eliminamos el producto del carrito
            if (producto.getCantidad <= 0) {
                this.eliminarProducto(id,talla);
            }
        }
    }

    //Metodo para comprobar si el carrito esta vacio
    isEmpty() {
        return this.productos.length == 0;
    }

    //Metodo que devuelve el array de productos del carrito
    getProductos() {
        return this.productos;
    }

    toString() {
        let str = ""
        this.productos.forEach(element => {
            str += element + ","
        });
        str = str.substring(0, str.length - 1)
        return str
    }

    getSize(){
        let sum = 0;
        this.productos.forEach(prod => {
            sum += prod.cantidad;
        });
        return sum;
    }

    guardarCarrito(){
        sessionStorage.setItem("carrito", this);
    }

    vaciarCarrito(){
        this.productos = [];
    }

}

class ProductoCarrito {
    constructor(id, cantidad,talla) {
        this.id = id
        this.cantidad = cantidad
        this.talla = ""+talla
    }

    equals(prod) {
        return prod.id == this.id && this.talla == prod.talla;
    }

    toString() {
        return this.id + "-" + this.cantidad + "-" + this.talla;
    }
}

// Exportamos las clases que hemos usado para usarlas en el resto de documentos
export default Carrito;