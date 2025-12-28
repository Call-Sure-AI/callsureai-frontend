// components\campaigns\form-components.tsx
"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
    Upload, 
    FileText, 
    AlertCircle, 
    CheckCircle2, 
    Calendar, 
    Clock, 
    Mail, 
    Phone, 
    Users, 
    Sparkles,
    Link2,
    MessageSquare,
    Repeat,
    Zap
} from 'lucide-react';
import { DataMapping, BookingConfig, AutomationConfig, fieldMappingOptions } from '@/types/campaign';

// ============================================
// FILE UPLOAD COMPONENT
// ============================================
interface FileUploadProps {
    onFileSelect: (file: File) => void;
    selectedFile: File | null;
    error?: string;
}

export const FileUploadComponent: React.FC<FileUploadProps> = ({ onFileSelect, selectedFile, error }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = React.useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.name.endsWith('.csv')) {
            onFileSelect(file);
        }
    };

    return (
        <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Upload className="w-4 h-4 text-cyan-500" />
                Upload Leads CSV
            </Label>
            
            <motion.div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                animate={{ 
                    borderColor: isDragging ? 'rgb(6, 182, 212)' : error ? 'rgb(239, 68, 68)' : 'rgb(229, 231, 235)',
                    backgroundColor: isDragging ? 'rgba(6, 182, 212, 0.05)' : 'transparent'
                }}
                className={`
                    relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300
                    ${isDragging ? 'border-cyan-500 bg-cyan-500/5' : error ? 'border-red-300 dark:border-red-500/50' : 'border-gray-200 dark:border-slate-700'}
                    hover:border-cyan-500/50 dark:hover:border-cyan-500/50 hover:bg-cyan-500/5 dark:hover:bg-cyan-500/5
                    group cursor-pointer
                `}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                />
                
                <div className="flex flex-col items-center space-y-4">
                    {/* Icon */}
                    <motion.div
                        animate={{ scale: isDragging ? 1.1 : 1 }}
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 flex items-center justify-center group-hover:from-cyan-500/20 group-hover:to-blue-500/20 transition-all"
                    >
                        <Upload className="w-7 h-7 text-cyan-500" />
                    </motion.div>

                    {/* Text */}
                    <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            {isDragging ? 'Drop your file here' : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            CSV files only (max 10MB)
                        </p>
                    </div>

                    {/* Button */}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-lg border-cyan-500/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10"
                        onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                        }}
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Choose File
                    </Button>
                </div>
            </motion.div>

            {/* Success State */}
            <AnimatePresence>
                {selectedFile && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl"
                    >
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 truncate">
                                {selectedFile.name}
                            </p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-500">
                                {(selectedFile.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error State */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400"
                    >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ============================================
// DATA MAPPING COMPONENT
// ============================================
interface DataMappingComponentProps {
    csvHeaders: string[];
    dataMapping: DataMapping[];
    onMappingChange: (mapping: DataMapping[]) => void;
    error?: string;
}

export const DataMappingComponent: React.FC<DataMappingComponentProps> = ({
    csvHeaders,
    dataMapping,
    onMappingChange,
    error
}) => {
    const updateMapping = (index: number, field: keyof DataMapping, value: string | boolean) => {
        const newMapping = [...dataMapping];
        newMapping[index] = { ...newMapping[index], [field]: value };
        onMappingChange(newMapping);
    };

    if (csvHeaders.length === 0) {
        return (
            <div className="text-center py-12 px-6 bg-gray-50 dark:bg-slate-800/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-7 h-7 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    No CSV file uploaded yet
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                    Upload a CSV file first to map columns to data fields
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25 flex-shrink-0">
                    <Link2 className="w-5 h-5 text-white" />
                </div>
                <div>
                    <Label className="text-sm font-medium text-gray-900 dark:text-white">
                        Map CSV Columns
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Match your CSV columns to the corresponding data fields
                    </p>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Mapping Items */}
            <div className="space-y-3">
                {dataMapping.map((mapping, index) => {
                    const fieldOption = fieldMappingOptions.find(opt => opt.value === mapping.mapped_to);
                    const isRequired = mapping.mapped_to === 'first_name' || mapping.mapped_to === 'email';
                    
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl hover:border-cyan-500/30 dark:hover:border-cyan-500/30 transition-all"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                {/* Field Info */}
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                        isRequired 
                                            ? 'bg-cyan-500/10 text-cyan-500' 
                                            : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400'
                                    }`}>
                                        {fieldOption?.value === 'email' ? <Mail className="w-4 h-4" /> :
                                         fieldOption?.value === 'phone' ? <Phone className="w-4 h-4" /> :
                                         <FileText className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {fieldOption?.label}
                                            {isRequired && <span className="text-red-500 ml-1">*</span>}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {fieldOption?.type}
                                        </p>
                                    </div>
                                </div>

                                {/* CSV Column Select */}
                                <Select
                                    value={mapping.csv_column}
                                    onValueChange={(value) => updateMapping(index, 'csv_column', value)}
                                >
                                    <SelectTrigger className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-lg">
                                        <SelectValue placeholder="Select column" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {csvHeaders.map((header) => (
                                            <SelectItem key={header} value={header}>
                                                {header}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Required Toggle */}
                                <div className="flex items-center justify-end gap-2">
                                    <Switch
                                        checked={mapping.required}
                                        onCheckedChange={(checked) => updateMapping(index, 'required', checked)}
                                        disabled={isRequired}
                                        className="data-[state=checked]:bg-cyan-500"
                                    />
                                    <Label className="text-sm text-gray-600 dark:text-gray-400">
                                        Required
                                    </Label>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

// ============================================
// BOOKING CONFIG COMPONENT
// ============================================
interface BookingConfigComponentProps {
    bookingConfig: BookingConfig;
    onConfigChange: (config: BookingConfig) => void;
    error?: string;
}

export const BookingConfigComponent: React.FC<BookingConfigComponentProps> = ({
    bookingConfig,
    onConfigChange,
    error
}) => {
    const updateConfig = <K extends keyof BookingConfig>(field: K, value: BookingConfig[K]) => {
        onConfigChange({ ...bookingConfig, [field]: value });
    };

    const updateTeamEmails = (emails: string) => {
        const emailList = emails.split('\n').filter(email => email.trim());
        updateConfig('team_email_addresses', emailList);
    };

    return (
        <div className="space-y-6">
            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Calendar Integration */}
            <div className="p-4 bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                        <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <Label className="text-sm font-medium text-gray-900 dark:text-white">
                            Calendar Integration
                        </Label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Connect your preferred calendar service
                        </p>
                    </div>
                </div>
                
                <Select
                    value={bookingConfig.calendar_type}
                    onValueChange={(value: 'google' | 'outlook' | 'calendly') => updateConfig('calendar_type', value)}
                >
                    <SelectTrigger className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl h-11">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="google">
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500" />
                                Google Calendar
                            </span>
                        </SelectItem>
                        <SelectItem value="outlook">
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                Outlook Calendar
                            </span>
                        </SelectItem>
                        <SelectItem value="calendly">
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-500" />
                                Calendly
                            </span>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Meeting Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-cyan-500" />
                        <Label className="text-sm font-medium text-gray-900 dark:text-white">
                            Meeting Duration
                        </Label>
                    </div>
                    <div className="relative">
                        <Input
                            type="number"
                            value={bookingConfig.meeting_duration_minutes}
                            onChange={(e) => updateConfig('meeting_duration_minutes', parseInt(e.target.value) || 30)}
                            min="15"
                            max="120"
                            className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-lg pr-16"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                            mins
                        </span>
                    </div>
                </div>
                
                <div className="p-4 bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-purple-500" />
                        <Label className="text-sm font-medium text-gray-900 dark:text-white">
                            Buffer Time
                        </Label>
                    </div>
                    <div className="relative">
                        <Input
                            type="number"
                            value={bookingConfig.buffer_time_minutes}
                            onChange={(e) => updateConfig('buffer_time_minutes', parseInt(e.target.value) || 0)}
                            min="0"
                            max="60"
                            className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-lg pr-16"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                            mins
                        </span>
                    </div>
                </div>
            </div>

            {/* Invite Settings */}
            <div className="p-4 bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                        <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <Label className="text-sm font-medium text-gray-900 dark:text-white">
                            Calendar Invites
                        </Label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Configure who receives meeting invitations
                        </p>
                    </div>
                </div>

                <div className="space-y-3 pl-13">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                        <Label className="text-sm text-gray-700 dark:text-gray-300">
                            Send invite to lead
                        </Label>
                        <Switch
                            checked={bookingConfig.send_invite_to_lead}
                            onCheckedChange={(checked) => updateConfig('send_invite_to_lead', checked)}
                            className="data-[state=checked]:bg-cyan-500"
                        />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                        <Label className="text-sm text-gray-700 dark:text-gray-300">
                            Send invite to team
                        </Label>
                        <Switch
                            checked={bookingConfig.send_invite_to_team}
                            onCheckedChange={(checked) => updateConfig('send_invite_to_team', checked)}
                            className="data-[state=checked]:bg-cyan-500"
                        />
                    </div>
                </div>

                {/* Team Emails */}
                <AnimatePresence>
                    {bookingConfig.send_invite_to_team && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-3 border-t border-gray-200 dark:border-slate-700">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className="w-4 h-4 text-cyan-500" />
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Team Email Addresses
                                    </Label>
                                </div>
                                <Textarea
                                    placeholder="Enter email addresses (one per line)"
                                    value={bookingConfig.team_email_addresses.join('\n')}
                                    onChange={(e) => updateTeamEmails(e.target.value)}
                                    rows={3}
                                    className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-lg resize-none"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// ============================================
// AUTOMATION CONFIG COMPONENT
// ============================================
interface AutomationConfigComponentProps {
    automationConfig: AutomationConfig;
    onConfigChange: (config: AutomationConfig) => void;
    error?: string;
}

export const AutomationConfigComponent: React.FC<AutomationConfigComponentProps> = ({
    automationConfig,
    onConfigChange,
    error
}) => {
    const updateConfig = <K extends keyof AutomationConfig>(field: K, value: AutomationConfig[K]) => {
        onConfigChange({ ...automationConfig, [field]: value });
    };

    return (
        <div className="space-y-6">
            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Email Template */}
            <div className="p-4 bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                        <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <Label className="text-sm font-medium text-gray-900 dark:text-white">
                            Email Template
                        </Label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Customize your outreach email message
                        </p>
                    </div>
                </div>
                <Textarea
                    placeholder="Hi {{first_name}}, let's schedule a call!"
                    value={automationConfig.email_template}
                    onChange={(e) => updateConfig('email_template', e.target.value)}
                    rows={4}
                    className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-lg resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Use {`{{first_name}}`}, {`{{company}}`}, etc. for dynamic content
                </p>
            </div>

            {/* Call Script */}
            <div className="p-4 bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                        <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <Label className="text-sm font-medium text-gray-900 dark:text-white">
                            Call Script
                        </Label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Script for AI agent during calls
                        </p>
                    </div>
                </div>
                <Textarea
                    placeholder="Hello {{first_name}}, I'm calling from {{company_name}}..."
                    value={automationConfig.call_script}
                    onChange={(e) => updateConfig('call_script', e.target.value)}
                    rows={4}
                    className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-lg resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Use {`{{first_name}}`}, {`{{company}}`}, etc. for dynamic content
                </p>
            </div>

            {/* Call Settings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                        <Repeat className="w-4 h-4 text-orange-500" />
                        <Label className="text-sm font-medium text-gray-900 dark:text-white">
                            Max Call Attempts
                        </Label>
                    </div>
                    <Input
                        type="number"
                        value={automationConfig.max_call_attempts}
                        onChange={(e) => updateConfig('max_call_attempts', parseInt(e.target.value) || 3)}
                        min="1"
                        max="10"
                        className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-lg"
                    />
                </div>
                
                <div className="p-4 bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <Label className="text-sm font-medium text-gray-900 dark:text-white">
                            Call Interval
                        </Label>
                    </div>
                    <div className="relative">
                        <Input
                            type="number"
                            value={automationConfig.call_interval_hours}
                            onChange={(e) => updateConfig('call_interval_hours', parseInt(e.target.value) || 24)}
                            min="1"
                            max="168"
                            className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-lg pr-14"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                            hours
                        </span>
                    </div>
                </div>

                <div className="p-4 bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-emerald-500" />
                        <Label className="text-sm font-medium text-gray-900 dark:text-white">
                            Delay Between Calls
                        </Label>
                    </div>
                    <div className="relative">
                        <Input
                            type="number"
                            value={automationConfig.delay_between_calls}
                            onChange={(e) => updateConfig('delay_between_calls', parseInt(e.target.value) || 30)}
                            min="1"
                            max="300"
                            className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-lg pr-12"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                            secs
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                        Time to wait between making calls
                    </p>
                </div>

                <div className="p-4 bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-4 h-4 text-purple-500" />
                        <Label className="text-sm font-medium text-gray-900 dark:text-white">
                            Max Concurrent Calls
                        </Label>
                    </div>
                    <Input
                        type="number"
                        value={automationConfig.max_concurrent_calls}
                        onChange={(e) => updateConfig('max_concurrent_calls', parseInt(e.target.value) || 1)}
                        min="1"
                        max="10"
                        className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-lg"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                        Maximum simultaneous calls
                    </p>
                </div>
            </div>

            {/* Follow-up Emails Toggle */}
            <div className="p-4 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 dark:from-cyan-500/10 dark:to-blue-500/10 border border-cyan-500/20 rounded-xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                            <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-900 dark:text-white">
                                Follow-up Emails
                            </Label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Automatically send follow-up emails after calls
                            </p>
                        </div>
                    </div>
                    <Switch
                        checked={automationConfig.enable_followup_emails}
                        onCheckedChange={(checked) => updateConfig('enable_followup_emails', checked)}
                        className="data-[state=checked]:bg-cyan-500"
                    />
                </div>
            </div>
        </div>
    );
};