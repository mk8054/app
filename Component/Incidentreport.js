import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, Image, ScrollView, TextInput, Modal, FlatList, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleLeft, faStarOfLife, faTrash, faPenToSquare, faCirclePlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import RadioGroup from 'react-native-radio-buttons-group';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Textarea from 'react-native-textarea';
import { format } from 'date-fns';
import style from '../Component/Style';
import { Picker } from '@react-native-picker/picker';

const Incidentreport = () => {

    const [officerName, setOfficerName] = useState('');
    const [clientName, setClientName] = useState('');
    const [siteName, setSiteName] = useState('');

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const textareaRef = useRef(null);
    const [media, setMedia] = useState([]);

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

    useEffect(() => {
        getOfficerInfo();
    }, []);

    const handleStartDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || startDate;
        setShowStartDatePicker(false);
        setStartDate(currentDate);
    };

    const handleEndDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || endDate;
        setShowEndDatePicker(false);
        setEndDate(currentDate);
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

    return (
        <ScrollView style={style.MainScrollView}>
            <View style={style.viewforiconandtextindailyreport}>
                <TouchableOpacity style={style.lefticontouchopacity} onPress={() => navigation.navigate("Reports")}>
                    <FontAwesomeIcon style={style.gobackicon} color="#E34234" size={22} icon={faAngleLeft} />
                </TouchableOpacity>
                <Text style={style.mainheadingtext}>Incident Report</Text>
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
                        <Text style={style.headingtextfordailyactivey}>Overview</Text>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>Incident Report # :</Text>
                        </View>
                        <TextInput
                            style={style.textyinputforshift}
                        // value={postShift}
                        // onChangeText={setPostShift}
                        />
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>Date and Time of Incident :</Text>
                            <FontAwesomeIcon style={style.staricon} size={8} icon={faStarOfLife} />
                        </View>
                        <View style={style.InspectedOfficerOtherview}>
                            <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
                                <TextInput
                                    style={style.inspectiontextfieldothertextinput}
                                    value={startDate.toLocaleDateString()} // Format the date
                                    editable={false} // Make it read-only
                                />
                            </TouchableOpacity>
                            {showStartDatePicker && (
                                <DateTimePicker
                                    value={startDate}
                                    mode="date"
                                    display="default"
                                    onChange={handleStartDateChange}
                                />
                            )}
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>Incident Type :</Text>
                            <FontAwesomeIcon style={style.staricon} size={8} icon={faStarOfLife} />
                        </View>
                        <View style={style.maindropdownview}>
                            <View style={style.dropdownmenuandiconview}>
                                <Picker
                                    // selectedValue={maintenanceTypeId}
                                    // onValueChange={(itemValue) => setmaintenanceTypeId(itemValue)}
                                    style={style.dropdownheadingtext}
                                >
                                    <Picker.Item label="Select Inspection Type" value={null} />
                                    {/* {Array.isArray(types) && types.map((type) => (
                                        <Picker.Item key={type._id} label={type.typeName} value={type._id} />
                                    ))} */}
                                </Picker>
                            </View>
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>IIf Other, What Type :</Text>
                        </View>
                        <TextInput
                            style={style.textyinputforshift}
                        // value={postShift}
                        // onChangeText={setPostShift}
                        />
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>Victim Name(s) :</Text>
                        </View>
                        <TextInput
                            style={style.textyinputforshift}
                        // value={postShift}
                        // onChangeText={setPostShift}
                        />
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>Victim Contact Info :</Text>
                        </View>
                        <TextInput
                            style={style.textyinputforshift}
                        // value={postShift}
                        // onChangeText={setPostShift}
                        />
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>Suspect Name(s) :</Text>
                        </View>
                        <TextInput
                            style={style.textyinputforshift}
                        // value={postShift}
                        // onChangeText={setPostShift}
                        />
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>Suspect Contact Info :</Text>
                        </View>
                        <TextInput
                            style={style.textyinputforshift}
                        // value={postShift}
                        // onChangeText={setPostShift}
                        />
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>Witness Name(s) :</Text>
                        </View>
                        <TextInput
                            style={style.textyinputforshift}
                        // value={postShift}
                        // onChangeText={setPostShift}
                        />
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>Witness Contact Info :</Text>
                        </View>
                        <TextInput
                            style={style.textyinputforshift}
                        // value={postShift}
                        // onChangeText={setPostShift}
                        />
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>Incident Location :</Text>
                            <FontAwesomeIcon style={style.staricon} size={8} icon={faStarOfLife} />
                        </View>
                        <TextInput
                            style={style.textyinputforshift}
                        // value={postShift}
                        // onChangeText={setPostShift}
                        />
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>Incident Summary :</Text>
                            <FontAwesomeIcon style={style.staricon} size={8} icon={faStarOfLife} />
                        </View>
                        <TextInput
                            style={style.textyinputforshift}
                        // value={postShift}
                        // onChangeText={setPostShift}
                        />
                    </View>
                </View>
                <View style={style.officerandsitesection}>
                    <View style={style.viewforbgcandtext}>
                        <Text style={style.headingtextfordailyactivey}>Responder Info</Text>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>Police Called :</Text>
                            <FontAwesomeIcon style={style.staricon} size={8} icon={faStarOfLife} />
                        </View>
                        <View style={style.maindropdownview}>
                            <View style={style.dropdownmenuandiconview}>
                                <Picker
                                    // selectedValue={maintenanceTypeId}
                                    // onValueChange={(itemValue) => setmaintenanceTypeId(itemValue)}
                                    style={style.dropdownheadingtext}
                                >
                                    <Picker.Item label="Select Inspection Type" value={null} />
                                    {/* {Array.isArray(types) && types.map((type) => (
                                        <Picker.Item key={type._id} label={type.typeName} value={type._id} />
                                    ))} */}
                                </Picker>
                            </View>
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>If Not, Why? :</Text>
                            <FontAwesomeIcon style={style.staricon} size={8} icon={faStarOfLife} />
                        </View>
                        <TextInput
                            style={style.textyinputforshift}
                        // value={postShift}
                        // onChangeText={setPostShift}
                        />
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <Text style={style.describetext}>Police Name(s) & Badge(s) :</Text>
                        <View style={style.alertsectionradiobutnview}>
                            <View style={style.textareaviewofdescribe}>
                                <Textarea ref={textareaRef} placeholder={''}
                                // value={details}
                                // onChangeText={setdetails}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>Fire Truck Number :</Text>
                            <FontAwesomeIcon style={style.staricon} size={8} icon={faStarOfLife} />
                        </View>
                        <TextInput
                            style={style.textyinputforshift}
                        // value={postShift}
                        // onChangeText={setPostShift}
                        />
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <View style={style.textandstariconview}>
                            <Text style={style.textinputtext}>Ambulance Number :</Text>
                            <FontAwesomeIcon style={style.staricon} size={8} icon={faStarOfLife} />
                        </View>
                        <TextInput
                            style={style.textyinputforshift}
                        // value={postShift}
                        // onChangeText={setPostShift}
                        />
                    </View>
                </View>
                <View style={style.officerandsitesection}>
                    <View style={style.viewforbgcandtext}>
                        <Text style={style.headingtextfordailyactivey}>Details</Text>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <Text style={style.describetext}>Who, What, When, etc :</Text>
                        <View style={style.alertsectionradiobutnview}>
                            <View style={style.textareaviewofdescribe}>
                                <Textarea ref={textareaRef} placeholder={''}
                                // value={details}
                                // onChangeText={setdetails}
                                />
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
                <View style={style.officerandsitesection}>
                    <View style={style.viewforbgcandtext}>
                        <Text style={style.headingtextfordailyactivey}>Officer Actions</Text>
                    </View>
                    <View style={style.textfieldandtextarseview}>
                        <Text style={style.describetext}>Details :</Text>
                        <View style={style.alertsectionradiobutnview}>
                            <View style={style.textareaviewofdescribe}>
                                <Textarea ref={textareaRef} placeholder={''}
                                // value={details}
                                // onChangeText={setdetails}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default Incidentreport;