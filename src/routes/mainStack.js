import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import signIn from "../components/signIn/signIn";
import home from "../components/home/home";
import Loading from "../components/loading/loading";
import trip from "../components/trip/trip";
import complaint from "../components/complaint/complaint";


const Stack = createStackNavigator();
function MainStackScreen() {

    return (
        <Stack.Navigator screenOptions={{ headerShown: false, gestureDirection: 'horizontal-inverted' }}>
            <Stack.Screen name="Loading" component={Loading} />
            <Stack.Screen name="Home" component={home} />
            <Stack.Screen name="SignIn" component={signIn} />
            <Stack.Screen name="Trip" component={trip} />
            <Stack.Screen name="Complaint" component={complaint} />
        </Stack.Navigator>
    );
}
export default MainStackScreen