// app\(settings)\payments-section\page.tsx
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
    CreditCard, 
    Wallet, 
    Receipt, 
    Plus, 
    Check, 
    Trash2, 
    RefreshCw,
    ArrowLeft,
    Sparkles,
    Shield,
    Zap,
    Crown,
    ChevronRight,
    Calendar,
    DollarSign,
    TrendingUp
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Payment Method Card Component
const PaymentMethodCard = ({ 
    method, 
    index 
}: { 
    method: { id: number; type: string; isDefault: boolean; expiryDate: string; last4?: string };
    index: number;
}) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isHovered, setIsHovered] = useState<boolean>(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.01 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="group relative"
        >
            <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-slate-800/50 p-5 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Default badge */}
                {method.isDefault && (
                    <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-sm">
                            <Check className="w-3 h-3" />
                            Default
                        </span>
                    </div>
                )}

                {/* Glow effect */}
                <div className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-10 blur-3xl transition-opacity`} />

                <div className="relative space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center shadow-lg">
                            <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-900 dark:text-white">{method.type}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">•••• {method.last4 || '4242'}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <Shield className="w-3 h-3 text-emerald-500" />
                                <span>Secure payment</span>
                            </div>
                        </div>
                    </div>

                    {/* Card Details */}
                    <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-100 dark:border-slate-800">
                        <div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Contact</div>
                            <div className="text-sm text-gray-700 dark:text-gray-300">•••• ••••</div>
                        </div>
                        <div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Phone</div>
                            <div className="text-sm text-gray-700 dark:text-gray-300">•••• ••••</div>
                        </div>
                        <div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Expires</div>
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{method.expiryDate}</div>
                        </div>
                        <div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Address</div>
                            <div className="text-sm text-gray-700 dark:text-gray-300">•••• ••••</div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 justify-end">
                        {!method.isDefault && (
                            <Button 
                                variant="outline" 
                                size="sm"
                                className="text-xs border-gray-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                            >
                                <Check className="w-3 h-3 mr-1" />
                                Set Default
                            </Button>
                        )}
                        <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs border-gray-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Replace
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs border-gray-200 dark:border-slate-700 hover:border-red-500 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Credit Pack Card Component
const CreditPackCard = ({ 
    pack, 
    index,
    isSelected,
    onSelect
}: { 
    pack: { id: number; name: string; credits: string; price: string; popular?: boolean };
    index: number;
    isSelected: boolean;
    onSelect: () => void;
}) => {
    const icons = [Zap, Crown, Sparkles];
    const Icon = icons[index % icons.length];
    const gradients = [
        'from-cyan-500 to-blue-600',
        'from-purple-500 to-indigo-600',
        'from-orange-500 to-amber-600'
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSelect}
            className="cursor-pointer"
        >
            <div className={`relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border-2 p-5 shadow-lg transition-all duration-300 overflow-hidden ${
                isSelected 
                    ? 'border-cyan-500 dark:border-cyan-500 shadow-cyan-500/20' 
                    : 'border-gray-200/50 dark:border-slate-800/50 hover:border-gray-300 dark:hover:border-slate-700'
            }`}>
                {/* Popular badge */}
                {pack.popular && (
                    <div className="absolute -top-0 -right-0">
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
                            POPULAR
                        </div>
                    </div>
                )}

                {/* Glow effect when selected */}
                {isSelected && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-10 blur-xl" />
                )}

                <div className="relative flex flex-col items-center text-center space-y-3">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{pack.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{pack.credits} credits</p>
                    </div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                        {pack.price}
                    </div>

                    {/* Selection indicator */}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected 
                            ? 'border-cyan-500 bg-cyan-500' 
                            : 'border-gray-300 dark:border-slate-600'
                    }`}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Billing History Row Component
