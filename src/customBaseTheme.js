import {
  red900,
  cyan700,
  grey600,
  pinkA100, pinkA200, pinkA400,
  fullWhite,
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';

export default {
  spacing: {
      iconSize: 24,
      desktopGutter: 30,
      desktopGutterMore: 32,
      desktopGutterLess: 16,
      desktopGutterMini: 8,
      desktopKeylineIncrement: 60,  // left-nav width = this * 4
      desktopDropDownMenuItemHeight: 32,
      desktopDropDownMenuFontSize: 15,
      desktopLeftNavMenuItemHeight: 30,
      desktopSubheaderHeight: 48,
      desktopToolbarHeight: 56
  },
  fontFamily: 'Roboto, sans-serif',
  borderRadius: 2,
  palette: {
    primary1Color: red900,
    primary2Color: cyan700,
    primary3Color: grey600,
    accent1Color: pinkA200,
    accent2Color: pinkA400,
    accent3Color: pinkA100,
    textColor: fullWhite,
    secondaryTextColor: fade(fullWhite, 0.7),
    alternateTextColor: fullWhite,
    canvasColor: '#303030',
    borderColor: fade(fullWhite, 0.3),
    disabledColor: fade(fullWhite, 0.3),
    pickerHeaderColor: fade(fullWhite, 0.12),
    clockCircleColor: fade(fullWhite, 0.12),
  },
};