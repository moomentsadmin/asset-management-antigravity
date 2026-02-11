import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssetTypes = () => {
    const [assetTypes, setAssetTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        depreciationRate: 0,
        warrantyMonths: 12
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAssetTypes();
    }, []);

    const fetchAssetTypes = async () => {
        try {
            const response = await axios.get('/api/asset-types');
            setAssetTypes(response.data);
            setError('');
        } catch (err) {
            console.error('Failed to fetch asset types:', err);
            setError('Failed to load asset types');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (editingId) {
                await axios.put(`/api/asset-types/${editingId}`, formData);
            } else {
                await axios.post('/api/asset-types', formData);
            }

            fetchAssetTypes();
            resetForm();
        } catch (err) {
            console.error('Failed to save asset type:', err);
            setError(err.response?.data?.message || 'Failed to save asset type');
        }
    };

    const handleEdit = (type) => {
        setFormData({
            name: type.name,
            description: type.description || '',
            depreciationRate: type.depreciationRate || 0,
            warrantyMonths: type.warrantyMonths || 12
        });
        setEditingId(type._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this asset type?')) {
            try {
                await axios.delete(`/api/asset-types/${id}`);
                fetchAssetTypes();
            } catch (err) {
                console.error('Failed to delete asset type:', err);
                alert(err.response?.data?.message || 'Failed to delete asset type');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            depreciationRate: 0,
            warrantyMonths: 12
        });
        setEditingId(null);
        setShowForm(false);
        setError('');
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Asset Types</h1>
                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
                >
                    + New Type
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                </div>
            )}

            {showForm && (
                <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-6 animate-fade-in">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                        {editingId ? 'Edit Asset Type' : 'Create Asset Type'}
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white"
                                rows="3"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Depreciation Rate (%)</label>
                            <input
                                type="number"
                                value={formData.depreciationRate}
                                onChange={(e) => setFormData({ ...formData, depreciationRate: parseFloat(e.target.value) })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white"
                                min="0"
                                max="100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Warranty (Months)</label>
                            <input
                                type="number"
                                value={formData.warrantyMonths}
                                onChange={(e) => setFormData({ ...formData, warrantyMonths: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white"
                                min="0"
                            />
                        </div>

                        <div className="md:col-span-2 flex gap-2 mt-4">
                            <button
                                type="submit"
                                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                {editingId ? 'Update' : 'Create'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="flex-1 py-2 px-4 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-950">
                        <tr className="border-b border-slate-200 dark:border-slate-800">
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Depr. Rate</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Warranty</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {assetTypes.map(type => (
                            <tr key={type._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">{type.name}</td>
                                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{type.description || '-'}</td>
                                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{type.depreciationRate}%</td>
                                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{type.warrantyMonths} mo</td>
                                <td className="px-6 py-4 flex gap-3">
                                    <button
                                        onClick={() => handleEdit(type)}
                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(type._id)}
                                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {assetTypes.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                                    No asset types defined. Create one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssetTypes;
