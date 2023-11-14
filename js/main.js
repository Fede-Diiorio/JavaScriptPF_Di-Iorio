//CLASES
class Producto {
   constructor(id, nombre, precio, stock, imagen, descripcion, descripcionImagen, categoria) {
      this.id = id;
      this.nombre = nombre;
      this.precio = precio;
      this.stock = stock;
      this.imagen = imagen;
      this.descripcion = descripcion
      this.descripcionImagen = descripcionImagen;
      this.categoria = categoria;
   }
};

// FUNCIONES
function BarraDeBusqueda() {
   const formBusqueda = document.getElementById("formBusqueda");
   const BarraDeBusqueda = document.getElementById("inputBuscarProductos");

   formBusqueda.addEventListener("submit", (event) => {
      event.preventDefault();

      const value = BarraDeBusqueda.value;
      const productosFiltrados = productos.filter((producto) => {
         return producto.nombre.toLowerCase().includes(value.toLowerCase());
      });

      renderizarProductos(productosFiltrados);
   });
}

function filtradoPorOrden() {
   const ordenFiltros = document.getElementById("ordenFiltros");

   ordenFiltros.addEventListener("click", (e) => {
      const target = e.target;

      if (target.type === "radio") {
         if (target.id === "mayorPrecio") {
            // Ordenar productos por mayor precio
            productos.sort((a, b) => b.precio - a.precio);
         } else if (target.id === "menorPrecio") {
            // Ordenar productos por menor precio
            productos.sort((a, b) => a.precio - b.precio);
         } else if (target.id === "alfabetoAZ") {
            productos.sort((a, b) => {
               if (a.nombre > b.nombre) {
                  return 1;
               };
               if (a.nombre < b.nombre) {
                  return -1;
               };
               return 0;
            });
         } else if (target.id === "alfabetoZA") {
            productos.sort((a, b) => {
               if (a.nombre > b.nombre) {
                  return -1;
               };
               if (a.nombre < b.nombre) {
                  return 1;
               };
               return 0;
            });
         };

         renderizarProductos(productos);
      };
   });
}

function mostrarNumeroConComas(numero) {
   const numeroConDecimales = Number(numero).toFixed(2);
   const numeroFormateado = numeroConDecimales.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
   return numeroFormateado;
}

function numeroDeProductosEnElCarrito() {
   const ls = JSON.parse(localStorage.getItem("carrito"));
   const numeroDeProductos = document.getElementById("contenedorParaCarritoIndex");
   numeroDeProductos.innerHTML = "";

   let totalCantidad = 0;

   if (ls) {
      ls.forEach((item) => {
         // Accedes a la propiedad "cantidad" de cada objeto en ls
         totalCantidad += item.cantidad;
      });
   }

   const numerito = document.createElement("a");
   numerito.className = "numero-carrito";
   numerito.innerText = totalCantidad; // Muestra el total de la cantidad de productos

   if (totalCantidad !== 0) {
      numerito.setAttribute('href', './pages/carrito.html');
      numeroDeProductos.append(numerito);
   }

}

function guardarProductoEnLocalStorage(producto, cantidad) {

   const agregarProducto = {
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: parseInt(cantidad),
      total: producto.precio * cantidad,
      stock: producto.stock,
      imagen: `.${producto.imagen}`
   };

   // Si no hay productos cargados a Local Storage
   if (carrito === null) {
      carrito = [agregarProducto];

   } else {

      if (agregarProducto.stock >= agregarProducto.cantidad) {
         agregarProducto.stock -= agregarProducto.cantidad;
      } else {
         alert("Stock insuficiente.");
         return; // No agregamos el producto si no hay suficiente stock
      }

      // Buscar indice de producto en local storage
      const buscarIndiceDeProducto = carrito.findIndex((el) => {
         return el.nombre === agregarProducto.nombre;
      });

      if (buscarIndiceDeProducto === -1) {
         carrito.push(agregarProducto);
      } else {
         carrito[buscarIndiceDeProducto].cantidad += parseInt(cantidad);
         carrito[buscarIndiceDeProducto].total += parseInt(agregarProducto.total);
         carrito[buscarIndiceDeProducto].stock -= parseInt(cantidad);
      }
   }
   // Actualizar Local Storage
   localStorage.setItem("carrito", JSON.stringify(carrito));
}

function obtenerProductosDeLocalStorage() {
   const carritoEnLocalStorage = JSON.parse(localStorage.getItem("carrito"));
   carrito = carritoEnLocalStorage ? carritoEnLocalStorage : [];
}

