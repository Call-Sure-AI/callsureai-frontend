// useSpeechRecognition.ts
import { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

interface UseSpeechRecognitionProps {
    onResult: (text: string) => void;
    onInterimResult?: (text: string) => void;
}

export const useSpeechRecognition = ({ onResult, onInterimResult }: UseSpeechRecognitionProps) => {
    const [isListening, setIsListening] = useState<boolean>(false);
    const recognition = useRef<any>(null);

    const initializeSpeechRecognition = () => {
        if (!window.webkitSpeechRecognition) {
            toast({
                title: "Warning",
                description: "Speech recognition is not supported in your browser",
                variant: "destructive"
            });
            return false;
        }

        recognition.current = new window.webkitSpeechRecognition();
        recognition.current.continuous = true;
        recognition.current.interimResults = true;
        recognition.current.lang = 'en-US';

        recognition.current.onstart = () => setIsListening(true);
        recognition.current.onend = () => setIsListening(false);

        recognition.current.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript = event.results[i][0].transcript;
                    onResult(finalTranscript);
                } else {
                    interimTranscript += event.results[i][0].transcript;
                    onInterimResult?.(interimTranscript);
                }
            }
        };

        recognition.current.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
            toast({
                title: "Error",
                description: "Speech recognition error occurred",
                variant: "destructive"
            });
        };

        return true;
    };

    const toggleListening = () => {
        if (isListening) {
            stop();
        } else {
            start();
        }
    };

    const start = () => {
        if (!recognition.current) {
            const success = initializeSpeechRecognition();
            if (!success) return false;
        }

        try {
            recognition.current?.start();
            return true;
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            return false;
        }
    };

    const stop = () => {
        try {
            recognition.current?.stop();
            return true;
        } catch (error) {
            console.error('Error stopping speech recognition:', error);
            return false;
        }
    };

    useEffect(() => {
        initializeSpeechRecognition();

        return () => {
            if (recognition.current) {
                try {
                    recognition.current.stop();
                } catch (err) {
                    console.error("Error stopping speech recognition:", err);
                }
            }
        };
    }, []);

    return {
        isListening,
        toggleListening,
        start,
        stop,
    };
};

export default useSpeechRecognition;