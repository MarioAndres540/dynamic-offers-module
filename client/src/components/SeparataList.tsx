import React from 'react';

interface SeparataListProps {
    separatads: any[];
}

const SeparataList: React.FC<SeparataListProps> = ({ separatads }) => {
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full leading-normal">
                <thead>
                    <tr>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Nombre
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Inicio / Fin
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Tipo
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Valor
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Productos
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {separatads.map((s) => (
                        <tr key={s._id}>
                            <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                <p className="text-gray-900 whitespace-no-wrap font-bold">{s.name}</p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">
                                    {new Date(s.startTime).toLocaleString()} - {new Date(s.endTime).toLocaleString()}
                                </p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${s.promotionType === 'percentage' ? 'text-green-900' : 'text-orange-900'}`}>
                                    <span aria-hidden className={`absolute inset-0 opacity-50 rounded-full ${s.promotionType === 'percentage' ? 'bg-green-200' : 'bg-orange-200'}`}></span>
                                    <span className="relative">{s.promotionType}</span>
                                </span>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">{s.promotionValue}</p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                <p className="text-gray-600 whitespace-no-wrap">
                                    {s.products.map((p: any) => p.name).join(', ')}
                                </p>
                            </td>
                        </tr>
                    ))}
                    {separatads.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-5 py-5 border-b border-gray-200 text-sm text-center">
                                No hay separatas programadas.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SeparataList;
