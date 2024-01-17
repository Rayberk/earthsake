import { View, Text, StyleSheet, Switch, SafeAreaView, Dimensions, TouchableOpacity, Button } from "react-native";
import React, { useEffect, useState } from "react";

import { Gyroscope, Accelerometer, DeviceMotion } from 'expo-sensors';

import { Chart, VerticalAxis, HorizontalAxis, Line } from 'react-native-responsive-linechart'

const LiveData = ({navigation}) => {
    const [gyroData, setGyroData] = useState({ x: 0, y: 0, z: 0 });
    const [gyroHistory, setGyroHistory] = useState([{ x: 0, y: 0, z: 0 }]); // [ {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0} ]

    const [accelData, setAccelData] = useState({ x: 0, y: 0, z: 0 });
    const [accelHistory, setAccelHistory] = useState([{ x: 0, y: 0, z: 0 }]); // [ {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0} ]

    const [deviceMotionData, setDeviceMotionData] = useState({ x: 0, y: 0, z: 0 });
    const [deviceMotionHistory, setDeviceMotionHistory] = useState([{ x: 0, y: 0, z: 0 }]); // [ {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0} ]


    const [sensorEnabled, setSensorEnabled] = useState(false);

    const currentDate = new Date();

    const dateWriter = () => {
        return `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}:${currentDate.getMilliseconds()}`
    }

    const _reset = () => {
        setGyroHistory([{ x: 0, y: 0, z: 0 }])

        setAccelHistory([{ x: 0, y: 0, z: 0 }])

        setDeviceMotionHistory([{ x: 0, y: 0, z: 0 }])
    }

    useEffect(() => {


        let subscription;
        let subscription2;
        let subscription3;
        Gyroscope.setUpdateInterval(1000);
        Accelerometer.setUpdateInterval(1000);
        DeviceMotion.setUpdateInterval(1000);






        if (sensorEnabled) {
            subscription = Gyroscope.addListener(gyroscopeListenerData => {

             
                setGyroData(gyroscopeListenerData);
                setGyroHistory(previousState => {
                    if (gyroHistory.length > 20) {
                        return [...previousState.slice(-20), gyroscopeListenerData]
                    } else {
                        return [...previousState, gyroscopeListenerData]
                    }
                }
                );
            });

            subscription2 = Accelerometer.addListener(accelerometerListenerData => {

                setAccelData(accelerometerListenerData);
                setAccelHistory(previousState => {
                    if (accelHistory.length > 20) {
                        return [...previousState.slice(-20), accelerometerListenerData]
                    } else {
                        return [...previousState, accelerometerListenerData]
                    }
                }
                );
            }
            );

            subscription3 = DeviceMotion.addListener(deviceMotionListenerData => {
                setDeviceMotionData(deviceMotionListenerData.acceleration);
                setDeviceMotionHistory(previousState => {
                    if (deviceMotionHistory.length > 20) {
                        return [...previousState.slice(-20), deviceMotionListenerData.acceleration]
                    } else {
                        return [...previousState, deviceMotionListenerData.acceleration]
                    }
                }
                );
            }
            );


        } else {

            subscription?.remove();
            subscription2?.remove();
            subscription3?.remove();


        }

        return () => {
            subscription?.remove();
            subscription2?.remove();
            subscription3?.remove();

        }
    }, [sensorEnabled, gyroHistory, accelHistory, deviceMotionHistory])

    const handleGyroToggle = () => {
        setSensorEnabled(previousState => !previousState);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.switchContainer}>
                <Button
                    title="Go to home"
                    onPress={() =>
                        navigation.navigate('home')
                    }
                />
               
                <View style={{ flexDirection: 'row' }}>
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={sensorEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor={'#3e3e3e'}
                    value={sensorEnabled}
                    onValueChange={handleGyroToggle}
                    style={styles.switch}
                />
                    <TouchableOpacity onPress={_reset} style={styles.button}>
                        <Text>Reset</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                <Text style={{ fontSize: 20 }}>Gyroscope:</Text>
                <Text>x: {gyroData.x?.toFixed(2)}</Text>
                <Text>y: {gyroData.y?.toFixed(2)}</Text>
                <Text>z: {gyroData.z?.toFixed(2)}</Text>

                <Chart
                    style={{ height: 160, width: 300 }}
                    data={
                        gyroHistory.map((item) => item.x)
                            .map((item, index) => ({ x: index, y: item }))
                    }
                    padding={{ left: 40, bottom: 5, right: 20, top: 5 }}
                    xDomain={{ min: 0, max: gyroHistory.length }}
                    yDomain={{ min: -1, max: 1 }}
                >
                    <VerticalAxis tickCount={11} theme={{ labels: { formatter: (v) => v?.toFixed(2) } }} />
                    <HorizontalAxis tickCount={5} />
                    <Line theme={{ stroke: { color: '#ffa500', width: 2 }, scatter: { default: { width: 2, height: 2, rx: 1 } } }} />
                </Chart>
            </View>
            <View>
                <Text style={{ fontSize: 20 }}>Accelerometer:</Text>
                <Text>x: {accelData.x?.toFixed(2)}</Text>
                <Text>y: {accelData.y?.toFixed(2)}</Text>
                <Text>z: {accelData.z?.toFixed(2)}</Text>

                <Chart
                    style={{ height: 160, width: 300 }}
                    data={
                        accelHistory.map((item) => item.x)
                            .map((item, index) => ({ x: index, y: item }))
                    }
                    padding={{ left: 40, bottom: 5, right: 20, top: 5 }}
                    xDomain={{ min: 0, max: accelHistory.length }}
                    yDomain={{ min: -1, max: 1 }}
                >
                    <VerticalAxis tickCount={11} theme={{ labels: { formatter: (v) => v?.toFixed(2) } }} />
                    <HorizontalAxis tickCount={5} />
                    <Line theme={{ stroke: { color: '#ffa500', width: 2 }, scatter: { default: { width: 2, height: 2, rx: 1 } } }} />
                </Chart>
            </View>
            <View>
                <Text style={{ fontSize: 20 }}>DeviceMotion:</Text>
                <Text>x: {deviceMotionData.x?.toFixed(2)}</Text>
                <Text>y: {deviceMotionData.y?.toFixed(2)}</Text>
                <Text>z: {deviceMotionData.z?.toFixed(2)}</Text>

                <Chart

                    style={{ height: 160, width: 300 }}
                    data={
                        deviceMotionHistory.map((item) => item.x)
                            .map((item, index) => ({ x: index, y: item }))
                    }
                    padding={{ left: 40, bottom: 5, right: 20, top: 5 }}
                    xDomain={{ min: 0, max: deviceMotionHistory.length }}
                    yDomain={{ min: -1, max: 1 }}
                >
                    <VerticalAxis tickCount={11} theme={{ labels: { formatter: (v) => v?.toFixed(2) } }} />
                    <HorizontalAxis tickCount={5} />
                    <Line theme={{ stroke: { color: '#ffa500', width: 2 }, scatter: { default: { width: 2, height: 2, rx: 1 } } }} />
                </Chart>
            </View>






        </SafeAreaView >
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

export default LiveData;

/* <View
                style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: 'red',
                    transform: [
                        { translateX: gyroData.y * 10 },
                        { translateY: gyroData.x * 10 },

                    ]
                }} >
            </View>

                <Chart
                    style={{ height: 200, width: 300 }}
                    data={
                        gyroHistory.map((item) => item.x)
                            .map((item, index) => ({ x: index, y: item }))
                    }
                    padding={{ left: 40, bottom: 5, right: 20, top: 5 }}
                    xDomain={{ min: 0, max: gyroHistory.length }}
                    yDomain={{ min: -1, max: 1 }}
                >
                    <VerticalAxis tickCount={11} theme={{ labels: { formatter: (v) => v?.toFixed(2) } }} />
                    <HorizontalAxis tickCount={5} />
                    <Line theme={{ stroke: { color: '#ffa500', width: 2 }, scatter: { default: { width: 2, height: 2, rx: 1 } } }} />
                </Chart>
            > */