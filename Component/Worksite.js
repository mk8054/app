import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import style from '../Component/Style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const Worksite = ({ navigation, route }) => {

    const [sites, setSites] = useState([]);
    const [selectedSite, setSelectedSite] = useState(null);

    const getallsites = async () => {
        try {
            const officerid = await AsyncStorage.getItem('userID');
            const token = await AsyncStorage.getItem('token');

            const response = await fetch(`https://officer-reports-backend.onrender.com/api/officer/get/${officerid}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            console.log("API response: ", result);

            if (result && result.data) {
                if (result.data.assignSiteIds) {
                    setSites(result.data.assignSiteIds);
                }
            } else {
                console.error('Error: Response does not contain "data" field', result);
            }
        } catch (error) {
            console.error('Error fetching sites:', error);
        }
    };

    const handleSitePress = async (site) => {
        try {
            await AsyncStorage.setItem('selectedSite', JSON.stringify(site));
            await AsyncStorage.setItem('siteid', site._id);
            setSelectedSite(site);
            navigation.navigate("Reports")
            console.log('Selected site saved:', site);
        } catch (error) {
            console.error('Error saving selected site:', error);
        }
    };

    useEffect(() => {
        getallsites();
    }, []);

    return (
        <ScrollView style={style.MainscrollviewofSchedule}>
            <View style={style.Mainschedulemainview}>
                <View style={style.scheduletextandcrossview}>
                    <Text style={style.scheduletext}>Option</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <FontAwesomeIcon color='grey' icon={faXmark} />
                    </TouchableOpacity>
                </View>
                <View style={style.worksitemainview}>
                    <Text style={style.selectsitetextinsites}>Select a Site</Text>
                    {(
                        sites.map((site, index) => (
                            <TouchableOpacity key={site._id} style={style.styleforclient} onPress={() => handleSitePress(site)} >
                                <Text style={style.textforsitesandclient}>Client: {site.clientId.companyName}</Text>
                                <Text style={style.textforsitesandclient}>Site: {site.siteName}</Text>
                            </TouchableOpacity>
                        ))
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

export default Worksite;
