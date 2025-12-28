// Design Tokens do SDS - Extraídos do protótipo Figma
// https://www.figma.com/design/gHucsLGgjNJs3jLKNTONvi/%F0%9F%92%BB-SDS---Nova-Solu%C3%A7%C3%A3o

export const colors = {
  // Azul Principal
  blue: {
    50: '#e9f5f9',
    100: '#d3ebf3',
    200: '#b6dce9',
    300: '#6cbdd8',
    400: '#4fb1d1',
    500: '#239dc5', // Principal
    600: '#208fb3',
    700: '#1a8db3',
    800: '#196f8c',
    900: '#0f4253',
  },
  // Cinza
  grey: {
    50: '#f5f5f5',
    100: '#e1e1e1',
    200: '#c4c4c4',
    300: '#a8a8a8',
    400: '#8c8c8c',
    500: '#6e6e6e',
    600: '#909090',
    700: '#707070',
    800: '#575757',
    900: '#424242',
  },
  // Verde (Sucesso)
  green: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981', // Principal
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  // Vermelho (Erro)
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#c3363d', // Principal
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  // Amarelo (Alerta)
  yellow: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Principal
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  // Roxo (Avatar)
  purple: {
    500: '#b535ff',
    600: '#a020f0',
  },
  // Base
  white: '#ffffff',
  black: '#000000',
}

export const typography = {
  fontFamily: "'Poppins', sans-serif",
  
  // Headings
  h1: {
    fontSize: '24px',
    fontWeight: 600,
    lineHeight: '100%',
  },
  h2: {
    fontSize: '22px',
    fontWeight: 600,
    lineHeight: 'normal',
  },
  h3: {
    fontSize: '18px',
    fontWeight: 600,
    lineHeight: '100%',
  },
  
  // Body
  body1Semibold: {
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '100%',
  },
  body1Regular: {
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '100%',
  },
  body2Semibold: {
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: '100%',
  },
  body2Medium: {
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
  },
  body2Regular: {
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '20px',
  },
  
  // Caption
  caption: {
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '100%',
  },
  captionSmall: {
    fontSize: '10px',
    fontWeight: 400,
    lineHeight: '14px',
  },
  
  // Stepper
  stepLabel: {
    fontSize: '13px',
    fontWeight: 500,
    lineHeight: 'normal',
  },
}

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '40px',
}

export const borderRadius = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  pill: '33px',
  full: '9999px',
}

export const shadows = {
  sm: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
  md: '0px 4px 6px -2px rgba(0, 0, 0, 0.05), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)',
  lg: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
}

// Classes Tailwind customizadas para o projeto
export const tailwindClasses = {
  // Header
  header: 'bg-[#239dc5] flex items-center gap-6 px-6 py-4 rounded-lg shadow-lg',
  headerPill: 'bg-[#e9f5f9] border border-[#4fb1d1] px-[18px] py-[10px] rounded-[33px]',
  headerPillText: "font-['Poppins'] font-medium text-sm text-[#208fb3]",
  headerAvatar: 'bg-[#b535ff] w-[30px] h-[30px] rounded-full flex items-center justify-center',
  
  // Container
  container: 'bg-white rounded-lg p-6',
  containerTitle: "font-['Poppins'] font-semibold text-base text-[#424242]",
  containerDesc: "font-['Poppins'] font-normal text-sm text-[#707070] leading-5",
  
  // Cards
  card: 'bg-white border border-[#e1e1e1] rounded-md p-4',
  cardTitle: "font-['Poppins'] font-medium text-sm text-[#424242]",
  cardMeta: "font-['Poppins'] font-normal text-[10px] text-[#909090]",
  
  // Tags
  tagBlue: 'bg-[#e9f5f9] text-[#0f4253] text-xs px-1 py-0.5 rounded',
  tagGreen: 'bg-[#ecfdf5] text-[#10b981] text-xs px-1 py-0.5 rounded',
  tagYellow: 'bg-[#fffbeb] text-[#f59e0b] text-xs px-1 py-0.5 rounded',
  tagRed: 'bg-[#fef2f2] text-[#c3363d] text-xs px-1 py-0.5 rounded',
  
  // Buttons
  btnPrimary: 'bg-[#239dc5] text-[#e9f5f9] px-3 py-3 rounded-md font-normal text-sm',
  btnSecondary: 'text-[#208fb3] px-3 py-3 rounded-md font-normal text-sm',
  btnOutline: 'border border-[#4fb1d1] text-[#208fb3] px-3 py-3 rounded-md font-normal text-sm',
  
  // Progress bar
  progressBg: 'bg-[#e1e1e1] h-[7px] rounded-[30px]',
  progressFill: 'bg-gradient-to-r from-[#6ec8e5] to-[#1c7b99] h-[7px] rounded-[30px]',
  
  // Info box
  infoBox: 'bg-[#e9f5f9] border border-[#6cbdd8] rounded-md p-4',
  
  // Success message
  successText: "font-['Poppins'] text-sm text-[#10b981] leading-5",
  
  // Error message
  errorText: "font-['Poppins'] text-sm text-[#c3363d] leading-5",
}

