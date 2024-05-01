import React, { useState, useEffect } from 'react';
import SERVER_URL from "../Config/config";
import { FaEdit, FaTrash } from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';
function RecetasComponent() {
    const [recetas, setRecetas] = useState([]);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [nombreProducto, setNombreProducto] = useState('');
  
    const navigate = useNavigate();
    const obtenerTodasRecetas = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/recetas`);
            if (!response.ok) {
                throw new Error('Error al obtener las recetas');
            }
            const data = await response.json();
            setRecetas(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const crearReceta = async (nuevaReceta) => {
        try {
            // Verificar si la receta ya existe
            const response = await fetch(`${SERVER_URL}/recetas/${nuevaReceta.nombre}`);
            if (response.ok) {
                // La receta ya existe
                throw new Error('La receta ya existe');
            }

            // Si la receta no existe, crearla
            const crearResponse = await fetch(`${SERVER_URL}/recetas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevaReceta),
            });
            if (!crearResponse.ok) {
                throw new Error('Error al crear la receta');
            }
            // Si es necesario hacer algo después de crear la receta, puedes hacerlo aquí
        } catch (err) {
            console.error('Error al crear la receta:', err);
        }
    };

    const actualizarReceta = async (id, nuevaInfoReceta) => {
        try {
            const response = await fetch(`${SERVER_URL}/recetas/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevaInfoReceta),
            });
            if (!response.ok) {
                throw new Error('Error al actualizar la receta');
            }
            obtenerTodasRecetas();
        } catch (err) {
            setError(err.message);
        }
    };

    const eliminarReceta = async (id) => {
        try {
            const response = await fetch(`${SERVER_URL}/recetas/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Error al eliminar la receta');
            }
            obtenerTodasRecetas();
        } catch (err) {
            setError(err.message);
        }
    };


    const buscarRecetasPorProducto = async (nombreProducto) => {
        try {
            const response = await fetch(`${SERVER_URL}/recetas/buscar/${nombreProducto}`);
            if (!response.ok) {
                throw new Error('Error al buscar recetas por producto');
            }
            const data = await response.json();
            setRecetas(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const obtenerRecetasDisponibles = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/recetasDisponibles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            if (!response.ok) {
                throw new Error('Error al obtener recetas disponibles');
            }
            const data = await response.json();
            setRecetas(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const obtenerMejorRecetaDelMes = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/recetas/Top`);
            if (!response.ok) {
                throw new Error('Error al obtener la mejor receta del mes');
            }
            const data = await response.json();
            setRecetas([data]);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        obtenerTodasRecetas();
    }, []);
    const redirectToCrearRecetas = () => {
        navigate("/CrearRecetas"); 
    };
    return (
        <div>
            <h1>Recetas</h1>
            {error && <p>Error: {error}</p>}
            <button onClick={obtenerTodasRecetas}>Obtener todas las recetas</button>
            <button onClick={obtenerRecetasDisponibles}>Obtener recetas disponibles</button>
            <button onClick={obtenerMejorRecetaDelMes}>Obtener mejor receta del mes</button>
            <input type="text" placeholder="Buscar recetas por producto" value={nombreProducto} onChange={(e) => setNombreProducto(e.target.value)} />
            <button onClick={() => buscarRecetasPorProducto(nombreProducto)}>Buscar</button>
            <button onClick={redirectToCrearRecetas}>Crear Recetas</button>
            
            <ul>
                {recetas.map((receta) => (
                    <li key={receta._id}>
                        {receta.nombre}
                        <button onClick={() => actualizarReceta(receta._id, nuevaInfoReceta)}>
                            <FaEdit /> Actualizar
                        </button>
                        <button onClick={() => eliminarReceta(receta._id)}>
                            <FaTrash /> Eliminar
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RecetasComponent;
