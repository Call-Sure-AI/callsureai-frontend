import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
    onBack: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Agent ID Missing</h2>
                <p className="text-gray-600 mb-4">No agent ID was provided in the URL parameters.</p>
                <button
                    onClick={onBack}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default ErrorMessage;