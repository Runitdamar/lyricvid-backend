export const THEMES = [
  // ── GenZ / Reel Themes ──
  { id: 'neon-noir', name: 'Neon Noir', tag: '🔥', preview: ['#000000', '#ff1fa0', '#ffffff'] },
  { id: 'cyberpunk', name: 'Cyberpunk', tag: '⚡', preview: ['#0d0221', '#00ffff', '#ffff00'] },
  { id: 'vaporwave', name: 'Vaporwave', tag: '🌸', preview: ['#1a0040', '#ff71ce', '#01cdfe'] },
  { id: 'dark-luxury', name: 'Dark Luxury', tag: '👑', preview: ['#0a0a0a', '#c9a84c', '#ffffff'] },
  { id: 'holographic', name: 'Holo', tag: '✨', preview: ['#050505', '#ff00ff', '#00ffff'] },
  { id: 'fire', name: 'Fire', tag: '🔥', preview: ['#0a0000', '#ff4500', '#ffff00'] },
  { id: 'ice', name: 'Icy', tag: '❄️', preview: ['#000d1a', '#00d4ff', '#ffffff'] },
  { id: 'golden', name: 'Golden Hour', tag: '🌅', preview: ['#0a0500', '#ffd700', '#ffffff'] },
  { id: 'matrix', name: 'Matrix', tag: '🟢', preview: ['#000000', '#00ff00', '#003300'] },
  { id: 'retro', name: 'Retro', tag: '📼', preview: ['#1a0a00', '#ff8c00', '#ffe0b2'] },
  { id: 'graffiti', name: 'Graffiti', tag: '🎨', preview: ['#111111', '#ff6b35', '#f7c59f'] },
  { id: 'minimal', name: 'Minimal', tag: '⬜', preview: ['#ffffff', '#000000', '#555555'] },
  // ── New Real Reel Themes ──
  { id: 'midnight-drip', name: 'Midnight Drip', tag: '💧', preview: ['#0a0015', '#7b2fff', '#e040fb'] },
  { id: 'trap-god', name: 'Trap God', tag: '💎', preview: ['#0d0d0d', '#silver', '#ffffff'], previewColors: ['#0d0d0d', '#c0c0c0', '#ffffff'] },
  { id: 'aesthetic', name: 'Aesthetic', tag: '🌷', preview: ['#1a0a1a', '#ff85a1', '#ffc8dd'] },
  { id: 'streetwear', name: 'Streetwear', tag: '👟', preview: ['#111111', '#ff4655', '#ffffff'] },
  { id: 'lo-fi', name: 'Lo-Fi', tag: '🎧', preview: ['#1a1a2e', '#e94560', '#f5a623'] },
  { id: 'neon-jungle', name: 'Neon Jungle', tag: '🌿', preview: ['#001a00', '#39ff14', '#00ff9f'] },
  { id: 'sad-boy', name: 'Sad Boy', tag: '🌧️', preview: ['#0d0d1a', '#4a4aff', '#8888ff'] },
  { id: 'drip-gold', name: 'Drip Gold', tag: '🏆', preview: ['#0a0800', '#ffd700', '#ff8c00'] },
]

export const FONTS = [
  // Display / Bold
  { id: 'Bebas Neue', name: 'BEBAS NEUE', category: 'Display' },
  { id: 'Anton', name: 'ANTON BOLD', category: 'Display' },
  { id: 'Bungee', name: 'BUNGEE', category: 'Display' },
  { id: 'Russo One', name: 'RUSSO ONE', category: 'Bold' },
  { id: 'Teko', name: 'TEKO CONDENSED', category: 'Condensed' },
  // Futuristic
  { id: 'Orbitron', name: 'ORBITRON', category: 'Futuristic' },
  { id: 'Exo 2', name: 'EXO 2', category: 'Futuristic' },
  { id: 'Rajdhani', name: 'Rajdhani', category: 'Futuristic' },
  // GenZ / Trendy
  { id: 'Bangers', name: 'Bangers!', category: 'GenZ' },
  { id: 'Righteous', name: 'Righteous', category: 'GenZ' },
  { id: 'Fredoka One', name: 'Fredoka One', category: 'GenZ' },
  { id: 'Lilita One', name: 'Lilita One', category: 'GenZ' },
  // Handwritten / Vibe
  { id: 'Permanent Marker', name: 'Marker Vibe', category: 'Handwritten' },
  { id: 'Pacifico', name: 'Pacifico', category: 'Handwritten' },
  { id: 'Dancing Script', name: 'Dancing Script', category: 'Handwritten' },
  // Serif / Luxury
  { id: 'Abril Fatface', name: 'Abril Fatface', category: 'Luxury' },
  { id: 'Playfair Display', name: 'Playfair Display', category: 'Luxury' },
]

