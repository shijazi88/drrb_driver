import {
  Platform
} from 'react-native';

export default {

  getFont: () => {
    return Platform.OS === 'ios' ? 'Almarai-Regular' : 'Almarai-Regular'
  },
  getFontBold: () => {
    return Platform.OS === 'ios' ? 'Almarai-Bold' : 'Almarai-Bold'
  },
  getFontExtraBold: () => {
    return Platform.OS === 'ios' ? 'Almarai-ExtraBold' : 'Almarai-ExtraBold'
  },
  getFontExtraLight: () => {
    return Platform.OS === 'ios' ? 'Almarai-Light' : 'Almarai-Light'
  },
  parseArabic: (str) => {
    if (!str) return str;

    const isnum = /^\d+$/.test(str);

    if (isnum)
      return str;

    let number = Number(str.replace(/[٠١٢٣٤٥٦٧٨٩]/g, function (d) {
      return d.charCodeAt(0) - 1632; // Convert Arabic numbers
    }));

    if (isNaN(number)) {
      return str;
    }

    if (str.startsWith("٠٠")) {
      return `00${number}`
    }

    if (str.startsWith("٠")) {
      return `0${number}`
    }

    return `${number}`
  },
  /**
   * Check if point inside the the polygon
   * @param point
   * @param polygon
   * @return {boolean}
   */
  // isPointInPolygon : (point, polygon) => {
  //   if(!polygon) return false;

  //   const checkResult = polygon.find((row) => {
  //     return !row.latitude || !row.longitude;
  //   });

  //   if(checkResult && Object.keys(checkResult).length > 0) {
  //     return false
  //   }

  //   try {
  //     return geolib.isPointInPolygon(
  //       point,
  //       polygon
  //     );
  //   } catch (err) {
  //     return false
  //   }
  // }

  
}