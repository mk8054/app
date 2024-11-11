import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { RadioButton } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import style from '../Component/Style';

const FieldInspectionForm = ({ navigation }) => {

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
    const [userId, setuserId] = useState('')

    const handleSubmit = async () => {

        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userID');

        const selectedSiteData = await AsyncStorage.getItem('selectedSite');
        const parsedSiteData = selectedSiteData ? JSON.parse(selectedSiteData) : null;
        const clientSiteId = parsedSiteData?.clientId?._id;


        const formData = new FormData();
        formData.append('inspectedOfficer', inspectedOfficer);
        formData.append('inspectedOfficerOther', inspectedOfficerOther);
        formData.append('alert', alert);
        formData.append('alertDetail', alertDetail);
        formData.append('distracted', distracted);
        formData.append('distractedDetail', distractedDetail);
        formData.append('properUniform', properUniform);
        formData.append('properUniformDetail', properUniformDetail);
        formData.append('properlyGroomed', properlyGroomed);
        formData.append('properlyGroomedDetail', properlyGroomedDetail);
        formData.append('validLicenses', validLicenses);
        formData.append('validLicensesDetail', validLicensesDetail);
        formData.append('DARCompleted', DARCompleted);
        formData.append('DARCompletedDetail', DARCompletedDetail);
        formData.append('knowPostOrders', knowPostOrders);
        formData.append('knowPostOrdersDetail', knowPostOrdersDetail);
        formData.append('adminQuestions', adminQuestions);
        formData.append('adminQuestionDetail', adminQuestionDetail);
        formData.append('vehicleGoodCondition', vehicleGoodCondition);
        formData.append('vehicleConditionDetail', vehicleConditionDetail);
        formData.append('vehicleServiceRequired', vehicleServiceRequired);
        formData.append('vehicleServiceRequiredDetail', vehicleServiceRequiredDetail);
        formData.append('vehicleDocsPresent', vehicleDocsPresent);
        formData.append('vehicleDocsPresentDetail: ', vehicleDocsPresentDetail);
        formData.append('meetClient', meetClient);
        formData.append('meetClientDetail', meetClientDetail);
        formData.append('additionalComments', additionalComments);
        formData.append('officerAttachments', officerAttachments);
        formData.append('createdLatitude', createdLatitude);
        formData.append('createdLongitude', createdLongitude);
        formData.append('clientSiteId', clientSiteId);
        formData.append('userId', userId);

        try {
            const response = await axios.post('https://officer-reports-backend.onrender.com/api/field-inspection/add', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Submission successful:', response.data);
        } catch (error) {
            console.error('Submission error:', error);
        }
    };

    const fetchOfficers = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('https://officer-reports-backend.onrender.com/api/officer/getAll?role=officer', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (data && data.data) {
                setOfficers(data.data);
            } else {
                console.error("Data structure unexpected:", data);
            }
        } catch (error) {
            console.error("Fetching officers error:", error);
        }
    };

    useEffect(() => {
        fetchOfficers();
        getClientAndSiteInfo();
    }, []);

    const getClientAndSiteInfo = async () => {
        const selectedSite = await AsyncStorage.getItem('selectedSite');
        const parsedSelectedSite = selectedSite ? JSON.parse(selectedSite) : null;
        setClientName(parsedSelectedSite?.clientId?.companyName);
        setSiteName(parsedSelectedSite?.siteName);
    };

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

    return (
        <ScrollView style={{ width: '90%', alignSelf: 'center', marginTop: 100 }}>
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <Text>Inspected Officer: *</Text>
                <Picker
                    selectedValue={selectedOfficer}
                    onValueChange={(itemValue) => setSelectedOfficer(itemValue)}
                    style={style.dropdownheadingtext}
                >
                    <Picker.Item label="Select Inspection Officer" value={null} />
                    {Array.isArray(officers) && officers.map((officer) => (
                        <Picker.Item key={officer._id} label={officer.firstName} value={officer._id} />
                    ))}
                </Picker>
            </View>

            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <Text>Inspected Officer - Other:</Text>
                <TextInput
                    value={setinspectedOfficerOther}
                    onChangeText={setinspectedOfficer}
                    placeholder='Inspected Officer - Other'
                />
            </View>

            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <Text>Photo(s) of Officer:</Text>
                <TouchableOpacity onPress={pickImageLibrary}>
                    <Text>Add Photo, Video, or Audio</Text>
                </TouchableOpacity>
                <View style={{ alignItems: 'center' }}>
                    {selectedImage && (
                        <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200, marginTop: 20 }} />
                    )}
                </View>
            </View>

            {/* Alert Section */}
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <Text>Alert: *</Text>
                <RadioButton value="yes" status={alert === 'yes' ? 'checked' : 'unchecked'} onPress={() => { setalert('yes'); setalert('yes'); }} />
                <Text>Yes</Text>
                <RadioButton value="no" status={alert === 'no' ? 'checked' : 'unchecked'} onPress={() => { setalert('no'); setalert('no'); }} />
                <Text>No</Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <Text>If No, Describe:</Text>
                <TextInput
                    value={alertDetail}
                    onChangeText={setalertDetail}
                    placeholder="Describe if No"
                />
            </View>

            {/* Distracted Section */}
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <Text>Distracted: *</Text>
                <RadioButton value="yes" status={distracted === 'yes' ? 'checked' : 'unchecked'} onPress={() => { setdistracted('yes'); setdistracted('yes'); }} />
                <Text>Yes</Text>
                <RadioButton value="no" status={distracted === 'no' ? 'checked' : 'unchecked'} onPress={() => { setdistracted('no'); setdistracted('no'); }} />
                <Text>No</Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <Text>If Yes, Describe:</Text>
                <TextInput
                    value={distractedDetail}
                    onChangeText={setdistractedDetail}
                    placeholder="Describe if Yes"
                />
            </View>

            {/* Proper Uniform Section */}
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <Text>Proper Uniform: *</Text>
                <RadioButton value="yes" status={properUniform === 'yes' ? 'checked' : 'unchecked'} onPress={() => { setproperUniform('yes'); setproperUniform('yes'); }} />
                <Text>Yes</Text>
                <RadioButton value="no" status={properUniform === 'no' ? 'checked' : 'unchecked'} onPress={() => { setproperUniform('no'); setproperUniform('no'); }} />
                <Text>No</Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <Text>If No, Describe:</Text>
                <TextInput
                    value={properUniformDetail}
                    onChangeText={setproperUniformDetail}
                    placeholder="Describe if No"
                />
            </View>



            {/* setvalidLicenses */}
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <Text>Properly Groomed: *</Text>
                <RadioButton value="yes" status={validLicenses === 'yes' ? 'checked' : 'unchecked'} onPress={() => { setvalidLicenses('yes'); setvalidLicenses('yes'); }} />
                <Text>Yes</Text>
                <RadioButton value="no" status={validLicenses === 'no' ? 'checked' : 'unchecked'} onPress={() => { setvalidLicenses('no'); setvalidLicenses('no'); }} />
                <Text>No</Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <Text>If No, Describe:</Text>
                <TextInput
                    value={validLicensesDetail}
                    onChangeText={setvalidLicensesDetail}
                    placeholder="Describe if No"
                />
            </View>

            {/* Properly Groomed Section */}
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <Text>Properly Groomed: *</Text>
                <RadioButton value="yes" status={properlyGroomed === 'yes' ? 'checked' : 'unchecked'} onPress={() => { setproperlyGroomed('yes'); setproperlyGroomed('yes'); }} />
                <Text>Yes</Text>
                <RadioButton value="no" status={properlyGroomed === 'no' ? 'checked' : 'unchecked'} onPress={() => { setproperlyGroomed('no'); setproperlyGroomed('no'); }} />
                <Text>No</Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <Text>If No, Describe:</Text>
                <TextInput
                    value={properlyGroomedDetail}
                    onChangeText={setproperlyGroomedDetail}
                    placeholder="Describe if No"
                />
            </View>

            {/*Is DAR completed Properly? */}
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <Text>Is DAR completed Properly?: *</Text>
                <RadioButton value="yes" status={DARCompleted === 'yes' ? 'checked' : 'unchecked'} onPress={() => { setDARCompleted('yes'); setDARCompleted('yes'); }} />
                <Text>Yes</Text>
                <RadioButton value="no" status={DARCompleted === 'no' ? 'checked' : 'unchecked'} onPress={() => { setDARCompleted('no'); setDARCompleted('no'); }} />
                <Text>No</Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <Text>If No, Describe:</Text>
                <TextInput
                    value={DARCompletedDetail}
                    onChangeText={setDARCompletedDetail}
                    placeholder="Describe if No"
                />
            </View>

            {/*Does Officer know the Post Orders? */}
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <Text>Does Officer know the Post Orders?: *</Text>
                <RadioButton value="yes" status={knowPostOrders === 'yes' ? 'checked' : 'unchecked'} onPress={() => { setknowPostOrders('yes'); setknowPostOrders('yes'); }} />
                <Text>Yes</Text>
                <RadioButton value="no" status={knowPostOrders === 'no' ? 'checked' : 'unchecked'} onPress={() => { setknowPostOrders('no'); setknowPostOrders('no'); }} />
                <Text>No</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <Text>If No, Describe:</Text>
                <TextInput
                    value={knowPostOrdersDetail}
                    onChangeText={setknowPostOrdersDetail}
                    placeholder="Describe if No"
                />
            </View>

            {/*Does the officer have payroll or administrative questions? */}
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <Text>Does the officer have payroll or administrative questions?: *</Text>
                <RadioButton value="yes" status={adminQuestions === 'yes' ? 'checked' : 'unchecked'} onPress={() => { setadminQuestions('yes'); setadminQuestions('yes'); }} />
                <Text>Yes</Text>
                <RadioButton value="no" status={adminQuestions === 'no' ? 'checked' : 'unchecked'} onPress={() => { setadminQuestions('no'); setadminQuestions('no'); }} />
                <Text>No</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <Text>If Yes, what are they:</Text>
                <TextInput
                    value={adminQuestionDetail}
                    onChangeText={setadminQuestionDetail}
                    placeholder="Describe if No"
                />
            </View>

            {/*Is company vehicle in good condition?: */}
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <Text>Is company vehicle in good condition?: *</Text>
                <RadioButton value="yes" status={vehicleGoodCondition === 'yes' ? 'checked' : 'unchecked'} onPress={() => { setvehicleGoodCondition('yes'); setvehicleGoodCondition('yes'); }} />
                <Text>Yes</Text>
                <RadioButton value="no" status={vehicleGoodCondition === 'no' ? 'checked' : 'unchecked'} onPress={() => { setvehicleGoodCondition('no'); setvehicleGoodCondition('no'); }} />
                <Text>No</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <Text>If No, Describe</Text>
                <TextInput
                    value={vehicleConditionDetail}
                    onChangeText={setvehicleConditionDetail}
                    placeholder="Describe if No"
                />
            </View>

            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <Text>Photo(s) of Officer:</Text>
                <TouchableOpacity onPress={pickImageLibrary}>
                    <Text>Add Photo, Video, or Audio</Text>
                </TouchableOpacity>
                <View style={{ alignItems: 'center' }}>
                    {selectedImage && (
                        <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200, marginTop: 20 }} />
                    )}
                </View>
            </View>

            {/*Does the vehicle require service?: */}
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <Text>Does the vehicle require service?: *</Text>
                <RadioButton value="yes" status={vehicleServiceRequired === 'yes' ? 'checked' : 'unchecked'} onPress={() => { setvehicleServiceRequired('yes'); setvehicleServiceRequired('yes'); }} />
                <Text>Yes</Text>
                <RadioButton value="no" status={vehicleServiceRequired === 'no' ? 'checked' : 'unchecked'} onPress={() => { setvehicleServiceRequired('no'); setvehicleServiceRequired('no'); }} />
                <Text>No</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <Text>If Yes, Describe</Text>
                <TextInput
                    value={vehicleServiceRequiredDetail}
                    onChangeText={setvehicleServiceRequiredDetail}
                    placeholder="Describe if No"
                />
            </View>

            {/*Vehicle Documents Present (Insurance, Gas, Registration, etc)?: */}
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <Text>Vehicle Documents Present (Insurance, Gas, Registration, etc)?: *</Text>
                <RadioButton value="yes" status={vehicleDocsPresent === 'yes' ? 'checked' : 'unchecked'} onPress={() => { setvehicleDocsPresent('yes'); setvehicleDocsPresent('yes'); }} />
                <Text>Yes</Text>
                <RadioButton value="no" status={vehicleDocsPresent === 'no' ? 'checked' : 'unchecked'} onPress={() => { setvehicleDocsPresent('no'); setvehicleDocsPresent('no'); }} />
                <Text>No</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <Text>If Yes, what are they:</Text>
                <TextInput
                    value={vehicleDocsPresentDetail}
                    onChangeText={setvehicleDocsPresentDetail}
                    placeholder="Describe if No"
                />
            </View>

            {/*Did you meet with the client?:  */}
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <Text>If Yes, what are they: </Text>
                <RadioButton value="yes" status={meetClient === 'yes' ? 'checked' : 'unchecked'} onPress={() => { setmeetClient('yes'); setmeetClient('yes'); }} />
                <Text>Yes</Text>
                <RadioButton value="no" status={meetClient === 'no' ? 'checked' : 'unchecked'} onPress={() => { setmeetClient('no'); setmeetClient('no'); }} />
                <Text>No</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <Text>If Yes, what are they:</Text>
                <TextInput
                    value={meetClientDetail}
                    onChangeText={setmeetClientDetail}
                    placeholder="Describe if No"
                />
            </View>

            {/* Additional Comments */}
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <Text>Additional Comments:</Text>
                <TextInput
                    value={additionalComments}
                    onChangeText={setadditionalComments}
                    placeholder="Any additional comments"
                />
            </View>

            {/* Submit Button */}
            <TouchableOpacity onPress={handleSubmit} >
                <Text >Submit</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default FieldInspectionForm;