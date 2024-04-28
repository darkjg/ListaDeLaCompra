import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SERVER_URL from "../Config/config";

const ListaPagina = () => {
    const { id } = useParams();
    const [lista, setLista] = useState(null);
    const [nuevoNombreLista, setNuevoNombreLista] = useState('');
    const [nuevoProducto, setNuevoProducto] = useState('');
    const [nuevaCantidad, setNuevaCantidad] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLista = async () => {
            try {

                const response = await fetch(`${SERVER_URL}/lista/${id}`);
                console.log(response)
                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }
                const data = await response.json();
                setLista(data);
            } catch (error) {
                console.error('Error al obtener la lista:', error);
                setError('Error al obtener la lista');
            }
        };

        fetchLista();
    }, [id]);

    const ChangeNombreLista = (event) => {
        setNuevoNombreLista(event.target.value);
    };

    const ChangeNuevoProducto = (event) => {
        setNuevoProducto(event.target.value);
    };

    const ChangeNuevaCantidad = (event) => {
        setNuevaCantidad(event.target.value);
    };

    const ActualizarNombreLista = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/lista/actualizar/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre: nuevoNombreLista }),
            });

            if (!response.ok) {
                throw new Error('Failed to update');
            }
            const data = await response.json();
            setLista(data);
        } catch (error) {
            console.error('Error al actualizar el nombre de la lista:', error);
            setError('Error al actualizar el nombre de la lista');
        }
    };

    const AgregarProducto = async () => {
        try {
            lista.Productos.push({ nombre: nuevoProducto, cantidad: nuevaCantidad })
          
            
            const response = await fetch(`${SERVER_URL}/lista/actualizar/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(lista),
            });

            if (!response.ok) {
                throw new Error('Failed to add product');
            }
            const data = await response.json();
            console.log(data)
            setLista(data);
            console.log(lista)
            setNuevoProducto('');
            setNuevaCantidad('');
        } catch (error) {
            console.error('Error al agregar producto:', error);
            setError('Error al agregar producto');
        }
    };

    const EliminarProducto = async (nombre) => {
        try {
            lista.Productos=lista.Productos.filter(producto => producto.nombre !== nombre);
            
            const response = await fetch(`${SERVER_URL}/lista/actualizar/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify( lista ),
            });

            if (!response.ok) {
                throw new Error('Failed to add product');
            }
            const data = await response.json();
            
            setLista(data);
            
            setNuevoProducto('');
            setNuevaCantidad('');
        } catch (error) {
            console.error('Error al agregar producto:', error);
            setError('Error al agregar producto');
        }
};

return (
    <div>
        {lista && (
            <div>
                <h1>{lista.NombreLista}</h1>

                <div>
                    <h2>Cambiar nombre de la lista:</h2>
                    <input type="text" value={nuevoNombreLista} onChange={ChangeNombreLista} />
                    <button onClick={ActualizarNombreLista}>Actualizar Nombre</button>
                </div>
                <div>
                    <h2>Añadir producto:</h2>
                    <input type="text" placeholder="Nombre del producto" value={nuevoProducto} onChange={ChangeNuevoProducto} />
                    <input type="number" placeholder="Cantidad" value={nuevaCantidad} onChange={ChangeNuevaCantidad} />
                    <button onClick={AgregarProducto}>Añadir Producto</button>
                </div>
                <div>
                    <h2>Productos:</h2>
                    <ul>
                        {lista.Productos.map((producto) => (
                            <li key={producto+ Math.floor(Math.random() * 999)}>

                                <div>{producto.nombre} :{producto.cantidad}</div>
                                <button onClick={() => EliminarProducto(producto.nombre)}>Eliminar</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )}
        {error && <p>{error}</p>}
    </div>
);
};

export default ListaPagina;
