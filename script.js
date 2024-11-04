class Carrito {
    constructor(productos) {
        this.productos = productos; 
        this.carrito = {};

        productos.forEach(producto => {
            this.carrito[producto.SKU] = 0;
        });
    }

    actualizarUnidades(sku, unidades) {
        if (unidades >= 0) {
            this.carrito[sku] = unidades;
            this.actualizarDOM();
        }
    }

    obtenerInformacionProducto(sku) {
        return this.productos.find(producto => producto.SKU === sku);
    }

    obtenerCarrito() {
        let total = 0;
        let productosCarrito = [];

        for (let sku in this.carrito) {
            if (this.carrito[sku] > 0) {
                let producto = this.obtenerInformacionProducto(sku);
                if (producto) {
                    let cantidad = this.carrito[sku];
                    let subtotal = producto.price * cantidad;
                    total += subtotal;
                    productosCarrito.push({
                        ...producto,
                        quantity: cantidad,
                        total: subtotal.toFixed(2)
                    });
                }
            }
        }

        return {
            total: total.toFixed(2),
            currency: '€',
            products: productosCarrito
        };
    }

    actualizarDOM() {
        const tbody = document.getElementById('cuerpoTabla');
        tbody.innerHTML = ''; 

        this.productos.forEach(producto => {
            let cantidad = this.carrito[producto.SKU];
            let totalProducto = (producto.price * cantidad).toFixed(2);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${producto.title}</td>
                <td>
                    <button onclick="carrito.actualizarUnidades('${producto.SKU}', ${Math.max(cantidad - 1, 0)})">-</button>
                    ${cantidad}
                    <button onclick="carrito.actualizarUnidades('${producto.SKU}', ${cantidad + 1})">+</button>
                </td>
                <td>${producto.price}€</td>
                <td>${totalProducto}€</td>
            `;

            tbody.appendChild(row);
        });

        const totalFinal = this.obtenerCarrito().total;
        document.getElementById('totalFinal').textContent = `${totalFinal}€`;

        // Actualizar el carrito visualmente
        this.actualizarCarritoDOM();
    }

    actualizarCarritoDOM() {
        const productosCarritoDiv = document.getElementById('productosCarrito');
        productosCarritoDiv.innerHTML = ''; 

        const carritoInfo = this.obtenerCarrito();
        carritoInfo.products.forEach(producto => {
            const productoDiv = document.createElement('div');
            productoDiv.innerHTML = `${producto.quantity} x ${producto.title} - ${producto.total}€`;
            productosCarritoDiv.appendChild(productoDiv);
        });

       
        const totalFinal = carritoInfo.total;
        document.getElementById('totalFinal').textContent = `${totalFinal}€`;
    }
}

fetch('https://jsonblob.com/api/1303045873599373312')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Datos cargados:', data); 
        const productos = data.products || data; 
        window.carrito = new Carrito(productos);
        carrito.actualizarDOM();
    })
    .catch(error => console.error('Error al cargar los datos:', error));
