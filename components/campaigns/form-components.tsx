"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { DataMapping, BookingConfig, AutomationConfig, fieldMappingOptions } from '@/types/campaign';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    selectedFile: File | null;
    error?: string;
}

export const FileUploadComponent: React.FC<FileUploadProps> = ({ onFileSelect, selectedFile, error }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileSelect(file);
        }
    };

    return (
        <div className="space-y-2">
            <Label className="text-sm font-medium">Upload Leads CSV</Label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                />
                <div className="flex flex-col items-center space-y-2">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="mb-2"
                        >
                            Choose CSV File
                        </Button>
                        <p className="text-sm text-gray-500">
                            or drag and drop your CSV file here
                        </p>
                    </div>
                </div>
            </div>
            {selectedFile && (
                <div className="flex items-center space-x-2 text-sm text-green-600">
                    <FileText className="w-4 h-4" />
                    <span>✓ {selectedFile.name}</span>
                </div>
            )}
            {error && (
                <div className="flex items-center space-x-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
};

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
    const updateMapping = (index: number, field: keyof DataMapping, value: any) => {
        const newMapping = [...dataMapping];
        newMapping[index] = { ...newMapping[index], [field]: value };
        onMappingChange(newMapping);
    };

    if (csvHeaders.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Upload a CSV file first to map columns</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div>
                <Label className="text-sm font-medium">Map CSV Columns to Data Fields</Label>
                <p className="text-xs text-gray-500 mt-1">
                    Select which columns from your CSV correspond to each data field
                </p>
            </div>

            {error && (
                <div className="flex items-center space-x-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                </div>
            )}

            <div className="space-y-3">
                {dataMapping.map((mapping, index) => {
                    const fieldOption = fieldMappingOptions.find(opt => opt.value === mapping.mapped_to);
                    return (
                        <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center p-3 border rounded-lg">
                            <div>
                                <Label className="text-sm font-medium">{fieldOption?.label}</Label>
                                <p className="text-xs text-gray-500">{fieldOption?.type}</p>
                            </div>
                            <Select
                                value={mapping.csv_column}
                                onValueChange={(value) => updateMapping(index, 'csv_column', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select CSV column" />
                                </SelectTrigger>
                                <SelectContent>
                                    {csvHeaders.map((header) => (
                                        <SelectItem key={header} value={header}>
                                            {header}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={mapping.required}
                                    onCheckedChange={(checked) => updateMapping(index, 'required', checked)}
                                    disabled={mapping.mapped_to === 'first_name' || mapping.mapped_to === 'email'}
                                />
                                <Label className="text-sm">Required</Label>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

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
    const updateConfig = (field: keyof BookingConfig, value: any) => {
        onConfigChange({ ...bookingConfig, [field]: value });
    };

    const updateTeamEmails = (emails: string) => {
        const emailList = emails.split('\n').filter(email => email.trim());
        updateConfig('team_email_addresses', emailList);
    };

    return (
        <div className="space-y-4">
            {error && (
                <div className="flex items-center space-x-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                </div>
            )}

            <div>
                <Label className="text-sm font-medium">Calendar Integration</Label>
                <Select
                    value={bookingConfig.calendar_type}
                    onValueChange={(value: 'google' | 'outlook' | 'calendly') => updateConfig('calendar_type', value)}
                >
                    <SelectTrigger className="mt-1">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="google">Google Calendar</SelectItem>
                        <SelectItem value="outlook">Outlook Calendar</SelectItem>
                        <SelectItem value="calendly">Calendly</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <Label className="text-sm font-medium">Meeting Duration (minutes)</Label>
                    <Input
                        type="number"
                        value={bookingConfig.meeting_duration_minutes}
                        onChange={(e) => updateConfig('meeting_duration_minutes', parseInt(e.target.value))}
                        className="mt-1"
                        min="15"
                        max="120"
                    />
                </div>
                <div>
                    <Label className="text-sm font-medium">Buffer Time (minutes)</Label>
                    <Input
                        type="number"
                        value={bookingConfig.buffer_time_minutes}
                        onChange={(e) => updateConfig('buffer_time_minutes', parseInt(e.target.value))}
                        className="mt-1"
                        min="0"
                        max="60"
                    />
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center space-x-2">
                    <Switch
                        checked={bookingConfig.send_invite_to_lead}
                        onCheckedChange={(checked) => updateConfig('send_invite_to_lead', checked)}
                    />
                    <Label className="text-sm">Send calendar invite to lead</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch
                        checked={bookingConfig.send_invite_to_team}
                        onCheckedChange={(checked) => updateConfig('send_invite_to_team', checked)}
                    />
                    <Label className="text-sm">Send calendar invite to team</Label>
                </div>
            </div>

            {bookingConfig.send_invite_to_team && (
                <div>
                    <Label className="text-sm font-medium">Team Email Addresses</Label>
                    <Textarea
                        placeholder="Enter email addresses (one per line)"
                        value={bookingConfig.team_email_addresses.join('\n')}
                        onChange={(e) => updateTeamEmails(e.target.value)}
                        rows={3}
                        className="mt-1"
                    />
                </div>
            )}
        </div>
    );
};

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
    const updateConfig = (field: keyof AutomationConfig, value: any) => {
        onConfigChange({ ...automationConfig, [field]: value });
    };

    return (
        <div className="space-y-4">
            {error && (
                <div className="flex items-center space-x-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                </div>
            )}

            <div>
                <Label className="text-sm font-medium">Email Template</Label>
                <Textarea
                    placeholder="Hi {{first_name}}, let's schedule a call!"
                    value={automationConfig.email_template}
                    onChange={(e) => updateConfig('email_template', e.target.value)}
                    rows={4}
                    className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Use {`{{first_name}}`}, {`{{company}}`}, etc. for dynamic content
                </p>
            </div>

            <div>
                <Label className="text-sm font-medium">Call Script</Label>
                <Textarea
                    placeholder="Hello {{first_name}}, I'm calling from {{company_name}}..."
                    value={automationConfig.call_script}
                    onChange={(e) => updateConfig('call_script', e.target.value)}
                    rows={4}
                    className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Use {`{{first_name}}`}, {`{{company}}`}, etc. for dynamic content
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <Label className="text-sm font-medium">Max Call Attempts</Label>
                    <Input
                        type="number"
                        value={automationConfig.max_call_attempts}
                        onChange={(e) => updateConfig('max_call_attempts', parseInt(e.target.value))}
                        className="mt-1"
                        min="1"
                        max="10"
                    />
                </div>
                <div>
                    <Label className="text-sm font-medium">Call Interval (hours)</Label>
                    <Input
                        type="number"
                        value={automationConfig.call_interval_hours}
                        onChange={(e) => updateConfig('call_interval_hours', parseInt(e.target.value))}
                        className="mt-1"
                        min="1"
                        max="168"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <Label className="text-sm font-medium">Delay Between Calls (seconds)</Label>
                    <Input
                        type="number"
                        value={automationConfig.delay_between_calls}
                        onChange={(e) => updateConfig('delay_between_calls', parseInt(e.target.value))}
                        className="mt-1"
                        min="1"
                        max="300"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Time to wait between making calls
                    </p>
                </div>
                <div>
                    <Label className="text-sm font-medium">Max Concurrent Calls</Label>
                    <Input
                        type="number"
                        value={automationConfig.max_concurrent_calls}
                        onChange={(e) => updateConfig('max_concurrent_calls', parseInt(e.target.value))}
                        className="mt-1"
                        min="1"
                        max="10"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Maximum number of calls to run simultaneously
                    </p>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <Switch
                    checked={automationConfig.enable_followup_emails}
                    onCheckedChange={(checked) => updateConfig('enable_followup_emails', checked)}
                />
                <Label className="text-sm">Enable follow-up emails</Label>
            </div>
        </div>
    );
};
