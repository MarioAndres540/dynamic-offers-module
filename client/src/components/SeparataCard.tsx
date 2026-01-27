import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Package, Clock, CheckCircle, AlertCircle, Edit, Eye } from 'lucide-react';

interface Product {
    _id: string;
    name: string;
    basePrice: number;
    image?: string;
}

interface Separata {
    _id: string;
    name: string;
    description?: string;
    startTime: string;
    endTime: string;
    products: Product[];
    promotionType: 'fixed' | 'percentage';
    promotionValue: number;
}

interface SeparataCardProps {
    separata: Separata;
}

const SeparataCard: React.FC<SeparataCardProps> = ({ separata }) => {
    const now = new Date();
    const start = new Date(separata.startTime);
    const end = new Date(separata.endTime);

    let status: 'Activa' | 'Programada' | 'Finalizada' = 'Programada';
    if (now > end) status = 'Finalizada';
    else if (now >= start && now <= end) status = 'Activa';

    const statusConfig = {
        Activa: { color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-4 h-4" /> },
        Programada: { color: 'bg-blue-100 text-blue-700', icon: <Clock className="w-4 h-4" /> },
        Finalizada: { color: 'bg-gray-100 text-gray-700', icon: <AlertCircle className="w-4 h-4" /> },
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{separata.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusConfig[status].color}`}>
                        {statusConfig[status].icon}
                        {status}
                    </span>
                </div>
                <p className="text-gray-500 mb-6">{separata.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Inicio: {format(start, "dd MMM yyyy 'a las' HH:mm", { locale: es })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Fin: {format(end, "dd MMM yyyy 'a las' HH:mm", { locale: es })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span>{separata.products.length} producto(s)</span>
                    </div>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {separata.products.map((product) => (
                        <div key={product._id} className="min-w-[120px] flex flex-col gap-1">
                            <div className="h-24 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 overflow-hidden">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Package className="w-8 h-8 text-gray-300" />
                                )}
                            </div>
                            <p className="text-xs font-medium text-gray-800 truncate" title={product.name}>{product.name}</p>
                            <p className="text-xs font-bold text-green-600">${product.basePrice.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex gap-4 border-t border-gray-100">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-white transition-colors">
                    <Eye className="w-4 h-4" />
                    Ver Detalle
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
                    <Edit className="w-4 h-4" />
                    Editar
                </button>
            </div>
        </div>
    );
};

export default SeparataCard;
