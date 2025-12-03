
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useEffect, useRef } from 'react';
import { Heart, Zap, Trophy, MapPin, Hexagon, Rocket, ArrowUpCircle, Shield, Activity, PlusCircle, Play, Server, Cpu } from 'lucide-react';
import { useStore } from '../../store';
import { GameStatus, THEME_COLORS, COLORS, ShopItem, RUN_SPEED_BASE } from '../../types';
import { audio } from '../System/Audio';

// Available Shop Items
const SHOP_ITEMS: ShopItem[] = [
    {
        id: 'DOUBLE_JUMP',
        name: 'MULTI-THREADING',
        description: 'Enables double jump. Execute parallel movements.',
        cost: 1000,
        icon: ArrowUpCircle,
        oneTime: true,
        color: COLORS.gold
    },
    {
        id: 'MAX_LIFE',
        name: 'REDUNDANCY',
        description: 'Adds a permanent health node and repairs damage.',
        cost: 1500,
        icon: Activity,
        color: COLORS.danger
    },
    {
        id: 'HEAL',
        name: 'DEBUG PROTOCOL',
        description: 'Restores 1 Health Node instantly.',
        cost: 1000,
        icon: PlusCircle,
        color: COLORS.teal
    },
    {
        id: 'IMMORTAL',
        name: 'FIREWALL',
        description: 'Unlock Ability: Press Space for 5s invulnerability.',
        cost: 3000,
        icon: Shield,
        oneTime: true,
        color: COLORS.accent
    }
];

const ShopScreen: React.FC = () => {
    const { score, buyItem, closeShop, hasDoubleJump, hasImmortality } = useStore();
    const [items, setItems] = useState<ShopItem[]>([]);

    useEffect(() => {
        let pool = SHOP_ITEMS.filter(item => {
            if (item.id === 'DOUBLE_JUMP' && hasDoubleJump) return false;
            if (item.id === 'IMMORTAL' && hasImmortality) return false;
            return true;
        });

        pool = pool.sort(() => 0.5 - Math.random());
        setItems(pool.slice(0, 3));
    }, []);

    return (
        <div className="absolute inset-0 bg-[#200b01]/95 z-[100] text-[#e7cbc5] pointer-events-auto backdrop-blur-md overflow-y-auto">
             <div className="flex flex-col items-center justify-center min-h-full py-8 px-4">
                 <h2 className="text-3xl md:text-5xl font-black text-[#e7cbc5] mb-2 font-cyber tracking-widest text-center">NETWORK UPGRADE</h2>
                 <div className="flex items-center text-[#553e36] mb-6 md:mb-8">
                     <span className="text-base md:text-lg mr-2 font-mono">AVAILABLE COMPUTE:</span>
                     <span className="text-xl md:text-2xl font-bold" style={{color: COLORS.gold}}>{score.toLocaleString()}</span>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl w-full mb-8">
                     {items.map(item => {
                         const Icon = item.icon;
                         const canAfford = score >= item.cost;
                         const itemColor = item.color || COLORS.text;

                         return (
                             <div key={item.id} className="bg-[#1a0901]/80 border border-[#553e36] p-4 md:p-6 rounded-xl flex flex-col items-center text-center hover:border-opacity-100 transition-all shadow-lg"
                                style={{ borderColor: canAfford ? itemColor : '#553e36' }}
                             >
                                 <div className="bg-[#553e36]/30 p-3 md:p-4 rounded-full mb-3 md:mb-4">
                                     <Icon className="w-6 h-6 md:w-8 md:h-8" style={{ color: itemColor }} />
                                 </div>
                                 <h3 className="text-lg md:text-xl font-bold mb-2 font-cyber" style={{ color: itemColor }}>{item.name}</h3>
                                 <p className="text-[#cfb0aa] text-xs md:text-sm mb-4 h-10 md:h-12 flex items-center justify-center font-mono">{item.description}</p>
                                 <button 
                                    onClick={() => buyItem(item.id as any, item.cost)}
                                    disabled={!canAfford}
                                    className={`px-4 md:px-6 py-2 rounded font-bold w-full text-sm md:text-base transition-all font-mono`}
                                    style={{
                                        backgroundColor: canAfford ? itemColor : 'rgba(85, 62, 54, 0.5)',
                                        color: canAfford ? '#200b01' : '#999',
                                        cursor: canAfford ? 'pointer' : 'not-allowed'
                                    }}
                                 >
                                     {item.cost} TOKENS
                                 </button>
                             </div>
                         );
                     })}
                 </div>

                 <button 
                    onClick={closeShop}
                    className="flex items-center px-8 md:px-10 py-3 md:py-4 font-bold text-lg md:text-xl rounded hover:scale-105 transition-all shadow-[0_0_20px_rgba(231,203,197,0.4)] font-cyber"
                    style={{ backgroundColor: COLORS.text, color: COLORS.background }}
                 >
                     RESUME COMPUTATION <Play className="ml-2 w-5 h-5" fill={COLORS.background} />
                 </button>
             </div>
        </div>
    );
};

