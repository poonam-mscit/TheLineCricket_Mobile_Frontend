// TheLine Cricket Color Scheme - Extracted from Web Frontend
// Cricket Brand Colors
const cricketGreen = '#2e4b5f';
const cricketGreenHover = '#1a3240';
const cricketGreenLight = '#4a6b7f';
const fireOrange = '#e85e20';
const fireOrangeHover = '#d14a0f';
const fireOrangeLight = '#ff7a3d';

// Sports Theme Colors
const grassGreen = '#1a5f3f';
const skyBlue = '#4a90e2';
const sunsetGold = '#f4a261';
const leatherBrown = '#8b4513';

// Sports Neutral Colors
const stadiumWhite = '#ffffff';
const scoreboardBlack = '#000000';
const fieldLight = '#f0f8f0';
const pavilionCream = '#faf9f6';
const boundaryLine = '#34495e';
const scoreboardGray = '#2c3e50';

// Standard grays with sports naming
const gray50 = fieldLight;
const gray100 = '#e8f4e8';
const gray200 = '#d4e6d4';
const gray300 = '#b8d4b8';
const gray400 = '#9cb89c';
const gray500 = '#6c8a6c';
const gray600 = scoreboardGray;
const gray700 = boundaryLine;
const gray800 = '#1a252a';

// Semantic Colors
const success = '#28a745';
const successLight = '#d4edda';
const error = '#dc3545';
const errorLight = '#f8d7da';
const warning = '#ffc107';
const warningLight = '#fff3cd';
const info = '#17a2b8';
const infoLight = '#d1ecf1';

// Social Colors
const facebook = '#1877f2';
const google = '#4285f4';

export default {
  light: {
    // Primary Colors
    primary: cricketGreen,
    primaryHover: cricketGreenHover,
    primaryLight: cricketGreenLight,
    contrast: fireOrange,
    contrastHover: fireOrangeHover,
    contrastLight: fireOrangeLight,
    
    // Sports Colors
    grassGreen,
    skyBlue,
    sunsetGold,
    leatherBrown,
    
    // Neutral Colors
    text: scoreboardGray,
    background: stadiumWhite,
    card: stadiumWhite,
    border: gray200,
    
    // Semantic Colors
    success,
    successLight,
    error,
    errorLight,
    warning,
    warningLight,
    info,
    infoLight,
    
    // Social Colors
    facebook,
    google,
    
    // Legacy support
    tint: cricketGreen,
    tabIconDefault: gray400,
    tabIconSelected: cricketGreen,
  },
  dark: {
    // Primary Colors
    primary: stadiumWhite,
    primaryHover: gray100,
    primaryLight: gray200,
    contrast: fireOrange,
    contrastHover: fireOrangeHover,
    contrastLight: fireOrangeLight,
    
    // Sports Colors
    grassGreen,
    skyBlue,
    sunsetGold,
    leatherBrown,
    
    // Neutral Colors
    text: stadiumWhite,
    background: scoreboardBlack,
    card: gray800,
    border: gray700,
    
    // Semantic Colors
    success,
    successLight,
    error,
    errorLight,
    warning,
    warningLight,
    info,
    infoLight,
    
    // Social Colors
    facebook,
    google,
    
    // Legacy support
    tint: stadiumWhite,
    tabIconDefault: gray400,
    tabIconSelected: stadiumWhite,
  },
};
