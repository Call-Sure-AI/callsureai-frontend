import React from 'react';

const ConnectionDiagram = () => {
    const tags = [
        "SimplifySales",
        "BoostProductivity",
        "RelationshipManagement",
        "CustomerSuccess",
        "GrowWithEase",
    ];

    return (
        <div className="relative w-full max-w-[1200px] mx-auto min-h-[160px] px-4 sm:px-8 md:px-16 py-20 sm:py-16">
            <div className="md:hidden flex flex-col items-center gap-8">
                <div className="flex justify-center gap-4">
                    <div className="w-10 h-10 sm:w-[52px] sm:h-[52px] rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-md">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#22C55E] rounded-full" />
                    </div>
                    <div className="w-10 h-10 sm:w-[52px] sm:h-[52px] rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-md">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#3B82F6] rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 bg-blue-200 rounded-full" />
                        </div>
                    </div>
                    <div className="w-10 h-10 sm:w-[52px] sm:h-[52px] rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-md">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#F97316] rounded-full" />
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full">
                    <div className="w-5 h-5 bg-[#1E3A8A] rounded-full flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" className="text-white">
                            <path fill="currentColor" d="M12 5V19M5 12H19" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <span className="text-blue-600 text-sm font-medium">Collab</span>
                </div>
                <div className="bg-white/40 backdrop-blur-sm px-4 sm:px-8 py-4 rounded-2xl w-full sm:w-auto">
                    <div className="flex flex-wrap justify-center gap-2">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-blue-600/90 text-xs sm:text-sm font-medium bg-white/80 px-3 sm:px-4 py-1.5 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full">
                    <div className="w-5 h-5 bg-[#1E3A8A] rounded-full flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" className="text-white">
                            <path fill="currentColor" d="M12 5V19M5 12H19" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <span className="text-blue-600 text-sm font-medium">Connect</span>
                </div>
                <div className="flex justify-center gap-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="w-10 h-10 sm:w-[52px] sm:h-[52px] rounded-full shadow-md border-2 border-white overflow-hidden"
                            style={{
                                background: i === 1 ? 'linear-gradient(to bottom right, #FED7AA, #FDBA74)' :
                                    i === 2 ? 'linear-gradient(to bottom right, #E9D5FF, #D8B4FE)' :
                                        'linear-gradient(to bottom right, #BFDBFE, #93C5FD)'
                            }}
                        >
                            <img src={`/api/placeholder/52/52`} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>
            <div className="hidden md:block relative h-[160px]">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-5">
                    <div className="w-[52px] h-[52px] rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-md">
                        <div className="w-7 h-7 bg-[#22C55E] rounded-full" />
                    </div>
                    <div className="w-[52px] h-[52px] rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-md">
                        <div className="w-7 h-7 bg-[#3B82F6] rounded-full flex items-center justify-center">
                            <div className="w-3.5 h-3.5 bg-blue-200 rounded-full" />
                        </div>
                    </div>
                    <div className="w-[52px] h-[52px] rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-md">
                        <div className="w-6 h-6 bg-[#F97316] rounded-full" />
                    </div>
                </div>
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 160" preserveAspectRatio="none">
                    <path d="M 52,40 C 100,40 150,80 250,80" stroke="#E2E8F0" strokeWidth="1.5" fill="none" />
                    <path d="M 52,80 C 100,80 150,80 250,80" stroke="#E2E8F0" strokeWidth="1.5" fill="none" />
                    <path d="M 52,120 C 100,120 150,80 250,80" stroke="#E2E8F0" strokeWidth="1.5" fill="none" />
                    <path d="M 950,80 C 1050,80 1100,40 1148,40" stroke="#E2E8F0" strokeWidth="1.5" fill="none" />
                    <path d="M 950,80 C 1050,80 1100,80 1148,80" stroke="#E2E8F0" strokeWidth="1.5" fill="none" />
                    <path d="M 950,80 C 1050,80 1100,120 1148,120" stroke="#E2E8F0" strokeWidth="1.5" fill="none" />
                </svg>
                <div className="absolute z-10 left-[200px] top-1/2 -translate-y-1/2">
                    <div className="flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full">
                        <div className="w-5 h-5 bg-[#1E3A8A] rounded-full flex items-center justify-center">
                            <svg width="14" height="14" viewBox="0 0 24 24" className="text-white">
                                <path fill="currentColor" d="M12 5V19M5 12H19" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <span className="text-blue-600 text-sm font-medium">Collab</span>
                    </div>
                </div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/40 backdrop-blur-sm px-8 py-4 rounded-2xl">
                    <div className="flex flex-wrap justify-center gap-2">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-blue-600/90 text-sm font-medium bg-white/80 px-4 py-1.5 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="absolute right-[200px] top-1/2 -translate-y-1/2">
                    <div className="flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full">
                        <div className="w-5 h-5 bg-[#1E3A8A] rounded-full flex items-center justify-center">
                            <svg width="14" height="14" viewBox="0 0 24 24" className="text-white">
                                <path fill="currentColor" d="M12 5V19M5 12H19" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <span className="text-blue-600 text-sm font-medium">Connect</span>
                    </div>
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-5">
                    <div className="w-[52px] h-[52px] rounded-full bg-gradient-to-br from-orange-200 to-orange-300 shadow-md border-2 border-white overflow-hidden">
                        <img src="/api/placeholder/52/52" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-[52px] h-[52px] rounded-full bg-gradient-to-br from-purple-300 to-purple-400 shadow-md border-2 border-white overflow-hidden">
                        <img src="/api/placeholder/52/52" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-[52px] h-[52px] rounded-full bg-gradient-to-br from-blue-200 to-blue-300 shadow-md border-2 border-white overflow-hidden">
                        <img src="/api/placeholder/52/52" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConnectionDiagram;