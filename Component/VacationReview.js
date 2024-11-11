import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleLeft, faStarOfLife } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import style from '../Component/Style';

const VacationReview = ({navigation}) => {

    const [officerName, setOfficerName] = useState('');
    const [clientName, setClientName] = useState('');
    const [siteName, setSiteName] = useState('');
    const [data, setData] = useState([]);

    const getOfficerInfo = async () => {
        try {
            const officer = await AsyncStorage.getItem('name');
            const selectedSite = await AsyncStorage.getItem('selectedSite');
            const parsedSelectedSite = selectedSite ? JSON.parse(selectedSite) : null;
            setOfficerName(officer || 'N/A');
            setClientName(parsedSelectedSite?.clientId?.companyName);
            setSiteName(parsedSelectedSite?.siteName);
        } catch (error) {
            console.error('Error retrieving officer info', error);
        }
    };

    const vacationget = async () => {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userID');
        const apiUrl = `https://officer-reports-backend.onrender.com/api/vacation/getByUserId/${userId}`;
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        const result = await response.json();
        setData(result.data);
        console.log(data, "datadatadata")
    }

    useEffect(() => {
        vacationget();
        getOfficerInfo();
    }, []);

    return (
        <ScrollView style={style.MainScrollView}>
            <View style={style.viewforiconandtextindailyreport}>
                <TouchableOpacity style={style.lefticontouchopacity} onPress={() => navigation.navigate("Reports")}>
                    <FontAwesomeIcon style={style.gobackicon} color="#E34234" size={22} icon={faAngleLeft} />
                </TouchableOpacity>
                <Text style={style.mainheadingtext}>Vacation Request Review</Text>
                <View style={style.viewforimageheader}>
                    <View style={style.imagewidthviewforheader}>
                        <Image style={style.reportofofficerpasge} source={require('../assets/images/securitybaselogo.png')} />
                    </View>
                </View>
            </View>
            <View>
                <View style={style.officerandsitesection}>
                    <View style={style.viewforbgcandtext}>
                        <Text style={style.headingtextfordailyactivey}>Officer and Site</Text>
                    </View>
                    <View style={style.officernameandsiteandlcinwetvalue}>
                        <Text><Text style={style.onltfontweight}>Officer: </Text>{officerName}</Text>
                        <Text><Text style={style.onltfontweight}>Client: </Text>{clientName}</Text>
                        <Text><Text style={style.onltfontweight}>Site: </Text>{siteName}</Text>
                    </View>
                </View>
                <View style={style.officerandsitesection}>
                    <View style={style.viewforbgcandtext}>
                        <Text style={style.headingtextfordailyactivey}>Trucks</Text>
                    </View>
                    {data.length > 0 ? (
                        data.map((entry) => {
                            const { _id, createdAt, startDate, endDate, reason, vacationRequestStatus } = entry;
                            return (
                                <View key={_id} style={style.licensnceplacenumbeerview}>
                                    <Text><Text style={style.onltfontweight}>Date Entered: </Text>{new Date(createdAt).toLocaleDateString()}</Text>
                                    <Text><Text style={style.onltfontweight}>Start Date: </Text>{new Date(startDate).toLocaleDateString()}</Text>
                                    <Text><Text style={style.onltfontweight}>End Date: </Text>{new Date(endDate).toLocaleDateString()}</Text>
                                    <Text><Text style={style.onltfontweight}>Reason: </Text>{reason}</Text>
                                    <Text><Text style={style.onltfontweight}>Status: </Text>{vacationRequestStatus}</Text>
                                </View>
                            );
                        })
                    ) : (
                        <Text>No truck data available</Text>
                    )}

                </View>
            </View>
        </ScrollView>
    )
}

export default VacationReview;