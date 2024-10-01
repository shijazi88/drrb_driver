import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from '../../config/styles'
let ScreenHeight = Dimensions.get("window").height;
let width = Dimensions.get("window").width;
import { helpers } from '../../utils';
import { normalize } from '../../utils/index'

/**
 * Creates a StyleSheet style reference from the given object.
 * @param {object} style - component styles object.
 * @return {object}
 */
export default StyleSheet.create({

    container: {
        // flex: 1,
        minHeight: ScreenHeight - 77,
        backgroundColor: colors.white,
    },
    safeArea: {
        // flex: 1,
        // flexDirection: 'column',
        backgroundColor: colors.white
    },

    mainImage: {
        marginTop: 40,
        height: 360,
        width: width,
        resizeMode: 'contain',
    },
    headerImageBox: {
        justifyContent: 'space-between',
        flexDirection: 'row-reverse',
        marginTop: 10,
        marginHorizontal: 20,
        textAlign: 'center'
    },
    borderedBox: {
        marginHorizontal: 16,
        marginVertical: 16,
        borderWidth: 1,
        borderColor: colors.primaryLight,
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 16
    },
    borderedInput:{
        borderWidth: 1,
        borderColor: colors.primaryLight,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 10, flexDirection: 'row',
        marginVertical: 5
    },
    iconBackgroundRound:{
        width: 36,
        height: 36,
        backgroundColor: colors.primaryLight,
        alignSelf: 'center',
        marginHorizontal: 10,
        borderRadius: 8,
        justifyContent: 'center'
    },
    drbButton: {
        marginVertical: 5,
        height: normalize(45),
        backgroundColor: colors.primary,
        borderRadius: 10,
        fontWeight: 'bold',
    },
    errorText:{
        color: colors.error,
        // marginHorizontal: 5,
        fontSize: normalize(12),
        fontFamily: helpers.getFont(),
        textAlign: 'center'
    }
});