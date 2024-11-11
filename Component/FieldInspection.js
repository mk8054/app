import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleLeft, faStarOfLife, faTrash, faPenToSquare, faCirclePlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { RadioButton } from 'react-native-paper';
import Textarea from 'react-native-textarea';
import * as ImagePicker from 'expo-image-picker';
import style from '../Component/Style';
import Imagepicker from '../Component/Imagepicker';

const FieldInspection = ({ navigation }) => {

    const [officerName, setOfficerName] = useState('');
    const [clientName, setClientName] = useState('');
    const [siteName, setSiteName] = useState('');
    const [checked, setChecked] = useState('first');
    const [officers, setOfficers] = useState([]);
    const [selectedOfficer, setSelectedOfficer] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [hasPermission, setHasPermission] = useState(null);

    const [inspectedOfficer, setinspectedOfficer] = useState('')
    const [inspectedOfficerOther, setinspectedOfficerOther] = useState('')
    const [alert, setalert] = useState('')
    const [alertDetail, setalertDetail] = useState('')
    const [distracted, setdistracted] = useState('')
    const [distractedDetail, setdistractedDetail] = useState('')
    const [properUniform, setproperUniform] = useState('')
    const [properUniformDetail, setproperUniformDetail] = useState('')
    const [properlyGroomed, setproperlyGroomed] = useState('')
    const [properlyGroomedDetail, setproperlyGroomedDetail] = useState('')
    const [validLicenses, setvalidLicenses] = useState('')
    const [validLicensesDetail, setvalidLicensesDetail] = useState('')
    const [DARCompleted, setDARCompleted] = useState('')
    const [DARCompletedDetail, setDARCompletedDetail] = useState('')
    const [knowPostOrders, setknowPostOrders] = useState('')
    const [knowPostOrdersDetail, setknowPostOrdersDetail] = useState('')
    const [adminQuestions, setadminQuestions] = useState('')
    const [adminQuestionDetail, setadminQuestionDetail] = useState('')
    const [vehicleGoodCondition, setvehicleGoodCondition] = useState('')
    const [vehicleConditionDetail, setvehicleConditionDetail] = useState('')
    const [vehicleServiceRequired, setvehicleServiceRequired] = useState('')
    const [vehicleServiceRequiredDetail, setvehicleServiceRequiredDetail] = useState('')
    const [vehicleDocsPresent, setvehicleDocsPresent] = useState('')
    const [vehicleDocsPresentDetail, setvehicleDocsPresentDetail] = useState('')
    const [meetClient, setmeetClient] = useState('')
    const [meetClientDetail, setmeetClientDetail] = useState('')
    const [additionalComments, setadditionalComments] = useState('')
    const [officerAttachments, setofficerAttachments] = useState('')
    const [createdLatitude, setcreatedLatitude] = useState('')
    const [createdLongitude, setcreatedLongitude] = useState('')
    const [clientSiteId, setclientSiteId] = useState('')
    const [userId, setuserId] = useState('')

    const getOfficerInfo = async () => {
        const officer = await AsyncStorage.getItem('name');
        const selectedSite = await AsyncStorage.getItem('selectedSite');
        const parsedSelectedSite = selectedSite ? JSON.parse(selectedSite) : null;
        setOfficerName(officer);
        setClientName(parsedSelectedSite?.clientId?.companyName);
        setSiteName(parsedSelectedSite?.siteName);
    };

    useEffect(() => {
        fetchOfficers();
        getOfficerInfo();
    }, []);

    const handleSubmit = async () => {
        const userId = await AsyncStorage.getItem('userID');

        const formData = new FormData();
        formData.append('postShift', inspectedOfficer);
        formData.append('postShift', inspectedOfficerOther);
        formData.append('postShift', alert);
        formData.append('postShift', alertDetail);
        formData.append('postShift', distracted);
        formData.append('postShift', distractedDetail);
        formData.append('postShift', properUniform);
        formData.append('postShift', properUniformDetail);
        formData.append('postShift', properlyGroomed);
        formData.append('postShift', properlyGroomedDetail);
        formData.append('postShift', validLicenses);
        formData.append('postShift', validLicensesDetail);
        formData.append('postShift', DARCompleted);
        formData.append('postShift', DARCompletedDetail);
        formData.append('postShift', knowPostOrders);
        formData.append('postShift', knowPostOrdersDetail);
        formData.append('postShift', adminQuestions);
        formData.append('postShift', adminQuestionDetail);
        formData.append('postShift', vehicleGoodCondition);
        formData.append('postShift', vehicleConditionDetail);
        formData.append('postShift', vehicleServiceRequired);
        formData.append('postShift', vehicleServiceRequiredDetail);
        formData.append('postShift', vehicleDocsPresent);
        formData.append('postShift', vehicleDocsPresentDetail);
        formData.append('postShift', meetClient);
        formData.append('postShift', meetClientDetail);
        formData.append('postShift', additionalComments);
        formData.append('postShift', officerAttachments);
        formData.append('postShift', createdLatitude);
        formData.append('postShift', createdLongitude);
        formData.append('postShift', clientSiteId);
        formData.append('postShift', userId);
    }

    const fetchOfficers = async () => {
        const token = await AsyncStorage.getItem('token');
        const role = await AsyncStorage.getItem('role');
        const response = await fetch('https://officer-reports-backend.onrender.com/api/officer/getAll?role=officer', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        // console.log("Fetched data:", data);
        setOfficers(data.data);
    };

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const pickImageLibrary = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    if (hasPermission === null) {
        return <Text>Requesting permissions...</Text>;
    }

    if (hasPermission === false) {
        return <Text>Permission to access gallery denied</Text>;
    }

    const deleteImage = (uri) => {
        setMedia(prevMedia => prevMedia.filter(item => item !== uri));
    };

    return (
        <ScrollView style={style.MainScrollView}>
            <View style={style.viewforiconandtextindailyreport}>
                <TouchableOpacity style={style.lefticontouchopacity} onPress={() => navigation.navigate("Reports")}>
                    <FontAwesomeIcon style={style.gobackicon} color="#E34234" size={22} icon={faAngleLeft} />
                </TouchableOpacity>
                <Text style={style.mainheadingtext}>Field Inspection</Text>
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
                        <Text><Text style={style.onltfontweight}>Officer:  </Text>{officerName}</Text>
                        <Text><Text style={style.onltfontweight}>Client:    </Text>{clientName}</Text>
                        <Text><Text style={style.onltfontweight}>Site:        </Text>{siteName}</Text>
                    </View>
                </View>
                <View>
                    <View style={style.viewforbgcandtext}>
                        <Text style={style.headingtextfordailyactivey}>Field Inspection</Text>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>Inspected Officer:</Text>
                            <FontAwesomeIcon style={style.staricon} size={8} icon={faStarOfLife} />
                        </View>
                        <View style={style.maindropdownview}>
                            <View style={style.dropdownmenuandiconview}>
                                <Picker selectedValue={selectedOfficer} onValueChange={(itemValue) => setSelectedOfficer(itemValue)} style={style.dropdownheadingtext}>
                                    <Picker.Item label="Select Inspection Officer" value={null} />
                                    {Array.isArray(officers) && officers.map((officer) => (
                                        <Picker.Item key={officer._id} label={officer.firstName} value={officer} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>Inspected Officer - Other:</Text>
                        </View>
                        <View style={style.InspectedOfficerOtherview}>
                            <TextInput style={style.inspectiontextfieldothertextinput} />
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>Photo(s) of Officer:</Text>
                        </View>
                        <View style={style.viewforredlineandaddbutton}>
                            <TouchableOpacity onPress={pickImageLibrary} style={style.addobservationtouchopcay}>
                                <FontAwesomeIcon style={{ marginLeft: 5 }} icon={faCirclePlus} />
                                <Text style={style.addobservationtext}> Add Photo, Video, or Audio</Text>
                            </TouchableOpacity>
                        </View>
                        {/* <View style={style.mainviewforimageanddeleticon}> */}
                        {/* {media.map((uri, index) => {
                                return (
                                    <View key={index} style={style.mediaimageview}>
                                        <Image source={{ uri }} style={style.mediaimage} />
                                        <TouchableOpacity onPress={() => deleteImage(uri)} style={style.mediaimagedeleteiocnview}>
                                            <FontAwesomeIcon icon={faXmark} size={18} color="#dc311c" />
                                        </TouchableOpacity>
                                    </View>
                                );
                            })} */}
                        {/* <View style={{ alignItems: 'center' }}>
                                {selectedImage && (
                                    <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200, marginTop: 20 }} />
                                )}
                            </View> */}
                        {/* </View> */}
                        <Imagepicker />
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>alert:</Text>
                            <FontAwesomeIcon style={style.staricon} size={8} icon={faStarOfLife} />
                        </View>
                        <View style={style.alertsectionradiobutnview}>
                            <RadioButton value="first" status={checked === 'first' ? 'checked' : 'unchecked'} onPress={() => setChecked('first')} />
                            <RadioButton value="second" status={checked === 'second' ? 'checked' : 'unchecked'} onPress={() => setChecked('second')} />
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <Text style={style.describetext}>If No, Describe:</Text>
                        <View style={style.alertsectionradiobutnview}>
                            <View style={style.textareaviewofdescribe}>
                                <Textarea placeholder={'好玩有趣的，大家同乐，伤感忧闷的，大家同哭。。。'} />
                            </View>
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>Distracted:</Text>
                            <FontAwesomeIcon style={style.staricon} size={8} icon={faStarOfLife} />
                        </View>
                        <View style={style.alertsectionradiobutnview}>
                            <RadioButton value="first" status={checked === 'first' ? 'checked' : 'unchecked'} onPress={() => setChecked('first')} />
                            <RadioButton value="second" status={checked === 'second' ? 'checked' : 'unchecked'} onPress={() => setChecked('second')} />
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <Text style={style.describetext}>If Yes, Describe:</Text>
                        <View style={style.alertsectionradiobutnview}>
                            <View style={style.textareaviewofdescribe}>
                                <Textarea placeholder={'好玩有趣的，大家同乐，伤感忧闷的，大家同哭。。。'} />
                            </View>
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>Proper Uniform:</Text>
                            <FontAwesomeIcon style={style.staricon} size={8} icon={faStarOfLife} />
                        </View>
                        <View style={style.alertsectionradiobutnview}>
                            <RadioButton value="first" status={checked === 'first' ? 'checked' : 'unchecked'} onPress={() => setChecked('first')} />
                            <RadioButton value="second" status={checked === 'second' ? 'checked' : 'unchecked'} onPress={() => setChecked('second')} />
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <Text style={style.describetext}>If No, Describe:</Text>
                        <View style={style.alertsectionradiobutnview}>
                            <View style={style.textareaviewofdescribe}>
                                <Textarea placeholder={'好玩有趣的，大家同乐，伤感忧闷的，大家同哭。。。'} />
                            </View>
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>Properly Groomed:</Text>
                            <FontAwesomeIcon style={style.staricon} size={8} icon={faStarOfLife} />
                        </View>
                        <View style={style.alertsectionradiobutnview}>
                            <RadioButton value="first" status={checked === 'first' ? 'checked' : 'unchecked'} onPress={() => setChecked('first')} />
                            <RadioButton value="second" status={checked === 'second' ? 'checked' : 'unchecked'} onPress={() => setChecked('second')} />
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <Text style={style.describetext}>If No, Describe:</Text>
                        <View style={style.alertsectionradiobutnview}>
                            <View style={style.textareaviewofdescribe}>
                                <Textarea placeholder={'好玩有趣的，大家同乐，伤感忧闷的，大家同哭。。。'} />
                            </View>
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>All Valid Licenses:</Text>
                            <FontAwesomeIcon style={style.staricon} size={8} icon={faStarOfLife} />
                        </View>
                        <View style={style.alertsectionradiobutnview}>
                            <RadioButton value="first" status={checked === 'first' ? 'checked' : 'unchecked'} onPress={() => setChecked('first')} />
                            <RadioButton value="second" status={checked === 'second' ? 'checked' : 'unchecked'} onPress={() => setChecked('second')} />
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <Text style={style.describetext}>If No, Describe:</Text>
                        <View style={style.alertsectionradiobutnview}>
                            <View style={style.textareaviewofdescribe}>
                                <Textarea placeholder={'好玩有趣的，大家同乐，伤感忧闷的，大家同哭。。。'} />
                            </View>
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>Is DAR completed Properly?:</Text>
                            <FontAwesomeIcon style={style.staricon} size={8} icon={faStarOfLife} />
                        </View>
                        <View style={style.alertsectionradiobutnview}>
                            <RadioButton value="first" status={checked === 'first' ? 'checked' : 'unchecked'} onPress={() => setChecked('first')} />
                            <RadioButton value="second" status={checked === 'second' ? 'checked' : 'unchecked'} onPress={() => setChecked('second')} />
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <Text style={style.describetext}>If No, Describe:</Text>
                        <View style={style.alertsectionradiobutnview}>
                            <View style={style.textareaviewofdescribe}>
                                <Textarea placeholder={'好玩有趣的，大家同乐，伤感忧闷的，大家同哭。。。'} />
                            </View>
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>Does Officer know the Post Orders?:</Text>
                            <FontAwesomeIcon style={style.staricon} size={8} icon={faStarOfLife} />
                        </View>
                        <View style={style.alertsectionradiobutnview}>
                            <RadioButton value="first" status={checked === 'first' ? 'checked' : 'unchecked'} onPress={() => setChecked('first')} />
                            <RadioButton value="second" status={checked === 'second' ? 'checked' : 'unchecked'} onPress={() => setChecked('second')} />
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <Text style={style.describetext}>If No, Describe:</Text>
                        <View style={style.alertsectionradiobutnview}>
                            <View style={style.textareaviewofdescribe}>
                                <Textarea placeholder={'好玩有趣的，大家同乐，伤感忧闷的，大家同哭。。。'} />
                            </View>
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>Does the officer have payroll or administrative questions?:</Text>
                            <FontAwesomeIcon style={style.staricon} size={8} icon={faStarOfLife} />
                        </View>
                        <View style={style.alertsectionradiobutnview}>
                            <RadioButton value="first" status={checked === 'first' ? 'checked' : 'unchecked'} onPress={() => setChecked('first')} />
                            <RadioButton value="second" status={checked === 'second' ? 'checked' : 'unchecked'} onPress={() => setChecked('second')} />
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <Text style={style.describetext}>If Yes, what are they:</Text>
                        <View style={style.alertsectionradiobutnview}>
                            <View style={style.textareaviewofdescribe}>
                                <Textarea placeholder={'好玩有趣的，大家同乐，伤感忧闷的，大家同哭。。。'} />
                            </View>
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>Is company vehicle in good condition?: </Text>
                            <FontAwesomeIcon style={style.staricon} size={8} icon={faStarOfLife} />
                        </View>
                        <View style={style.alertsectionradiobutnview}>
                            <RadioButton value="first" status={checked === 'first' ? 'checked' : 'unchecked'} onPress={() => setChecked('first')} />
                            <RadioButton value="second" status={checked === 'second' ? 'checked' : 'unchecked'} onPress={() => setChecked('second')} />
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <Text style={style.describetext}>If No, Describe:</Text>
                        <View style={style.alertsectionradiobutnview}>
                            <View style={style.textareaviewofdescribe}>
                                <Textarea placeholder={'好玩有趣的，大家同乐，伤感忧闷的，大家同哭。。。'} />
                            </View>
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>Photo(s) of Officer:</Text>
                        </View>
                        <View style={style.viewforredlineandaddbutton}>
                            <TouchableOpacity style={style.addobservationtouchopcay} onPress={pickImageLibrary}>
                                <FontAwesomeIcon style={{ marginLeft: 5 }} icon={faCirclePlus} />
                                <Text style={style.addobservationtext}> Add Photo, Video, or Audio</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            {selectedImage && (
                                <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200, marginTop: 20 }} />
                            )}
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>Does the vehicle require service?: </Text>
                            <FontAwesomeIcon style={style.staricon} size={8} icon={faStarOfLife} />
                        </View>
                        <View style={style.alertsectionradiobutnview}>
                            <RadioButton value="first" status={checked === 'first' ? 'checked' : 'unchecked'} onPress={() => setChecked('first')} />
                            <RadioButton value="second" status={checked === 'second' ? 'checked' : 'unchecked'} onPress={() => setChecked('second')} />
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <Text style={style.describetext}>If Yes, Describe:</Text>
                        <View style={style.alertsectionradiobutnview}>
                            <View style={style.textareaviewofdescribe}>
                                <Textarea placeholder={'好玩有趣的，大家同乐，伤感忧闷的，大家同哭。。。'} />
                            </View>
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>Vehicle Documents Present (Insurance, Gas, Registration, etc)?</Text>
                            <FontAwesomeIcon style={style.staricon} size={8} icon={faStarOfLife} />
                        </View>
                        <View style={style.alertsectionradiobutnview}>
                            <RadioButton value="first" status={checked === 'first' ? 'checked' : 'unchecked'} onPress={() => setChecked('first')} />
                            <RadioButton value="second" status={checked === 'second' ? 'checked' : 'unchecked'} onPress={() => setChecked('second')} />
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <Text style={style.describetext}>If Yes, what are they :</Text>
                        <View style={style.alertsectionradiobutnview}>
                            <View style={style.textareaviewofdescribe}>
                                <Textarea placeholder={'好玩有趣的，大家同乐，伤感忧闷的，大家同哭。。。'} />
                            </View>
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>Did you meet with the client?:</Text>
                            <FontAwesomeIcon style={style.staricon} size={8} icon={faStarOfLife} />
                        </View>
                        <View style={style.alertsectionradiobutnview}>
                            <RadioButton value="first" status={checked === 'first' ? 'checked' : 'unchecked'} onPress={() => setChecked('first')} />
                            <RadioButton value="second" status={checked === 'second' ? 'checked' : 'unchecked'} onPress={() => setChecked('second')} />
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <Text style={style.describetext}>If Yes, what are they :</Text>
                        <View style={style.alertsectionradiobutnview}>
                            <View style={style.textareaviewofdescribe}>
                                <Textarea placeholder={'好玩有趣的，大家同乐，伤感忧闷的，大家同哭。。。'} />
                            </View>
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <Text style={style.describetext}>Additional Comments:</Text>
                        <View style={style.alertsectionradiobutnview}>
                            <View style={style.textareaviewofdescribe}>
                                <Textarea placeholder={'好玩有趣的，大家同乐，伤感忧闷的，大家同哭。。。'} />
                            </View>
                        </View>
                    </View>
                </View>
                <View style={style.submitandclearbutnview}>
                    <TouchableOpacity style={style.submitbuttonview}>
                        <Text style={style.submitextindailyreport}>submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

export default FieldInspection;