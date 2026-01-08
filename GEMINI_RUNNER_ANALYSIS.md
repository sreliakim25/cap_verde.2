# 📋 ANÁLISE COMPLETA DO PROJETO: GEMINI RUNNER

## 🎯 O QUE É O PROJETO?

**Gemini Runner** é um jogo 3D de corrida infinita (endless runner) no estilo cyberpunk/sci-fi, construído com **React Three Fiber** (Three.js + React). O jogador controla um personagem robótico que corre automaticamente por uma pista espacial, desviando de obstáculos, coletando itens e letras para completar níveis.

---

## 🎨 ELEMENTOS PRINCIPAIS DO JOGO

### 🤖 1. PERSONAGEM (Player)

**Arquivo:** `components/World/Player.tsx`

**Aparência:** Robô humanóide com estética low-poly/geométrica

**Composição:**
- Corpo cilíndrico (torso)
- Cabeça esférica com "olhos" brilhantes
- Braços articulados (shoulder, braço, antebraço)
- Pernas articuladas (hips, thighs, shins)
- Juntas esféricas
- Sombra circular embaixo

**Cores:** Tons de azul neon/ciano (#00FFFF)

**Controles:**
- ⬅️ **Setas/Swipe:** Movimento lateral entre pistas
- ⬆️ **Seta para cima/Tap:** Pular
- **Espaço/Touch longo:** Ativar habilidade de imortalidade

**Habilidades:**
- Pulo simples (padrão)
- **Double Jump** (pode ser comprado na loja)
- **Imortalidade temporária** (5 segundos, pode ser comprado)

---

### 🌌 2. CENÁRIO/AMBIENTE (Environment)

**Arquivo:** `components/World/Environment.tsx`

**Componentes visuais:**

#### 🌟 StarField (Campo de Estrelas)
- Partículas brilhantes que se movem, simulando viagem espacial
- Diferentes tamanhos e velocidades
- Efeito de profundidade

#### 🛣️ LaneGuides (Guias das Pistas)
- Linhas verticais neon nas laterais das pistas
- Cores: Rosa/Magenta (#FF00FF)
- Expandem dinamicamente conforme o número de pistas aumenta

#### 🌅 RetroSun (Sol Retro)
- Sol estilizado no estilo "synthwave/vaporwave"
- Localizado no horizonte
- Cor rosa/magenta brilhante com anéis concêntricos
- Reflexos e sombras dinâmicas

#### 📐 MovingGrid (Grade em Movimento)
- Grade de chão no estilo "Tron"
- Cor ciano neon
- Se move junto com a velocidade do jogo
- Efeito de perspectiva infinita

---

### 💎 3. ITENS COLECIONÁVEIS

#### 🔤 LETRAS (Letters)
**Tipo:** `ObjectType.LETTER`

- **Objetivo:** Coletar as 6 letras que formam "**G-E-M-I-N-I**"
- **Aparência:** Texto 3D brilhante
- **Cores:** Cada letra tem uma cor específica (baseado nas cores do Google):
  - **G** - Azul (`#2979ff`)
  - **E** - Vermelho (`#ff1744`)
  - **M** - Amarelo (`#ffea00`)
  - **I** - Azul (`#2979ff`)
  - **N** - Verde (`#00e676`)
  - **I** - Vermelho (`#ff1744`)
- **Efeito:** Aumenta a velocidade do jogo em 10% por letra
- **Objetivo:** Coletar todas as 6 letras para avançar de nível

#### 💎 GEMAS (Gems)
**Tipo:** `ObjectType.GEM`

- **Aparência:** Diamante 3D rotativo brilhante
- **Cores:** Variadas (ciano, amarelo, rosa)
- **Valor:** Cada gema vale **pontos** que são usados como moeda
- **Uso:** Comprar itens na loja

---

### 🚧 4. OBSTÁCULOS E INIMIGOS

#### 🧱 OBSTÁCULOS (Obstacles)
**Tipo:** `ObjectType.OBSTACLE`

- **Aparência:** Caixas/cubos 3D
- **Cores:** Vermelho/Laranja brilhante
- **Efeito:** Causa dano (perde 1 vida)
- **Interação:** Pode ser pulado

#### 👽 ALIENS (Inimigos)
**Tipo:** `ObjectType.ALIEN`

- **Aparência:** Forma alienígena flutuante com "olho" brilhante
- **Cores:** Verde neon
- **Comportamento:** 
  - Flutuam acima da pista
  - **Disparam mísseis** direcionados ao jogador
- **Efeito:** Causa dano se o míssil acertar

#### 🚀 MÍSSEIS (Missiles)
**Tipo:** `ObjectType.MISSILE`

- **Aparência:** Projétil alongado com anéis brilhantes
- **Cores:** Vermelho/Laranja
- **Comportamento:** Rastreiam o jogador e se movem rapidamente
- **Efeito:** Causa dano (perde 1 vida)

---

### 🏪 5. LOJA (Shop)

#### 🌀 PORTAL DA LOJA
**Tipo:** `ObjectType.SHOP_PORTAL`

- **Aparência:** Portal vertical brilhante que atravessa todas as pistas
- **Quando aparece:** Depois de coletar todas as letras "GEMINI"
- **Efeito:** Ao passar pelo portal, abre a loja

#### 🛒 ITENS DA LOJA:

1. **🔝 DOUBLE JUMP** - Pulo duplo
   - **Custo:** 1000 gemas
   - **Descrição:** Permite pular novamente no ar
   - **Tipo:** Item único (compra uma vez)

2. **❤️ MAX LIFE UP** - Vida máxima aumentada
   - **Custo:** 1500 gemas
   - **Descrição:** Adiciona 1 slot de vida permanentemente e cura você
   - **Tipo:** Pode comprar múltiplas vezes

3. **🩹 REPAIR KIT** - Kit de reparo
   - **Custo:** 1000 gemas
   - **Descrição:** Restaura 1 ponto de vida
   - **Tipo:** Pode comprar múltiplas vezes

4. **🛡️ IMMORTALITY** - Imortalidade
   - **Custo:** 3000 gemas
   - **Descrição:** Desbloqueia habilidade ativa - aperte Espaço/Tap para ser invencível por 5 segundos
   - **Tipo:** Item único (compra uma vez)

---

### 💰 6. SISTEMA DE PONTUAÇÃO E MOEDAS

- **💎 Score/Gemas:** Moeda principal do jogo
  - Coletadas ao pegar gemas
  - Usadas para comprar itens na loja
  - Também serve como pontuação
  
- **❤️ Vidas:** 
  - **Inicial:** 3 vidas
  - **Máximo:** Pode aumentar comprando "MAX LIFE UP"
  - **Perde vida:** Ao colidir com obstáculos, aliens ou mísseis

- **📊 Níveis:**
  - **Total de níveis:** 3
  - **Progressão:** Coletar todas as 6 letras "GEMINI" avança 1 nível
  - **Efeito:** Cada nível aumenta:
    - Velocidade do jogo (+40% da velocidade base)
    - Número de pistas (de 3 → 5 → 7 ou até 9)

- **⚡ Velocidade:**
  - **Base:** 100%
  - **Aumenta:** +10% por cada letra coletada
  - **Aumenta:** +40% ao completar um nível

- **📏 Distância:**
  - Medida em "LY" (Light Years - Anos-luz)
  - Rastreada durante o jogo

---

### 🎮 7. ESTADOS DO JOGO

**Arquivo:** `types.ts` - `GameStatus`

1. **MENU** - Menu inicial
   - Mostra imagem de capa
   - Botão "INITIALIZE RUN"

2. **PLAYING** - Jogando
   - HUD principal visível
   - Personagem correndo

3. **SHOP** - Na loja
   - Mostra os itens disponíveis para compra
   - Botão "RESUME MISSION" para continuar

4. **GAME_OVER** - Game Over
   - Mostra estatísticas finais (nível, gemas, distância, score)
   - Botão "RUN AGAIN"

5. **VICTORY** - Vitória
   - Completou todos os 3 níveis
   - Mostra score final com celebração
   - Botão "RESTART MISSION"

---

### 🎨 8. ESTÉTICA VISUAL

- **Tema:** Cyberpunk/Synthwave/Vaporwave/Neon
- **Paleta de cores:**
  - Ciano neon (#00FFFF)
  - Rosa/Magenta (#FF00FF)
  - Amarelo (#FFEA00)
  - Roxo/Lilás
  - Fundo escuro/preto
- **Efeitos:**
  - Glow/Bloom (brilho neon)
  - Sombras dinâmicas
  - Partículas explosivas
  - Animações suaves

---

### 🎯 9. OBJETIVO DO JOGO

**Meta principal:** Completar os 3 níveis coletando todas as letras "GEMINI" em cada nível e chegando ao final sem perder todas as vidas.

**Progressão:**
1. Coletar letras G-E-M-I-N-I (Nível 1)
2. Portal da loja aparece → comprar upgrades
3. Repetir nos níveis 2 e 3
4. **VITÓRIA!** 🎉

---

## 📁 ESTRUTURA DE ARQUIVOS

```
copy-of-gemini-runner/
├── components/
│   ├── UI/
│   │   └── HUD.tsx          # Interface do usuário, menus, loja
│   ├── World/
│   │   ├── Player.tsx       # Personagem jogável
│   │   ├── Environment.tsx  # Cenário (estrelas, sol, grade)
│   │   ├── LevelManager.tsx # Gerencia spawning de objetos, colisões
│   │   └── Effects.tsx      # Efeitos visuais pós-processamento
│   └── System/
│       └── Audio.ts         # Sistema de áudio
├── App.tsx                  # Componente principal
├── store.ts                 # Estado global do jogo (Zustand)
├── types.ts                 # Definições de tipos e constantes
└── package.json             # Dependências (React, Three.js, etc.)
```

---

## 🔧 TECNOLOGIAS USADAS

- **React** (v19.2.0)
- **Three.js** (v0.181.1) - Engine 3D
- **@react-three/fiber** - Integração React + Three.js
- **@react-three/drei** - Helpers para Three.js
- **@react-three/postprocessing** - Efeitos visuais
- **Zustand** - Gerenciamento de estado
- **Vite** - Build tool
- **TypeScript** - Tipagem

---

## 📝 NOTA IMPORTANTE

> Este projeto está sendo adaptado para **Capitão Verde Run** - um jogo com temática ambiental/sustentabilidade. Consulte o arquivo `walkthrough.md` na pasta `.gemini/antigravity/brain/` para ver as mudanças implementadas.

> Para a análise completa do jogo Capitão Verde (referência), veja a pasta `C:\Users\Viana e Moura\Desktop\Antigravity\cap.verde\ANALISE.md`
