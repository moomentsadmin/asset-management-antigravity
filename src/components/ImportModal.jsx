import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';

const ImportModal = ({ isOpen, onClose, title, apiEndpoint, onSuccess, templateFields }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [stats, setStats] = useState(null);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setError('');
    };

    const downloadTemplate = () => {
        const csv = Papa.unparse([templateFields]);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'import_template.csv';
        a.click();
    };

    const handleUpload = () => {
        if (!file) {
            setError('Please select a CSV file first.');
            return;
        }

        setLoading(true);
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                if (results.errors.length) {
                    setError(`CSV Parsing Error: ${results.errors[0].message}`);
                    setLoading(false);
                    return;
                }

                try {
                    const response = await axios.post(apiEndpoint, { data: results.data });
                    setStats({ count: response.data.count });
                    if (onSuccess) onSuccess();
                    setTimeout(() => {
                        onClose();
                        setStats(null);
                        setFile(null);
                    }, 2000);
                } catch (err) {
                    console.error(err);
                    setError(err.response?.data?.message || 'Upload failed. Check your data format.');
                } finally {
                    setLoading(false);
                }
            },
            error: (err) => {
                setError(`File Read Error: ${err.message}`);
                setLoading(false);
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Import {title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {!stats ? (
                        <>
                            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="csv-upload"
                                />
                                <label htmlFor="csv-upload" className="cursor-pointer block">
                                    <svg className="w-10 h-10 text-slate-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {file ? file.name : 'Click to upload CSV'}
                                    </span>
                                    <p className="text-xs text-slate-500 mt-1">Maximum size 5MB</p>
                                </label>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <button onClick={downloadTemplate} className="text-blue-600 hover:underline">
                                    Download Template
                                </button>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Import Successful!</h4>
                            <p className="text-slate-500 mt-1">{stats.count} records processed.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!stats && (
                    <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-b-xl flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={loading || !file}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading && <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                            Import Data
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImportModal;
