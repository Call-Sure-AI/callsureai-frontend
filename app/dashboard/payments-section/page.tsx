import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard } from 'lucide-react';

const PaymentSettings = () => {
    const paymentMethods = [
        {
            id: 1,
            type: 'VISA',
            isDefault: true,
            expiryDate: '1/2026',
        },
        {
            id: 2,
            type: 'VISA',
            isDefault: false,
            expiryDate: '1/2026',
        }
    ];

    const creditPacks = [
        { id: 1, name: 'Pack 1' },
        { id: 2, name: 'Pack 2' },
        { id: 3, name: 'Pack 3' },
    ];

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <div>
                <h2 className="text-xl font-semibold mb-4">Payment Info</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paymentMethods.map((method) => (
                        <Card key={method.id} className="p-4">
                            <CardContent className="p-0 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5" />
                                        <span className="text-sm text-gray-600">Secure payment by (Our Payment Gateway)</span>
                                    </div>
                                    <span className="font-medium">{method.type}</span>
                                </div>

                                <div className="space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <div className="text-sm text-gray-500">Contact name</div>
                                            <div className="text-sm">•••• ••••</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500">Phone number</div>
                                            <div className="text-sm">•••• ••••</div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-sm text-gray-500">Ending in:</div>
                                        <div className="text-sm">•••• ••••</div>
                                    </div>

                                    <div>
                                        <div className="text-sm text-gray-500">Expires:</div>
                                        <div className="text-sm">{method.expiryDate}</div>
                                    </div>

                                    <div>
                                        <div className="text-sm text-gray-500">Address</div>
                                        <div className="text-sm">•••• ••••</div>
                                    </div>
                                </div>

                                <div className="flex gap-2 justify-end">
                                    {!method.isDefault && (
                                        <Button variant="outline" size="sm">
                                            Set Default
                                        </Button>
                                    )}
                                    <Button variant="outline" size="sm">
                                        Replace
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">Add Credits</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {creditPacks.map((pack) => (
                        <Card key={pack.id} className="p-4">
                            <CardContent className="p-0 flex items-center justify-center h-24">
                                <span className="text-lg font-medium">{pack.name}</span>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="flex gap-4">
                    <Select>
                        <SelectTrigger className="w-[300px] bg-yellow-50">
                            <SelectValue placeholder="Select the Plan" />
                        </SelectTrigger>
                        <SelectContent>
                            {creditPacks.map((pack) => (
                                <SelectItem key={pack.id} value={pack.id.toString()}>
                                    {pack.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="primary">Buy</Button>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">Billing History</h2>
                <Card className="p-4 h-48">
                    <CardContent className="p-0">
                        {/* Billing history content would go here */}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PaymentSettings;