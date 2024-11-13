import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleLeft, faStarOfLife, faCirclePlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import Textarea from 'react-native-textarea';
import style from '../Component/Style';

const Maintenace = ({ navigation }) => {

    const [officerName, setOfficerName] = useState('');
    const [clientName, setClientName] = useState('');
    const [siteName, setSiteName] = useState('');

    const [types, setTypes] = useState([]);
    const textareaRef = useRef(null);
    const [media, setMedia] = useState([]);

    const [maintenanceTypeId, setmaintenanceTypeId] = useState(null);
    const [typeIfOther, settypeIfOther] = useState(null);
    const [details, setdetails] = useState(null);
    const [notification, setnotification] = useState(null);
    const [emailClient, setemailClient] = useState(null);
    const [addedObservations, setAddedObservations] = useState([]);

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

    const fetchMaintenance = async (_id) => {

        const token = await AsyncStorage.getItem('token');
        const response = await fetch('https://officer-reports-backend.onrender.com/api/type/getAll?category=Maintenance', {
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
        fetchMaintenance();
        getOfficerInfo();
    }, []);


    const handleSubmit = async () => {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userID');
        const clientSiteId = await AsyncStorage.getItem('siteid');

        const formData = new FormData();
        formData.append('maintenanceTypeId', maintenanceTypeId);
        formData.append('typeIfOther', typeIfOther);
        formData.append('details', details);
        formData.append('notification', notification);
        formData.append('emailClient', emailClient);
        addedObservations.forEach((id, index) => {
            formData.append(`observations[${index}]`, id);
        });

        await Promise.all(media.map(async (uri, index) => {
            const fileType = uri.split('.').pop();
            const response = await fetch(uri);
            const blob = await response.blob();
            formData.append('attachments', {
                name: `media_${index}.${fileType}`,
                type: `image/${fileType}`,
                uri: uri,
            });
        }));

        formData.append('clientSiteId', clientSiteId);
        formData.append('userId', userId);

        try {
            const response = await fetch('https://officer-reports-backend.onrender.com/api/maintenance-report/add', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Response:', data);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleClearForm = () => {
        setmaintenanceTypeId('');
        settypeIfOther('');
        setdetails('');
        setnotification('');
        setemailClient('');
        setAddedObservations('');
        setMedia('')
    };

    const pickMedia = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled) {
                setMedia(prevMedia => [...prevMedia, result.assets[0].uri]);
            }
        } catch (error) {
            console.error("Error picking media:", error);
            Alert.alert('Error', 'Something went wrong while selecting media.');
        }
    };

    const deleteImage = (uri) => {
        setMedia(prevMedia => prevMedia.filter(item => item !== uri));
    };

    const handleOptionSelect = (option) => {
        setemailClient(option);
    };

    return (
        <ScrollView style={style.MainScrollView}>
            <View style={style.viewforiconandtextindailyreport}>
                <TouchableOpacity style={style.lefticontouchopacity} onPress={() => navigation.navigate("Reports")}>
                    <FontAwesomeIcon style={style.gobackicon} color="#E34234" size={22} icon={faAngleLeft} />
                </TouchableOpacity>
                <Text style={style.mainheadingtext}>Maintenance Request</Text>
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
                <View>
                    <View style={style.viewforbgcandtext}>
                        <Text style={style.headingtextfordailyactivey}>Maintenance Request</Text>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>Inspected Officer:</Text>
                            <FontAwesomeIcon style={style.staricon} size={8} icon={faStarOfLife} />
                        </View>
                        <View style={style.maindropdownview}>
                            <View style={style.dropdownmenuandiconview}>
                                <Picker selectedValue={maintenanceTypeId} onValueChange={(itemValue) => setmaintenanceTypeId(itemValue)} style={style.dropdownheadingtext}>
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
                            <Text style={style.textinputtext}>If Other, What Type:</Text>
                        </View>
                        <View style={style.InspectedOfficerOtherview}>
                            <TextInput style={style.inspectiontextfieldothertextinput}
                                value={typeIfOther}
                                onChangeText={settypeIfOther}
                            />
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <Text style={style.describetext}>Details: </Text>
                        <View style={style.alertsectionradiobutnview}>
                            <View style={style.textareaviewofdescribe}>
                                <Textarea ref={textareaRef} placeholder={''}
                                    value={details}
                                    onChangeText={setdetails}
                                />
                            </View>
                        </View>
                    </View>
                </View>
                <View>
                    <View style={style.viewforbgcandtext}>
                        <Text style={style.headingtextfordailyactivey}>Notification</Text>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <Text style={style.describetext}>Who has been notified?: </Text>
                        <View style={style.alertsectionradiobutnview}>
                            <View style={style.textareaviewofdescribe}>
                                <Textarea ref={textareaRef} placeholder={''}
                                    value={notification}
                                    onChangeText={setnotification} />
                            </View>
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>Email Client:</Text>
                            <FontAwesomeIcon style={style.staricon} size={8} icon={faStarOfLife} />
                        </View>
                        <View style={style.maindropdownview}>
                            <View style={style.dropdownmenuandiconview}>
                                <Picker selectedValue={emailClient} onValueChange={(itemValue) => setemailClient(itemValue)} style={style.dropdownheadingtext}>
                                    <Picker.Item label="Select Option" value={null} />
                                    <Picker.Item label="Yes" value="true" />
                                    <Picker.Item label="No" value="false" />
                                </Picker>

                            </View>
                        </View>
                    </View>
                </View>
                <View style={style.videoaudiophotoviewmainview}>
                    <View style={style.viewforbgcandtext}>
                        <Text style={style.headingtextfordailyactivey}>Photos, Videos, Audio</Text>
                    </View>
                    <View style={style.viewforredlineandaddbutton}>
                        <TouchableOpacity onPress={pickMedia} style={style.addobservationtouchopcay}>
                            <FontAwesomeIcon style={{ marginLeft: 5 }} icon={faCirclePlus} />
                            <Text style={style.addobservationtext}> Add Photo, Video, or Audio</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <View style={style.mainviewforimageanddeleticon}>
                        {Array.isArray(media) && media.length > 0 && media.map((uri, index) => (
                            <View key={index} style={style.mediaimageview}>
                                <Image source={{ uri }} style={style.mediaimage} />
                                <TouchableOpacity onPress={() => deleteImage(uri)} style={style.mediaimagedeleteiocnview}>
                                    <FontAwesomeIcon icon={faXmark} size={18} color="#dc311c" />
                                </TouchableOpacity>
                            </View>
                        ))}

                    </View>
                </View>
            </View>

            <View style={style.submitandclearbutnview}>
                <TouchableOpacity style={style.submitbuttonview} onPress={handleSubmit}>
                    <Text style={style.submitextindailyreport}>submit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={style.submitbuttonview} onPress={handleClearForm}>
                    <Text style={style.submitextindailyreport}>Clear Form</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default Maintenace;
