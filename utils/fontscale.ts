import { PixelRatio } from 'react-native';

export function getCappedFontScale(max = 1.3) {
  return Math.min(PixelRatio.getFontScale(), max);
}