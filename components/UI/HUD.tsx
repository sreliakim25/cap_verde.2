/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useEffect } from 'react';
import { Heart, Zap, Trophy, MapPin, Diamond, Rocket, ArrowUpCircle, Shield, Activity, PlusCircle, Play } from 'lucide-react';
import { useStore } from '../../store';
import { GameStatus, GEMINI_COLORS, ShopItem, RUN_SPEED_BASE } from '../../types';
import { audio } from '../System/Audio';

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

                <p className="text-green-300/80 text-sm md:text-lg font-mono text-center max-w-lg px-4 animate-pulse">
                    "{message}"
                </p>
            </div>
        </div>
    );
};

export const HUD: React.FC = () => {
    const { score, lives, maxLives, collectedLetters, status, level, restartGame, startGame, gemsCollected, distance, isImmortalityActive, speed } = useStore();
    const target = ['C', 'A', 'P', ' ', 'V', 'E', 'R', 'D', 'E'];

    // Common container style
    const containerClass = "absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-8 z-50";

    if (status === GameStatus.SHOP) {
        return <ShopScreen />;
    }

    if (status === GameStatus.MENU) {
        return (
            <div className="absolute inset-0 flex items-center justify-center z-[100] bg-black/80 backdrop-blur-sm p-4 pointer-events-auto">
                {/* Card Container */}
                <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,255,255,0.2)] border border-white/10 animate-in zoom-in-95 duration-500">

                    {/* Image Container - Auto height to fit full image without cropping */}
                    <div className="relative w-full bg-gray-900">
                        <img
                            src="/assets/capitao-verde-menu.jpg"
                            alt="Capitão Verde Run Cover"
                            className="w-full h-auto block"
                        />

                        {/* Gradient Overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050011] via-black/30 to-transparent"></div>

                        {/* Content positioned at the bottom of the card */}
                        <div className="absolute inset-0 flex flex-col justify-end items-center p-6 pb-8 text-center z-10">
                            <button
                                onClick={() => { audio.init(); startGame(); }}
                                className="w-full group relative px-6 py-4 bg-green-600/20 backdrop-blur-md border-2 border-green-500 text-white font-black text-xl rounded-xl hover:bg-green-600/40 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500/40 via-emerald-500/40 to-lime-500/40 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                <span className="relative z-10 tracking-widest flex items-center justify-center">
                                    INICIAR MISSÃO <Play className="ml-2 w-5 h-5 fill-white" />
                                </span>
                            </button>

                            <p className="text-green-400/70 text-[10px] md:text-xs font-mono mt-3 tracking-wider">
                                [ SETAS / SWIPE PARA MOVER ]
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (status === GameStatus.GAME_OVER) {
        return <GameOverScreen />;
    }

    if (status === GameStatus.VICTORY) {
        return (
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/90 to-black/95 z-[100] text-white pointer-events-auto backdrop-blur-md overflow-y-auto">
                <div className="flex flex-col items-center justify-center min-h-full py-8 px-4">
                    <Rocket className="w-16 h-16 md:w-24 md:h-24 text-yellow-400 mb-4 animate-bounce drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]" />
                    <h1 className="text-3xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-500 to-pink-500 mb-2 drop-shadow-[0_0_20px_rgba(255,165,0,0.6)] font-cyber text-center leading-tight">
                        MISSION COMPLETE
                    </h1>
                    <p className="text-cyan-300 text-sm md:text-2xl font-mono mb-8 tracking-widest text-center">
                        THE ANSWER TO THE UNIVERSE HAS BEEN FOUND
                    </p>

                    <div className="grid grid-cols-1 gap-4 text-center mb-8 w-full max-w-md">
                        <div className="bg-black/60 p-6 rounded-xl border border-yellow-500/30 shadow-[0_0_15px_rgba(255,215,0,0.1)]">
                            <div className="text-xs md:text-sm text-gray-400 mb-1 tracking-wider">FINAL SCORE</div>
                            <div className="text-3xl md:text-4xl font-bold font-cyber text-yellow-400">{score.toLocaleString()}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black/60 p-4 rounded-lg border border-white/10">
                                <div className="text-xs text-gray-400">GEMS</div>
                                <div className="text-xl md:text-2xl font-bold text-cyan-400">{gemsCollected}</div>
                            </div>
                            <div className="bg-black/60 p-4 rounded-lg border border-white/10">
                                <div className="text-xs text-gray-400">DISTÂNCIA</div>
                                <div className="text-xl md:text-2xl font-bold text-purple-400">{Math.floor(distance)} M</div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => { audio.init(); restartGame(); }}
                        className="px-8 md:px-12 py-4 md:py-5 bg-white text-black font-black text-lg md:text-xl rounded hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] tracking-widest"
                    >
                        RESTART MISSION
                    </button>
                </div>
            </div>
        );
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