const BillingHistoryRow = ({ 
    item, 
    index 
}: { 
    item: { id: number; date: string; description: string; amount: string; status: string };
    index: number;
}) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 + index * 0.05 }}
        className="flex items-center justify-between p-4 rounded-lg bg-gray-50/50 dark:bg-slate-800/50 hover:bg-gray-100/50 dark:hover:bg-slate-800/80 transition-colors"
    >
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 flex items-center justify-center">
                <Receipt className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">{item.description}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.date}
                </p>
            </div>
        </div>
        <div className="text-right">
            <p className="font-semibold text-gray-900 dark:text-white">{item.amount}</p>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                item.status === 'Paid' 
                    ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                    : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
            }`}>
                {item.status}
            </span>
        </div>
    </motion.div>
);

const PaymentSettings = () => {
    const [selectedPack, setSelectedPack] = useState<number | null>(null);

    const paymentMethods = [
        { id: 1, type: 'VISA', isDefault: true, expiryDate: '1/2026', last4: '4242' },
        { id: 2, type: 'VISA', isDefault: false, expiryDate: '1/2026', last4: '8888' }
    ];

    const creditPacks = [
        { id: 1, name: 'Starter', credits: '500', price: '$49' },
        { id: 2, name: 'Professional', credits: '2,000', price: '$149', popular: true },
        { id: 3, name: 'Enterprise', credits: '10,000', price: '$499' },
    ];

    const billingHistory = [
        { id: 1, date: 'Dec 1, 2024', description: 'Professional Plan - 2,000 credits', amount: '$149.00', status: 'Paid' },
        { id: 2, date: 'Nov 1, 2024', description: 'Starter Plan - 500 credits', amount: '$49.00', status: 'Paid' },
        { id: 3, date: 'Oct 1, 2024', description: 'Professional Plan - 2,000 credits', amount: '$149.00', status: 'Paid' },
    ];

    return (
        <div className="w-full max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <Link href="/dashboard">
                    <Button 
                        variant="ghost" 
                        className="mb-4 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 -ml-2"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </Link>
                <h1 className="text-2xl lg:text-3xl font-bold">
                    <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                        Payments
                    </span>
                    <span className="text-gray-900 dark:text-white ml-2">& Billing</span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Manage your payment methods and purchase credits
                </p>
            </motion.div>

            <div className="space-y-8">
                {/* Credit Balance Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl p-6 shadow-xl overflow-hidden"
                >
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl" />
                    </div>
                    
                    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <Wallet className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <p className="text-white/80 text-sm font-medium">Current Balance</p>
                                <p className="text-3xl font-bold text-white">$1,444.00</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-white/60 text-xs">Available Credits</p>
                                <p className="text-white font-semibold flex items-center gap-1">
                                    <TrendingUp className="w-4 h-4" />
                                    8,500 credits
                                </p>
                            </div>
                            <Button className="bg-white hover:bg-gray-100 text-blue-600 font-semibold px-6 shadow-lg">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Credits
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Payment Methods Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-cyan-500" />
                            Payment Methods
                        </h2>
                        <Button 
                            variant="outline" 
                            size="sm"
                            className="text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800 hover:bg-cyan-50 dark:hover:bg-cyan-500/10"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Add New
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {paymentMethods.map((method, index) => (
                            <PaymentMethodCard key={method.id} method={method} index={index} />
                        ))}
                    </div>
                </motion.div>

                {/* Add Credits Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                        Purchase Credits
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        {creditPacks.map((pack, index) => (
                            <CreditPackCard 
                                key={pack.id} 
                                pack={pack} 
                                index={index}
                                isSelected={selectedPack === pack.id}
                                onSelect={() => setSelectedPack(pack.id)}
                            />
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-slate-800/50"
                    >
                        <div className="flex-1">
                            <Select>
                                <SelectTrigger className="w-full bg-gray-50/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/20">
                                    <SelectValue placeholder="Select a credit pack" />
                                </SelectTrigger>
                                <SelectContent>
                                    {creditPacks.map((pack) => (
                                        <SelectItem key={pack.id} value={pack.id.toString()}>
                                            {pack.name} - {pack.credits} credits ({pack.price})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-8 shadow-lg shadow-cyan-500/25">
                            <DollarSign className="w-4 h-4 mr-1" />
                            Purchase Now
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Billing History Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Receipt className="w-5 h-5 text-emerald-500" />
                            Billing History
                        </h2>
                        <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400"
                        >
                            View All
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-slate-800/50 shadow-lg overflow-hidden">
                        <div className="p-4 space-y-3">
                            {billingHistory.map((item, index) => (
                                <BillingHistoryRow key={item.id} item={item} index={index} />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PaymentSettings;