import React, { useEffect, useState } from 'react';
import { leaderboardService, LeaderboardEntry } from '../../services/leaderboard';
import { Trophy, User, Send, Loader2, AlertCircle } from 'lucide-react';

interface LeaderboardProps {
    currentScore?: number;
    gameMode?: string;
    onClose?: () => void;
    allowSubmission?: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ currentScore, gameMode, onClose, allowSubmission = true }) => {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [playerName, setPlayerName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        setLoading(true);
        const data = await leaderboardService.getTopScores(10);
        setEntries(data);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentScore || !playerName.trim()) return;

        setSubmitting(true);
        const success = await leaderboardService.submitScore(playerName, currentScore);
        setSubmitting(false);

        if (success) {
            setSubmitted(true);
            fetchLeaderboard(); // Refresh list
        } else {
            setError('Erro ao salvar pontuação. Tente novamente.');
        }
    };

    return (
        <div className="bg-black/80 backdrop-blur-md border border-green-500/30 rounded-xl p-6 w-full max-w-md shadow-[0_0_30px_rgba(34,197,94,0.2)]">
            <div className="flex items-center justify-center mb-6 text-green-400">
                <Trophy className="w-8 h-8 mr-3 text-yellow-400" />
                <h2 className="text-2xl font-black font-cyber tracking-wider">RANKING GLOBAL</h2>
            </div>

            {/* Score Submission Form - Only if score provided, allowed, and not submitted yet */}
            {allowSubmission && currentScore !== undefined && currentScore > 0 && !submitted && gameMode === 'ENDLESS' && (
                <div className="mb-8 p-4 bg-green-900/20 rounded-lg border border-green-500/20">
                    <h3 className="text-white font-bold mb-2 flex items-center">
                        <span className="text-cyan-400 mr-2">{Math.floor(currentScore).toLocaleString()}</span> METROS
                    </h3>
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Seu Nome de Capitão"
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
                                maxLength={10}
                                className="w-full bg-black/50 border border-gray-600 rounded-lg py-2 pl-9 pr-4 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 uppercase font-mono"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting || !playerName.trim()}
                            className="bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center"
                        >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> REGISTRAR</>}
                        </button>
                        {error && <p className="text-red-400 text-xs flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> {error}</p>}
                    </form>
                </div>
            )}

            {/* Success Message */}
            {submitted && (
                <div className="mb-6 text-center p-3 bg-green-500/20 rounded text-green-300 border border-green-500/50">
                    Pontuação registrada com sucesso!
                </div>
            )}

            {/* Leaderboard Table */}
            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                    </div>
                ) : entries.length === 0 ? (
                    <p className="text-gray-500 text-center py-4 text-sm">Seja o primeiro a entrar no ranking!</p>
                ) : (
                    entries.map((entry, index) => (
                        <div
                            key={index}
                            className={`flex items-center justify-between p-3 rounded ${entry.name === playerName ? 'bg-yellow-500/20 border border-yellow-500/50' : 'bg-gray-800/50'
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <span className={`font-mono font-bold w-6 text-center ${index === 0 ? 'text-yellow-400 text-xl' :
                                    index === 1 ? 'text-gray-300 text-lg' :
                                        index === 2 ? 'text-amber-600 text-lg' : 'text-gray-500'
                                    }`}>
                                    {index + 1}
                                </span>
                                <span className="font-bold text-white tracking-wide">{entry.name}</span>
                            </div>
                            <span className="font-mono text-cyan-400">{Math.floor(entry.score).toLocaleString()} M</span>
                        </div>
                    ))
                )}
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.3);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(34,197,94,0.5);
                    border-radius: 4px;
                }
            `}</style>
        </div>
    );
};
