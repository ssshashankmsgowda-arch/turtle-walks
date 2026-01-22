import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { DB } from '../services/db';
import { School } from '../types';

interface DirectoryPageProps {
    onBack: () => void;
    onSelect: () => void;
}

export const DirectoryPage: React.FC<DirectoryPageProps> = ({ onBack, onSelect }) => {
    const { setSelectedSchool } = useApp();
    const [schools, setSchools] = useState<School[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');

    // Load schools on mount
    useEffect(() => {
        setSchools(DB.getSchools());
    }, []);

    // Filter logic
    const filteredSchools = schools.filter(school => {
        const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            school.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = selectedLocation ? school.location === selectedLocation : true;
        return matchesSearch && matchesLocation;
    });

    // Get unique locations for filter
    const locations = Array.from(new Set(schools.map(s => s.location))).filter(Boolean);

    const handleSelectSchool = (school: School) => {
        setSelectedSchool(school);
        onSelect();
    };

    return (
        <div className="min-h-screen bg-canvas pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="mb-8">
                    <button
                        onClick={onBack}
                        className="text-saffron hover:text-saffron/80 font-medium mb-4 flex items-center gap-2"
                    >
                        ← Back to Home
                    </button>
                    <h1 className="text-3xl font-bold text-indiaNavy">School Directory</h1>
                    <p className="mt-2 text-gray-600">Find your school to access your custom pledge portal.</p>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search by school name or city..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indiaNavy/10 focus:border-indiaNavy outline-none transition-all shadow-sm"
                        />
                        <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
                    </div>

                    <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none bg-white shadow-sm min-w-[200px]"
                    >
                        <option value="">All Locations</option>
                        {locations.map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>
                </div>

                {/* Schools Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredSchools.map((school) => (
                        <div
                            key={school.id}
                            onClick={() => handleSelectSchool(school)}
                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 p-6 cursor-pointer group hover:-translate-y-1"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-full bg-saffron/5 flex items-center justify-center text-2xl group-hover:bg-saffron/10 transition-colors overflow-hidden">
                                    {school.logoUrl ? (
                                        <img src={school.logoUrl} alt={school.name} className="w-full h-full object-contain p-2" />
                                    ) : (
                                        school.icon
                                    )}
                                </div>
                                {school.isActive && (
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                        Active
                                    </span>
                                )}
                            </div>

                            <h3 className="font-bold text-lg text-indiaNavy mb-1 group-hover:text-saffron transition-colors">
                                {school.name}
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">{school.subLocation}, {school.location}</p>

                            <div className="flex items-center text-sm font-medium text-saffron group-hover:translate-x-1 transition-transform">
                                Enter →
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredSchools.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-5xl mb-4">🏫</div>
                        <h3 className="text-xl font-medium text-gray-900">No schools found</h3>
                        <p className="text-gray-500">Try adjusting your search filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};
