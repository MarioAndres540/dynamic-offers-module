import React, { useState, useEffect } from 'react';
import { getProducts, createSeparata, updateSeparata } from '../api';
import { ArrowLeft, Plus, Package, X, Save, Calendar, Clock, Tag } from 'lucide-react';

interface Product {
    _id: string;
    name: string;
    basePrice: number;
    image?: string;
}

interface SeparataFormProps {
    initialData?: any;
    onBack: () => void;
    onSuccess: () => void;
}

const SeparataForm: React.FC<SeparataFormProps> = ({ initialData, onBack, onSuccess }) => {
    const isEdit = !!initialData;
    const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
    const [showProductSelector, setShowProductSelector] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');

    // Date handling
    const formatDate = (dateStr?: string) => dateStr ? new Date(dateStr).toISOString().split('T')[0] : '';
    const formatTime = (dateStr?: string) => dateStr ? new Date(dateStr).toTimeString().slice(0, 5) : '00:00';

    const [startDate, setStartDate] = useState(formatDate(initialData?.startTime));
    const [startTime, setStartTime] = useState(formatTime(initialData?.startTime) || '00:00');
    const [endDate, setEndDate] = useState(formatDate(initialData?.endTime));
    const [endTime, setEndTime] = useState(formatTime(initialData?.endTime) || '23:59');

    const [selectedProducts, setSelectedProducts] = useState<any[]>(initialData?.products || []);

    // Product Selector State
    const [tempProduct, setTempProduct] = useState('');
    const [tempType, setTempType] = useState('percentage');
    const [tempValue, setTempValue] = useState(10);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await getProducts();
            setAvailableProducts(data);
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    const handleAddProduct = () => {
        if (!tempProduct) return;
        const product = availableProducts.find(p => p._id === tempProduct);
        if (product) {
            // Check if already selected
            if (selectedProducts.find(p => p._id === product._id)) {
                setError('El producto ya está en la lista.');
                return;
            }
            setSelectedProducts([...selectedProducts, {
                ...product,
                promoType: tempType,
                promoValue: tempValue
            }]);
            setShowProductSelector(false);
            setTempProduct('');
        }
    };

    const handleRemoveProduct = (id: string) => {
        setSelectedProducts(selectedProducts.filter(p => p._id !== id));
    };

    const handleSubmit = async () => {
        setError('');
        if (!name || !startDate || !endDate || selectedProducts.length === 0) {
            setError('Por favor completa todos los campos obligatorios y agrega al menos un producto.');
            return;
        }

        setLoading(true);
        try {
            const start = new Date(`${startDate}T${startTime}`);
            const end = new Date(`${endDate}T${endTime}`);

            const payload = {
                name,
                description,
                startTime: start.toISOString(),
                endTime: end.toISOString(),
                products: selectedProducts.map(p => p._id),
                promotionType: selectedProducts[0].promoType || 'percentage',
                promotionValue: selectedProducts[0].promoValue || 10
            };

            if (isEdit) {
                await updateSeparata(initialData._id, payload);
            } else {
                await createSeparata(payload);
            }
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al procesar la separata');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 animate-in fade-in duration-500">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Volver
            </button>

            <h1 className="text-3xl font-bold text-gray-900 mb-8">{isEdit ? 'Editar Separata' : 'Nueva Separata'}</h1>

            <div className="space-y-6">
                {/* General Info Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800">Información General</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre de la Separata *</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Black Friday 2026"
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                                <textarea
                                    placeholder="Descripción opcional de la promoción"
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha de Inicio *</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="date"
                                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="w-32">
                                    <label className="block text-sm font-semibold text-transparent mb-2">Hora</label>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="time"
                                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha de Fin *</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="date"
                                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="w-32">
                                    <label className="block text-sm font-semibold text-transparent mb-2">Hora</label>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="time"
                                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden text-sm">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-800">Productos en Promoción</h2>
                        {!showProductSelector && (
                            <button
                                onClick={() => setShowProductSelector(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                Agregar Producto
                            </button>
                        )}
                    </div>
                    <div className="p-6">
                        {selectedProducts.length === 0 && !showProductSelector ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="bg-gray-50 p-4 rounded-full mb-4">
                                    <Package className="w-10 h-10 text-gray-300" />
                                </div>
                                <p className="text-lg font-medium text-gray-600">No hay productos seleccionados</p>
                                <p className="text-gray-400">Agrega productos para crear la separata</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {selectedProducts.map((p) => (
                                    <div key={p._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                                                {p.image ? (
                                                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="w-6 h-6 text-gray-300" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 leading-tight">{p.name}</p>
                                                <p className="text-xs text-gray-400 mt-1 uppercase">SKU: {p._id.substring(0, 8)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400 line-through">${p.basePrice?.toFixed(2)}</p>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-green-600">
                                                        ${(p.promoType === 'percentage'
                                                            ? p.basePrice * (1 - p.promoValue / 100)
                                                            : Math.max(0, p.basePrice - p.promoValue)).toFixed(2)}
                                                    </p>
                                                    <span className="text-xs font-semibold text-gray-400">
                                                        {p.promoType === 'percentage' ? `${p.promoValue}% OFF` : `-$${p.promoValue}`}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveProduct(p._id)}
                                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Product Selector Form */}
                        {showProductSelector && (
                            <div className="mt-4 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg border-t-4 border-t-blue-500 animate-in slide-in-from-top-4 duration-300">
                                <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="font-bold text-gray-800">Seleccionar Producto</h3>
                                    <button onClick={() => setShowProductSelector(false)} className="text-gray-400 hover:text-gray-600">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Producto</label>
                                        <select
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium appearance-none"
                                            value={tempProduct}
                                            onChange={(e) => setTempProduct(e.target.value)}
                                        >
                                            <option value="">Seleccionar producto...</option>
                                            {availableProducts.filter(ap => !selectedProducts.find(sp => sp._id === ap._id)).map(p => (
                                                <option key={p._id} value={p._id}>{p.name} - ${p.basePrice?.toFixed(2)}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tipo de Promoción</label>
                                            <select
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                                value={tempType}
                                                onChange={(e) => setTempType(e.target.value)}
                                            >
                                                <option value="percentage">Porcentaje de Descuento</option>
                                                <option value="fixed">Monto Fijo de Descuento</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Valor (%)</label>
                                            <input
                                                type="number"
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                                value={tempValue}
                                                onChange={(e) => setTempValue(Number(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleAddProduct}
                                        disabled={!tempProduct}
                                        className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all disabled:bg-gray-300 shadow-lg shadow-blue-100"
                                    >
                                        Agregar Producto
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 font-medium">
                    <X className="w-5 h-5" />
                    {error}
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8">
                <button
                    onClick={onBack}
                    className="px-8 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:bg-gray-400"
                >
                    <Save className="w-5 h-5" />
                    {loading ? 'Guardando...' : isEdit ? 'Actualizar Separata' : 'Crear Separata'}
                </button>
            </div>
        </div>
    );
};

export default SeparataForm;
