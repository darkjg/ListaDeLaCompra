import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import SERVER_URL from "../Config/config";
import { useNavigate } from "react-router-dom";
function CrearRecetas() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [recetaEnEdicion, setRecetaEnEdicion] = useState(null);
    const [nombre, setNombre] = useState("");
    const [ingredientes, setIngredientes] = useState([{ nombre: "", cantidad: "", tipo: "" }]);
    const [explicacion, setExplicacion] = useState("");
    const [puntuacion, setPuntuacion] = useState(0);

    useEffect(() => {
        const obtenerDetallesReceta = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/recetas/${id}`);
                if (!response.ok) {
                    throw new Error("Error al obtener detalles de la receta");
                }
                const data = await response.json();
                if (data.length === 0) {
                    console.log("No se encontró ninguna receta con el ID proporcionado.");
                   
                } else {
                    console.log(data);
                    setRecetaEnEdicion(data);
                    setNombre(data.nombre);
                    setIngredientes(data.ingredientes);
                    setExplicacion(data.explicacion);
                    setPuntuacion(data.puntuacion);
                }
            } catch (err) {
                console.error(err);
            }
        };
        if (id) {
            obtenerDetallesReceta();
        }
    }, [id]);

    const crearReceta = async (nuevaReceta) => {
        try {
            const response = await fetch(`${SERVER_URL}/recetas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(nuevaReceta),
            });
            if (!response.ok) {
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
        } catch (err) {
            console.error("Error al actualizar la receta:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (nombre.trim() === "" || explicacion.trim() === "" || ingredientes.some(ingrediente => ingrediente.nombre.trim() === "" || ingrediente.cantidad === "" || ingrediente.tipo.trim() === "")) {
            console.error("Todos los campos deben ser completados");
            return;
        }
        const nuevaReceta = { nombre, ingredientes, explicacion, puntuacion };
    
        if (recetaEnEdicion) {
            try {
                await actualizarReceta(recetaEnEdicion._id, nuevaReceta);
                setRecetaEnEdicion(null);
                navigate("/Recetas"); 
            } catch (error) {
                console.error("Error al actualizar la receta:", error);
            }
        } else {
            try {
                await crearReceta(nuevaReceta);
                navigate("/Recetas"); 
            } catch (error) {
                console.error("Error al crear la receta:", error);
            }
        }
    
        setNombre("");
        setIngredientes([{ nombre: "", cantidad: "", tipo: "" }]);
        setExplicacion("");
        setPuntuacion(0);
    };

    const handleIngredientChange = (index, event) => {
        const { name, value } = event.target;
        const list = [...ingredientes];
        list[index][name] = value;
        setIngredientes(list);
    };

    const handleAddIngredient = () => {
        setIngredientes([...ingredientes, { nombre: "", cantidad: "", tipo: "" }]);
    };

    const handleRemoveIngredient = (index) => {
        const list = [...ingredientes];
        list.splice(index, 1);
        setIngredientes(list);
    };

    return (
        <>
            <h2>{recetaEnEdicion ? "Editar Receta" : "Crear Nueva Receta"}</h2>
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
                {ingredientes && ingredientes.map((ingrediente, index) => (
                    <div key={index}>
                        <label>Nombre:</label>
                        <input
                            type="text"
                            name="nombre"
                            value={ingrediente.nombre}
                            onChange={(e) => handleIngredientChange(index, e)}
                        />
                        <label>Cantidad:</label>
                        <input
                            type="text"
                            name="cantidad"
                            value={ingrediente.cantidad}
                            onChange={(e) => handleIngredientChange(index, e)}
                        />
                        <label>Tipo:</label>
                        <select
                            name="tipo"
                            value={ingrediente.tipo}
                            onChange={(e) => handleIngredientChange(index, e)}
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
                <button type="submit">{recetaEnEdicion ? "Actualizar Receta" : "Crear Receta"}</button>
            </form>
        </>
    );
}

export default CrearRecetas;
