import React, { useState, useEffect } from 'react';
import { getSeparatas, getProducts, createSeparata } from './api';
import SeparataForm from './components/SeparataForm';
import SeparataList from './components/SeparataList';

const App: React.FC = () => {
    const [separatas, setSeparatas] = useState([]);
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const fetchData = async () => {
        try {
            const [sRes, pRes] = await Promise.all([getSeparatas(), getProducts()]);
            setSeparatas(sRes.data);
            setProducts(pRes.data);
        } catch (err) {
            console.error("Error fetching data", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8 text-gray-900">
            <header className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-blue-600">Gestión de Separatas</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
                >
                    {showForm ? 'Volver al Listado' : 'Nueva Separata'}
                </button>
            </header>

            <main>
                {showForm ? (
                    <SeparataForm products={products} onSuccess={() => { setShowForm(false); fetchData(); }} />
                ) : (
                    <SeparataList separatads={separatas} />
                )}
            </main>
        </div>
    );
};

export default App;
