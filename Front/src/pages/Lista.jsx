import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SERVER_URL from "../Config/config";
import "../css/Lista.css"
const ListaDeComprasPage = () => {
    const [email, setEmail] = useState("");
    const [listas, setListas] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const userEmail = localStorage.getItem("user");
        if (userEmail) {
            setEmail(userEmail);
        }
        BuscarListasPorEmail();
    }, [email]);

    const CrearLista = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/lista/crear`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });
            if (!response.ok) {

                throw new Error("Failed to create list");
            }
            setError(null)
            const data = await response.json();
            console.log(data)
            setListas([...listas, data]);
        } catch (error) {
            console.error("Error al crear lista:", error);
            setError("Error al crear lista");
        }
    };

    const BuscarListasPorEmail = async () => {
        try {
            const email = localStorage.getItem("user");
            if (!email) return;
    
            const response = await fetch(`${SERVER_URL}/lista/buscar/${email}`);
    
            if (response.ok) {
                setError(null);
    
                const data = await response.json();
                const newListas = [];
                for (const listId of data) {
                    const response2 = await fetch(`${SERVER_URL}/lista/${listId}`);
                    if (response2.ok) {
                        const data2 = await response2.json();
                        newListas.push(data2);
                    } else {
                        setError("Error al buscar listas por id");
                    }
                }
                setListas(newListas);
            } else {
                setError("Error al buscar listas");
            }
        } catch (error) {
            console.error("Error al buscar listas:", error);
            setError("Error al buscar listas");
        }
    };
    
    const EliminarLista = async (listaEnvio) => {

        try {
            console.log(listaEnvio)
            const response = await fetch(`${SERVER_URL}/lista/eliminar/${listaEnvio}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            }
            );

            if (response.ok) {
                setError(null)
                const filteredListas = listas.filter(lista => lista._id !== listaEnvio._id);
                setListas(filteredListas);
            } else {
                setError("Error al eliminar lista");
            }
        } catch (error) {
            setError("Error al eliminar lista");
        }
    };

       return (
        <div className="page-content">
            <div className="container">
             
                {email && (
                    <div className="card">
                        <div className="flex-container">
                            <div>
                                <h3>Usuario: {email}</h3>
                            </div>
                            <button className="buton-Create" onClick={CrearLista}>Crear Lista</button>
                        </div>
                    </div>
                )}
                <h2>Listas:</h2>
                {listas.length > 0 && (
                    
                <div className="flex-container">
                    
                    {listas.map(lista => (
                        <div key={lista.id} className="card">
                            <div className="flex-container list-item">
                                <Link to={`/lista/${lista._id}`}>{lista.NombreLista}</Link>
                                <div className="button-container">
                                   
                                    <button onClick={() => EliminarLista(lista)}>Eliminar</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
                {error && <p>{error}</p>}
            </div>
        </div>
    );

};

export default ListaDeComprasPage;


