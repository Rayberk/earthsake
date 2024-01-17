import { View, Text, StyleSheet, Switch, SafeAreaView, Dimensions, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";

import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LiveData from "./pages/live-data";
import Home from "./pages/home";

const Stack = createNativeStackNavigator();

const AppNav = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="live" screenOptions={{
                headerShown: false
            }}>
                <Stack.Screen name="home" component={Home} options={{ title: 'Home' }} />
                <Stack.Screen name="live" component={LiveData} options={{ title: 'Live Data' }} />
            </Stack.Navigator>

        </NavigationContainer>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },

    title: {
        fontSize: 40,
        fontWeight: 'bold',
        marginTop: 40
    },

    switchContainer: {
        marginBottom: 16,
        marginTop: 16
    },

    switch: {
        alignSelf: 'center',
        marginTop: 16,
        marginBottom: 16,
        transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }]
    },

    button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10,
        margin: 4
    },
});

export default AppNav;
