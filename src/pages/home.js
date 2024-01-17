import React, { useEffect, useState } from 'react'
import { View, Button, Text, StyleSheet, SafeAreaView, Image } from 'react-native'
import * as Location from "expo-location";
// import { useFonts } from 'expo-font';

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

const Home = ({ navigation }) => {
    const [earthquakeData, setEarthquakeData] = useState();
    const [location, setLocation] = useState(false);
    const [locationError, setLocationError] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [distance, setDistance] = useState(0);
    const [textWarning, setTextWarning] = useState(["", "", "", ""]);
    // let [fontsLoaded] = useFonts({
    //     'Century Gothic': require('../../assets/fonts/Century Gothic.ttf'),
    // });


    useEffect(() => {

        const getLocation = async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();

                if (status !== "granted") {
                    setLocationError("Location permission denied");
                    return;
                }
                let today = new Date();
                today.setDate(today.getDate() - 1);
                let yesterday = today.toISOString().slice(0, 10);
                let location = await Location.getCurrentPositionAsync({});
                setLocation(location);
                fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${yesterday}&minmagnitude=4&latitude=${location.coords.latitude}&longitude=${location.coords.longitude}&maxradiuskm=1000&orderby=magnitude-asc`)
                    .then((response) => response.json())
                    .then((json) => {
                        setEarthquakeData(json)
                        setLoading(false)
                        let dst = getDistanceFromLatLonInKm(location.coords.latitude, location.coords.longitude, json.features[0].geometry.coordinates[1], json.features[0].geometry.coordinates[0]);
                        setDistance(String(dst).split('.')[0]);
                    })
                    .catch((error) => {
                        console.error(error)
                        setLoading(false)
                    
                    })
                    
                
            } catch (error) {
                console.error("Error requesting location permission:", error);
            }
        };

        getLocation();
    }, [])




    return (
        <SafeAreaView style={styles.container}>
            <View style={{backgroundColor: "#ffffff"}}>
                <Image style={styles.logo} source={require('../../assets/earthsake-logo-vertical-transparent.png')} />
                {/* <Button
                    title="Go to live data"
                    onPress={() =>
                        navigation.navigate('live')
                    }
                /> */}
            </View>
            <View style={styles.infoContainer}>
                <View style={{ marginTop: 64 }}>
                    <Text style={styles.description}>Blank motion alarm <Text style={{ color: "#55a846" }}>active</Text></Text>
                    <Text style={styles.title}>You are <Text style={{ color: "#55a846", fontWeight: 600 }}>safe</Text></Text>
                    <View>
                        <Image style={styles.safe} source={require('../../assets/safe.png')} />

                    </View>
                    {!(earthquakeData && earthquakeData.features[0]) ? <Text style={styles.description2}>{locationError}</Text> : <Text style={styles.description5}> {"\n"} {distance + " km " + earthquakeData.features[0].properties.title.split(' ')[1] + ", \n" + earthquakeData.features[0].properties.title.split(' ')[7] +  " " + earthquakeData.features[0].properties.title.split(' ')[8]}</Text>}
                    <Text style={styles.description}>Your location: </Text>
                    {!location ? <Text style={styles.description4}>{locationError}</Text> : <Text style={styles.description4}>{location.coords.latitude + ", " + location.coords.longitude}</Text>}
                    
                    <Text style={styles.description}>Nearest earthquake: </Text>
                    {!(earthquakeData && earthquakeData.features[0]) ? <Text style={styles.description2}>{locationError}</Text> : <Text style={styles.description2}><Text style={styles.description3}>{earthquakeData.features[0].properties.title}</Text> </Text>}
                </View>

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },

    title: {
        fontSize: 48,
        fontWeight: "500",
        marginTop: 0,
        // fontFamily: 'Century Gothic',
        lineHeight: 48,
    },
    description: {
        // fontFamily: 'Century Gothic',
        fontSize: 16,
        fontWeight: "400",
        marginTop: 8,
        marginBottom: 0,
        textAlign: 'center',
        color: 'black'
    },
    description2: {
        // fontFamily: 'Century Gothic',
        fontSize: 32,
        fontWeight: "400",
        marginTop: 0,
        marginBottom: 0,
        textAlign: 'center',
        color: 'black',
        width: 200,
        alignSelf: 'center',
        lineHeight: 16,
    },
    description3: {
        // fontFamily: 'Century Gothic',
        fontSize: 16,
        fontWeight: "400",
        marginTop: 0,
        marginBottom: 4,
        textAlign: 'center',
        color: 'red'
    },
    description4: {
        // fontFamily: 'Century Gothic',
        fontSize: 16,
        fontWeight: "500",
        marginTop: 8,
        marginBottom: 0,
        textAlign: 'center',
        color: 'black',
        
    },
    description5: {
        // fontFamily: 'Century Gothic',
        fontSize: 32,
        fontWeight: "400",
        marginTop: 0,
        marginBottom: 0,
        textAlign: 'center',
        color: 'black',
        width: 200,
        alignSelf: 'center',
        lineHeight: 32,
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
        padding: 5,
        margin: 4
    },
    logo: {
        width: 300,
        height: 75,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: 8,
        marginBottom: 8,
        backgroundColor: "#ffffff"
    },

    safe: {
        width: 172,
        height: 172,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: 24,
        marginBottom: 24,

    },

    infoContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'start',
        width: '100%',
        padding: 3,
        backgroundColor: '#f5f5f5'
    }

});

export default Home