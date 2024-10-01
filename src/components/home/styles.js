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
        flex: 1,
        minHeight: ScreenHeight - 77,
        backgroundColor: colors.white,
    },
    safeArea: {
        flex: 1,
        flexDirection: 'column',
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
    borderedInput: {
        borderWidth: 1,
        borderColor: colors.primaryLight,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 10, flexDirection: 'row',
        marginVertical: 5
    },
    iconBackgroundRound: {
        width: 36,
        height: 36,
        backgroundColor: colors.primaryLight,
        alignSelf: 'center',
        // marginHorizontal: 10,
        borderRadius: 8,
        justifyContent: 'center', padding: 10
    },
    drbButton: {
        marginVertical: 5,
        height: normalize(31),
        backgroundColor: colors.primary,
        borderRadius: 10,
        fontWeight: 'bold',
    },
    drbButtonDisabled: {
        marginVertical: 5,
        height: normalize(31),
        backgroundColor: colors.primaryLight,
        borderRadius: 10,
        fontWeight: 'bold',
    },
    filterItem: {
        backgroundColor: colors.white,
        minWidth: 40,
        height: 40,
        borderRadius: 6,
        justifyContent: 'center',
        marginHorizontal: 5,
        shadowColor: colors.grey2,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: colors.primaryLight, paddingHorizontal: 10
    },
    filterItemSelected: {
        backgroundColor: colors.primaryLight,
        minWidth: 40,
        height: 40,
        borderRadius: 6,
        justifyContent: 'center',
        marginHorizontal: 5,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: colors.primary, paddingHorizontal: 10
    },
    filterItemText: {

        textAlign: 'center',
        color: colors.grey3,
        fontSize: normalize(12),
        textAlignVertical: 'center',
        padding: 3,
        paddingHorizontal: 10
    },
    filterItemTextSelected: {

        textAlign: 'center',
        color: colors.black,
        fontSize: normalize(12),
        textAlignVertical: 'center',
        padding: 3,
        paddingHorizontal: 10
    },
    tripListItemContainer: {
        borderWidth: 1,
        borderColor: colors.primaryLight,
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 16, marginVertical: 10
    },
    durationBox: {
        marginHorizontal: 16,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: colors.primaryLight,
        borderRadius: 6,
        paddingVertical: 3,
        textAlign: 'center'
    },
    smallTagFilled: {
        backgroundColor: colors.primary50,
        padding: 3,
        minWidth: 40,
        // height: 26,
        borderRadius: 6,
        justifyContent: 'center',
        marginHorizontal: 5,
        paddingHorizontal: 10,
    },
    smallTag: {
        padding: 3,
        minWidth: 40,
        // height: 26,
        borderRadius: 6,
        justifyContent: 'center',
        marginHorizontal: 5,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: colors.primary50
    },
    smallTagBlackBorder: {
       padding: 3,
        minWidth: 40,
        // height: 26,
        borderRadius: 6,
        justifyContent: 'center',
        marginHorizontal: 5,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: colors.primary
    },
    smallTagFilledGreen: {
        padding: 3,
         minWidth: 40,
         // height: 26,
         borderRadius: 6,
         justifyContent: 'center',
         marginHorizontal: 5,
         paddingHorizontal: 10,
        //  borderWidth: 1,
         backgroundColor: colors.green1,
        //  borderColor: colors.primary
     },
    content: {
        justifyContent: 'center', flex: 1,  marginBottom: 120,
    },
});