// Interactive Menu with Parallax
const InteractiveMenu: React.FC = () => {
    const { startGame } = useStore();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = (e.clientY / window.innerHeight) * 2 - 1;
            setMousePos({ x, y });
        };
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, []);

    // Calculate transforms
    const rotX = -mousePos.y * 10;
    const rotY = mousePos.x * 10;
    
    return (
        <div className="absolute inset-0 flex items-center justify-center z-[100] bg-[#200b01]/70 backdrop-blur-[2px] p-4 pointer-events-auto overflow-hidden">
             {/* Background Ambience */}
             <div className="absolute inset-0 pointer-events-none">
                 <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-[120px] opacity-10 animate-pulse" style={{backgroundColor: COLORS.teal}}></div>
                 <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-[100px] opacity-20" style={{backgroundColor: COLORS.gold}}></div>
             </div>

             <div 
                ref={cardRef}
                style={{
                    transform: `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
                    transition: 'transform 0.1s ease-out'
                }}
                className="relative w-full max-w-md bg-[#1a0901] rounded-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] border border-[#553e36] animate-in zoom-in-95 duration-700"
            >
                {/* Decorative border glow */}
                <div className="absolute inset-0 rounded-3xl border-2 border-[#e7cbc5]/20 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center justify-center p-12">
                     <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-tr from-[#553e36] to-[#200b01] border border-[#e7cbc5]/30 flex items-center justify-center shadow-[0_0_30px_rgba(231,203,197,0.2)]">
                        <Cpu className="w-10 h-10 text-[#e7cbc5]" />
                     </div>
                     <h1 className="text-5xl font-black text-[#e7cbc5] font-cyber tracking-tighter mb-2 drop-shadow-md">GENSYN</h1>
                     <h2 className="text-xl font-mono text-[#cfb0aa] tracking-[0.5em] mb-10 opacity-80">RUNNER</h2>
                     
                     <button 
                      onClick={() => { audio.init(); startGame(); }}
                      className="group relative w-64 px-6 py-4 bg-[#e7cbc5] hover:bg-white text-[#200b01] font-black text-lg rounded-xl transition-all shadow-[0_0_20px_rgba(231,203,197,0.3)] hover:scale-105 hover:shadow-[0_0_30px_rgba(231,203,197,0.6)] flex items-center justify-center overflow-hidden"
                    >
                        <span className="relative z-10 font-cyber tracking-widest flex items-center group-hover:tracking-[0.2em] transition-all">
                            START NODE <Play className="ml-2 w-4 h-4 fill-[#200b01]" />
                        </span>
                        {/* Button sheen */}
                        <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 transform skew-x-12"></div>
                    </button>
                    
                    <div className="mt-8 text-[#553e36] text-xs font-mono tracking-widest opacity-60">
                        SYSTEM READY // WAITING FOR INPUT
                    </div>
                </div>
            </div>
        </div>
    );
};

export const HUD: React.FC = () => {
  const { score, lives, maxLives, collectedLetters, status, level, restartGame, gemsCollected, distance, isImmortalityActive, speed } = useStore();
  const target = ['G', 'E', 'N', 'S', 'Y', 'N'];

  const containerClass = "absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-8 z-50";

  if (status === GameStatus.SHOP) {
      return <ShopScreen />;
  }

  if (status === GameStatus.MENU) {
      return <InteractiveMenu />;
  }

  if (status === GameStatus.GAME_OVER) {
      return (
          <div className="absolute inset-0 bg-[#200b01]/95 z-[100] text-[#e7cbc5] pointer-events-auto backdrop-blur-sm overflow-y-auto">
              <div className="flex flex-col items-center justify-center min-h-full py-8 px-4">
                <h1 className="text-4xl md:text-6xl font-black mb-6 drop-shadow-[0_0_15px_rgba(85,62,54,0.5)] font-cyber text-center" style={{color: COLORS.danger}}>SYSTEM FAILURE</h1>
                
                <div className="grid grid-cols-1 gap-3 md:gap-4 text-center mb-8 w-full max-w-md">
                    <div className="bg-[#1a0901] p-3 md:p-4 rounded border border-[#553e36] flex items-center justify-between">
                        <div className="flex items-center text-[#cfb0aa] text-sm md:text-base font-mono"><Server className="mr-2 w-4 h-4 md:w-5 md:h-5"/> LAYER</div>
                        <div className="text-xl md:text-2xl font-bold font-mono">{level} / 3</div>
                    </div>
                    <div className="bg-[#1a0901] p-3 md:p-4 rounded border border-[#553e36] flex items-center justify-between">
                        <div className="flex items-center text-[#e7cbc5] text-sm md:text-base font-mono"><Hexagon className="mr-2 w-4 h-4 md:w-5 md:h-5"/> TOKENS</div>
                        <div className="text-xl md:text-2xl font-bold font-mono" style={{color: COLORS.gold}}>{gemsCollected}</div>
                    </div>
                    <div className="bg-[#1a0901] p-3 md:p-4 rounded border border-[#553e36] flex items-center justify-between">
                        <div className="flex items-center text-[#cfb0aa] text-sm md:text-base font-mono"><Activity className="mr-2 w-4 h-4 md:w-5 md:h-5"/> HASHES</div>
                        <div className="text-xl md:text-2xl font-bold font-mono">{Math.floor(distance)}</div>
                    </div>
                     <div className="bg-[#553e36]/30 p-3 md:p-4 rounded flex items-center justify-between mt-2 border border-[#e7cbc5]/20">
                        <div className="flex items-center text-[#e7cbc5] text-sm md:text-base font-cyber">COMPUTE YIELD</div>
                        <div className="text-2xl md:text-3xl font-bold font-mono text-white">{score.toLocaleString()}</div>
                    </div>
                </div>

                <button 
                  onClick={() => { audio.init(); restartGame(); }}
                  className="px-8 md:px-10 py-3 md:py-4 bg-[#e7cbc5] text-[#200b01] font-bold text-lg md:text-xl rounded hover:scale-105 transition-all shadow-[0_0_20px_rgba(231,203,197,0.4)] font-cyber"
                >
                    REBOOT SYSTEM
                </button>
              </div>
          </div>
      );
  }

  if (status === GameStatus.VICTORY) {
    return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#200b01] to-black z-[100] text-[#e7cbc5] pointer-events-auto backdrop-blur-md overflow-y-auto">
            <div className="flex flex-col items-center justify-center min-h-full py-8 px-4">
                <Rocket className="w-16 h-16 md:w-24 md:h-24 mb-4 animate-bounce drop-shadow-[0_0_15px_#e7cbc5]" style={{color: COLORS.gold}} />
                <h1 className="text-3xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#e7cbc5] via-[#cfb0aa] to-[#553e36] mb-2 font-cyber text-center leading-tight">
                    NETWORK SYNCHRONIZED
                </h1>
                <p className="text-[#cfb0aa] text-sm md:text-xl font-mono mb-8 tracking-widest text-center">
                    GLOBAL COMPUTE OPTIMIZED
                </p>
                
                <div className="grid grid-cols-1 gap-4 text-center mb-8 w-full max-w-md">
                    <div className="bg-[#e7cbc5]/10 p-6 rounded-xl border border-[#e7cbc5]/30 shadow-[0_0_15px_rgba(231,203,197,0.1)]">
                        <div className="text-xs md:text-sm text-[#cfb0aa] mb-1 tracking-wider font-mono">FINAL YIELD</div>
                        <div className="text-3xl md:text-4xl font-bold font-mono text-white">{score.toLocaleString()}</div>
                    </div>
                </div>

                <button 
                  onClick={() => { audio.init(); restartGame(); }}
                  className="px-8 md:px-12 py-4 md:py-5 bg-[#e7cbc5] text-[#200b01] font-black text-lg md:text-xl rounded hover:scale-105 transition-all shadow-[0_0_40px_rgba(231,203,197,0.3)] tracking-widest font-cyber"
                >
                    NEW EPOCH
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
                <div className="text-3xl md:text-5xl font-bold drop-shadow-[0_0_10px_#e7cbc5] font-mono" style={{color: COLORS.text}}>
                    {score.toLocaleString()}
                </div>
            </div>
            
            <div className="flex space-x-1 md:space-x-2">
                {[...Array(maxLives)].map((_, i) => (
                    <Heart 
                        key={i} 
                        className={`w-6 h-6 md:w-8 md:h-8 drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]`} 
                        fill={i < lives ? COLORS.danger : COLORS.background}
                        color={i < lives ? COLORS.danger : COLORS.structure}
                    />
                ))}
            </div>
        </div>
        
        {/* Level Indicator */}
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 text-sm md:text-lg text-[#200b01] font-bold tracking-wider font-mono bg-[#e7cbc5]/90 px-4 py-1 rounded-full border border-[#553e36]/30 backdrop-blur-sm z-50 shadow-lg">
            LAYER {level} <span className="text-[#553e36] text-xs md:text-sm">/ 3</span>
        </div>

        {/* Active Skill Indicator */}
        {isImmortalityActive && (
             <div className="absolute top-24 left-1/2 transform -translate-x-1/2 font-bold text-xl md:text-2xl animate-pulse flex items-center drop-shadow-[0_0_10px_#e7cbc5] font-mono" style={{color: COLORS.teal}}>
                 <Shield className="mr-2" fill={COLORS.teal} stroke="#200b01" /> FIREWALL ACTIVE
             </div>
        )}

        {/* Target Collection Status */}
        <div className="absolute top-16 md:top-24 left-1/2 transform -translate-x-1/2 flex space-x-2 md:space-x-3">
            {target.map((char, idx) => {
                const isCollected = collectedLetters.includes(idx);
                const color = THEME_COLORS[idx];

                return (
                    <div 
                        key={idx}
                        style={{
                            borderColor: isCollected ? color : 'rgba(231, 203, 197, 0.1)',
                            color: isCollected ? '#200b01' : 'rgba(231, 203, 197, 0.1)',
                            boxShadow: isCollected ? `0 0 15px ${color}` : 'none',
                            backgroundColor: isCollected ? color : 'transparent'
                        }}
                        className={`w-8 h-10 md:w-10 md:h-12 flex items-center justify-center border-2 font-black text-lg md:text-xl font-cyber rounded transform transition-all duration-300`}
                    >
                        {char}
                    </div>
                );
            })}
        </div>

        {/* Bottom Overlay */}
        <div className="w-full flex justify-end items-end">
             <div className="flex items-center space-x-2 opacity-80" style={{color: COLORS.gold}}>
                 <Zap className="w-4 h-4 md:w-6 md:h-6 animate-pulse" />
                 <span className="font-mono text-base md:text-xl">CLOCK SPEED {Math.round((speed / RUN_SPEED_BASE) * 100)}%</span>
             </div>
        </div>
    </div>
  );
};
