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

// Facebook SDK types
declare global {
    interface Window {
        FB: {
            init: (params: {
                appId: string;
                autoLogAppEvents: boolean;
                xfbml: boolean;
                version: string;
            }) => void;
            login: (
                callback: (response: any) => void,
                options: {
                    config_id: string;
                    response_type: string;
                    override_default_response_type: boolean;
                    extras: {
                        setup: {};
                        featureType: string;
                        sessionInfoVersion: string;
                    };
                }
            ) => void;
        };
        fbAsyncInit: () => void;
    }
}

export { }; 