"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ChevronDown, Users, Mail, Shield, Search } from 'lucide-react';
import { AccessLevel, AccessLevelName, AccessManagerProps, SelectedAccessMap, User } from '@/types';

const AccessManagerDashboard: React.FC<AccessManagerProps> = ({
    initialUsers = [],
    onInvite,
    onCancel
}) => {
    const [email, setEmail] = useState<string>('');
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [selectedAccess, setSelectedAccess] = useState<SelectedAccessMap>({});
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [users, setUsers] = useState<User[]>(initialUsers.length > 0
        ? initialUsers
        : [
            { id: '1', email: 'example1@email.com' },
            { id: '2', email: 'example2@email.com' }
        ]
    );

    const accessLevels: AccessLevel[] = [
        { name: 'Admin Access', icon: Shield },
        { name: 'Projects Access', icon: Users },
        { name: 'Custom Projects Access', icon: Users }
    ];

    const toggleDropdown = (userId: string): void => {
        setOpenDropdownId(openDropdownId === userId ? null : userId);
    };

    const handleAccessSelect = (userId: string, accessName: AccessLevelName): void => {
        setSelectedAccess(prev => ({
            ...prev,
            [userId]: accessName
        }));
        setOpenDropdownId(null);
    };

    const handleAddUser = (): void => {
        if (!email) return;

        const newUser: User = {
            id: `user-${Date.now()}`,
            email
        };

        setUsers(prev => [...prev, newUser]);
        setEmail('');
    };

    const handleRemoveUser = (userId: string): void => {
        setUsers(prev => prev.filter(user => user.id !== userId));
        const { [userId]: _, ...restAccess } = selectedAccess; // eslint-disable-line @typescript-eslint/no-unused-vars
        setSelectedAccess(restAccess);
    };

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        }
    };

    const dropdownVariants = {
        hidden: { opacity: 0, y: -10, height: 0 },
        visible: {
            opacity: 1,
            y: 0,
            height: 'auto',
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 p-8">
            <motion.div
                className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
                    <motion.h1
                        className="text-3xl font-bold mb-2"
                        variants={itemVariants}
                    >
                        Access Manager
                    </motion.h1>
                    <motion.p
                        className="text-blue-100"
                        variants={itemVariants}
                    >
                        Manage user permissions and access levels
                    </motion.p>
                </div>

                <div className="p-8">
                    {/* Search and Add Section */}
                    <motion.div
                        className="flex flex-col md:flex-row gap-4 mb-8"
                        variants={itemVariants}
                    >
                        <div className="flex-1 relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                placeholder="Enter email address"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-md transition-colors duration-200"
                            onClick={handleAddUser}
                            disabled={!email}
                        >
                            <Plus size={20} />
                            Add User
                        </motion.button>
                    </motion.div>

                    {/* Search Filter */}
                    <motion.div
                        className="mb-6 relative"
                        variants={itemVariants}
                    >
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </motion.div>

                    {/* User List */}
                    <motion.div
                        className="space-y-4"
                        variants={itemVariants}
                    >
                        {filteredUsers.map((user, index) => (
                            <motion.div
                                key={user.id}
                                className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-200 transition-all duration-200"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-100 p-2 rounded-lg">
                                        <Users className="text-blue-600" size={24} />
                                    </div>
                                    <span className="text-xs md:text-lg text-gray-700 font-medium">{user.email}</span>

                                    <div className="relative ml-auto">
                                        <motion.button
                                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-200"
                                            onClick={() => toggleDropdown(user.id)}
                                        >
                                            <Shield size={16} className="text-blue-600" />
                                            <span className='hidden md:block'>{selectedAccess[user.id] || 'Admin Access'}</span>
                                            <ChevronDown
                                                size={16}
                                                className={`transform transition-transform duration-200 ${openDropdownId === user.id ? 'rotate-180' : ''}`}
                                            />
                                        </motion.button>

                                        <AnimatePresence>
                                            {openDropdownId === user.id && (
                                                <motion.div
                                                    className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden"
                                                    variants={dropdownVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="hidden"
                                                >
                                                    {accessLevels.map(({ name, icon: Icon }) => (
                                                        <motion.button
                                                            key={name}
                                                            className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-200"
                                                            onClick={() => handleAccessSelect(user.id, name)}
                                                            whileHover={{ x: 4 }}
                                                        >
                                                            <Icon size={16} className="text-blue-600" />
                                                            {name}
                                                        </motion.button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                                        onClick={() => handleRemoveUser(user.id)}
                                    >
                                        <X size={20} />
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Footer Actions */}
                    <motion.div
                        className="flex gap-4 mt-8 pt-8 border-t border-gray-200"
                        variants={itemVariants}
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                            onClick={onCancel}
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-md"
                            onClick={() => onInvite?.(users)}
                        >
                            Invite Selected Users
                        </motion.button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default AccessManagerDashboard;