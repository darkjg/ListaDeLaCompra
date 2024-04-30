import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { FaSave } from "react-icons/fa";

const Producto = ({ nevera, setNevera }) => {
  const { nombreProducto } = useParams();
  const [productoEditado, setProductoEditado] = useState({
    nombre: nombreProducto,
    cantidad: "",
    tipo: ""
  });

  const GuardarCambios = () => {
 
    const productosActualizados = nevera.productos.map(p => {
      if (p.nombre === productoEditado.nombre) {
        return { ...p, cantidad: productoEditado.cantidad, tipo: productoEditado.tipo };
      }
      return p;
    });
    setNevera({ ...nevera, productos: productosActualizados });
  };

  return (
    <div>
      <h1>Editar Producto: {nombreProducto}</h1>
      <input
        type="number"
        value={productoEditado.cantidad}
        onChange={e => setProductoEditado({ ...productoEditado, cantidad: e.target.value })}
      />
      <select
        value={productoEditado.tipo}
        onChange={e => setProductoEditado({ ...productoEditado, tipo: e.target.value })}
      >
        <option value="">Selecciona el tipo</option>
        <option value="unidades">Unidades</option>
        <option value="kg">Kg</option>
        <option value="litros">Litros</option>
      </select>
      <button onClick={GuardarCambios}><FaSave /> Guardar Cambios</button>
    </div>
  );
};

export default Producto;