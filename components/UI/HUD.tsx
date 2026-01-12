/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useEffect, useMemo } from 'react';
import { Heart, Zap, Trophy, MapPin, Diamond, Rocket, ArrowUpCircle, Shield, Activity, PlusCircle, Play, Leaf, RefreshCw } from 'lucide-react';
import { useStore } from '../../store';
import { GameStatus, GEMINI_COLORS, ShopItem, RUN_SPEED_BASE } from '../../types';
import { audio } from '../System/Audio';
import { Leaderboard } from './Leaderboard';

// Available Shop Items
const SHOP_ITEMS: ShopItem[] = [
    {
        id: 'DOUBLE_JUMP',
        name: 'PULO DUPLO',
        description: 'Pule novamente no ar. Essencial para obstáculos altos.',
        cost: 1000,
        icon: ArrowUpCircle,
        oneTime: true
    },
    {
        id: 'MAX_LIFE',
        name: 'VIDA MÁXIMA',
        description: 'Adiciona um coração extra e cura você.',
        cost: 1500,
        icon: Activity
    },
    {
        id: 'HEAL',
        name: 'KIT DE REPARO',
        description: 'Restaura 1 ponto de vida instantaneamente.',
        cost: 1000,
        icon: PlusCircle
    },
    {
        id: 'IMMORTAL',
        name: 'IMORTALIDADE',
        description: 'Habilidade: Espaço/Toque para invencibilidade por 5s.',
        cost: 3000,
        icon: Shield,
        oneTime: true
    }
];

const ShopScreen: React.FC = () => {
    const { score, buyItem, closeShop, hasDoubleJump, hasImmortality } = useStore();
    const [items, setItems] = useState<ShopItem[]>([]);

    useEffect(() => {
        // Select 3 random items, filtering out one-time items already bought
        let pool = SHOP_ITEMS.filter(item => {
            if (item.id === 'DOUBLE_JUMP' && hasDoubleJump) return false;
            if (item.id === 'IMMORTAL' && hasImmortality) return false;
            return true;
        });

        // Shuffle and pick 3
        pool = pool.sort(() => 0.5 - Math.random());
        setItems(pool.slice(0, 3));
    }, []);

    return (
        <div className="absolute inset-0 z-[100] text-white pointer-events-auto overflow-y-auto bg-cover bg-center" style={{ backgroundImage: 'url(/captain-bg.png)' }}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
            <div className="relative flex flex-col items-center justify-center min-h-full py-8 px-4 z-10">
                <h2 className="text-3xl md:text-4xl font-black text-green-500 mb-2 font-cyber tracking-widest text-center shadow-green-500/50 drop-shadow-lg">LOJA SUSTENTÁVEL</h2>
                <div className="flex items-center text-yellow-400 mb-6 md:mb-8">
                    <span className="text-base md:text-lg mr-2">CRÉDITOS DISPONÍVEIS:</span>
                    <span className="text-xl md:text-2xl font-bold">{score.toLocaleString()}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl w-full mb-8">
                    {items.map(item => {
                        const Icon = item.icon;
                        const canAfford = score >= item.cost;
                        return (
                            <div key={item.id} className="bg-gray-900/80 border border-gray-700 p-4 md:p-6 rounded-xl flex flex-col items-center text-center hover:border-green-500 transition-colors group">
                                <div className="bg-gray-800 p-3 md:p-4 rounded-full mb-3 md:mb-4 group-hover:bg-green-900/30 transition-colors">
                                    <Icon className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold mb-2">{item.name}</h3>
                                <p className="text-gray-400 text-xs md:text-sm mb-4 h-10 md:h-12 flex items-center justify-center">{item.description}</p>
                                <button
                                    onClick={() => buyItem(item.id as any, item.cost)}
                                    disabled={!canAfford}
                                    className={`px-4 md:px-6 py-2 rounded font-bold w-full text-sm md:text-base ${canAfford ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:brightness-110 shadow-lg shadow-green-900/20' : 'bg-gray-700 cursor-not-allowed opacity-50'}`}
                                >
                                    {item.cost} GEMAS
                                </button>
                            </div>
                        );
                    })}
                </div>

                <button
                    onClick={closeShop}
                    className="flex items-center px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg md:text-xl rounded hover:scale-105 transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                >
                    RETOMAR MISSÃO <Play className="ml-2 w-5 h-5" fill="white" />
                </button>
            </div>
        </div>
    );
};

