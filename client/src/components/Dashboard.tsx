import React, { useEffect, useState } from 'react';
import { getSeparatas } from '../api';
import StatCard from './StatCard';
import SeparataCard from './SeparataCard';
import SeparataForm from './SeparataForm';
import SeparataDetail from './SeparataDetail';
import { LayoutDashboard, CheckCircle2, Clock3, History, Search, Filter, Plus, Tag } from 'lucide-react';

const Dashboard: React.FC = () => {
    const [view, setView] = useState<'list' | 'create' | 'detail' | 'edit'>('list');
    const [selectedSeparata, setSelectedSeparata] = useState<any>(null);
    const [separatas, setSeparatas] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSeparatas();
    }, []);

    const fetchSeparatas = async () => {
        try {
            const { data } = await getSeparatas();
            setSeparatas(data);
        } catch (error) {
            console.error('Error fetching separatas:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatus = (start: string, end: string) => {
        const now = new Date();
        const s = new Date(start);
        const e = new Date(end);
        if (now > e) return 'Finalizada';
        if (now >= s && now <= e) return 'Activa';
        return 'Programada';
    };

    const stats = {
        total: separatas.length,
        activas: separatas.filter(s => getStatus(s.startTime, s.endTime) === 'Activa').length,
        programadas: separatas.filter(s => getStatus(s.startTime, s.endTime) === 'Programada').length,
        finalizadas: separatas.filter(s => getStatus(s.startTime, s.endTime) === 'Finalizada').length,
    };

    const filteredSeparatas = separatas.filter(s => {
        const status = getStatus(s.startTime, s.endTime);
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.description?.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesFilter = filterStatus === 'all' || status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    const handleViewDetail = (separata: any) => {
        setSelectedSeparata(separata);
        setView('detail');
    };

    const handleEdit = (separata: any) => {
        setSelectedSeparata(separata);
        setView('edit');
    };

    const onSuccess = () => {
        fetchSeparatas();
        setView('list');
    };

    if (view === 'create') {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto p-4 md:p-8">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <Tag className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 leading-none">Gestión de Separatas</h1>
                            <p className="text-gray-500 text-xs mt-1">Sistema POS Kodigo Fuente</p>
                        </div>
                    </div>
                    <SeparataForm onBack={() => setView('list')} onSuccess={onSuccess} />
                </div>
            </div>
        );
    }

    if (view === 'detail' && selectedSeparata) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto p-4 md:p-8">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <Tag className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 leading-none">Gestión de Separatas</h1>
                            <p className="text-gray-500 text-xs mt-1">Sistema POS Kodigo Fuente</p>
                        </div>
                    </div>
                    <SeparataDetail
                        separata={selectedSeparata}
                        onBack={() => setView('list')}
                        onEdit={() => handleEdit(selectedSeparata)}
                    />
                </div>
            </div>
        );
    }

    if (view === 'edit' && selectedSeparata) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto p-4 md:p-8">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <Tag className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 leading-none">Gestión de Separatas</h1>
                            <p className="text-gray-500 text-xs mt-1">Sistema POS Kodigo Fuente</p>
                        </div>
                    </div>
                    <SeparataForm
                        initialData={selectedSeparata}
                        onBack={() => setView('list')}
                        onSuccess={onSuccess}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <Tag className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Gestión de Separatas</h1>
                    </div>
                    <p className="text-gray-500 text-sm">Sistema POS Kodigo Fuente</p>
                </div>
                <button
                    onClick={() => setView('create')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Nueva Separata
                </button>
            </div>

            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-1">Separatas</h2>
                <p className="text-gray-500 mb-8">Gestiona las promociones y ofertas del sistema POS</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        label="Total"
                        value={stats.total}
                        icon={<LayoutDashboard className="w-6 h-6 text-gray-600" />}
                        color="bg-gray-100"
                    />
                    <StatCard
                        label="Activas"
                        value={stats.activas}
                        icon={<CheckCircle2 className="w-6 h-6 text-green-600" />}
                        color="bg-green-100"
                    />
                    <StatCard
                        label="Programadas"
                        value={stats.programadas}
                        icon={<Clock3 className="w-6 h-6 text-blue-600" />}
                        color="bg-blue-100"
                    />
                    <StatCard
                        label="Finalizadas"
                        value={stats.finalizadas}
                        icon={<History className="w-6 h-6 text-gray-600" />}
                        color="bg-gray-100"
                    />
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o descripción..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="bg-white p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                            <Filter className="w-5 h-5 text-gray-600" />
                        </button>
                        <select
                            className="px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">Todos los estados</option>
                            <option value="Activa">Activas</option>
                            <option value="Programada">Programadas</option>
                            <option value="Finalizada">Finalizadas</option>
                        </select>
                    </div>
                </div>

                {/* Separata Cards List */}
                <div className="grid grid-cols-1 gap-6">
                    {filteredSeparatas.length > 0 ? (
                        filteredSeparatas.map(s => (
                            <SeparataCard
                                key={s._id}
                                separata={s}
                                onViewDetail={handleViewDetail}
                                onEdit={() => handleEdit(s)}
                            />
                        ))
                    ) : (
                        <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
                            <Tag className="w-12 h-12 text-gray-300 mb-4" />
                            <p className="text-xl font-medium text-gray-500">No se encontraron separatas</p>
                            <p className="text-gray-400">Intenta ajustar tu búsqueda o crea una nueva.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
