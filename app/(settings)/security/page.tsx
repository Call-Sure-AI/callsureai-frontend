// app\(settings)\security\page.tsx
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
    Shield,
    Lock,
    Smartphone,
    Key,
    Eye,
    EyeOff,
    ArrowLeft,
    Check,
    X,
    AlertTriangle,
    Monitor,
    Clock,
    Trash2,
    RefreshCw,
    Bell,
    Fingerprint,
    ShieldCheck,
    ShieldAlert,
    LogOut,
    MapPin
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ProtectedRoute } from '@/components/protected-route';

// Password Strength Indicator
const PasswordStrength = ({ password }: { password: string }) => {
    const getStrength = () => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/\d/)) strength++;
        if (password.match(/[^a-zA-Z\d]/)) strength++;
        return strength;
    };

    const strength = getStrength();
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500'];

    if (!password) return null;

    return (
        <div className="mt-2 space-y-1">
            <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                            i < strength ? colors[strength - 1] : 'bg-gray-200 dark:bg-slate-700'
                        }`}
                    />
                ))}
            </div>
            <p className={`text-xs ${strength <= 1 ? 'text-red-500' : strength === 2 ? 'text-orange-500' : strength === 3 ? 'text-yellow-600' : 'text-emerald-500'}`}>
                {labels[strength - 1] || 'Too weak'}
            </p>
        </div>
    );
};

// Security Status Card
const SecurityStatusCard = () => {
    const securityScore = 85;
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (securityScore / 100) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl p-6 shadow-xl overflow-hidden"
        >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl" />
            </div>

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    {/* Circular Progress */}
                    <div className="relative w-28 h-28">
                        <svg className="w-28 h-28 -rotate-90">
                            <circle
                                cx="56"
                                cy="56"
                                r="45"
                                stroke="rgba(255,255,255,0.2)"
                                strokeWidth="8"
                                fill="none"
                            />
                            <circle
                                cx="56"
                                cy="56"
                                r="45"
                                stroke="white"
                                strokeWidth="8"
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                className="transition-all duration-1000"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">{securityScore}%</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Security Score</h3>
                        <p className="text-white/80 text-sm mt-1">Your account is well protected</p>
                        <div className="flex items-center gap-2 mt-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-300" />
                            <span className="text-white/90 text-sm">2FA Enabled</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/20 backdrop-blur-sm">
                        <Shield className="w-4 h-4 mr-2" />
                        Security Checkup
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

// Session/Device Card
const DeviceCard = ({ 
    device, 
    index 
}: { 
    device: { id: number; name: string; type: string; location: string; lastActive: string; current?: boolean };
    index: number;
}) => {
    const icons: Record<string, React.ReactNode> = {
        'desktop': <Monitor className="w-5 h-5" />,
        'mobile': <Smartphone className="w-5 h-5" />,
        'tablet': <Monitor className="w-5 h-5" />
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
                device.current 
                    ? 'bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-500/10 dark:to-blue-500/10 border border-cyan-200 dark:border-cyan-500/20' 
                    : 'bg-gray-50/50 dark:bg-slate-800/50 hover:bg-gray-100/50 dark:hover:bg-slate-800/80'
            }`}
        >
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    device.current 
                        ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white' 
                        : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-400'
                }`}>
                    {icons[device.type] || <Monitor className="w-5 h-5" />}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 dark:text-white">{device.name}</p>
                        {device.current && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500 text-white">
                                Current
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {device.location}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {device.lastActive}
                        </span>
                    </div>
                </div>
            </div>
            {!device.current && (
                <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                    <LogOut className="w-4 h-4" />
                </Button>
            )}
        </motion.div>
    );
};

// Security Setting Toggle
const SecurityToggle = ({ 
    icon: Icon, 
    title, 
    description, 
    enabled, 
    onToggle,
    color = 'cyan',
    delay = 0
}: { 
    icon: React.ElementType;
    title: string;
    description: string;
    enabled: boolean;
    onToggle: () => void;
    color?: string;
    delay?: number;
}) => {
    const colorClasses: Record<string, string> = {
        cyan: 'from-cyan-500 to-blue-500',
        purple: 'from-purple-500 to-indigo-500',
        emerald: 'from-emerald-500 to-green-500',
        orange: 'from-orange-500 to-amber-500'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="flex items-center justify-between p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-md`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                    <p className="font-medium text-gray-900 dark:text-white">{title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
                </div>
            </div>
            <Switch checked={enabled} onCheckedChange={onToggle} />
        </motion.div>
    );
};

