import React, { useState, useEffect } from "react";
import SERVER_URL from "../Config/config";
import { FaTimes } from 'react-icons/fa';
function CrearRecetas() {
    const [nombre, setNombre] = useState('');
    const [ingredientes, setIngredientes] = useState([{ nombre: '', cantidad: '', tipo: '' }]);
    const [explicacion, setExplicacion] = useState('');
    const [puntuacion, setPuntuacion] = useState(0);
    const [recetaEnEdicion, setRecetaEnEdicion] = useState(null);

    const crearReceta = async (nuevaReceta) => {
        try {
            const response = await fetch(`${SERVER_URL}/recetas/${nuevaReceta.nombre}`);
            if (!response.ok) {
                throw new Error("Error al verificar la existencia de la receta");
            }
        
            const clonedResponse = response.clone(); // Clonar la respuesta
        
            const responseData = await clonedResponse .json(); // Lerr La respuesta
        
            // Verificar si la receta ya existe
            if (responseData.existe) {
                throw new Error("La receta ya existe");
            }
        
            
            const crearResponse = await fetch(`${SERVER_URL}/recetas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(nuevaReceta),
            });
            if (!crearResponse.ok) {
                throw new Error("Error al crear la receta");
            }
            
        } catch (err) {
            console.error("Error al crear la receta:", err);
        }
    };

    const actualizarReceta = async (id, nuevaInfoReceta) => {
        try {
            const response = await fetch(`${SERVER_URL}/recetas/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(nuevaInfoReceta),
            });
            if (!response.ok) {
                throw new Error("Error al actualizar la receta");
            }
            obtenerTodasRecetas();
        } catch (err) {
            setError(err.message);
        }
    };


    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        if (name === 'nombre' || name === 'explicacion' || name === 'puntuacion') {
            switch (name) {
                case 'nombre':
                    setNombre(value);
                    break;
                case 'explicacion':
                    setExplicacion(value);
                    break;
                case 'puntuacion':
                    setPuntuacion(parseFloat(value));
                    break;
                default:
                    break;
            }
        } else {
            const list = [...ingredientes];
            list[index][name] = value;
            setIngredientes(list);
        }
    };

    const handleAddIngredient = () => {
        setIngredientes([...ingredientes, { nombre: '', cantidad: '', tipo: '' }]);
    };
    const handleRemoveIngredient = (index) => {
        const list = [...ingredientes];
        list.splice(index, 1);
        setIngredientes(list);
    };

    const handleIngredientChange = (index, event) => {
        const { name, value } = event.target;
        if (name === 'cantidad') {
            // Solo permitir números en el campo de cantidad
            const re = /^[0-9\b]+$/; // Expresión regular para aceptar solo números
            if (value === '' || re.test(value)) {
                const list = [...ingredientes];
                list[index]['cantidad'] = value;
                setIngredientes(list);
            }
        } else if (name === 'nombre') {
            const list = [...ingredientes];
            list[index]['nombre'] = value;
            setIngredientes(list);
        } else {
            const list = [...ingredientes];
            list[index]['tipo'] = value;
            setIngredientes(list);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (nombre.trim() === '' || explicacion.trim() === '' || ingredientes.some(ingrediente => ingrediente.nombre.trim() === '' || ingrediente.cantidad === '' || ingrediente.tipo.trim() === '')) {
            console.error('Todos los campos deben ser completados');
            return;
        }
        const nuevaReceta = { nombre, ingredientes, explicacion, puntuacion };

        if (recetaEnEdicion) {
            await actualizarReceta(recetaEnEdicion, nuevaReceta);
            setRecetaEnEdicion(null);
        } else {
            await crearReceta(nuevaReceta);
        }

        setNombre('');
        setIngredientes([{ nombre: '', cantidad: '', tipo: '' }]);
        setExplicacion('');
        setPuntuacion(0);
    };
    return (
        <>
            <h2>{recetaEnEdicion ? 'Editar Receta' : 'Crear Nueva Receta'}</h2>
            <form onSubmit={handleSubmit}>
                <label>Nombre de la receta:</label>
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    name="nombre"
                />
                <>
                    <label>Explicación:</label>
                    <textarea
                        value={explicacion}
                        onChange={(e) => setExplicacion(e.target.value)}
                        name="explicacion"
                    />
                </>
                <>
                    <label>Puntuación:</label>
                    <input
                        type="number"
                        value={puntuacion}
                        onChange={(e) => setPuntuacion(parseFloat(e.target.value))}
                        name="puntuacion"
                        step="0.1"
                        min="0"
                        max="10"
                    />
                </>
                <h3>Ingredientes:</h3>
                {ingredientes.map((ingrediente, index) => (
                    <div key={index}>
                        <label>Nombre:</label>
                        <input
                            type="text"
                            name="nombre"
                            value={ingrediente.nombre}
                            onChange={(e) => handleIngredientChange(index, e)} // Usar handleIngredientChange en lugar de handleInputChange
                        />
                        <label>Cantidad:</label>
                        <input
                            type="text"
                            name="cantidad"
                            value={ingrediente.cantidad}
                            onChange={(e) => handleInputChange(index, e)}
                        />
                        <label>Tipo:</label>
                        <select
                            name="tipo"
                            value={ingrediente.tipo}
                            onChange={(e) => handleInputChange(index, e)}
                        >
                            <option value="">Seleccione...</option>
                            <option value="Kg">Kg</option>
                            <option value="Litros">Litros</option>
                            <option value="Unidades">unidades</option>
                        </select>
                        {index === ingredientes.length - 1 && <button onClick={() => handleAddIngredient()}>+</button>}
                        {index !== ingredientes.length - 1 && <button onClick={() => handleRemoveIngredient(index)}><FaTimes /></button>}
                    </div>
                ))}
                <button type="submit">{recetaEnEdicion ? 'Actualizar Receta' : 'Crear Receta'}</button>
            </form>
        </>
    );
}

export default CrearRecetas;