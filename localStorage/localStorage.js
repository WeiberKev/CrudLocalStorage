const d = document;
let nombrePro = d.querySelector("#nombrePro");
let precioPro = d.querySelector("#precioPro");
let descripcionPro = d.querySelector("#descripcionPro");
let imagenPro = d.querySelector("#imagenPro");
let btnGuardar = d.querySelector(".btnGuardar");
let searchInput = d.querySelector("#searchInput");
let productList = d.querySelector("#productList");
let exportBtn = d.querySelector("#exportBtn");
let editIndex = null; // Variable para almacenar el índice del producto que se está editando

btnGuardar.addEventListener("click", () => {
    validarDatos();
});

searchInput.addEventListener("input", () => {
    filtrarProductos();
});

exportBtn.addEventListener("click", () => {
    exportarPDF();
});

function validarDatos() {
    let producto;
    if (nombrePro.value && precioPro.value && descripcionPro.value && imagenPro.value) {
        producto = {
            nombre: nombrePro.value,
            precio: precioPro.value,
            descripcion: descripcionPro.value,
            imagen: imagenPro.value
        };
        if (editIndex !== null) {
            // Si estamos editando, actualizamos el producto
            actualizarDatos(producto);
        } else {
            guardarDatos(producto);
        }
        mostrarProductos(); // Mostrar productos después de guardar o actualizar
    } else {
        alert("Todos los campos son obligatorios 🙄");
    }
    limpiarCampos();
}

function guardarDatos(pro) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    productos.push(pro);
    localStorage.setItem("productos", JSON.stringify(productos));
    alert("El producto fue guardado con éxito 🦄");
}

function actualizarDatos(pro) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    productos[editIndex] = pro; // Actualizar el producto en el índice correspondiente
    localStorage.setItem("productos", JSON.stringify(productos));
    alert("El producto fue actualizado con éxito 🦄");
    editIndex = null; // Reiniciar el índice de edición
}

function mostrarProductos() {
    productList.innerHTML = ""; // Limpiar la lista antes de mostrar los productos
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    productos.forEach((producto, index) => {
        let li = d.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.textContent = `${producto.nombre} - $${producto.precio} - ${producto.descripcion}`;
        
        // Botón de editar
        let editBtn = d.createElement("button");
        editBtn.className = "btn btn-warning btn-sm";
        editBtn.innerHTML = '<i class="bi bi-pencil"></i>'; // Icono de editar
        editBtn.onclick = () => {
            editarProducto(index);
        };

        // Botón de eliminar
        let deleteBtn = d.createElement("button");
        deleteBtn.className = "btn btn-danger btn-sm";
        deleteBtn.innerHTML = '<i class="bi bi-trash"></i>'; // Icono de eliminar
        deleteBtn.onclick = () => {
            eliminarProducto(index);
        };

        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        productList.appendChild(li);
    });
}

function filtrarProductos() {
    let filter = searchInput.value.toLowerCase();
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    productList.innerHTML = ""; // Limpiar la lista antes de mostrar los resultados
    productos.forEach((producto, index) => {
        if (producto.nombre.toLowerCase().includes(filter)) {
            let li = d.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            li.textContent = `${producto.nombre} - $${producto.precio} - ${producto.descripcion}`;
            
            // Botón de editar
            let editBtn = d.createElement("button");
            editBtn.className = "btn btn-warning btn-sm";
            editBtn.innerHTML = '<i class="bi bi-pencil"></i>'; // Icono de editar
 editBtn.onclick = () => {
                editarProducto(index);
            };

            // Botón de eliminar
            let deleteBtn = d.createElement("button");
            deleteBtn.className = "btn btn-danger btn-sm";
            deleteBtn.innerHTML = '<i class="bi bi-trash"></i>'; // Icono de eliminar
            deleteBtn.onclick = () => {
                eliminarProducto(index);
            };

            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
            productList.appendChild(li);
        }
    });
}

function editarProducto(index) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    let producto = productos[index];
    nombrePro.value = producto.nombre;
    precioPro.value = producto.precio;
    descripcionPro.value = producto.descripcion;
    imagenPro.value = producto.imagen;
    editIndex = index; // Establecer el índice del producto que se está editando
}

function eliminarProducto(index) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    productos.splice(index, 1); // Eliminar el producto del índice correspondiente
    localStorage.setItem("productos", JSON.stringify(productos));
    mostrarProductos(); // Actualizar la lista de productos
    alert("El producto fue eliminado con éxito 🦄");
}

function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    let y = 10;

    doc.text("Listado de Productos", 10, y);
    y += 10;

    productos.forEach((producto) => {
        doc.text(`${producto.nombre} - $${producto.precio}`, 10, y);
        y += 10;
    });

    doc.save("productos.pdf");
}

function limpiarCampos() {
    nombrePro.value = "";
    precioPro.value = "";
    descripcionPro.value = "";
    imagenPro.value = "";
}

// Llamar a mostrarProductos al cargar la página para mostrar la lista inicial
mostrarProductos();