const SecurityPage = () => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
    const [loginAlerts, setLoginAlerts] = useState(true);
    const [biometricEnabled, setBiometricEnabled] = useState(false);
    const [sessionTimeout, setSessionTimeout] = useState(true);

    const devices = [
        { id: 1, name: 'MacBook Pro', type: 'desktop', location: 'San Francisco, CA', lastActive: 'Active now', current: true },
        { id: 2, name: 'iPhone 15 Pro', type: 'mobile', location: 'San Francisco, CA', lastActive: '2 hours ago' },
        { id: 3, name: 'Windows PC', type: 'desktop', location: 'New York, NY', lastActive: '3 days ago' },
    ];

    const recentActivity = [
        { id: 1, action: 'Password changed', time: '2 days ago', icon: Key, status: 'success' },
        { id: 2, action: 'New login from iPhone', time: '5 days ago', icon: Smartphone, status: 'success' },
        { id: 3, action: 'Failed login attempt', time: '1 week ago', icon: ShieldAlert, status: 'warning' },
    ];

    return (
        <ProtectedRoute>
            <div className="w-full max-w-4xl mx-auto">
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
                            Security
                        </span>
                        <span className="text-gray-900 dark:text-white ml-2">Settings</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage your account security and authentication preferences
                    </p>
                </motion.div>

                <div className="space-y-6">
                    {/* Security Status */}
                    <SecurityStatusCard />

                    {/* Change Password Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-slate-800/50 shadow-lg overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100 dark:border-slate-800">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Lock className="w-5 h-5 text-cyan-500" />
                                Change Password
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Update your password regularly to keep your account secure
                            </p>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Current Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Current Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Enter current password"
                                        className="pl-10 pr-10 bg-white/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showCurrentPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Key className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        className="pl-10 pr-10 bg-white/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                                <PasswordStrength password={newPassword} />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Key className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        className="pl-10 pr-10 bg-white/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                                {confirmPassword && newPassword && (
                                    <p className={`text-xs mt-2 flex items-center gap-1 ${
                                        confirmPassword === newPassword ? 'text-emerald-500' : 'text-red-500'
                                    }`}>
                                        {confirmPassword === newPassword ? (
                                            <><Check className="w-3 h-3" /> Passwords match</>
                                        ) : (
                                            <><X className="w-3 h-3" /> Passwords do not match</>
                                        )}
                                    </p>
                                )}
                            </div>

                            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Update Password
                            </Button>
                        </div>
                    </motion.div>

                    {/* Security Settings Toggles */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-3"
                    >
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                            <Shield className="w-5 h-5 text-purple-500" />
                            Security Preferences
                        </h2>
                        
                        <SecurityToggle
                            icon={Smartphone}
                            title="Two-Factor Authentication"
                            description="Add an extra layer of security to your account"
                            enabled={twoFactorEnabled}
                            onToggle={() => setTwoFactorEnabled(!twoFactorEnabled)}
                            color="cyan"
                            delay={0.25}
                        />
                        <SecurityToggle
                            icon={Bell}
                            title="Login Alerts"
                            description="Get notified when someone logs into your account"
                            enabled={loginAlerts}
                            onToggle={() => setLoginAlerts(!loginAlerts)}
                            color="purple"
                            delay={0.3}
                        />
                        <SecurityToggle
                            icon={Fingerprint}
                            title="Biometric Login"
                            description="Use fingerprint or face recognition to login"
                            enabled={biometricEnabled}
                            onToggle={() => setBiometricEnabled(!biometricEnabled)}
                            color="emerald"
                            delay={0.35}
                        />
                        <SecurityToggle
                            icon={Clock}
                            title="Auto Session Timeout"
                            description="Automatically logout after 30 minutes of inactivity"
                            enabled={sessionTimeout}
                            onToggle={() => setSessionTimeout(!sessionTimeout)}
                            color="orange"
                            delay={0.4}
                        />
                    </motion.div>

                    {/* Active Sessions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-slate-800/50 shadow-lg overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Monitor className="w-5 h-5 text-emerald-500" />
                                    Active Sessions
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Manage devices where you&apos;re currently logged in
                                </p>
                            </div>
                            <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-500 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-500/10"
                            >
                                <LogOut className="w-4 h-4 mr-1" />
                                Logout All
                            </Button>
                        </div>
                        <div className="p-6 space-y-3">
                            {devices.map((device, index) => (
                                <DeviceCard key={device.id} device={device} index={index} />
                            ))}
                        </div>
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-slate-800/50 shadow-lg overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100 dark:border-slate-800">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Clock className="w-5 h-5 text-orange-500" />
                                Recent Security Activity
                            </h2>
                        </div>
                        <div className="p-6 space-y-3">
                            {recentActivity.map((activity, index) => (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50 dark:bg-slate-800/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                            activity.status === 'success' 
                                                ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                                                : 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'
                                        }`}>
                                            <activity.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white text-sm">{activity.action}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                                        </div>
                                    </div>
                                    {activity.status === 'warning' && (
                                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Danger Zone */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-red-50/50 dark:bg-red-500/5 backdrop-blur-xl rounded-2xl border border-red-200/50 dark:border-red-500/20 shadow-lg overflow-hidden"
                    >
                        <div className="p-6">
                            <h2 className="text-lg font-bold text-red-600 dark:text-red-400 flex items-center gap-2 mb-4">
                                <AlertTriangle className="w-5 h-5" />
                                Danger Zone
                            </h2>
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white/80 dark:bg-slate-900/50 rounded-xl border border-red-100 dark:border-red-500/10">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Delete Account</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Permanently delete your account and all data</p>
                                    </div>
                                    <Button 
                                        variant="outline"
                                        className="text-red-600 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 shrink-0"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Account
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default SecurityPage;