import React from 'react';
import { Shield, Leaf, Wind, ArrowRight, X } from 'lucide-react';

interface InstructionsProps {
    onClose: () => void;
}

export const Instructions: React.FC<InstructionsProps> = ({ onClose }) => {
    return (
        <div className="absolute inset-0 z-[150] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-gray-900 border border-green-500/50 rounded-2xl max-w-2xl w-full p-6 md:p-8 relative shadow-[0_0_50px_rgba(34,197,94,0.2)]">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-8 h-8" />
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-black font-cyber text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 tracking-wider mb-2">
                        BRIEFING DA MISSÃO
                    </h2>
                    <div className="h-1 w-32 bg-green-500 mx-auto rounded-full"></div>
                </div>

                <div className="space-y-6 text-gray-200">
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
                </div>

                <div className="mt-8 text-center">
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
