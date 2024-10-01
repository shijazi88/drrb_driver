import { View } from "react-native";
import React, { Component } from "react";
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../../config/styles";

class Loading extends Component {

    async componentDidMount() {
        try {
            const isLoggedIn = await AsyncStorage.getItem("isLoggedIn")
            if (isLoggedIn == "true") {
                this.props.navigation.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [
                            { name: 'Home' },
                        ],
                    })
                );
            } else {
                AsyncStorage.setItem("isLoggedIn", JSON.stringify(null))
                AsyncStorage.setItem("profileData", JSON.stringify(null))
                AsyncStorage.setItem("token", JSON.stringify(null))
                this.props.navigation.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [
                            { name: 'SignIn' },
                        ],
                    })
                );
            }
        } catch (error) {
            console.log("Error => ", error)
        }
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: colors.white
            }}>

            </View>
        )
    }

}
export default Loading;