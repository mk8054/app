import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleLeft, faStarOfLife, faCirclePlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import Textarea from 'react-native-textarea';
import style from '../Component/Style';

const ParkingViolationSearch = ({ navigation }) => {

    const [officerName, setOfficerName] = useState('');
    const [clientName, setClientName] = useState('');
    const [siteName, setSiteName] = useState('');
    const [types, setTypes] = useState([]);

    const [licensePlateComparison, setlicensePlateComparison] = useState("")
    const [licensePlateNumber, setlicensePlateNumber] = useState(null);
    const [parkingViolationTypeId, setparkingViolationTypeId] = useState([]);

    const [violationdata, setviolationdata] = useState([]);

    const getOfficerInfo = async () => {
        try {
            const officer = await AsyncStorage.getItem('name');
            const role = await AsyncStorage.getItem('role');
            const selectedSite = await AsyncStorage.getItem('selectedSite');
            const parsedSelectedSite = selectedSite ? JSON.parse(selectedSite) : null;
            setOfficerName(officer || 'N/A');
            setClientName(parsedSelectedSite?.clientId?.companyName);
            setSiteName(parsedSelectedSite?.siteName);
        } catch (error) {
            console.error('Error retrieving officer info', error);
        }
    };

    const fetchViolation = async () => {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch('https://officer-reports-backend.onrender.com/api/type/getAll?category=Parking_Violation', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setTypes(data.data);
    };

    useEffect(() => {
        fetchViolation();
        getOfficerInfo();
    }, []);

    const handlesubmit = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const clientSiteId = await AsyncStorage.getItem('siteid');

            const payload = {
                clientSiteId: clientSiteId,
                licensePlateNumber: licensePlateNumber,
                licensePlateComparison: licensePlateComparison,
                parkingViolationTypeId: parkingViolationTypeId
            };

            const response = await fetch('https://officer-reports-backend.onrender.com/api/parking-violation/search', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch violation data');
            }

            const data = await response.json();
            console.log("Response Data:", data);
            if (data && data.data) {
                setviolationdata(data.data);
            } else {
                setviolationdata([]);
            }
        } catch (error) {
            console.error('Error submitting parking violation search:', error);
            Alert.alert("Error", "Failed to fetch parking violations.");
        }
    };

    const handleClearForm = () => {
        setlicensePlateComparison('');
        setlicensePlateNumber('');
        setparkingViolationTypeId('');
    };

    return (
        <ScrollView style={style.MainScrollView}>
            <View style={style.viewforiconandtextindailyreport}>
                <TouchableOpacity style={style.lefticontouchopacity} onPress={() => navigation.navigate("Reports")}>
                    <FontAwesomeIcon style={style.gobackicon} color="#E34234" size={22} icon={faAngleLeft} />
                </TouchableOpacity>
                <Text style={style.mainheadingtext}>Parking Violation Search</Text>
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
                        <Text style={style.headingtextfordailyactivey}>Maintenance Request</Text>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>Violation Type :</Text>
                            <FontAwesomeIcon style={style.staricon} size={8} icon={faStarOfLife} />
                        </View>
                        <View style={style.maindropdownview}>
                            <View style={style.dropdownmenuandiconview}>
                                <Picker
                                    selectedValue={parkingViolationTypeId}
                                    onValueChange={(itemValue) => {
                                        console.log(itemValue);
                                        setparkingViolationTypeId(itemValue);
                                    }}
                                    style={style.dropdownheadingtext}
                                >
                                    <Picker.Item label="Select Inspection Type" value={null} />
                                    {Array.isArray(types) && types.map((type) => (
                                        <Picker.Item key={type._id} label={type.typeName} value={type._id} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>LP # :</Text>
                        </View>
                        <View style={style.maindropdownview}>
                            <View style={style.dropdownmenuandiconview}>
                                <Picker selectedValue={licensePlateComparison} onValueChange={(itemValue) => setlicensePlateComparison(itemValue)} style={style.dropdownheadingtext}>
                                    <Picker.Item label="Select Option" value={null} />
                                    <Picker.Item label="is equal to" value="is_equal_to" />
                                    <Picker.Item label="starts with" value="starts_with" />
                                    <Picker.Item label="contain" value="contain" />
                                </Picker>
                            </View>
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.onltfontweight}></Text>
                        </View>
                        <View style={style.InspectedOfficerOtherview}>
                            <TextInput style={style.inspectiontextfieldothertextinput} value={licensePlateNumber}
                                onChangeText={setlicensePlateNumber} placeholder='search'
                            />
                        </View>
                    </View>
                </View>
                <View style={style.submitandclearbutnview}>
                    <TouchableOpacity style={style.submitbuttonview} onPress={handlesubmit}>
                        <Text style={style.submitextindailyreport}>submit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.submitbuttonview} onPress={handleClearForm}>
                        <Text style={style.submitextindailyreport}>Clear Form</Text>
                    </TouchableOpacity>
                </View>
                <View style={style.officerandsitesection}>
                    <View style={style.viewforbgcandtext}>
                        <Text style={style.headingtextfordailyactivey}>Parking Violations</Text>
                    </View>
                    {Array.isArray(violationdata) && violationdata.length > 0 ? (
                        violationdata.map((violation, index) => (
                            <View key={index} style={style.officerandsitesection}>
                                <View style={style.viewforbgcandtext}>
                                    <Text style={style.headingtextfordailyactivey}>Parking Violations</Text>
                                </View>
                                <View style={style.licensnceplacenumbeerview}>
                                    <Text><Text style={style.licenseplatenumbertext}>Date: </Text>{new Date(violation.createdAt).toLocaleString()}</Text>
                                    <Text><Text style={style.licenseplatenumbertext}>LP: </Text>{violation[0]?.data?.licensePlateNumber}</Text>
                                    <Text><Text style={style.licenseplatenumbertext}>VIN: </Text>{violation.data.vin}</Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text>No violations found</Text>
                    )}

                </View>
            </View>
        </ScrollView>

    )
}

export default ParkingViolationSearch;