import React, { useState, useEffect } from "react";
import SERVER_URL from "../Config/config";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Producto from "./Producto";
const Nevera = () => {
  const navigate = useNavigate();
  const [nevera, setNevera] = useState({});
  const [neveraId, setNeveraId] = useState("");
  const [nuevoProducto, setNuevoProducto] = useState("");
  const [nuevaCantidad, setNuevaCantidad] = useState("");
  const [tipoCantidad, setTipoCantidad] = useState("");
  const [error, setError] = useState("");
  const [productoEditando, setProductoEditando] = useState(null);
  const [nombreEditando, setNombreEditando] = useState("");
  const [cantidadEditando, setCantidadEditando] = useState("");
  const [tipoEditando, setTipoEditando] = useState("");
  // Función para cargar la lista de nevera 
  const cargarnevera = async () => {
    if (neveraId) {
      try {
        const response = await fetch(`${SERVER_URL}/nevera/${neveraId}`);
        const data = await response.json();
        setNevera(data.nevera);
      } catch (error) {
        console.error("Error al cargar las nevera:", error);
      }
    }
  };

  // Función para obtener el ID de la nevera asociada al usuario
  const obtenerIdNeveraUsuario = async () => {
    try {
      const userEmail = localStorage.getItem("user");
      const response = await fetch(`${SERVER_URL}/cuenta/nevera`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();
      setNeveraId(data.nevera);
    } catch (error) {
      console.error("Error al obtener el ID de la nevera del usuario:", error);
    }
  };

  // Función para agregar un nuevo producto a la nevera
  const agregarProducto = async () => {
    try {
      if (!nuevoProducto || !nuevaCantidad || !tipoCantidad) {
        setError("Por favor, completa todos los campos.");
        return;
      }

      await fetch(`${SERVER_URL}/nevera/update/${neveraId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productos: {
            nombre: nuevoProducto,
            cantidad: nuevaCantidad,
            tipo: tipoCantidad
          }
        }),
      });

      // Recargar la nevera después de la actualización exitosa
      cargarnevera();
      setNuevoProducto("");
      setNuevaCantidad("");
      setTipoCantidad("");
      setError("");
    } catch (error) {
      console.error("Error al agregar producto a la nevera:", error);
      setError("Error al agregar producto a la nevera");
    }
  };
  const editarProducto = (producto) => {
    setProductoEditando(producto);
    setProductoEditando(producto);
    setNombreEditando(producto.nombre);
    setCantidadEditando(producto.cantidad);
    setTipoEditando(producto.tipo);
  };

  const handleCancelarEdicion = () => {
    setProductoEditando(null);
  };

  const eliminarProducto = async (nombreProducto) => {
    try {

      const nuevaListaProductos = nevera.productos.filter(producto => producto.nombre !== nombreProducto);
      setNevera({ ...nevera, productos: nuevaListaProductos });
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  const handleGuardarCambios = async () => {
    try {
      const productosActualizados = nevera.productos.map(producto => {
        if (producto.nombre == productoEditando.nombre) {
          return {
            ...producto,
            nombre: nombreEditando, 
            cantidad: cantidadEditando != "" ? cantidadEditando : producto.cantidad,
            tipo: tipoEditando != "" ? tipoEditando : producto.tipo
          };
        }
        return producto;
      });
  
      // Actualizar el estado nevera con los productos actualizados
      setNevera({ ...nevera, productos: productosActualizados });
  
      // Reiniciar los estados de edición
      setProductoEditando(null);
      setNombreEditando("");
      setCantidadEditando("");
      setTipoEditando("");
    } catch (error) {
      console.error("Error al guardar los cambios del producto:", error);
    }
  };
  useEffect(() => {
    obtenerIdNeveraUsuario();
    cargarnevera();

  }, [neveraId]); // Se ejecuta solo una vez al cargar el componente

  return (
    <div>
      <h1>{nevera.nombre}</h1>


      {nevera.productos && (
        <div>
          <h2>Productos en la Nevera</h2>
          <ul>
            {nevera.productos.map(producto => (
              <li key={producto.nombre}>{producto.nombre} - {producto.cantidad} {producto.tipo}
                {productoEditando == producto ? (
                  <div>
                    <input type="text" value={nombreEditando} onChange={e => setNombreEditando(e.target.value)} />
                    <input type="number" value={cantidadEditando} onChange={e => setCantidadEditando(e.target.value)} />
                    <select value={tipoEditando} onChange={e => setTipoEditando(e.target.value)}>
                      <option value="">Selecciona el tipo</option>
                      <option value="unidades">Unidades</option>
                      <option value="kg">Kg</option>
                      <option value="litros">Litros</option>
                    </select>
                    <button onClick={handleCancelarEdicion}>Cancelar</button>
                    <button onClick={handleGuardarCambios}>Guardar</button>
                  </div>
                ) : (
                  <>
                    <FaEdit onClick={() => editarProducto(producto)} style={{ cursor: "pointer", marginLeft: "5px" }} />
                    <FaTrash onClick={() => eliminarProducto(producto.nombre)} style={{ cursor: "pointer", marginLeft: "5px" }} />
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <h2>Añadir Nuevo Producto</h2>
        <input type="text" placeholder="Nombre del Producto" value={nuevoProducto} onChange={e => setNuevoProducto(e.target.value)} />
        <input type="number" placeholder="Cantidad" value={nuevaCantidad} onChange={e => setNuevaCantidad(e.target.value)} />
        <select value={tipoCantidad} onChange={e => setTipoCantidad(e.target.value)}>
          <option value="">Selecciona el tipo</option>
          <option value="unidades">Unidades</option>
          <option value="kg">Kg</option>
          <option value="litros">Litros</option>
        </select>
        <button onClick={agregarProducto}>Agregar Producto</button>
      </div>

    </div>
  );
};

export default Nevera;
