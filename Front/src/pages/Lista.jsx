import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SERVER_URL from "../Config/config";

const ListaDeComprasPage = () => {
    const [email, setEmail] = useState('');
    const [listas, setListas] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const userEmail = localStorage.getItem('user');
        if (userEmail) {
            setEmail(userEmail);
        }
        BuscarListasPorEmail();
    }, [email]);

    const CrearLista = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/lista/crear`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            if (!response.ok) {

                throw new Error('Failed to create list');
            }
            setError(null)
            const data = await response.json();
            console.log(data)
            setListas([...listas, data]);
        } catch (error) {
            console.error('Error al crear lista:', error);
            setError('Error al crear lista');
        }
    };

    const BuscarListasPorEmail = async () => {
        if (email)
            try {
                const response = await fetch(`${SERVER_URL}/lista/buscar/${email}`);

                if (response.ok) {
                    setError(null)

                    const data = await response.json();
                    try {
                        data.map(async list => {
                            const response2 = await fetch(`${SERVER_URL}/lista/${list}`);
                            if (response2.ok) {
                                setError(null)
                                const data2 = await response2.json();
                                const listaExists = listas.some(lista => lista.id === data2.id);
                                if (!listaExists) {
                                    setListas([...listas, data2]);
                                }
                            } else {
                                setError('Error al buscar listas por id');
                            }
                        })

                    } catch (error) {

                    }


                } else {
                    setError('Error al buscar listas');
                }
            } catch (error) {
                console.error('Error al buscar listas:', error);
                setError('Error al buscar listas');
            }
    };

    const EliminarLista = async (listaEnvio) => {

        try {
            console.log(listaEnvio)
            const response = await fetch(`${SERVER_URL}/lista/eliminar/${listaEnvio}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            }
            );

            if (response.ok) {
                setError(null)
                const filteredListas = listas.filter(lista => lista._id !== listaEnvio._id);
                setListas(filteredListas);
            } else {
                setError('Error al eliminar lista');
            }
        } catch (error) {
            setError('Error al eliminar lista');
        }
    };

    return (
        <div>
            <h1>Lista de Compras</h1>
            {email && (
                <div>
                    <h3>Usuario: {email}</h3>
                    <button onClick={CrearLista}>Crear Lista</button>
                </div>
            )}
            {listas.length > 0 && (
                <div>
                    <h2>Listas:</h2>
                    <ul>
                        {listas.map(lista => (

                            <li key={lista.id}>

                                <Link to={`/lista/${lista._id}`}>{lista.NombreLista}</Link>
                                <button onClick={() => BuscarListasPorEmail()}>Buscar Listas</button>
                                <button onClick={() => EliminarLista(lista)}>Eliminar</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {error && <p>{error}</p>}
        </div>
    );
};

export default ListaDeComprasPage;


