import { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

interface UseAudioManagerProps {
    initialEnabled?: boolean;
}

export const useAudioManager = ({ initialEnabled = true }: UseAudioManagerProps = {}) => {
    const [audioEnabled, setAudioEnabled] = useState<boolean>(initialEnabled);
    const [inputMode, setInputMode] = useState<'text' | 'audio'>('text');

    const audioContext = useRef<AudioContext | null>(null);
    const audioQueue = useRef<AudioBuffer[]>([]);
    const isPlayingAudio = useRef<boolean>(false);

    const initializeAudioContext = () => {
        try {
            if (audioContext.current) return;

            audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({
                sampleRate: 16000,
            });

            if (audioContext.current.state === 'suspended') {
                const resumeAudio = () => {
                    audioContext.current?.resume();
                    document.removeEventListener('click', resumeAudio);
                };
                document.addEventListener('click', resumeAudio);
            }

            console.log('Audio context initialized');
        } catch (error) {
            console.error('Failed to initialize AudioContext:', error);
            toast({
                title: "Audio Error",
                description: "Your browser may have limited audio support",
                variant: "destructive"
            });
        }
    };

    const toggleAudioOutput = () => {
        setAudioEnabled(!audioEnabled);

        toast({
            title: audioEnabled ? "Audio Muted" : "Audio Unmuted",
            description: audioEnabled ? "Response audio has been muted" : "Response audio has been enabled",
        });

        if (audioEnabled) {
            audioQueue.current = [];
            isPlayingAudio.current = false;
        }
    };

    const toggleInputMode = () => {
        const newMode = inputMode === 'text' ? 'audio' : 'text';
        setInputMode(newMode);

        toast({
            title: `Switched to ${newMode} mode`,
            description: newMode === 'text' ? "You can now type messages" : "You can now use voice input",
        });
    };

    const processAudioChunk = async (base64Audio: string): Promise<boolean> => {
        try {
            if (!audioEnabled || !audioContext.current) {
                return false;
            }

            const audioData = atob(base64Audio);
            const audioArray = new Uint8Array(audioData.length);
            for (let i = 0; i < audioData.length; i++) {
                audioArray[i] = audioData.charCodeAt(i);
            }

            const audioBuffer = await audioContext.current.decodeAudioData(audioArray.buffer);

            audioQueue.current.push(audioBuffer);

            if (!isPlayingAudio.current) {
                playNextAudioChunk();
            }

            return true;
        } catch (error) {
            console.error('Error processing audio chunk:', error);
            return false;
        }
    };

    const playNextAudioChunk = () => {
        if (audioQueue.current.length === 0) {
            isPlayingAudio.current = false;
            return;
        }

        isPlayingAudio.current = true;
        const audioBuffer = audioQueue.current.shift();

        if (!audioBuffer || !audioContext.current) {
            console.warn('Audio buffer or context not available');
            isPlayingAudio.current = false;
            return;
        }

        try {
            const source = audioContext.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.current.destination);

            source.onended = () => {
                playNextAudioChunk();
            };

            source.start();
        } catch (error) {
            console.error('Error playing audio chunk:', error);
            playNextAudioChunk();
        }
    };

    const playAudio = async (base64Audio: string): Promise<boolean> => {
        try {
            if (!audioEnabled) return false;

            const audioData = atob(base64Audio);
            const audioArray = new Uint8Array(audioData.length);
            for (let i = 0; i < audioData.length; i++) {
                audioArray[i] = audioData.charCodeAt(i);
            }
            const blob = new Blob([audioArray], { type: 'audio/mp3' });
            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);
            await audio.play();
            URL.revokeObjectURL(audioUrl);
            return true;
        } catch (error) {
            console.error('Error playing audio:', error);
            toast({
                title: "Error",
                description: "Failed to play audio response",
                variant: "destructive"
            });
            return false;
        }
    };

    useEffect(() => {
        initializeAudioContext();

        return () => {
            audioQueue.current = [];
            isPlayingAudio.current = false;
        };
    }, []);

    return {
        audioEnabled,
        inputMode,
        toggleAudioOutput,
        toggleInputMode,
        processAudioChunk,
        playAudio,
        initializeAudioContext
    };
};