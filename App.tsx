
import React, { useState, useCallback } from 'react';
import { enhancePrompt } from './services/geminiService';

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const App: React.FC = () => {
    const [userInput, setUserInput] = useState<string>('');
    const [enhancedPrompt, setEnhancedPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = useCallback(async () => {
        if (!userInput.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setEnhancedPrompt('');

        try {
            const result = await enhancePrompt(userInput);
            setEnhancedPrompt(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [userInput, isLoading]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-gray-200 font-sans">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Prompt <span className="text-indigo-400">Enhancer</span>
                    </h1>
                    <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
                        Transform your ideas into powerful, structured prompts for any AI.
                    </p>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Side: User Input */}
                    <div className="flex flex-col space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Your Raw Prompt</h2>
                        <div className="bg-white/5 p-4 rounded-xl shadow-lg ring-1 ring-white/10 flex-grow flex flex-col">
                            <textarea
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="e.g., write a story about a space cat"
                                className="w-full h-64 md:h-80 bg-transparent text-gray-200 placeholder-gray-500 border-none focus:ring-0 resize-none p-2 text-lg leading-relaxed"
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading || !userInput.trim()}
                            className="flex items-center justify-center w-full md:w-auto md:self-center px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
                        >
                            {isLoading ? (
                                <>
                                    <LoadingSpinner />
                                    Enhancing...
                                </>
                            ) : (
                                'Enhance Prompt'
                            )}
                        </button>
                    </div>

                    {/* Right Side: Enhanced Output */}
                    <div className="flex flex-col space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Enhanced Prompt</h2>
                        <div className="bg-white/5 p-6 rounded-xl shadow-lg ring-1 ring-white/10 flex-grow min-h-[300px] md:min-h-[400px]">
                            {isLoading && (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <LoadingSpinner />
                                    <p className="mt-2">Generating optimized prompt...</p>
                                </div>
                            )}
                            {error && (
                                <div className="text-red-400 h-full flex items-center justify-center">
                                    <p><strong>Error:</strong> {error}</p>
                                </div>
                            )}
                            {!isLoading && !error && !enhancedPrompt && (
                                <div className="text-gray-500 h-full flex items-center justify-center">
                                    <p>Your enhanced prompt will appear here...</p>
                                </div>
                            )}
                            {enhancedPrompt && (
                                <div className="text-gray-200 whitespace-pre-wrap font-mono text-sm md:text-base leading-relaxed overflow-y-auto h-full max-h-[calc(100vh-250px)]">
                                    {enhancedPrompt}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
                 <footer className="text-center mt-12 text-gray-500">
                    <p>Powered by Google Gemini</p>
                </footer>
            </div>
        </div>
    );
};

export default App;
