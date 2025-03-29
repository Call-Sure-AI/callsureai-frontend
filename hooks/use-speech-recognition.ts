import { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

interface UseSpeechRecognitionProps {
    onResult: (text: string) => void;
    onInterimResult?: (text: string) => void;
    language?: string;
    continuous?: boolean;
}

export const useSpeechRecognition = ({
    onResult,
    onInterimResult,
    language = 'en-US',
    continuous = true
}: UseSpeechRecognitionProps) => {
    const [isListening, setIsListening] = useState<boolean>(false);
    const [isSupported, setIsSupported] = useState<boolean>(true);
    const recognition = useRef<any>(null);

    const initializeSpeechRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setIsSupported(false);
            toast({
                title: "Warning",
                description: "Speech recognition is not supported in your browser",
                variant: "destructive"
            });
            return false;
        }

        recognition.current = new SpeechRecognition();
        recognition.current.continuous = continuous;
        recognition.current.interimResults = true;
        recognition.current.lang = language;

        recognition.current.onstart = () => {
            setIsListening(true);
            console.log('Speech recognition started');
        };

        recognition.current.onend = () => {
            setIsListening(false);
            console.log('Speech recognition ended');

            if (continuous && isListening && isSupported) {
                try {
                    console.log('Restarting continuous recognition...');
                    recognition.current.start();
                } catch (error) {
                    console.error('Error restarting recognition:', error);
                }
            }
        };

        recognition.current.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript = event.results[i][0].transcript;
                    if (finalTranscript.trim()) {
                        onResult(finalTranscript);
                    }
                } else {
                    interimTranscript += event.results[i][0].transcript;
                    if (onInterimResult) {
                        onInterimResult(interimTranscript);
                    }
                }
            }
        };

        recognition.current.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);

            switch (event.error) {
                case 'no-speech':
                    console.log('No speech detected');
                    break;

                case 'aborted':
                    console.log('Speech recognition aborted');
                    break;

                case 'not-allowed':
                    toast({
                        title: "Microphone Access Denied",
                        description: "Please allow microphone access to use speech recognition",
                        variant: "destructive"
                    });
                    setIsSupported(false);
                    break;

                default:
                    toast({
                        title: "Speech Recognition Error",
                        description: `Error: ${event.error}`,
                        variant: "destructive"
                    });
            }

            setIsListening(false);
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
        if (!isSupported) {
            toast({
                title: "Speech Recognition Unavailable",
                description: "Speech recognition is not supported in your browser",
                variant: "destructive"
            });
            return false;
        }

        if (!recognition.current) {
            const success = initializeSpeechRecognition();
            if (!success) return false;
        }

        try {
            recognition.current?.start();
            return true;
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            toast({
                title: "Error",
                description: "Could not start speech recognition",
                variant: "destructive"
            });
            return false;
        }
    };

    const stop = () => {
        try {
            recognition.current?.stop();
            setIsListening(false);
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

    useEffect(() => {
        if (recognition.current) {
            recognition.current.lang = language;
        }
    }, [language]);

    return {
        isListening,
        isSupported,
        toggleListening,
        start,
        stop,
    };
};