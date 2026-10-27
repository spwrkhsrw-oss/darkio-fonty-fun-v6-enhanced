(/* Darkio Fonty Fun V6.1 — classic/Vendetta-compatible text styling with expanded controls.
 * Local-only display styling. No token access, network calls, or profile edits.
 */
globalThis.plugin = (() => {
  "use strict";
  // Revenge Classic/Bunny/Vendetta expose slightly different global API surfaces.
  // Prefer the legacy-compatible UI when running from the classic manifest, while
  // keeping each lookup independent so a partial shim cannot mask a working API.
  const safeRead = getter => { try { return getter(); } catch (_) { return undefined; } };
  let injectedRevenge = safeRead(() => (typeof revenge !== 'undefined' ? revenge : undefined));
  let injectedBunny = safeRead(() => (typeof bunny !== 'undefined' ? bunny : undefined));
  let injectedVendetta = safeRead(() => (typeof vendetta !== 'undefined' ? vendetta : undefined));
  let revengeApi = injectedRevenge || safeRead(() => globalThis.revenge) || injectedBunny || safeRead(() => globalThis.bunny);
  let legacy = injectedVendetta || safeRead(() => globalThis.vendetta);
  let runtime = revengeApi || legacy || injectedBunny || injectedVendetta;
  let React, RN, Forms, logger, patcher, findByProps, jsxRuntime;
  let h, Animated, Text, View, ScrollView, TextInput, Switch, Pressable;

  // Resolve from both Classic globals and the API object Revenge passes to
  // lifecycle methods. Some runtimes don't expose their API globally.
  function resolveRuntime(context = {}) {
    const direct = safeRead(() => context?.api) || context || {};
    const unscoped = safeRead(() => direct?.unscoped)
      || safeRead(() => context?.unscoped)
      || safeRead(() => revengeApi?.unscoped)
      || {};
    const reactApi = safeRead(() => unscoped?.react)
      || safeRead(() => direct?.react)
      || safeRead(() => context?.react)
      || {};

    injectedRevenge = safeRead(() => (typeof revenge !== 'undefined' ? revenge : undefined)) || injectedRevenge;
    injectedBunny = safeRead(() => (typeof bunny !== 'undefined' ? bunny : undefined)) || injectedBunny;
    injectedVendetta = safeRead(() => (typeof vendetta !== 'undefined' ? vendetta : undefined)) || injectedVendetta;
    revengeApi = injectedRevenge || safeRead(() => globalThis.revenge) || injectedBunny || safeRead(() => globalThis.bunny) || revengeApi;
    legacy = injectedVendetta || safeRead(() => globalThis.vendetta) || legacy;
    runtime = revengeApi || legacy || injectedBunny || injectedVendetta || runtime;

    React = safeRead(() => reactApi?.React)
      || safeRead(() => direct?.React)
      || safeRead(() => context?.React)
      || safeRead(() => revengeApi?.metro?.common?.React)
      || safeRead(() => legacy?.metro?.common?.React)
      || safeRead(() => injectedBunny?.metro?.common?.React)
      || safeRead(() => runtime?.metro?.common?.React)
      || safeRead(() => revengeApi?.metro?.findByProps?.('createElement', 'useState'))
      || safeRead(() => legacy?.metro?.findByProps?.('createElement', 'useState'))
      || safeRead(() => globalThis.React)
      || React;
    RN = safeRead(() => reactApi?.ReactNative)
      || safeRead(() => direct?.ReactNative)
      || safeRead(() => revengeApi?.metro?.common?.ReactNative)
      || safeRead(() => legacy?.metro?.common?.ReactNative)
      || safeRead(() => injectedBunny?.metro?.common?.ReactNative)
      || safeRead(() => runtime?.metro?.common?.ReactNative)
      || safeRead(() => revengeApi?.metro?.findByProps?.('View', 'Text', 'ScrollView'))
      || safeRead(() => legacy?.metro?.findByProps?.('View', 'Text', 'ScrollView'))
      || safeRead(() => globalThis.ReactNative)
      || RN;
    Forms = safeRead(() => direct?.ui?.components?.Forms)
      || safeRead(() => context?.ui?.components?.Forms)
      || safeRead(() => revengeApi?.ui?.components?.Forms)
      || safeRead(() => legacy?.ui?.components?.Forms)
      || safeRead(() => injectedBunny?.ui?.components?.Forms)
      || safeRead(() => runtime?.ui?.components?.Forms)
      || safeRead(() => revengeApi?.ui?.components)
      || safeRead(() => legacy?.ui?.components)
      || Forms;
    logger = safeRead(() => direct?.logger)
      || safeRead(() => revengeApi?.plugin?.logger)
      || safeRead(() => legacy?.logger)
      || safeRead(() => runtime?.logger)
      || safeRead(() => runtime?.plugin?.logger)
      || logger;
    patcher = safeRead(() => direct?.patcher)
      || safeRead(() => unscoped?.patcher)
      || safeRead(() => revengeApi?.api?.patcher)
      || safeRead(() => revengeApi?.patcher)
      || safeRead(() => legacy?.patcher)
      || safeRead(() => injectedBunny?.api?.patcher)
      || safeRead(() => injectedBunny?.patcher)
      || patcher;
    findByProps = safeRead(() => direct?.metro?.findByPropsLazy)
      || safeRead(() => direct?.metro?.findByProps)
      || safeRead(() => unscoped?.modules?.metro?.findByProps)
      || safeRead(() => revengeApi?.metro?.findByPropsLazy)
      || safeRead(() => revengeApi?.metro?.findByProps)
      || safeRead(() => legacy?.metro?.findByPropsLazy)
      || safeRead(() => legacy?.metro?.findByProps)
      || safeRead(() => injectedBunny?.metro?.findByProps)
      || findByProps;
    jsxRuntime = safeRead(() => reactApi?.ReactJSXRuntime)
      || safeRead(() => reactApi?.jsxRuntime)
      || safeRead(() => direct?.ReactJSXRuntime)
      || safeRead(() => revengeApi?.unscoped?.react?.ReactJSXRuntime)
      || safeRead(() => revengeApi?.unscoped?.react?.jsxRuntime)
      || jsxRuntime;
    h = React?.createElement?.bind(React);
    Animated = RN?.Animated;
    Text = RN?.Text;
    View = RN?.View;
    ScrollView = RN?.ScrollView;
    TextInput = RN?.TextInput;
    Switch = RN?.Switch;
    Pressable = RN?.Pressable || RN?.TouchableOpacity || RN?.Button;
    if (!jsxRuntime && findByProps) jsxRuntime = safeRead(() => findByProps('jsx', 'jsxs'));
    return !!(React && h);
  }
  resolveRuntime();

const DEFAULT_SETTINGS = {
  enabled: false,
  targetName: '',
  fontStyle: 'medieval',
  colorEnabled: true,
  color: '#B69CFF',
  colorMode: 'solid',
  animationSpeed: 'normal',
  targetMatchMode: 'exact',
  caseSensitive: true,
  bold: false,
  italic: false,
  letterSpacing: 'normal',
  secondaryColor: '#55D6BE',
  reduceMotion: false,
  reverseAnimation: false,
};

const COLOR_MODE_OPTIONS = [
  { id: 'solid', label: 'Solid', sample: '●' },
  { id: 'rainbow', label: 'Prism / Rainbow', sample: '🌈' },
  { id: 'ocean', label: 'Ocean', sample: '🌊' },
  { id: 'sunset', label: 'Sunset', sample: '🌅' },
  { id: 'aurora', label: 'Aurora', sample: '✨' },
  { id: 'neon-pulse', label: 'Neon Pulse', sample: '💜' },
  { id: 'gummy', label: 'Gummy', sample: '🍬' },
  { id: 'fire', label: 'Fire', sample: '🔥' },
  { id: 'ice', label: 'Ice', sample: '🧊' },
  { id: 'rose', label: 'Rose', sample: '🌹' },
  { id: 'mint', label: 'Mint', sample: '🌿' },
  { id: 'cosmic', label: 'Cosmic', sample: '🌌' },
  { id: 'custom-cycle', label: 'Custom cycle', sample: '🎨' },
];
const SPEED_OPTIONS = [
  { id: 'very-slow', label: 'Very slow' },
  { id: 'slow', label: 'Slow' },
  { id: 'normal', label: 'Normal' },
  { id: 'fast', label: 'Fast' },
];
const MATCH_MODE_OPTIONS = [
  { id: 'exact', label: 'Exact match', note: 'Safest: only the whole text must match.' },
  { id: 'contains', label: 'Contains', note: 'Styles only the matching name inside longer text.' },
  { id: 'starts-with', label: 'Starts with', note: 'Styles the starting part that matches your name.' },
];
const SPACING_OPTIONS = [
  { id: 'normal', label: 'Normal' },
  { id: 'loose', label: 'Loose' },
  { id: 'wide', label: 'Wide' },
];
const ANIMATION_DURATIONS = { 'very-slow': 16000, slow: 10000, normal: 6200, fast: 3400 };
const COLOR_PALETTES = {
  rainbow: { inputRange: [0,1,2,3,4,5,6], outputRange: ['#FF4D6D','#FFB84D','#F9F871','#55E6A5','#49C6FF','#A78BFA','#FF4D6D'] },
  ocean: { inputRange: [0,2,4,6], outputRange: ['#22D3EE','#38BDF8','#6366F1','#22D3EE'] },
  sunset: { inputRange: [0,2,4,6], outputRange: ['#FB7185','#F97316','#FACC15','#FB7185'] },
  aurora: { inputRange: [0,2,4,6], outputRange: ['#5EEAD4','#60A5FA','#C084FC','#5EEAD4'] },
  gummy: { inputRange: [0,1.5,3,4.5,6], outputRange: ['#FF8FAB','#F9A8D4','#C4B5FD','#93C5FD','#FF8FAB'] },
  fire: { inputRange: [0,2,4,6], outputRange: ['#FFD166','#FF7B00','#EF233C','#FFD166'] },
  ice: { inputRange: [0,2,4,6], outputRange: ['#D9F7FF','#67E8F9','#3B82F6','#D9F7FF'] },
  rose: { inputRange: [0,2,4,6], outputRange: ['#FDA4AF','#F472B6','#C084FC','#FDA4AF'] },
  mint: { inputRange: [0,2,4,6], outputRange: ['#BBF7D0','#34D399','#2DD4BF','#BBF7D0'] },
  cosmic: { inputRange: [0,2,4,6], outputRange: ['#7C3AED','#EC4899','#38BDF8','#7C3AED'] },
};

const FONT_OPTIONS = [
  {
    "id": "gg-sans",
    "label": "gg sans",
    "sample": "Darkio",
    "note": "Classic / unchanged text"
  },
  {
    "id": "tempo",
    "label": "Tempo",
    "sample": "𝗗𝗮𝗿𝗸𝗶𝗼",
    "note": "Bold sans approximation"
  },
  {
    "id": "sakura",
    "label": "Sakura",
    "sample": "𝒟𝒶𝓇𝓀𝒾𝑜",
    "note": "Script approximation"
  },
  {
    "id": "jellybean",
    "label": "Jellybean",
    "sample": "𝔻𝕒𝕣𝕜𝕚𝕠",
    "note": "Double-struck approximation"
  },
  {
    "id": "modern",
    "label": "Modern",
    "sample": "𝘋𝘢𝘳𝘬𝘪𝘰",
    "note": "Sans italic approximation"
  },
  {
    "id": "medieval",
    "label": "Medieval",
    "sample": "𝔇𝔞𝔯𝔨𝔦𝔬",
    "note": "Fraktur / blackletter"
  },
  {
    "id": "8bit",
    "label": "8Bit",
    "sample": "🄳🄰🅁🄺🄸🄾",
    "note": "Squared characters"
  },
  {
    "id": "vampyre",
    "label": "Vampyre",
    "sample": "𝕯𝖆𝖗𝖐𝖎𝖔",
    "note": "Bold blackletter approximation"
  },
  {
    "id": "monkey-bars",
    "label": "Monkey Bars",
    "sample": "ⓓⓐⓡⓚⓘⓞ",
    "note": "Circled / bubble approximation"
  },
  {
    "id": "mainframe",
    "label": "Mainframe",
    "sample": "𝙳𝚊𝚛𝚔𝚒𝚘",
    "note": "Monospace characters"
  },
  {
    "id": "headbang",
    "label": "Headbang",
    "sample": "𝑫𝒂𝒓𝒌𝒊𝒐",
    "note": "Bold italic approximation"
  },
  {
    "id": "journal",
    "label": "Journal",
    "sample": "𝐷𝑎𝑟𝑘𝑖𝑜",
    "note": "Italic serif approximation"
  },
  {
    "id": "bold-serif",
    "label": "Bold Serif",
    "sample": "𝐃𝐚𝐫𝐤𝐢𝐨",
    "note": "Extra style"
  },
  {
    "id": "italic-serif",
    "label": "Italic Serif",
    "sample": "𝐷𝑎𝑟𝑘𝑖𝑜",
    "note": "Extra style"
  },
  {
    "id": "bold-italic",
    "label": "Bold Italic",
    "sample": "𝑫𝒂𝒓𝒌𝒊𝒐",
    "note": "Extra style"
  },
  {
    "id": "bold-fraktur",
    "label": "Bold Fraktur",
    "sample": "𝕯𝖆𝖗𝖐𝖎𝖔",
    "note": "Extra style"
  },
  {
    "id": "double-struck",
    "label": "Double-Struck",
    "sample": "𝔻𝕒𝕣𝕜𝕚𝕠",
    "note": "Extra style"
  },
  {
    "id": "small-caps",
    "label": "Small Caps",
    "sample": "ᴅᴀʀᴋɪᴏ",
    "note": "Extra style"
  },
  {
    "id": "fullwidth",
    "label": "Fullwidth",
    "sample": "Ｄａｒｋｉｏ",
    "note": "Extra style"
  },
  {
    "id": "sans-italic",
    "label": "Sans Italic",
    "sample": "𝘋𝘢𝘳𝘬𝘪𝘰",
    "note": "Extra style"
  },
  {
    "id": "bubble",
    "label": "Bubble Letters",
    "sample": "ⓓⓐⓡⓚⓘⓞ",
    "note": "Extra style"
  }
];
const FONT_ALPHABET = {
  "gg-sans": "plain",
  "tempo": "bold-sans",
  "sakura": "script",
  "jellybean": "double-struck",
  "modern": "sans-italic",
  "medieval": "fraktur",
  "8bit": "squared",
  "vampyre": "bold-fraktur",
  "monkey-bars": "circled",
  "mainframe": "monospace",
  "headbang": "bold-italic",
  "journal": "italic-serif",
  "double-struck": "double-struck",
  "small-caps": "small-caps",
  "fullwidth": "fullwidth",
  "bold-serif": "bold-serif",
  "italic-serif": "italic-serif",
  "bold-italic": "bold-italic",
  "bold-fraktur": "bold-fraktur",
  "sans-italic": "sans-italic",
  "bubble": "bubble"
};
const ALPHABETS = {
  "plain": {
    "upper": [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z"
    ],
    "lower": [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z"
    ],
    "digits": [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9"
    ]
  },
  "fraktur": {
    "upper": [
      "𝔄",
      "𝔅",
      "ℭ",
      "𝔇",
      "𝔈",
      "𝔉",
      "𝔊",
      "ℌ",
      "ℑ",
      "𝔍",
      "𝔎",
      "𝔏",
      "𝔐",
      "𝔑",
      "𝔒",
      "𝔓",
      "𝔔",
      "ℜ",
      "𝔖",
      "𝔗",
      "𝔘",
      "𝔙",
      "𝔚",
      "𝔛",
      "𝔜",
      "ℨ"
    ],
    "lower": [
      "𝔞",
      "𝔟",
      "𝔠",
      "𝔡",
      "ℯ",
      "𝔣",
      "ℊ",
      "𝔥",
      "𝔦",
      "𝔧",
      "𝔨",
      "𝔩",
      "𝔪",
      "𝔫",
      "ℴ",
      "𝔭",
      "𝔮",
      "𝔯",
      "𝔰",
      "𝔱",
      "𝔲",
      "𝔳",
      "𝔴",
      "𝔵",
      "𝔶",
      "𝔷"
    ]
  },
  "script": {
    "upper": [
      "𝒜",
      "ℬ",
      "𝒞",
      "𝒟",
      "ℰ",
      "ℱ",
      "𝒢",
      "ℋ",
      "ℐ",
      "𝒥",
      "𝒦",
      "ℒ",
      "ℳ",
      "𝒩",
      "𝒪",
      "𝒫",
      "𝒬",
      "ℛ",
      "𝒮",
      "𝒯",
      "𝒰",
      "𝒱",
      "𝒲",
      "𝒳",
      "𝒴",
      "𝒵"
    ],
    "lower": [
      "𝒶",
      "𝒷",
      "𝒸",
      "𝒹",
      "ℯ",
      "𝒻",
      "ℊ",
      "𝒽",
      "𝒾",
      "𝒿",
      "𝓀",
      "𝓁",
      "𝓂",
      "𝓃",
      "ℴ",
      "𝓅",
      "𝓆",
      "𝓇",
      "𝓈",
      "𝓉",
      "𝓊",
      "𝓋",
      "𝓌",
      "𝓍",
      "𝓎",
      "𝓏"
    ]
  },
  "double-struck": {
    "upper": [
      "𝔸",
      "𝔹",
      "ℂ",
      "𝔻",
      "𝔼",
      "𝔽",
      "𝔾",
      "ℍ",
      "𝕀",
      "𝕁",
      "𝕂",
      "𝕃",
      "𝕄",
      "ℕ",
      "𝕆",
      "ℙ",
      "ℚ",
      "ℝ",
      "𝕊",
      "𝕋",
      "𝕌",
      "𝕍",
      "𝕎",
      "𝕏",
      "𝕐",
      "ℤ"
    ],
    "lower": [
      "𝕒",
      "𝕓",
      "𝕔",
      "𝕕",
      "𝕖",
      "𝕗",
      "𝕘",
      "𝕙",
      "𝕚",
      "𝕛",
      "𝕜",
      "𝕝",
      "𝕞",
      "𝕟",
      "𝕠",
      "𝕡",
      "𝕢",
      "𝕣",
      "𝕤",
      "𝕥",
      "𝕦",
      "𝕧",
      "𝕨",
      "𝕩",
      "𝕪",
      "𝕫"
    ],
    "digits": [
      "𝟘",
      "𝟙",
      "𝟚",
      "𝟛",
      "𝟜",
      "𝟝",
      "𝟞",
      "𝟟",
      "𝟠",
      "𝟡"
    ]
  },
  "monospace": {
    "upper": [
      "𝙰",
      "𝙱",
      "𝙲",
      "𝙳",
      "𝙴",
      "𝙵",
      "𝙶",
      "𝙷",
      "𝙸",
      "𝙹",
      "𝙺",
      "𝙻",
      "𝙼",
      "𝙽",
      "𝙾",
      "𝙿",
      "𝚀",
      "𝚁",
      "𝚂",
      "𝚃",
      "𝚄",
      "𝚅",
      "𝚆",
      "𝚇",
      "𝚈",
      "𝚉"
    ],
    "lower": [
      "𝚊",
      "𝚋",
      "𝚌",
      "𝚍",
      "𝚎",
      "𝚏",
      "𝚐",
      "𝚑",
      "𝚒",
      "𝚓",
      "𝚔",
      "𝚕",
      "𝚖",
      "𝚗",
      "𝚘",
      "𝚙",
      "𝚚",
      "𝚛",
      "𝚜",
      "𝚝",
      "𝚞",
      "𝚟",
      "𝚠",
      "𝚡",
      "𝚢",
      "𝚣"
    ],
    "digits": [
      "𝟶",
      "𝟷",
      "𝟸",
      "𝟹",
      "𝟺",
      "𝟻",
      "𝟼",
      "𝟽",
      "𝟾",
      "𝟿"
    ]
  },
  "small-caps": {
    "upper": [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z"
    ],
    "lower": [
      "ᴀ",
      "ʙ",
      "ᴄ",
      "ᴅ",
      "ᴇ",
      "ꜰ",
      "ɢ",
      "ʜ",
      "ɪ",
      "ᴊ",
      "ᴋ",
      "ʟ",
      "ᴍ",
      "ɴ",
      "ᴏ",
      "ᴘ",
      "ǫ",
      "ʀ",
      "ꜱ",
      "ᴛ",
      "ᴜ",
      "ᴠ",
      "ᴡ",
      "x",
      "ʏ",
      "ᴢ"
    ]
  },
  "fullwidth": {
    "upper": [
      "Ａ",
      "Ｂ",
      "Ｃ",
      "Ｄ",
      "Ｅ",
      "Ｆ",
      "Ｇ",
      "Ｈ",
      "Ｉ",
      "Ｊ",
      "Ｋ",
      "Ｌ",
      "Ｍ",
      "Ｎ",
      "Ｏ",
      "Ｐ",
      "Ｑ",
      "Ｒ",
      "Ｓ",
      "Ｔ",
      "Ｕ",
      "Ｖ",
      "Ｗ",
      "Ｘ",
      "Ｙ",
      "Ｚ"
    ],
    "lower": [
      "ａ",
      "ｂ",
      "ｃ",
      "ｄ",
      "ｅ",
      "ｆ",
      "ｇ",
      "ｈ",
      "ｉ",
      "ｊ",
      "ｋ",
      "ｌ",
      "ｍ",
      "ｎ",
      "ｏ",
      "ｐ",
      "ｑ",
      "ｒ",
      "ｓ",
      "ｔ",
      "ｕ",
      "ｖ",
      "ｗ",
      "ｘ",
      "ｙ",
      "ｚ"
    ],
    "digits": [
      "０",
      "１",
      "２",
      "３",
      "４",
      "５",
      "６",
      "７",
      "８",
      "９"
    ]
  },
  "bold-serif": {
    "upper": [
      "𝐀",
      "𝐁",
      "𝐂",
      "𝐃",
      "𝐄",
      "𝐅",
      "𝐆",
      "𝐇",
      "𝐈",
      "𝐉",
      "𝐊",
      "𝐋",
      "𝐌",
      "𝐍",
      "𝐎",
      "𝐏",
      "𝐐",
      "𝐑",
      "𝐒",
      "𝐓",
      "𝐔",
      "𝐕",
      "𝐖",
      "𝐗",
      "𝐘",
      "𝐙"
    ],
    "lower": [
      "𝐚",
      "𝐛",
      "𝐜",
      "𝐝",
      "𝐞",
      "𝐟",
      "𝐠",
      "𝐡",
      "𝐢",
      "𝐣",
      "𝐤",
      "𝐥",
      "𝐦",
      "𝐧",
      "𝐨",
      "𝐩",
      "𝐪",
      "𝐫",
      "𝐬",
      "𝐭",
      "𝐮",
      "𝐯",
      "𝐰",
      "𝐱",
      "𝐲",
      "𝐳"
    ],
    "digits": [
      "𝟎",
      "𝟏",
      "𝟐",
      "𝟑",
      "𝟒",
      "𝟓",
      "𝟔",
      "𝟕",
      "𝟖",
      "𝟗"
    ]
  },
  "italic-serif": {
    "upper": [
      "𝐴",
      "𝐵",
      "𝐶",
      "𝐷",
      "𝐸",
      "𝐹",
      "𝐺",
      "𝐻",
      "𝐼",
      "𝐽",
      "𝐾",
      "𝐿",
      "𝑀",
      "𝑁",
      "𝑂",
      "𝑃",
      "𝑄",
      "𝑅",
      "𝑆",
      "𝑇",
      "𝑈",
      "𝑉",
      "𝑊",
      "𝑋",
      "𝑌",
      "𝑍"
    ],
    "lower": [
      "𝑎",
      "𝑏",
      "𝑐",
      "𝑑",
      "𝑒",
      "𝑓",
      "𝑔",
      "ℎ",
      "𝑖",
      "𝑗",
      "𝑘",
      "𝑙",
      "𝑚",
      "𝑛",
      "𝑜",
      "𝑝",
      "𝑞",
      "𝑟",
      "𝑠",
      "𝑡",
      "𝑢",
      "𝑣",
      "𝑤",
      "𝑥",
      "𝑦",
      "𝑧"
    ]
  },
  "bold-italic": {
    "upper": [
      "𝑨",
      "𝑩",
      "𝑪",
      "𝑫",
      "𝑬",
      "𝑭",
      "𝑮",
      "𝑯",
      "𝑰",
      "𝑱",
      "𝑲",
      "𝑳",
      "𝑴",
      "𝑵",
      "𝑶",
      "𝑷",
      "𝑸",
      "𝑹",
      "𝑺",
      "𝑻",
      "𝑼",
      "𝑽",
      "𝑾",
      "𝑿",
      "𝒀",
      "𝒁"
    ],
    "lower": [
      "𝒂",
      "𝒃",
      "𝒄",
      "𝒅",
      "𝒆",
      "𝒇",
      "𝒈",
      "𝒉",
      "𝒊",
      "𝒋",
      "𝒌",
      "𝒍",
      "𝒎",
      "𝒏",
      "𝒐",
      "𝒑",
      "𝒒",
      "𝒓",
      "𝒔",
      "𝒕",
      "𝒖",
      "𝒗",
      "𝒘",
      "𝒙",
      "𝒚",
      "𝒛"
    ]
  },
  "bold-sans": {
    "upper": [
      "𝗔",
      "𝗕",
      "𝗖",
      "𝗗",
      "𝗘",
      "𝗙",
      "𝗚",
      "𝗛",
      "𝗜",
      "𝗝",
      "𝗞",
      "𝗟",
      "𝗠",
      "𝗡",
      "𝗢",
      "𝗣",
      "𝗤",
      "𝗥",
      "𝗦",
      "𝗧",
      "𝗨",
      "𝗩",
      "𝗪",
      "𝗫",
      "𝗬",
      "𝗭"
    ],
    "lower": [
      "𝗮",
      "𝗯",
      "𝗰",
      "𝗱",
      "𝗲",
      "𝗳",
      "𝗴",
      "𝗵",
      "𝗶",
      "𝗷",
      "𝗸",
      "𝗹",
      "𝗺",
      "𝗻",
      "𝗼",
      "𝗽",
      "𝗾",
      "𝗿",
      "𝘀",
      "𝘁",
      "𝘂",
      "𝘃",
      "𝘄",
      "𝘅",
      "𝘆",
      "𝘇"
    ],
    "digits": [
      "𝟬",
      "𝟭",
      "𝟮",
      "𝟯",
      "𝟰",
      "𝟱",
      "𝟲",
      "𝟳",
      "𝟴",
      "𝟵"
    ]
  },
  "bold-fraktur": {
    "upper": [
      "𝕬",
      "𝕭",
      "𝕮",
      "𝕯",
      "𝕰",
      "𝕱",
      "𝕲",
      "𝕳",
      "𝕴",
      "𝕵",
      "𝕶",
      "𝕷",
      "𝕸",
      "𝕹",
      "𝕺",
      "𝕻",
      "𝕼",
      "𝕽",
      "𝕾",
      "𝕿",
      "𝖀",
      "𝖁",
      "𝖂",
      "𝖃",
      "𝖄",
      "𝖅"
    ],
    "lower": [
      "𝖆",
      "𝖇",
      "𝖈",
      "𝖉",
      "𝖊",
      "𝖋",
      "𝖌",
      "𝖍",
      "𝖎",
      "𝖏",
      "𝖐",
      "𝖑",
      "𝖒",
      "𝖓",
      "𝖔",
      "𝖕",
      "𝖖",
      "𝖗",
      "𝖘",
      "𝖙",
      "𝖚",
      "𝖛",
      "𝖜",
      "𝖝",
      "𝖞",
      "𝖟"
    ]
  },
  "sans-italic": {
    "upper": [
      "𝘈",
      "𝘉",
      "𝘊",
      "𝘋",
      "𝘌",
      "𝘍",
      "𝘎",
      "𝘏",
      "𝘐",
      "𝘑",
      "𝘒",
      "𝘓",
      "𝘔",
      "𝘕",
      "𝘖",
      "𝘗",
      "𝘘",
      "𝘙",
      "𝘚",
      "𝘛",
      "𝘜",
      "𝘝",
      "𝘞",
      "𝘟",
      "𝘠",
      "𝘡"
    ],
    "lower": [
      "𝘢",
      "𝘣",
      "𝘤",
      "𝘥",
      "𝘦",
      "𝘧",
      "𝘨",
      "𝘩",
      "𝘪",
      "𝘫",
      "𝘬",
      "𝘭",
      "𝘮",
      "𝘯",
      "𝘰",
      "𝘱",
      "𝘲",
      "𝘳",
      "𝘴",
      "𝘵",
      "𝘶",
      "𝘷",
      "𝘸",
      "𝘹",
      "𝘺",
      "𝘻"
    ]
  },
  "circled": {
    "upper": [
      "Ⓐ",
      "Ⓑ",
      "Ⓒ",
      "Ⓓ",
      "Ⓔ",
      "Ⓕ",
      "Ⓖ",
      "Ⓗ",
      "Ⓘ",
      "Ⓙ",
      "Ⓚ",
      "Ⓛ",
      "Ⓜ",
      "Ⓝ",
      "Ⓞ",
      "Ⓟ",
      "Ⓠ",
      "Ⓡ",
      "Ⓢ",
      "Ⓣ",
      "Ⓤ",
      "Ⓥ",
      "Ⓦ",
      "Ⓧ",
      "Ⓨ",
      "Ⓩ"
    ],
    "lower": [
      "ⓐ",
      "ⓑ",
      "ⓒ",
      "ⓓ",
      "ⓔ",
      "ⓕ",
      "ⓖ",
      "ⓗ",
      "ⓘ",
      "ⓙ",
      "ⓚ",
      "ⓛ",
      "ⓜ",
      "ⓝ",
      "ⓞ",
      "ⓟ",
      "ⓠ",
      "ⓡ",
      "ⓢ",
      "ⓣ",
      "ⓤ",
      "ⓥ",
      "ⓦ",
      "ⓧ",
      "ⓨ",
      "ⓩ"
    ],
    "digits": [
      "⓪",
      "①",
      "②",
      "③",
      "④",
      "⑤",
      "⑥",
      "⑦",
      "⑧",
      "⑨"
    ]
  },
  "squared": {
    "upper": [
      "🄰",
      "🄱",
      "🄲",
      "🄳",
      "🄴",
      "🄵",
      "🄶",
      "🄷",
      "🄸",
      "🄹",
      "🄺",
      "🄻",
      "🄼",
      "🄽",
      "🄾",
      "🄿",
      "🅀",
      "🅁",
      "🅂",
      "🅃",
      "🅄",
      "🅅",
      "🅆",
      "🅇",
      "🅈",
      "🅉"
    ],
    "lower": [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z"
    ],
    "digits": [
      "⓪",
      "①",
      "②",
      "③",
      "④",
      "⑤",
      "⑥",
      "⑦",
      "⑧",
      "⑨"
    ]
  },
  "bubble": {
    "upper": [
      "Ⓐ",
      "Ⓑ",
      "Ⓒ",
      "Ⓓ",
      "Ⓔ",
      "Ⓕ",
      "Ⓖ",
      "Ⓗ",
      "Ⓘ",
      "Ⓙ",
      "Ⓚ",
      "Ⓛ",
      "Ⓜ",
      "Ⓝ",
      "Ⓞ",
      "Ⓟ",
      "Ⓠ",
      "Ⓡ",
      "Ⓢ",
      "Ⓣ",
      "Ⓤ",
      "Ⓥ",
      "Ⓦ",
      "Ⓧ",
      "Ⓨ",
      "Ⓩ"
    ],
    "lower": [
      "ⓐ",
      "ⓑ",
      "ⓒ",
      "ⓓ",
      "ⓔ",
      "ⓕ",
      "ⓖ",
      "ⓗ",
      "ⓘ",
      "ⓙ",
      "ⓚ",
      "ⓛ",
      "ⓜ",
      "ⓝ",
      "ⓞ",
      "ⓟ",
      "ⓠ",
      "ⓡ",
      "ⓢ",
      "ⓣ",
      "ⓤ",
      "ⓥ",
      "ⓦ",
      "ⓧ",
      "ⓨ",
      "ⓩ"
    ],
    "digits": [
      "⓪",
      "①",
      "②",
      "③",
      "④",
      "⑤",
      "⑥",
      "⑦",
      "⑧",
      "⑨"
    ]
  }
};

let apiStorage = null;
function readSettings() {
  const out = { ...DEFAULT_SETTINGS };
  const apiCache = safeRead(() => apiStorage?.cache);
  const source = { ...(apiCache && typeof apiCache === 'object' ? apiCache : {}), ...(storage || {}) };
  for (const key of Object.keys(DEFAULT_SETTINGS)) {
    if (source[key] !== undefined && source[key] !== null) out[key] = source[key];
  }
  if (!FONT_ALPHABET[out.fontStyle]) out.fontStyle = DEFAULT_SETTINGS.fontStyle;
  if (!COLOR_MODE_OPTIONS.some(x => x.id === out.colorMode)) out.colorMode = DEFAULT_SETTINGS.colorMode;
  if (!SPEED_OPTIONS.some(x => x.id === out.animationSpeed)) out.animationSpeed = DEFAULT_SETTINGS.animationSpeed;
  if (!MATCH_MODE_OPTIONS.some(x => x.id === out.targetMatchMode)) out.targetMatchMode = DEFAULT_SETTINGS.targetMatchMode;
  if (!SPACING_OPTIONS.some(x => x.id === out.letterSpacing)) out.letterSpacing = DEFAULT_SETTINGS.letterSpacing;
  if (!validHexColor(out.color)) out.color = DEFAULT_SETTINGS.color;
  if (!validHexColor(out.secondaryColor)) out.secondaryColor = DEFAULT_SETTINGS.secondaryColor;
  out.enabled = !!out.enabled;
  out.caseSensitive = !!out.caseSensitive;
  out.colorEnabled = !!out.colorEnabled;
  out.bold = !!out.bold;
  out.italic = !!out.italic;
  out.reduceMotion = !!out.reduceMotion;
  out.reverseAnimation = !!out.reverseAnimation;
  out.targetName = typeof out.targetName === 'string' ? out.targetName : '';
  return out;
}
function writeSettings(partial) {
  if (storage) for (const [key, value] of Object.entries(partial)) storage[key] = value;
  const next = { ...readSettings(), ...partial };
  if (storage) for (const [key, value] of Object.entries(next)) storage[key] = value;
  // Spec-3 storage is supported when a host passes it through, but the primary
  // build deliberately exports the Classic/Vendetta plugin shape.
  try { const pending = apiStorage?.set?.(next); pending?.catch?.(() => {}); } catch (_) {}
  syncAnimation(next);
}
function validHexColor(value) { return /^#[0-9a-fA-F]{6}$/.test(value || ''); }
function lightenHex(hex, amount) {
  if (!validHexColor(hex)) hex = '#B69CFF';
  const values = [1,3,5].map(i => parseInt(hex.slice(i, i+2), 16));
  return '#' + values.map(v => Math.round(v + (255-v)*(amount ?? 0.42)).toString(16).padStart(2,'0')).join('');
}
function mapText(input, style) {
  const map = ALPHABETS[FONT_ALPHABET[style]] || ALPHABETS.fraktur;
  return Array.from(input, char => {
    const code = char.codePointAt(0);
    if (style === '8bit') {
      const up = char.toUpperCase().codePointAt(0);
      if (up >= 65 && up <= 90) return map.upper[up - 65] || char;
      return char;
    }
    if (code >= 65 && code <= 90) return map.upper[code - 65] || char;
    if (code >= 97 && code <= 122) return map.lower[code - 97] || char;
    if (code >= 48 && code <= 57 && map.digits) return map.digits[code - 48] || char;
    return char;
  }).join('');
}

let storage = Object.create(null);
let colorProgress;
let colorLoop;
let colorLoopKey = '';
const unpatches = [];
function getProgress() {
  if (!colorProgress && Animated?.Value) colorProgress = new Animated.Value(0);
  return colorProgress;
}
function stopAnimation() {
  try { colorLoop?.stop?.(); } catch (_) {}
  colorLoop = null;
  colorLoopKey = '';
  try { colorProgress?.setValue?.(0); } catch (_) {}
}
function syncAnimation(settings) {
  const shouldAnimate = !!Animated && settings.enabled && settings.colorEnabled && !settings.reduceMotion && settings.colorMode !== 'solid';
  if (!shouldAnimate) { if (colorLoop) stopAnimation(); return; }
  const key = settings.colorMode + ':' + settings.animationSpeed + ':' + !!settings.reverseAnimation + ':' + settings.color + ':' + settings.secondaryColor;
  if (colorLoop && colorLoopKey === key) return;
  try { colorLoop?.stop?.(); } catch (_) {}
  const progress = getProgress();
  if (!progress) return;
  progress.setValue(0);
  const duration = ANIMATION_DURATIONS[settings.animationSpeed] || ANIMATION_DURATIONS.normal;
  const forward = Animated.timing(progress, { toValue: 6, duration, useNativeDriver: false, isInteraction: false });
  const animation = settings.reverseAnimation && typeof Animated.sequence === 'function'
    ? Animated.sequence([forward, Animated.timing(progress, { toValue: 0, duration, useNativeDriver: false, isInteraction: false })])
    : forward;
  colorLoop = Animated.loop(animation);
  colorLoopKey = key;
  colorLoop.start();
}
function colorValue(settings) {
  if (!settings.colorEnabled) return undefined;
  const safeCustom = validHexColor(settings.color) ? settings.color : '#B69CFF';
  if (settings.colorMode === 'solid' || settings.reduceMotion) return safeCustom;
  const progress = getProgress();
  if (!progress) return safeCustom;
  if (settings.colorMode === 'neon-pulse') return progress.interpolate({
    inputRange: [0,3,6], outputRange: [lightenHex(safeCustom), safeCustom, lightenHex(safeCustom)], extrapolate: 'clamp'
  });
  if (settings.colorMode === 'custom-cycle') {
    const second = validHexColor(settings.secondaryColor) ? settings.secondaryColor : '#55D6BE';
    return progress.interpolate({ inputRange: [0,3,6], outputRange: [safeCustom, second, safeCustom], extrapolate: 'clamp' });
  }
  const palette = COLOR_PALETTES[settings.colorMode] || COLOR_PALETTES.rainbow;
  return progress.interpolate({ inputRange: palette.inputRange, outputRange: palette.outputRange, extrapolate: 'clamp' });
}
function transformTextForSettings(input, settings) {
  const target = (settings.targetName || '').trim();
  if (!target) return input;
  const normalize = value => settings.caseSensitive ? value : value.toLocaleLowerCase();
  const haystack = normalize(input);
  const needle = normalize(target);
  const mode = settings.targetMatchMode || 'exact';
  if (mode === 'exact') return haystack.trim() === needle ? mapText(input, settings.fontStyle) : input;
  if (mode === 'starts-with') {
    const leading = input.length - input.trimStart().length;
    const visible = input.slice(leading);
    if (!normalize(visible).startsWith(needle)) return input;
    return input.slice(0, leading) + mapText(visible.slice(0, target.length), settings.fontStyle) + visible.slice(target.length);
  }
  // Replace all exact occurrences while leaving adjacent text and punctuation alone.
  let result = '';
  let cursor = 0;
  let found = haystack.indexOf(needle, cursor);
  if (found < 0) return input;
  while (found >= 0) {
    result += input.slice(cursor, found) + mapText(input.slice(found, found + target.length), settings.fontStyle);
    cursor = found + target.length;
    found = haystack.indexOf(needle, cursor);
  }
  return result + input.slice(cursor);
}
function textMatchesSettings(input, settings) {
  const target = (settings.targetName || '').trim();
  if (!target || typeof input !== 'string') return false;
  const normalize = value => settings.caseSensitive ? value : value.toLocaleLowerCase();
  const source = normalize(input.trim());
  const needle = normalize(target);
  if (settings.targetMatchMode === 'contains') return source.includes(needle);
  if (settings.targetMatchMode === 'starts-with') return source.startsWith(needle);
  return source === needle;
}
const patchDiagnostics = { factories: [], inspected: 0, transformed: 0, lastMatch: '' };
function isTextElementType(type) {
  return type === Text || type === RN?.Text || type?.displayName === 'Text' || type?.name === 'Text';
}
function makeStylePatch(settings) {
  const nextColor = colorValue(settings);
  const stylePatch = {};
  if (nextColor !== undefined) stylePatch.color = nextColor;
  if (settings.bold) stylePatch.fontWeight = '700';
  if (settings.italic) stylePatch.fontStyle = 'italic';
  if (settings.letterSpacing === 'loose') stylePatch.letterSpacing = 0.35;
  if (settings.letterSpacing === 'wide') stylePatch.letterSpacing = 0.8;
  return stylePatch;
}
function mergeStyle(props, stylePatch) {
  if (!Object.keys(stylePatch).length) return props;
  return { ...props, style: [props?.style, stylePatch] };
}
function patchElementArgs(method, first, second) {
  // Revenge's current patcher passes (args, self); Classic/Bunny shims may pass
  // (self, args). Always return the same argument array as well as mutating it.
  const args = Array.isArray(first) ? first : (Array.isArray(second) ? second : null);
  if (!args) return undefined;
  patchDiagnostics.inspected++;
  try {
    const settings = readSettings();
    if (!settings.enabled || !settings.targetName?.trim() || args.length < 1) return args;
    const type = args[0];
    const rawProps = args[1];
    const props = rawProps && typeof rawProps === 'object' && !Array.isArray(rawProps) ? rawProps : {};
    const isCreateElement = method === 'createElement';
    const hasPositionalChildren = isCreateElement && args.length >= 3;
    const originalChildren = hasPositionalChildren ? args.slice(2) : props.children;
    let stylePatch = null;
    function transformChild(child, depth = 0) {
      if (depth > 32 || child == null) return { value: child, changed: false };
      if (typeof child === 'string') {
        if (!textMatchesSettings(child, settings)) return { value: child, changed: false };
        const value = transformTextForSettings(child, settings);
        patchDiagnostics.transformed++;
        patchDiagnostics.lastMatch = child.slice(0, 96);
        return { value, changed: true };
      }
      if (Array.isArray(child)) {
        let changed = false;
        const value = child.map(part => {
          const result = transformChild(part, depth + 1);
          changed = changed || result.changed;
          return result.value;
        });
        return { value, changed };
      }
      // Walk pre-created React elements too; the older implementation stopped
      // at the element object and missed string children inside wrappers.
      if (typeof child === 'object' && child.props && typeof child.props === 'object' && 'children' in child.props) {
        const nested = transformChild(child.props.children, depth + 1);
        if (!nested.changed) return { value: child, changed: false };
        let nextProps = { ...child.props, children: nested.value };
        if (isTextElementType(child.type)) {
          if (!stylePatch) stylePatch = makeStylePatch(settings);
          nextProps = mergeStyle(nextProps, stylePatch);
        }
        let cloned = null;
        try { cloned = React?.cloneElement?.(child, nextProps); } catch (_) {}
        if (!cloned) cloned = { ...child, props: nextProps };
        return { value: cloned, changed: true };
      }
      return { value: child, changed: false };
    }
    const transformed = transformChild(originalChildren);
    if (!transformed.changed) return args;
    if (!stylePatch) stylePatch = makeStylePatch(settings);
    const nextProps = mergeStyle({ ...props }, stylePatch);
    if (!hasPositionalChildren) nextProps.children = transformed.value;
    args[1] = nextProps;
    if (hasPositionalChildren) {
      const newChildren = Array.isArray(transformed.value) ? transformed.value : [transformed.value];
      for (let i = 0; i < newChildren.length; i++) args[i + 2] = newChildren[i];
    }
    const nativeText = isTextElementType(type);
    const useAnimated = nativeText && settings.colorEnabled && !settings.reduceMotion && settings.colorMode !== 'solid' && !!Animated?.Text;
    if (useAnimated) args[0] = Animated.Text;
    return args;
  } catch (e) {
    logger?.warn?.('Darkio Fonty Fun: matching text could not be transformed', e);
    return args;
  }
}
function addPatcher(target, method) {
  if (!target || typeof target[method] !== 'function') return;
  const identity = method + ':' + (target === React ? 'React' : 'JSX');
  if (patchDiagnostics.factories.includes(identity)) return;
  const callback = (first, second) => patchElementArgs(method, first, second);
  if (typeof patcher?.before === 'function') {
    try {
      const unpatch = patcher.before(target, method, callback);
      if (typeof unpatch === 'function') {
        unpatches.push(unpatch);
        patchDiagnostics.factories.push(identity);
        return;
      }
    } catch (e) { logger?.warn?.('Darkio Fonty Fun: patcher.before failed for ' + method, e); }
  }
  // Fallback for Classic builds that expose React but no compatible patcher.
  try {
    const original = target[method];
    if (original.__darkioFontyFunWrapped) return;
    const wrapper = function (...args) {
      const next = patchElementArgs(method, args, this);
      return original.apply(this, Array.isArray(next) ? next : args);
    };
    Object.defineProperty(wrapper, '__darkioFontyFunWrapped', { value: true });
    target[method] = wrapper;
    unpatches.push(() => { if (target[method] === wrapper) target[method] = original; });
    patchDiagnostics.factories.push(method + ':direct-fallback');
  } catch (e) { logger?.warn?.('Darkio Fonty Fun: could not hook ' + method, e); }
}
function rowLabel(label, note) {
  return h(View, { style: { gap: 3, marginTop: 5 } },
    h(Text, { style: { color: '#F4F0FF', fontWeight: '700' } }, label),
    note ? h(Text, { style: { color: '#AAA7B5', fontSize: 12 } }, note) : null
  );
}
function choiceButton(label, active, onPress, sample) {
  return h(Pressable, {
    onPress,
    style: { borderWidth: 1, borderColor: active ? '#B69CFF' : '#4A4857', backgroundColor: active ? '#302744' : '#1C1B24', borderRadius: 10, padding: 11, marginBottom: 7, gap: 4 }
  },
    h(Text, { style: { color: '#F5F2FF', fontWeight: active ? '700' : '500' } }, label + (active ? '  ✓' : '')),
    sample ? h(Text, { style: { color: '#F5F2FF', fontSize: 18 } }, sample) : null
  );
}
function chip(label, active, onPress) {
  return h(Pressable, { onPress, style: { borderWidth: 1, borderColor: active ? '#B69CFF' : '#4A4857', backgroundColor: active ? '#302744' : '#1C1B24', borderRadius: 18, paddingVertical: 8, paddingHorizontal: 11, marginRight: 7, marginBottom: 7 } },
    h(Text, { style: { color: '#F5F2FF', fontWeight: active ? '700' : '400' } }, label + (active ? ' ✓' : ''))
  );
}
function toggleControl(value, onValueChange) {
  if (Switch) return h(Switch, { value: !!value, onValueChange });
  return h(Pressable, {
    onPress: () => onValueChange(!value),
    style: { borderWidth: 1, borderColor: value ? '#B69CFF' : '#4A4857', borderRadius: 18, paddingVertical: 8, paddingHorizontal: 12 }
  }, h(Text, { style: { color: '#F5F2FF', fontWeight: '700' } }, value ? 'ON' : 'OFF'));
}
function SettingsComponent(props = {}) {
  if (props?.api || props?.unscoped || props?.jsonStorage) resolveRuntime(props);
  if (!React || !h || typeof React.useState !== 'function') {
    return h && Forms?.FormSection && Forms?.FormRow
      ? h(Forms.FormSection, { title: 'Darkio Fonty Fun · V6.1' }, h(Forms.FormRow, { label: 'Settings unavailable', subLabel: 'This client did not expose the React settings runtime.' }))
      : null;
  }
  const suppliedStorage = safeRead(() => props?.api?.jsonStorage) || safeRead(() => props?.jsonStorage);
  if (suppliedStorage && typeof suppliedStorage === 'object') apiStorage = suppliedStorage;
  const liveSettings = safeRead(() => suppliedStorage?.use?.());
  if (liveSettings && typeof liveSettings === 'object') {
    for (const key of Object.keys(DEFAULT_SETTINGS)) if (storage[key] === undefined && liveSettings[key] !== undefined) storage[key] = liveSettings[key];
  }
  const settings = readSettings();
  const [enabledDraft, setEnabledDraft] = React.useState(settings.enabled ? '1' : '0');
  const [nameDraft, setNameDraft] = React.useState(settings.targetName || '');
  const [fontDraft, setFontDraft] = React.useState(String(Math.max(0, FONT_OPTIONS.findIndex(x => x.id === settings.fontStyle))));
  const colorIndex = Math.max(0, COLOR_MODE_OPTIONS.findIndex(x => x.id === settings.colorMode));
  const [colorDraft, setColorDraft] = React.useState(settings.colorMode === 'solid' ? settings.color : String(colorIndex));
  const [animationDraft, setAnimationDraft] = React.useState(String(settings.reduceMotion ? 0 : ({ 'very-slow': 1, slow: 2, normal: 3, fast: 4 }[settings.animationSpeed] || 3)));
  const [matchDraft, setMatchDraft] = React.useState(String(Math.max(0, MATCH_MODE_OPTIONS.findIndex(x => x.id === settings.targetMatchMode))));
  const [caseDraft, setCaseDraft] = React.useState(settings.caseSensitive ? '1' : '0');
  const [textStyleDraft, setTextStyleDraft] = React.useState(String((settings.bold ? 1 : 0) + (settings.italic ? 2 : 0)));
  const [spacingDraft, setSpacingDraft] = React.useState(String(Math.max(0, SPACING_OPTIONS.findIndex(x => x.id === settings.letterSpacing))));
  const [secondaryDraft, setSecondaryDraft] = React.useState(settings.secondaryColor || '#55D6BE');
  const [reverseDraft, setReverseDraft] = React.useState(settings.reverseAnimation ? '1' : '0');
  const [motionDraft, setMotionDraft] = React.useState(settings.reduceMotion ? '1' : '0');
  const update = partial => writeSettings(partial);
  const validNumber = (value, min, max) => /^\d+$/.test(String(value).trim()) && Number(value) >= min && Number(value) <= max;
  const onEnabled = value => { setEnabledDraft(value); if (value === '0' || value === '1') update({ enabled: value === '1' }); };
  const onName = value => { setNameDraft(value); update({ targetName: value }); };
  const onFont = value => { setFontDraft(value); if (validNumber(value, 0, FONT_OPTIONS.length - 1)) update({ fontStyle: FONT_OPTIONS[Number(value)].id }); };
  const onColor = value => {
    setColorDraft(value);
    const v = String(value).trim();
    if (v.toLowerCase() === 'off' || v === '-1') update({ colorEnabled: false });
    else if (validNumber(v, 0, COLOR_MODE_OPTIONS.length - 1)) update({ colorMode: COLOR_MODE_OPTIONS[Number(v)].id, colorEnabled: true });
    else if (validHexColor(v)) { update({ color: v.toUpperCase(), colorMode: 'solid', colorEnabled: true, reduceMotion: true }); setAnimationDraft('0'); setMotionDraft('1'); }
  };
  const onAnimation = value => {
    setAnimationDraft(value);
    if (validNumber(value, 0, 4)) {
      const id = Number(value);
      const speed = ({ 1: 'very-slow', 2: 'slow', 3: 'normal', 4: 'fast' })[id] || 'normal';
      update({ reduceMotion: id === 0, animationSpeed: speed });
      setMotionDraft(id === 0 ? '1' : '0');
    }
  };
  const onMatch = value => { setMatchDraft(value); if (validNumber(value, 0, 2)) update({ targetMatchMode: MATCH_MODE_OPTIONS[Number(value)].id }); };
  const onCase = value => { setCaseDraft(value); if (value === '0' || value === '1') update({ caseSensitive: value === '1' }); };
  const onTextStyle = value => { setTextStyleDraft(value); if (validNumber(value, 0, 3)) { const n = Number(value); update({ bold: n === 1 || n === 3, italic: n === 2 || n === 3 }); } };
  const onSpacing = value => { setSpacingDraft(value); if (validNumber(value, 0, 2)) update({ letterSpacing: SPACING_OPTIONS[Number(value)].id }); };
  const onSecondary = value => { setSecondaryDraft(value); if (validHexColor(String(value).trim())) update({ secondaryColor: String(value).trim().toUpperCase() }); };
  const onReverse = value => { setReverseDraft(value); if (value === '0' || value === '1') update({ reverseAnimation: value === '1' }); };
  const onMotion = value => {
    setMotionDraft(value);
    if (value === '0' || value === '1') {
      const reduceMotion = value === '1';
      update({ reduceMotion });
      if (reduceMotion) setAnimationDraft('0');
      else if (animationDraft === '0') setAnimationDraft('3');
    }
  };
  const titleStyle = { color: '#F4F0FF', fontWeight: '700', fontSize: 15, marginBottom: 5 };
  const noteStyle = { color: '#AAA7B5', fontSize: 12, lineHeight: 17, marginBottom: 6 };
  const inputStyle = { borderWidth: 1, borderColor: '#4A4857', borderRadius: 10, paddingVertical: 11, paddingHorizontal: 12, color: '#F5F2FF', backgroundColor: '#1C1B24', marginBottom: 13, minHeight: 44 };
  const textStyle = { color: '#E5E0F1', fontSize: 12, lineHeight: 18 };
  const headingStyle = { color: '#B69CFF', fontWeight: '800', fontSize: 13, marginTop: 13, marginBottom: 5, letterSpacing: 0.5 };
  const fontsList = FONT_OPTIONS.map((option, index) => `${index} = ${option.label} · ${option.sample}`).join('\n');
  const colorsList = COLOR_MODE_OPTIONS.map((option, index) => `${index} = ${option.label}`).join('\n');
  const target = settings.targetName || 'Darkio';
  const preview = mapText(target, settings.fontStyle);
  const previewColor = colorValue(settings) || '#FFFFFF';
  const inputField = (key, label, note, value, placeholder, onChange, keyboardType = 'default', autoCapitalize = 'none') => {
    const commonProps = { key, value, placeholder, onChange, title: label, subLabel: note, autoCapitalize, autoCorrect: false, keyboardType };
    if (TextInput) return h(View, { key: key + '-field', style: { marginBottom: 4 } },
      h(Text, { style: titleStyle }, label), h(Text, { style: noteStyle }, note),
      h(TextInput, { value, onChangeText: onChange, placeholder, placeholderTextColor: '#8A8795', autoCapitalize, autoCorrect: false, keyboardType, style: inputStyle }));
    if (Forms?.FormInput) return h(Forms.FormInput, commonProps);
    return h(Forms?.FormRow || Text, { key, label, subLabel: note + ' Text input is unavailable in this client.' });
  };
  const legend = (key, title, content) => h(View, { key, style: { marginTop: 6, padding: 11, borderRadius: 10, backgroundColor: '#1B1924', borderWidth: 1, borderColor: '#343044' } },
    h(Text, { style: headingStyle }, title), h(Text, { selectable: true, style: textStyle }, content));
  const fields = [
    inputField('enabled', '1. Enable styling (0 or 1)', '1 = on · 0 = off. Also enable the plugin in Revenge.', enabledDraft, '1', onEnabled, 'numeric'),
    inputField('display-name', '2. Display name', 'Name to match. Try Exact match first.', nameDraft, 'Your displayed name', onName),
    inputField('font-id', '3. Unicode font number', 'Choose 0–20. See FONT NUMBERS below.', fontDraft, '0–20', onFont, 'numeric'),
    inputField('color-id', '4. Color/effect or hex', 'Enter 0–12, #RRGGBB, or off. See COLOR NUMBERS.', colorDraft, '3 or #DC143C', onColor),
    inputField('animation-id', '5. Animation speed', '0 = off · 1 = very slow · 2 = slow · 3 = normal · 4 = fast.', animationDraft, '0–4', onAnimation, 'numeric'),
    inputField('match-mode', '6. Name matching', '0 = exact · 1 = contains · 2 = starts with.', matchDraft, '0–2', onMatch, 'numeric'),
    inputField('case-sensitive', '7. Case sensitivity', '1 = case-sensitive · 0 = ignore uppercase/lowercase.', caseDraft, '0 or 1', onCase, 'numeric'),
    inputField('text-style', '8. Bold/italic style', '0 = normal · 1 = bold · 2 = italic · 3 = bold + italic.', textStyleDraft, '0–3', onTextStyle, 'numeric'),
    inputField('letter-spacing', '9. Letter spacing', '0 = normal · 1 = loose · 2 = wide.', spacingDraft, '0–2', onSpacing, 'numeric'),
    inputField('secondary-color', '10. Secondary color', 'Hex color used by Custom Cycle, e.g. #55D6BE.', secondaryDraft, '#55D6BE', onSecondary),
    inputField('reverse-animation', '11. Reverse animation', '1 = ping-pong/reverse when supported · 0 = normal loop.', reverseDraft, '0 or 1', onReverse, 'numeric'),
    inputField('reduced-motion', '12. Reduce motion', '1 = stop animation · 0 = allow animation.', motionDraft, '0 or 1', onMotion, 'numeric'),
  ];
  const nativeAvailable = !!(View && Text && (TextInput || Forms?.FormInput));
  if (nativeAvailable) {
    const Container = ScrollView || View;
    return h(Container, { style: { flex: 1, backgroundColor: '#232229' }, contentContainerStyle: { padding: 16, paddingBottom: 28, gap: 2 }, keyboardShouldPersistTaps: 'handled' },
      h(Text, { style: { color: '#AAA7B5', fontSize: 11, fontWeight: '800', letterSpacing: 1.4, marginBottom: 8 } }, 'DARKIO FONTY FUN · V6.1'),
      h(Text, { style: { color: '#F5F2FF', fontSize: 21, fontWeight: '800', marginBottom: 4 } }, 'More control · No tap-only settings'),
      h(Text, { style: { color: '#AAA7B5', fontSize: 13, lineHeight: 19, marginBottom: 12 } }, 'Type into each field. Settings apply as soon as the value is valid. The plugin only changes matching text on this device.'),
      ...fields,
      h(View, { style: { borderRadius: 12, backgroundColor: '#1B1924', padding: 14, marginTop: 2, marginBottom: 8 } },
        h(Text, { style: headingStyle }, 'LIVE PREVIEW'),
        Animated?.Text && settings.colorEnabled && !settings.reduceMotion && settings.colorMode !== 'solid'
          ? h(Animated.Text, { style: { fontSize: 25, fontWeight: settings.bold ? '800' : '700', fontStyle: settings.italic ? 'italic' : 'normal', color: previewColor } }, preview)
          : h(Text, { style: { fontSize: 25, fontWeight: settings.bold ? '800' : '700', fontStyle: settings.italic ? 'italic' : 'normal', color: typeof previewColor === 'string' ? previewColor : '#B69CFF' } }, preview),
        h(Text, { style: { color: '#AAA7B5', fontSize: 11, marginTop: 4 } }, settings.enabled ? 'Styling is ON' : 'Styling is OFF'),
        h(Text, { style: { color: '#AAA7B5', fontSize: 11, marginTop: 4 } }, `Render hooks: ${patchDiagnostics.factories.length ? patchDiagnostics.factories.join(', ') : 'not attached yet'} · Matched strings: ${patchDiagnostics.transformed}`)
      ),
      legend('font-numbers', 'FONT NUMBERS · 0–20', fontsList),
      legend('color-numbers', 'COLOR NUMBERS · 0–12', colorsList),
      legend('advanced-options', 'ADVANCED OPTIONS', 'Match: 0 exact / 1 contains / 2 starts-with\nCase: 0 ignore case / 1 sensitive\nStyle: 0 normal / 1 bold / 2 italic / 3 both\nSpacing: 0 normal / 1 loose / 2 wide\nReverse: 0 off / 1 on\nReduce motion: 0 allow / 1 stop\nSecondary color is used by Custom Cycle. Enter "off" in the color field to disable color styling.'),
      h(Text, { style: { color: '#918C9F', fontSize: 11, lineHeight: 16, marginTop: 12 } }, 'Unicode look-alikes vary by device. This does not edit your public Discord account name. Use the same matching display text shown by Discord.')
    );
  }
  if (Forms?.FormSection && (Forms?.FormInput || Forms?.FormRow)) {
    return h(Forms.FormSection, { title: 'Darkio Fonty Fun · V6.1' },
      ...fields,
      h(Text || 'Text', null, fontsList + '\n\n' + colorsList));
  }
  return h && Text ? h(Text, null, 'Darkio Fonty Fun needs a settings runtime with text inputs. The plugin can still be enabled, but settings cannot be edited in this client.') : null;
}

const lifecycle = {
  start(context = {}) {
    resolveRuntime(context);
    const suppliedStorage = safeRead(() => context?.jsonStorage);
    if (suppliedStorage && typeof suppliedStorage === 'object') apiStorage = suppliedStorage;
    if (!React || !h) {
      logger?.error?.('Darkio Fonty Fun: React was not available; settings and rendering hooks could not be initialized.');
      return;
    }
    // createStorage is available in some Revenge Classic/Bunny builds too; do
    // not gate it on the newer spec-3 loader check.
    const persistentStorage = safeRead(() => legacy?.plugin?.storage)
      || safeRead(() => revengeApi?.plugin?.storage)
      || safeRead(() => legacy?.storage)
      || safeRead(() => revengeApi?.plugin?.createStorage?.());
    if (persistentStorage && typeof persistentStorage === 'object') storage = persistentStorage;
    else logger?.warn?.('Darkio Fonty Fun: persistent storage is unavailable; settings will last only for this session.');
    const savedApiSettings = safeRead(() => apiStorage?.cache);
    if (savedApiSettings && typeof savedApiSettings === 'object') {
      for (const [key, value] of Object.entries(savedApiSettings)) if (Object.prototype.hasOwnProperty.call(DEFAULT_SETTINGS, key)) storage[key] = value;
    }
    for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) if (storage[key] === undefined) storage[key] = value;
    if (apiStorage && !savedApiSettings) {
      try { const pending = apiStorage.set?.({ ...DEFAULT_SETTINGS }); pending?.catch?.(() => {}); } catch (_) {}
    }
    // React Native's classic JSX transform uses createElement. Some Discord builds use jsx/jsxs helpers.
    addPatcher(React, 'createElement');
    try {
      const jsx = jsxRuntime || findByProps?.('jsx', 'jsxs');
      if (jsx) { addPatcher(jsx, 'jsx'); addPatcher(jsx, 'jsxs'); if (typeof jsx.jsxDEV === 'function') addPatcher(jsx, 'jsxDEV'); }
    } catch (_) {}
    syncAnimation(readSettings());
    logger?.log?.('Darkio Fonty Fun V6.1 started (local rendering only).');
  },
  stop() {
    stopAnimation();
    while (unpatches.length) { try { unpatches.pop()(); } catch (_) {} }
    patchDiagnostics.factories.length = 0;
    logger?.log?.('Darkio Fonty Fun V6.1 stopped.');
  },
  SettingsComponent,
};

  // Classic/Vendetta plugin shape, matching the known-working reference plugins.
  // The settings key is intentional: Classic's wrench invokes this function.
  return {
    // Classic Vendetta/Bunny lifecycle names.
    onLoad: lifecycle.start,
    onUnload: lifecycle.stop,
    settings: lifecycle.SettingsComponent,
    // Newer Revenge lifecycle aliases. Unknown fields are harmless to Classic.
    start: lifecycle.start,
    stop: lifecycle.stop,
    SettingsComponent: lifecycle.SettingsComponent,
  };
})())
