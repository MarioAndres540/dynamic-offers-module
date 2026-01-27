import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, Edit, Calendar, Clock, Package, TrendingDown, Info, Tag, DollarSign } from 'lucide-react';

interface Product {
    _id: string;
    name: string;
    basePrice: number;
    image?: string;
    category?: string;
}

interface SeparataItem {
    product: Product;
    promotionType: 'fixed' | 'percentage';
    promotionValue: number;
}

interface Separata {
    _id: string;
    name: string;
    description?: string;
    startTime: string;
    endTime: string;
    items: SeparataItem[];
    createdAt?: string;
    updatedAt?: string;
}

interface SeparataDetailProps {
    separata: Separata;
    onBack: () => void;
    onEdit: () => void;
}

const SeparataDetail: React.FC<SeparataDetailProps> = ({ separata, onBack, onEdit }) => {
    const now = new Date();
    const start = new Date(separata.startTime);
    const end = new Date(separata.endTime);

    let status: 'Activa' | 'Programada' | 'Finalizada' = 'Programada';
    if (now > end) status = 'Finalizada';
    else if (now >= start && now <= end) status = 'Activa';

    const statusConfig = {
        Activa: { color: 'bg-green-100 text-green-700' },
        Programada: { color: 'bg-blue-100 text-blue-700' },
        Finalizada: { color: 'bg-gray-100 text-gray-700' },
    };

    // Financial Calculations
    const calculatePromoPrice = (item: SeparataItem) => {
        if (item.promotionType === 'percentage') {
            return item.product.basePrice * (1 - item.promotionValue / 100);
        }
        return Math.max(0, item.product.basePrice - item.promotionValue);
    };

    const regularTotal = separata.items?.reduce((acc, item) => acc + item.product.basePrice, 0) || 0;
    const promoTotal = separata.items?.reduce((acc, item) => acc + calculatePromoPrice(item), 0) || 0;
    const totalSavings = regularTotal - promoTotal;
    const avgDiscount = regularTotal > 0 ? (totalSavings / regularTotal) * 100 : 0;

    // Categories Calculation
    const categories = separata.items?.reduce((acc: any, item) => {
        const cat = item.product.category || 'Otros';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {}) || {};

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            {/* Header */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Volver
            </button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-gray-900">{separata.name}</h1>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[status].color}`}>
                        {status}
                    </span>
                </div>
                <button
                    onClick={onEdit}
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                >
                    <Edit className="w-4 h-4" />
                    Editar
                </button>
            </div>
            <p className="text-gray-500 mb-8">{separata.description}</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Validity Period */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <h2 className="text-lg font-bold text-gray-800">Período de Vigencia</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Fecha de Inicio</p>
                                    <p className="text-lg font-semibold text-gray-900">{format(start, "dd 'de' MMMM 'de' yyyy", { locale: es })}</p>
                                    <p className="text-sm text-gray-500">{format(start, "HH:mm 'hrs'")}</p>
                                </div>
                                <div className="p-3 bg-white rounded-full border border-gray-200">
                                    <Clock className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Fecha de Fin</p>
                                    <p className="text-lg font-semibold text-gray-900">{format(end, "dd 'de' MMMM 'de' yyyy", { locale: es })}</p>
                                    <p className="text-sm text-gray-500">{format(end, "HH:mm 'hrs'")}</p>
                                </div>
                                <div className="p-3 bg-white rounded-full border border-gray-200">
                                    <Clock className="w-6 h-6 text-red-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products List */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
                            <Package className="w-5 h-5 text-gray-400" />
                            <h2 className="text-lg font-bold text-gray-800">Productos en Promoción</h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {separata.items?.map((item) => {
                                const product = item.product;
                                const promoPrice = calculatePromoPrice(item);
                                const savings = product.basePrice - promoPrice;
                                return (
                                    <div key={product._id} className="p-6 flex flex-col md:flex-row items-center gap-6">
                                        <div className="w-24 h-24 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden flex-shrink-0">
                                            {product.image ? (
                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="w-8 h-8 text-gray-300" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
                                            <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                                            <p className="text-xs text-gray-500 mb-2">SKU: {product._id.substring(0, 8).toUpperCase()}</p>
                                            <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1">
                                                    <Tag className="w-3 h-3" />
                                                    {item.promotionType === 'percentage' ? 'Porcentaje de Descuento' : 'Descuento Directo'}
                                                </span>
                                                <span className="text-blue-600 font-bold text-xs self-center">
                                                    {item.promotionType === 'percentage' ? `${item.promotionValue}% OFF` : `-$${item.promotionValue.toFixed(2)}`}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-center md:text-right">
                                            <p className="text-sm text-gray-400 line-through">${product.basePrice.toFixed(2)}</p>
                                            <p className="text-2xl font-bold text-green-600">${promoPrice.toFixed(2)}</p>
                                            <p className="text-xs font-medium text-gray-500">Ahorro: ${savings.toFixed(2)}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    {/* Financial Summary */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <DollarSign className="w-5 h-5 text-gray-400" />
                            <h2 className="text-lg font-bold text-gray-800">Resumen Financiero</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Precio Total Regular</p>
                                <p className="text-2xl font-bold text-gray-900">${regularTotal.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Precio Total Promocional</p>
                                <p className="text-2xl font-bold text-green-600">${promoTotal.toFixed(2)}</p>
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-red-500 mb-1">
                                    <TrendingDown className="w-4 h-4" />
                                    <p className="text-xs font-bold uppercase">Ahorro Total</p>
                                </div>
                                <p className="text-3xl font-bold text-red-600">${totalSavings.toFixed(2)}</p>
                                <p className="text-sm text-gray-500">{avgDiscount.toFixed(1)}% de descuento promedio</p>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Info className="w-5 h-5 text-gray-400" />
                            <h2 className="text-lg font-bold text-gray-800">Información Adicional</h2>
                        </div>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Total de Productos</span>
                                <span className="font-bold text-gray-900">{separata.items?.length || 0} productos</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Fecha de Creación</span>
                                <span className="font-bold text-gray-900">{separata.createdAt ? format(new Date(separata.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: es }) : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">ID de Separata</span>
                                <span className="font-bold text-gray-900">{separata._id.substring(0, 8)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-6">Categorías</h2>
                        <div className="space-y-2">
                            {Object.entries(categories).map(([cat, count]: any) => (
                                <div key={cat} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                    <span className="text-sm text-gray-700 font-medium">{cat}</span>
                                    <span className="text-sm font-bold text-gray-900">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeparataDetail;
