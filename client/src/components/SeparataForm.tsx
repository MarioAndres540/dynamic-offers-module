import React, { useState } from 'react';
import { createSeparata } from '../api';

interface SeparataFormProps {
    products: any[];
    onSuccess: () => void;
}

const SeparataForm: React.FC<SeparataFormProps> = ({ products, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        products: [] as string[],
        startTime: '',
        endTime: '',
        promotionType: 'fixed',
        promotionValue: 0
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await createSeparata(formData);
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al crear la separata');
        }
    };

    const handleProductToggle = (id: string) => {
        setFormData(prev => ({
            ...prev,
            products: prev.products.includes(id)
                ? prev.products.filter(p => p !== id)
                : [...prev.products, id]
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Programar Nueva Separata</h2>

            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">{error}</div>}

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Nombre de la Campaña</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring bg-white"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Fecha/Hora Inicio</label>
                    <input
                        type="datetime-local"
                        onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Fecha/Hora Fin</label>
                    <input
                        type="datetime-local"
                        onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white"
                        required
                    />
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Tipo de Promoción</label>
                <select
                    value={formData.promotionType}
                    onChange={e => setFormData({ ...formData, promotionType: e.target.value })}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 bg-white"
                >
                    <option value="fixed">Descuento Directo ($)</option>
                    <option value="percentage">Porcentaje (%)</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Valor</label>
                <input
                    type="number"
                    value={formData.promotionValue}
                    onChange={e => setFormData({ ...formData, promotionValue: Number(e.target.value) })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Seleccionar Productos</label>
                <div className="h-40 overflow-y-auto border p-2 rounded">
                    {products.map(p => (
                        <div key={p._id} className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                checked={formData.products.includes(p._id)}
                                onChange={() => handleProductToggle(p._id)}
                                className="mr-2"
                            />
                            <span className="text-gray-700">{p.name} (${p.basePrice})</span>
                        </div>
                    ))}
                </div>
            </div>

            <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition">
                Guardar Separata
            </button>
        </form>
    );
};

export default SeparataForm;
