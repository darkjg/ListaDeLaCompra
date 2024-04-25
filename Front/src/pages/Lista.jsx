import React, { useState, useEffect } from 'react';
import SERVER_URL from "../Config/config";
const ListaDeComprasPage = () => {
    const [email, setEmail] = useState('');
    const [productos, setProductos] = useState('');
    const [lista, setLista] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const userEmail = localStorage.getItem('user');
        if (userEmail) {
            setEmail(userEmail);
        }
    }, []);

    const CrearLista = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/lista/crear`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            console.log(data)
            setLista(data);
        } catch (error) {
            console.log(error)
            setError('Error al crear lista');
        }
    };

    const ActualizarLista = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/lista/actualizar/${lista.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productos }),
            });
            const data = await response.json();
            setLista(data);
        } catch (error) {
            setError('Error al actualizar lista');
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
            {lista && (
                <div>
                    <h2>Lista:</h2>
                    <ul>
                        {lista.Productos.map((producto, index) => (
                            <li key={index}>{producto}</li>
                        ))}
                    </ul>
                    <div>
                        <label>Productos:</label>
                        <input type="text" value={productos} onChange={(e) => setProductos(e.target.value)} />
                        <button onClick={ActualizarLista}>Actualizar Lista</button>
                    </div>
                </div>
            )}
            {error && <p>{error}</p>}
        </div>
    );
};

export default ListaDeComprasPage;