function renderizarProductos(productos) {
   const contenedor = document.getElementById("contenedor-js");
   contenedor.innerHTML = "";

   obtenerProductosDeLocalStorage();

   for (const producto of productos) {

      const divPadre = document.createElement("div");
      divPadre.className = "card col-12 col-md-6 col-lg-4 mb-5 width-card"

      const productoEnCarrito = carrito.find((item) => item.nombre === producto.nombre);
      const stockAMostrar = productoEnCarrito ? productoEnCarrito.stock : producto.stock;

      const imagenProducto = document.createElement("img");
      imagenProducto.className = "card-img-top";
      imagenProducto.setAttribute("src", producto.imagen);
      imagenProducto.setAttribute("alt", producto.descripcionImagen);

      const divCard = document.createElement("div");
      divCard.className = "card-cuerpo"

      const titulo = document.createElement("h4");
      titulo.className = "card-title";
      titulo.innerText = producto.nombre;

      const contenedorPrecioStock = document.createElement("p");
      contenedorPrecioStock.className = "contenedor-precio-stock";

      const precio = document.createElement("p");
      precio.className = "precio";
      precio.innerText = `$${mostrarNumeroConComas(producto.precio)}`;

      const contenedorParaBoton = document.createElement("div");
      contenedorParaBoton.className = "contenedor-boton";

      const botonComprar = document.createElement("p");
      botonComprar.className = "boton";
      botonComprar.innerText = "Comprar"

      const stock = document.createElement("p");
      stock.innerHTML = `<strong>Stock:</strong> ${stockAMostrar}`;

      botonComprar.addEventListener("click", () => {
         renderizarProductoIndividual(producto)
      });

      // Insertar elementos uno dentro de otro
      contenedorPrecioStock.append(precio, stock);
      divCard.append(titulo, contenedorPrecioStock, botonComprar);
      divPadre.append(imagenProducto, divCard);

      contenedor.append(divPadre);
   }
}

function renderizarProductoIndividual(producto) {

   const contenedor = document.getElementById("producto-individual")
   contenedor.innerHTML = "";
   document.body.classList.add('no-scroll');

   obtenerProductosDeLocalStorage()

   const productoEnCarrito = carrito.find((item) => item.nombre === producto.nombre);
   const stockAMostrar = productoEnCarrito ? productoEnCarrito.stock : producto.stock;

   const divAbuelo = document.createElement("div");
   divAbuelo.className = "overlayProducto"

   const divPadre = document.createElement("div");
   divPadre.className = "producto-individual container marco";

   const imagen = document.createElement("img");
   imagen.setAttribute("src", producto.imagen);
   imagen.className = "producto-individual__imagen";

   const informacion = document.createElement("div");
   informacion.className = "producto-individual__informacion";

   const titulo = document.createElement("h2");
   titulo.className = "producto-individual__titulo"
   titulo.innerText = `${producto.nombre}`;

   const descripcion = document.createElement("p");
   descripcion.className = "producto-individual__descripcion";
   descripcion.innerText = `${producto.descripcion}`;

   const precio = document.createElement("p");
   precio.className = "precio";
   precio.innerText = `$${mostrarNumeroConComas(producto.precio)}`;

   const stock = document.createElement("p");
   stock.className = "producto-individual__stock"
   stock.innerHTML = `<strong>Stock:</strong> ${stockAMostrar}`;

   const formDeCompra = document.createElement("form");
   formDeCompra.className = "producto-individual__form";

   const consultaCantidad = document.createElement("div");
   consultaCantidad.className = "producto-individual__cantidad";

   const consultaCantidadLabel = document.createElement("label");
   consultaCantidadLabel.innerText = "Cantidad:"

   const consultaCantidadInput = document.createElement("input");
   consultaCantidadInput.type = "number"
   consultaCantidadInput.value = 1;
   consultaCantidadInput.min = 1;

   const comprar = document.createElement("a");
   comprar.innerText = "Comprar";
   comprar.className = "boton";

   const volver = document.createElement("p");
   volver.innerText = "Cancelar"
   volver.className = "producto-individual__cancelar"

   const productoAgregado = document.createElement("h2");
   productoAgregado.className = "producto-individual__agregado";
   productoAgregado.innerText = "¡Agregado al Carrito!"

   const stockInsuficiente = document.createElement("h2");
   stockInsuficiente.className = "producto-individual__agregado";
   stockInsuficiente.innerText = "Stock Insuficiente"

   const numeroInvalido = document.createElement("h2");
   numeroInvalido.className = "producto-individual__agregado";
   numeroInvalido.innerText = "Debe ingresar un número mayor a 0."

   volver.addEventListener("click", () => {
      contenedor.innerHTML = "";
      renderizarProductos(productos);
      document.body.classList.remove('no-scroll');
   });

   comprar.addEventListener("click", () => {
      const cantidad = consultaCantidadInput.value;

      if (cantidad < 1) {
         divPadre.append(imagen, informacion, numeroInvalido);
         setTimeout(() => {
            renderizarProductoIndividual(producto);
         }, 2000)
      } else {
         if (cantidad > stockAMostrar) {
            divPadre.append(imagen, informacion, stockInsuficiente);
            setTimeout(() => {
               renderizarProductoIndividual(producto);
            }, 1000)
         } else {
            guardarProductoEnLocalStorage(producto, cantidad);
            divPadre.append(imagen, informacion, productoAgregado);
            setTimeout(() => {
               document.body.classList.remove('no-scroll');
               numeroDeProductosEnElCarrito();
               renderizarProductos(productos);
               contenedor.innerHTML = "";
            }, 750)
         };
      };
   });

   consultaCantidad.append(consultaCantidadLabel, consultaCantidadInput);
   formDeCompra.append(consultaCantidad, comprar, volver);
   informacion.append(titulo, descripcion, precio, stock, formDeCompra);
   divPadre.append(imagen, informacion);
   divAbuelo.append(divPadre);
   contenedor.append(divAbuelo);
}