const GameOverScreen: React.FC = () => {
    const { score, level, gemsCollected, distance, restartGame } = useStore();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const messages = [
            "Dessa vez a poluição venceu. Tente novamente.",
            "O futuro é verde! Persista na missão.",
            "Cada ação conta. Não deixe o lixo vencer!"
        ];
        setMessage(messages[Math.floor(Math.random() * messages.length)]);
    }, []);

    return (
        <div className="absolute inset-0 z-[100] text-white pointer-events-auto overflow-y-auto bg-cover bg-center" style={{ backgroundImage: 'url(/game-over-bg.png)' }}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
            <div className="relative flex flex-col items-center justify-center min-h-full py-8 px-4 z-10">
                <h1 className="text-4xl md:text-6xl font-black text-green-500 mb-6 drop-shadow-[0_0_10px_rgba(0,255,0,0.8)] font-cyber text-center">FIM DE JOGO</h1>

                <div className="grid grid-cols-1 gap-3 md:gap-4 text-center mb-8 w-full max-w-md">
                    <div className="bg-gray-900/80 p-3 md:p-4 rounded-lg border border-green-700/50 flex items-center justify-between shadow-lg shadow-green-900/20">
                        <div className="flex items-center text-green-400 text-sm md:text-base"><Trophy className="mr-2 w-4 h-4 md:w-5 md:h-5" /> NÍVEL</div>
                        <div className="text-xl md:text-2xl font-bold font-mono text-white">{level} / 3</div>
                    </div>
                    <div className="bg-gray-900/80 p-3 md:p-4 rounded-lg border border-green-700/50 flex items-center justify-between shadow-lg shadow-green-900/20">
                        <div className="flex items-center text-emerald-400 text-sm md:text-base"><Diamond className="mr-2 w-4 h-4 md:w-5 md:h-5" /> GEMAS COLETADAS</div>
                        <div className="text-xl md:text-2xl font-bold font-mono text-white">{gemsCollected}</div>
                    </div>
                    <div className="bg-gray-900/80 p-3 md:p-4 rounded-lg border border-green-700/50 flex items-center justify-between shadow-lg shadow-green-900/20">
                        <div className="flex items-center text-lime-400 text-sm md:text-base"><MapPin className="mr-2 w-4 h-4 md:w-5 md:h-5" /> DISTÂNCIA</div>
                        <div className="text-xl md:text-2xl font-bold font-mono text-white">{Math.floor(distance)} M</div>
                    </div>
                    <div className="bg-green-900/40 p-3 md:p-4 rounded-lg flex items-center justify-between mt-2 border border-green-500/30">
                        <div className="flex items-center text-white text-sm md:text-base">PONTUAÇÃO TOTAL</div>
                        <div className="text-2xl md:text-3xl font-bold font-cyber text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">{score.toLocaleString()}</div>
                    </div>
                </div>

                <button
                    onClick={() => { audio.init(); restartGame(); }}
                    className="px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg md:text-xl rounded hover:scale-105 transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)] mb-8"
                >
                    TENTAR NOVAMENTE
                </button>

                <p className="text-green-300/80 text-sm md:text-lg font-mono text-center max-w-lg px-4 animate-pulse mb-6">
                    "{message}"
                </p>

                {/* Leaderboard Section */}
                <div className="w-full max-w-md">
                    <Leaderboard currentScore={score} allowSubmission={false} />
                </div>
            </div>
        </div>
    );
};

