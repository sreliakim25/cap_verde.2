import React from 'react';
import { Shield, Leaf, Wind, ArrowRight, X } from 'lucide-react';

interface InstructionsProps {
    onClose: () => void;
}

export const Instructions: React.FC<InstructionsProps> = ({ onClose }) => {
    return (
        <div className="absolute inset-0 z-[150] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-gray-900 border border-green-500/50 rounded-2xl max-w-2xl w-full p-6 md:p-8 relative shadow-[0_0_50px_rgba(34,197,94,0.2)] max-h-[90vh] flex flex-col">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 bg-black/50 p-1 rounded-full"
                >
                    <X className="w-8 h-8" />
                </button>

                <div className="text-center mb-6 shrink-0">
                    <h2 className="text-3xl md:text-4xl font-black font-cyber text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 tracking-wider mb-2">
                        BRIEFING DA MISSÃO
                    </h2>
                    <div className="h-1 w-32 bg-green-500 mx-auto rounded-full"></div>
                </div>

                <div className="space-y-6 text-gray-200 overflow-y-auto custom-scrollbar pr-2 pb-4">
                    <div className="flex items-start bg-green-900/20 p-4 rounded-xl border border-green-500/20">
                        <div className="bg-green-500/20 p-2 rounded-lg mr-4 mt-1">
                            <Leaf className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-green-300 text-lg mb-1">OBJETIVO PRINCIPAL</h3>
                            <p className="text-sm md:text-base leading-relaxed">
                                A cidade está cinza e poluída. Sua missão é restaurar a natureza!
                                Colete as letras <span className="text-green-400 font-bold font-mono">V-E-R-D-E</span> para ativar os portais de sustentabilidade e avançar de nível.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start bg-red-900/10 p-4 rounded-xl border border-red-500/20">
                        <div className="bg-red-500/20 p-2 rounded-lg mr-4 mt-1">
                            <Shield className="w-6 h-6 text-red-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-red-300 text-lg mb-1">PERIGOS</h3>
                            <p className="text-sm md:text-base leading-relaxed">
                                Evite os obstáculos de lixo e poluição. Se você colidir, perderá uma vida.
                                Colete <span className="text-cyan-400 font-bold">Gems</span> para pontuação extra!
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start bg-blue-900/10 p-4 rounded-xl border border-blue-500/20">
                        <div className="bg-blue-500/20 p-2 rounded-lg mr-4 mt-1">
                            <Wind className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-blue-300 text-lg mb-1">CONTROLES</h3>
                            <p className="text-sm md:text-base leading-relaxed font-mono text-gray-300">
                                [PC] Setas Esquerd/Direita para mover.<br />
                                [MOBILE] Deslize o dedo na tela.
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 text-center mb-6">
                        <h2 className="text-3xl md:text-4xl font-black font-cyber text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-600 tracking-wider mb-2">
                            REGRAS DA CORRIDA
                        </h2>
                        <div className="h-1 w-32 bg-teal-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="space-y-6 text-gray-200">
                        <div className="flex items-start bg-teal-900/20 p-4 rounded-xl border border-teal-500/20">
                            <div className="bg-teal-500/20 p-2 rounded-lg mr-4 mt-1">
                                <Leaf className="w-6 h-6 text-teal-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-teal-300 text-lg mb-1">SOBREVIVÊNCIA</h3>
                                <p className="text-sm md:text-base leading-relaxed">
                                    Neste modo, não há fim! A velocidade aumenta a cada 1.000 metros. Corra o mais longe que puder para liderar o Ranking Global.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start bg-purple-900/20 p-4 rounded-xl border border-purple-500/20">
                            <div className="bg-purple-500/20 p-2 rounded-lg mr-4 mt-1">
                                <Shield className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-purple-300 text-lg mb-1">PORTAL DE ITENS</h3>
                                <p className="text-sm md:text-base leading-relaxed">
                                    A cada 2.500 metros, um Portal Sustentável aparecerá. Passe por ele para comprar Vidas ou Imunidade com suas Gems coletadas. A pista também ficará mais larga para ajudar na alta velocidade!
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start bg-red-900/10 p-4 rounded-xl border border-red-500/20">
                            <div className="bg-red-500/20 p-2 rounded-lg mr-4 mt-1">
                                <Wind className="w-6 h-6 text-red-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-red-300 text-lg mb-1">ALIENÍGENAS</h3>
                                <p className="text-sm md:text-base leading-relaxed">
                                    Após 2.500 metros, os alienígenas começarão a invadir a pista. Desvie de seus veículos e obstáculos!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 shrink-0 text-center">
                    <button
                        onClick={onClose}
                        className="bg-green-600 hover:bg-green-500 text-white font-black py-3 px-8 rounded-xl shadow-lg hover:shadow-green-500/50 transition-all transform hover:scale-105 flex items-center mx-auto"
                    >
                        ENTENDIDO, CAPITÃO! <ArrowRight className="ml-2 w-5 h-5" />
                    </button>
                </div>

            </div>
        </div>
    );
};
