import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SERVER_URL from "../Config/config";
import "../css/ListaPagina.css"





const ListaPagina = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [lista, setLista] = useState(null);
    const [nuevoNombreLista, setNuevoNombreLista] = useState("");
    const [nuevoProducto, setNuevoProducto] = useState("");
    const [nuevaCantidad, setNuevaCantidad] = useState("");
    const [tipoCantidad, setTipoCantidad] = useState("unidades");
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLista = async () => {
            try {

                const response = await fetch(`${SERVER_URL}/lista/${id}`);
                // console.log(response)
                if (!response.ok) {
                    throw new Error("Failed to fetch");
                }
                const data = await response.json();
                setLista(data);
                setError()
            } catch (error) {
                console.error("Error al obtener la lista:", error);
                setError("Error al obtener la lista");
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
    const ChangeTipoCantidad = (event) => {
        setTipoCantidad(event.target.value);
    };

    const ActualizarNombreLista = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/lista/actualizar/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nombre: nuevoNombreLista }),
            });

            if (!response.ok) {
                throw new Error("Failed to update");
            }
            const data = await response.json();
            setLista(data);
            setError()
        } catch (error) {
            console.error("Error al actualizar el nombre de la lista:", error);
            setError("Error al actualizar el nombre de la lista");
        }
    };

    const AgregarProducto = async () => {
        try {

            if (!nuevoProducto || !nuevaCantidad || !tipoCantidad) {
                setError("Por favor, completa todos los campos.");
                return;
            }
            lista.Productos.push({ nombre: nuevoProducto, cantidad: nuevaCantidad, tipo: tipoCantidad, comprado: false })


            const response = await fetch(`${SERVER_URL}/lista/actualizar/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(lista),
            });

            if (!response.ok) {
                throw new Error("Failed to add product");
            }
            const data = await response.json();
            //    console.log(data)
            setLista(data);
            //   console.log(lista)
            setNuevoProducto("");
            setNuevaCantidad("");
            setError()
        } catch (error) {
            console.error("Error al agregar producto:", error);
            setError("Error al agregar producto");
        }
    };

    const EliminarProducto = async (nombre) => {
        try {
            lista.Productos = lista.Productos.filter(producto => producto.nombre !== nombre);

            const response = await fetch(`${SERVER_URL}/lista/actualizar/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(lista),
            });

            if (!response.ok) {
                throw new Error("Failed to add product");
            }
            const data = await response.json();

            setLista(data);

            setNuevoProducto("");
            setNuevaCantidad("");
            setError()
        } catch (error) {
            console.error("Error al agregar producto:", error);
            setError("Error al agregar producto");
        }
    };

    const marcarComprado = async (index) => {
        try {
            const listaActualizada = { ...lista };

            // Verificar si el índice está dentro de los límites de la lista
            if (index >= 0 && index < listaActualizada.Productos.length) {
                listaActualizada.Productos[index].comprado = !listaActualizada.Productos[index].comprado;

                const response = await fetch(`${SERVER_URL}/lista/actualizar/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(listaActualizada),
                });

                if (!response.ok) {
                    throw new Error("Failed to update product");
                }
                setLista(listaActualizada);
            } else {
                throw new Error("Invalid index");
            }
        } catch (error) {
            console.error("Error al marcar producto:", error);
            setError("Error al marcar producto");
        }
    };
    const completarLista = async () => {
        const userEmail = localStorage.getItem("user");
        try {
            const response = await fetch(`${SERVER_URL}/lista/completar/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: userEmail }),

            });

            if (!response.ok) {
                throw new Error("Failed to complete list");
            }

            // Redirigir a la página de la nevera u otra página deseada
            navigate("/Lista");
        } catch (error) {
            console.error("Error al completar la lista:", error);
        }
    };







    return (
        <div className="page-content">
            <div className="container">
                {error && <p>{error}</p>}
                {lista && (
                    <div>
                        <h1>{lista.NombreLista}</h1>
                        <button onClick={completarLista}>Completar Lista</button>
                        <div>
                            <h2>Cambiar nombre de la lista:</h2>
                            <input
                                type="text"
                                value={nuevoNombreLista}
                                onChange={ChangeNombreLista}
                            />
                            <button onClick={ActualizarNombreLista}>
                                Actualizar Nombre
                            </button>
                        </div>
                        <h2>Añadir producto:</h2>
                        <div className="add-product-container">
                            <div className="input-container">

                                <input
                                    type="text"
                                    placeholder="Nombre del producto"
                                    value={nuevoProducto}
                                    onChange={ChangeNuevoProducto}
                                    required
                                />
                            </div>
                            <div className="input-container">
                                <input
                                    type="number"
                                    placeholder="Cantidad"
                                    value={nuevaCantidad}
                                    onChange={ChangeNuevaCantidad}
                                    required
                                />
                            </div>
                            <div className="select-container">
                                <select
                                    value={tipoCantidad}
                                    onChange={ChangeTipoCantidad}
                                    required
                                >
                                    <option value="">Selecciona...</option>
                                    <option value="unidades">Unidades</option>
                                    <option value="kg">Kg</option>
                                    <option value="litros">Litros</option>
                                </select>
                            </div>
                            <button className="add-product-button" onClick={AgregarProducto}>Añadir Producto</button>
                        </div>

                        <div>
                            <h2>Productos:</h2>
                            <ul>
                                {lista.Productos.map((producto, index) => (
                                    <li
                                        key={producto.nombre}
                                        className={producto.comprado ? "completed" : ""}
                                        onClick={() =>
                                            index >= 0 &&
                                            index < lista.Productos.length &&
                                            marcarComprado(index)
                                        }
                                    >
                                        <div className="product-info">
                                            <div>Nombre: {producto.nombre}</div>
                                            <div>Cantidad: {producto.cantidad} {producto.tipo}</div>
                                        </div>
                                        <button onClick={() => EliminarProducto(producto.nombre)}>
                                            Eliminar
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


export default ListaPagina;