const VictoryScreen: React.FC = () => {
    const { score, level, gemsCollected, distance, restartGame } = useStore();

    const quotes = [
        "A sustentabilidade é o caminho para o nosso futuro.",
        "Pequenas ações, grande impacto. Mantenha o verde!",
        "A Terra agradece pelo seu serviço, Capitão!",
        "A natureza não é um lugar para visitar. É o nosso lar."
    ];

    // Use useMemo here correctly at the top level of the component
    const randomQuote = useMemo(() => quotes[Math.floor(Math.random() * quotes.length)], []);

    return (
        <div className="absolute inset-0 z-[100] bg-slate-900 bg-cover bg-center flex flex-col items-center justify-end pb-16 p-4 pointer-events-auto" style={{ backgroundImage: 'url(/victory_background.png)' }}>
            {/* Dark overlay for contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

            <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-4 mb-8">
                <Leaf className="w-16 h-16 md:w-20 md:h-20 text-green-400 mb-2 animate-bounce drop-shadow-[0_0_15px_rgba(74,222,128,0.6)]" />

                <h1 className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 mb-2 drop-shadow-[0_0_20px_rgba(34,197,94,0.6)] font-cyber text-center leading-tight">
                    MISSÃO CUMPRIDA
                </h1>

                <p className="text-green-200 text-sm md:text-xl font-mono mb-8 tracking-widest text-center italic max-w-2xl bg-black/40 p-2 rounded">
                    "{randomQuote}"
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
                    <div className="flex flex-col items-center">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-8 w-full max-w-2xl">
                            <div className="bg-black/60 p-6 rounded-xl border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)] backdrop-blur-sm md:col-span-3">
                                <div className="text-xs md:text-sm text-green-400/70 mb-1 tracking-wider uppercase">Pontuação Final</div>
                                <div className="text-4xl md:text-6xl font-bold font-cyber text-white drop-shadow-md">{score.toLocaleString()}</div>
                            </div>

                            <div className="bg-black/60 p-4 rounded-lg border border-white/10 backdrop-blur-sm">
                                <div className="text-xs text-green-400/70 uppercase">Gems</div>
                                <div className="text-xl md:text-3xl font-bold text-cyan-400">{gemsCollected}</div>
                            </div>
                            <div className="bg-black/60 p-4 rounded-lg border border-white/10 backdrop-blur-sm">
                                <div className="text-xs text-green-400/70 uppercase">Distância</div>
                                <div className="text-xl md:text-3xl font-bold text-purple-400">{Math.floor(distance)} M</div>
                            </div>
                            <div className="bg-black/60 p-4 rounded-lg border border-white/10 backdrop-blur-sm">
                                <div className="text-xs text-green-400/70 uppercase">Nível</div>
                                <div className="text-xl md:text-3xl font-bold text-yellow-400">{level}</div>
                            </div>
                        </div>

                        <button
                            onClick={() => { audio.init(); restartGame(); }}
                            className="group relative px-8 md:px-12 py-4 md:py-5 bg-green-600 hover:bg-green-500 text-white font-black text-lg md:text-xl rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(34,197,94,0.4)] tracking-widest overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <span className="relative z-10 flex items-center">
                                REINICIAR MISSÃO <RefreshCw className="ml-2 w-5 h-5" />
                            </span>
                        </button>
                    </div>

                    {/* Leaderboard Column */}
                    <div className="flex flex-col items-center justify-start w-full">
                        <Leaderboard currentScore={score} allowSubmission={true} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const HUD: React.FC = () => {
    const { score, lives, maxLives, collectedLetters, status, level, restartGame, startGame, gemsCollected, distance, isImmortalityActive, speed, setStatus } = useStore();
    const target = ['V', 'E', 'R', 'D', 'E'];

    // Common container style
    const containerClass = "absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-8 z-50";

    if (status === GameStatus.SHOP) {
        return <ShopScreen />;
    }

    if (status === GameStatus.MENU) {
        return (
            <div className="absolute inset-0 z-[100] bg-black bg-cover bg-center bg-no-repeat flex flex-col items-center justify-end pb-8 md:pb-16 p-4 pointer-events-auto overflow-hidden" style={{ backgroundImage: 'url(/menu_background_clean.png)' }}>
                {/* Dark overlay for contrast - lighter at top to show captain */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                {/* Card Container - Simplified and moved down */}
                <div className="relative w-full max-w-sm bg-black/60 backdrop-blur-md rounded-2xl border border-green-500/30 p-6 shadow-[0_0_50px_rgba(0,255,100,0.3)] animate-in slide-in-from-bottom-10 duration-700 flex flex-col items-center mb-8">

                    <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-8 font-cyber text-center leading-tight drop-shadow-sm">
                        CAPITÃO VERDE<br /><span className="text-white text-2xl md:text-3xl tracking-[0.2em]">RUN</span>
                    </h1>

                    <button
                        onClick={() => { audio.init(); startGame(); }}
                        className="w-full group relative px-6 py-4 bg-green-600 hover:bg-green-500 text-white font-black text-xl rounded-xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.8)] hover:scale-105 active:scale-95"
                    >
                        <span className="relative z-10 tracking-widest flex items-center justify-center">
                            INICIAR MISSÃO <Play className="ml-2 w-5 h-5 fill-white" />
                        </span>
                    </button>

                    <p className="text-green-400/70 text-[10px] md:text-xs font-mono mt-6 tracking-wider text-center">
                        [ SETAS / SWIPE PARA MOVER ]
                    </p>


                </div>
            </div>
        );
    }

    if (status === GameStatus.GAME_OVER) {
        return <GameOverScreen />;
    }

    if (status === GameStatus.VICTORY) {
        return <VictoryScreen />;
    }

    return (
        <div className={containerClass}>
            {/* Top Bar */}
            <div className="flex justify-between items-start w-full">
                <div className="flex flex-col">
                    <div className="text-3xl md:text-5xl font-bold text-cyan-400 drop-shadow-[0_0_10px_#00ffff] font-cyber">
                        {score.toLocaleString()}
                    </div>
                </div>

                <div className="flex space-x-1 md:space-x-2">
                    {[...Array(maxLives)].map((_, i) => (
                        <Heart
                            key={i}
                            className={`w-6 h-6 md:w-8 md:h-8 ${i < lives ? 'text-pink-500 fill-pink-500' : 'text-gray-800 fill-gray-800'} drop-shadow-[0_0_5px_#ff0054]`}
                        />
                    ))}
                </div>
            </div>

            {/* Level Indicator - Moved to Top Center aligned with Score/Hearts */}
            <div className="absolute top-5 left-1/2 transform -translate-x-1/2 text-sm md:text-lg text-purple-300 font-bold tracking-wider font-mono bg-black/50 px-3 py-1 rounded-full border border-purple-500/30 backdrop-blur-sm z-50">
                LEVEL {level} <span className="text-gray-500 text-xs md:text-sm">/ 3</span>
            </div>

            {/* Active Skill Indicator */}
            {isImmortalityActive && (
                <div className="absolute top-24 left-1/2 transform -translate-x-1/2 text-yellow-400 font-bold text-xl md:text-2xl animate-pulse flex items-center drop-shadow-[0_0_10px_gold]">
                    <Shield className="mr-2 fill-yellow-400" /> IMMORTAL
                </div>
            )}

            {/* Capitão Verde Collection Status - Just below Top Bar */}
            <div className="absolute top-16 md:top-24 left-1/2 transform -translate-x-1/2 flex space-x-1 md:space-x-1.5">
                {target.map((char, idx) => {
                    const isCollected = collectedLetters.includes(idx);
                    const isSpace = char === ' ';
                    const color = GEMINI_COLORS[idx % GEMINI_COLORS.length];

                    if (isSpace) return <div key={idx} className="w-2 md:w-3" />;

                    return (
                        <div
                            key={idx}
                            style={{
                                borderColor: isCollected ? color : 'rgba(55, 65, 81, 0.5)',
                                color: isCollected ? 'rgba(0, 0, 0, 0.9)' : 'rgba(55, 65, 81, 0.5)',
                                boxShadow: isCollected ? `0 0 15px ${color}` : 'none',
                                backgroundColor: isCollected ? color : 'rgba(0, 0, 0, 0.4)'
                            }}
                            className={`w-6 h-8 md:w-8 md:h-10 flex items-center justify-center border-2 font-black text-sm md:text-base font-cyber rounded-md transform transition-all duration-300`}
                        >
                            {char}
                        </div>
                    );
                })}
            </div>

            {/* Bottom Overlay */}
            <div className="w-full flex justify-end items-end">
                <div className="flex items-center space-x-2 text-cyan-500 opacity-70">
                    <Zap className="w-4 h-4 md:w-6 md:h-6 animate-pulse" />
                    <span className="font-mono text-base md:text-xl">SPEED {Math.round((speed / RUN_SPEED_BASE) * 100)}%</span>
                </div>


            </div>
        </div>
    );
};
