interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
}

declare class SpeechRecognition {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onstart: () => void;
    onend: () => void;
    onresult: (event: any) => void;
    onerror: (event: any) => void;
    start(): void;
    stop(): void;
}

declare class webkitSpeechRecognition {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onstart: () => void;
    onend: () => void;
    onresult: (event: any) => void;
    onerror: (event: any) => void;
    start(): void;
    stop(): void;
} 