export const TEXT_EFFECTS = [
  { id: 'none', name: 'None', icon: '✦', desc: 'Clean' },
  { id: 'neon-glow', name: 'Neon Glow', icon: '💫', desc: 'Glowing edges' },
  { id: 'glitch', name: 'Glitch', icon: '⚡', desc: 'Cyberpunk flicker' },
  { id: 'typewriter', name: 'Typewriter', icon: '⌨️', desc: 'Letter by letter' },
  { id: 'bounce', name: 'Bounce', icon: '🏀', desc: 'Elastic pop' },
  { id: 'flame', name: 'Flame', icon: '🔥', desc: 'Fire at base' },
  { id: 'wave', name: 'Wave', icon: '🌊', desc: 'Flowing motion' },
  { id: 'zoom-pulse', name: 'Zoom Pulse', icon: '🎯', desc: 'Beat sync' },
  { id: 'slide-up', name: 'Slide Up', icon: '⬆️', desc: 'Enters from below' },
  { id: 'fade', name: 'Fade In', icon: '✨', desc: 'Smooth appear' },
  { id: 'shake', name: 'Shake', icon: '📳', desc: 'Vibrate' },
  { id: 'rainbow', name: 'Rainbow', icon: '🌈', desc: 'Color cycle' },
  { id: 'shimmer', name: 'Shimmer', icon: '⭐', desc: 'Sparkle sweep' },
  { id: 'freeze', name: 'Freeze', icon: '❄️', desc: 'Icy crystallize' },
  { id: 'matrix', name: 'Matrix', icon: '🟢', desc: 'Digital rain' },
  { id: 'pop', name: 'Pop', icon: '💥', desc: 'Scale pop in' },
  { id: 'blur-in', name: 'Blur In', icon: '🔮', desc: 'Focuses in' },
  { id: 'karaoke', name: 'Karaoke', icon: '🎤', desc: 'Word highlight' },
]

export const TRANSITIONS = [
  { id: 'fade', name: 'Fade', icon: '✨', desc: 'Smooth fade in, stays visible' },
  { id: 'fadeInOut', name: 'Fade In/Out', icon: '💫', desc: 'Fades in then fades out' },
  { id: 'slideUp', name: 'Slide Up', icon: '⬆️', desc: 'Slides up in and out' },
  { id: 'scale', name: 'Scale Pop', icon: '💥', desc: 'Pops in from small' },
  { id: 'blur', name: 'Blur', icon: '🔮', desc: 'Blurs into focus' },
  { id: 'drop', name: 'Drop In', icon: '⬇️', desc: 'Falls in from top' },
  { id: 'glitch', name: 'Glitch Cut', icon: '⚡', desc: 'Hard glitch switch' },
]

export const PATTERNS = [
  { id: 'particles', name: 'Particles' },
  { id: 'geometric', name: 'Geometric' },
  { id: 'stars', name: 'Stars' },
  { id: 'matrix', name: 'Matrix Rain' },
  { id: 'grid', name: 'Grid' },
  { id: 'bokeh', name: 'Bokeh' },
  { id: 'hexagon', name: 'Hexagon' },
  { id: 'aurora', name: 'Aurora' },
  { id: 'lightning', name: 'Lightning' },
  { id: 'noise', name: 'Noise' },
]

export const COLOR_PALETTES = [
  { name: 'Hot Pink', colors: ['#ff1fa0', '#ff96d9', '#ffffff'] },
  { name: 'Electric Blue', colors: ['#0066ff', '#00ccff', '#ffffff'] },
  { name: 'Toxic Green', colors: ['#00ff41', '#00cc33', '#ffffff'] },
  { name: 'Sunset', colors: ['#ff6b35', '#f7c59f', '#ffff00'] },
  { name: 'Purple Haze', colors: ['#7b2fff', '#c77dff', '#ffffff'] },
  { name: 'Gold Rush', colors: ['#ffd700', '#ffaa00', '#ffffff'] },
  { name: 'Arctic', colors: ['#00d4ff', '#a8edea', '#ffffff'] },
  { name: 'Lava', colors: ['#ff4500', '#ff8c00', '#ffff00'] },
  { name: 'Monochrome', colors: ['#ffffff', '#aaaaaa', '#555555'] },
  { name: 'Cherry', colors: ['#dc143c', '#ff69b4', '#ffffff'] },
  { name: 'Midnight', colors: ['#7b2fff', '#e040fb', '#ffffff'] },
  { name: 'Drip Gold', colors: ['#ffd700', '#ff8c00', '#ffffff'] },
  { name: 'Neon Jungle', colors: ['#39ff14', '#00ff9f', '#ffffff'] },
  { name: 'Sad Vibes', colors: ['#4a4aff', '#8888ff', '#ffffff'] },
  { name: 'Street Red', colors: ['#ff4655', '#ff8888', '#ffffff'] },
  { name: 'Rose Soft', colors: ['#ff85a1', '#ffc8dd', '#ffffff'] },
]