// INICIO DEL PROGRAMA
const productos = [
   new Producto(0, "Fuente Sentey 700W", 42000, 10, "./img/Fuente.webp", "Fuente sentey 700w hbp700-gs 80 plus bronze active pfc autofan 20+4x1 4+4pinesx1 satax6 molexx 2pci-e6+2x2", "Imagen Fuente Sentey", "Fuente"),
   new Producto(1, "Memoria Ram 8gb", 13500, 60, "./img/RAM.webp", "Memoria Ddr3 8gb 1600mhz 1.5v Desktop Mushkin Essentials Latencia 11-11-11-28", "Imagen Memoria RAM", "Memoria"),
   new Producto(2, "Disco Rigido 2tb", 43500, 10, "./img/HDD.webp", "Disco rigido 2tb 3.5 sata 3 seagate barracuda desktop escritorio", "Imagen Disco Rigido HDD", "Unidad de Almacenamiento"),
   new Producto(3, "Webcam Philips", 12500, 5, "./img/webcam.webp", "Webcam philips p406b fhd 1080p usb 1920x1080 30fps angulo de vision 70 grados", "Imagen Webcam Philips", "Webcam"),
   new Producto(4, "Placa Madre Asrock", 160000, 10, "./img/mother.webp", "Mother asrock z690 extreme hdmi displayport 4xddr4 1xps2 5xusb 1xusbtipoc 3xpciex16 1xpciex1 8xsata2xm21xm2 wifi rj45 7.1 1700 compatible generacion 12 y 13 - Ya actualizado", "Imagen Placa Madre Asrock", "Placa Madre"),
   new Producto(5, "Procesador Intel I7", 165000, 5, "./img/procesador.webp", "Procesador intel comet lake i7-10700 8 nucleos 16 hilos 2.9ghz a 4.8ghz socket1200 solo windows 10 64Bits. Decima generacion trae cooler trae video integrado", "Imagen Procesador Intel I7", "Procesador"),
   new Producto(6, "Disco Solido Crucial 1tb", 32000, 10, "./img/m21tb.webp", "Disco solido SSD 1TB M2 Cruscial P3 22x80mm interface PCIE NVME 3D NAND lectura 3500MB escritura 1900mb PCIE G3 1X4.", "Imagen Disco M.2 Crucial", "Unidad de Almacenamiento"),
   new Producto(7, "Disco Solido ADATA 120gb", 9700, 30, "./img/ssd120.webp", "Disco solido SSD 120BG 2.5 sata III Adata ultimate SU650 lectura 520MB escritura 450MB.", "Imagen Disco SSD ADATA", "Unidad de Almacenamiento"),
   new Producto(8, "Disco Solido Kingston 240gb", 13000, 20, "./img/ssd240.webp", "Disco solido SSD 240GB 2.5 sata III Kingston A400 lectura hasta 500MB y escritura hasta 450MB.", "Disco SSD Kingston", "Unidad de Almacenamiento")
];

let carrito = [];
console.log(carrito)

renderizarProductos(productos);
BarraDeBusqueda();
filtradoPorOrden();
obtenerProductosDeLocalStorage();
numeroDeProductosEnElCarrito();
