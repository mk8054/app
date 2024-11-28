import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faAngleLeft,
  faStarOfLife,
  faCirclePlus,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { RadioButton } from 'react-native-paper';
import Textarea from 'react-native-textarea';
import * as ImagePicker from 'expo-image-picker';
import style from '../Component/Style';

const FieldInspection = ({ navigation }) => {
  const [officerName, setOfficerName] = useState('');
  const [clientName, setClientName] = useState('');
  const [siteName, setSiteName] = useState('');
  const [officers, setOfficers] = useState([]);
  const [hasPermission, setHasPermission] = useState(null);
  const [media, setMedia] = useState([]);
  const [mediatwo, setMediatwo] = useState([]);
  const [addedObservations, setAddedObservations] = useState([]);
  const [addedObservationstwo, setAddedObservationstwo] = useState([]);
  const [inspectedOfficer, setInspectedOfficer] = useState(null);
  const [inspectedOfficerOther, setinspectedOfficerOther] = useState('');
  const [alert, setalert] = useState('');
  const [alertDetail, setalertDetail] = useState('');
  const [distracted, setdistracted] = useState('');
  const [distractedDetail, setdistractedDetail] = useState('');
  const [properUniform, setproperUniform] = useState('');
  const [properUniformDetail, setproperUniformDetail] = useState('');
  const [properlyGroomed, setproperlyGroomed] = useState('');
  const [properlyGroomedDetail, setproperlyGroomedDetail] = useState('');
  const [validLicenses, setvalidLicenses] = useState('');
  const [validLicensesDetail, setvalidLicensesDetail] = useState('');
  const [DARCompleted, setDARCompleted] = useState('');
  const [DARCompletedDetail, setDARCompletedDetail] = useState('');
  const [knowPostOrders, setknowPostOrders] = useState('');
  const [knowPostOrdersDetail, setknowPostOrdersDetail] = useState('');
  const [adminQuestions, setadminQuestions] = useState('');
  const [adminQuestionDetail, setadminQuestionDetail] = useState('');
  const [vehicleGoodCondition, setvehicleGoodCondition] = useState('');
  const [vehicleConditionDetail, setvehicleConditionDetail] = useState('');
  const [vehicleServiceRequired, setvehicleServiceRequired] = useState('');
  const [vehicleServiceRequiredDetail, setvehicleServiceRequiredDetail] =
    useState('');
  const [vehicleDocsPresent, setvehicleDocsPresent] = useState('');
  const [vehicleDocsPresentDetail, setvehicleDocsPresentDetail] = useState('');
  const [meetClient, setmeetClient] = useState('');
  const [meetClientDetail, setmeetClientDetail] = useState('');
  const [additionalComments, setadditionalComments] = useState('');
  const [createdLatitude, setCreatedLatitude] = useState('');
  const [createdLongitude, setCreatedLongitude] = useState('');

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
    const clientSiteId = await AsyncStorage.getItem('siteid');
    const token = await AsyncStorage.getItem('token');

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
    formData.append(
      'vehicleServiceRequiredDetail',
      vehicleServiceRequiredDetail,
    );
    formData.append('vehicleDocsPresent', vehicleDocsPresent);
    formData.append('vehicleDocsPresentDetail', vehicleDocsPresentDetail);
    formData.append('meetClient', meetClient);
    formData.append('meetClientDetail', meetClientDetail);
    formData.append('additionalComments', additionalComments);
    addedObservations.forEach((id, index) => {
      formData.append(`observations[${index}]`, id);
    });
    await Promise.all(
      media.map(async (uri, index) => {
        const fileType = uri.split('.').pop();
        const response = await fetch(uri);
        const blob = await response.blob();
        formData.append('officerAttachments', {
          name: `media_${index}.${fileType}`,
          type: `image/${fileType}`,
          uri: uri,
        });
      }),
    );

    // Add observations for vehicle attachments
    addedObservationstwo.forEach((id, index) => {
      formData.append(`observations[${index}]`, id);
    });
    await Promise.all(
      media.map(async (uri, index) => {
        const fileType = uri.split('.').pop();
        const response = await fetch(uri);
        const blob = await response.blob();
        formData.append('vehicleAttachments', {
          name: `media_${index}.${fileType}`,
          type: `image/${fileType}`,
          uri: uri,
        });
      }),
    );

    formData.append('createdLatitude', createdLatitude);
    formData.append('createdLongitude', createdLongitude);
    formData.append('clientSiteId', clientSiteId);
    formData.append('userId', userId);

    try {
      console.log('Sending request to API');
      const response = await fetch(
        'https://officer-reports-backend.onrender.com/api/field-inspection/add',
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Response error:', errorResponse);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorResponse.message}`,
        );
      }

      const data = await response.json();
      console.log('Response:', data);
      Alert.alert('Success', 'Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert(
        'Error',
        `There was an error submitting the form: ${error.message}`,
      );
    }
  };

  const fetchOfficers = async () => {
    const token = await AsyncStorage.getItem('token');
    const role = await AsyncStorage.getItem('role');
    const response = await fetch(
      'https://officer-reports-backend.onrender.com/api/officer/getAll?role=officer',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
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
      console.error('Error picking media:', error);
      Alert.alert('Error', 'Something went wrong while selecting media.');
    }
  };

  const deleteImage = uri => {
    setMedia(prevMedia => prevMedia.filter(item => item !== uri));
  };

  const pickMediatwo = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setMediatwo(prevMedia => [...prevMedia, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error picking media:', error);
      Alert.alert('Error', 'Something went wrong while selecting media.');
    }
  };

  const deleteImagetwo = uri => {
    setMediatwo(prevMedia => prevMedia.filter(item => item !== uri));
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to get the current location.',
        );
      }
    } else {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setCreatedLatitude(latitude);
        setCreatedLongitude(longitude);
      },
      error => Alert.alert('Error', error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const handleClearForm = () => {
    setInspectedOfficer('');
    setinspectedOfficerOther('');
    setalert('');
    setalertDetail('');
    setdistracted('');
    setdistractedDetail('');
    setproperUniform('');
    setproperUniformDetail('');
    setproperlyGroomed('');
    setproperlyGroomedDetail('');
    setvalidLicenses('');
    setvalidLicensesDetail('');
    setDARCompleted('');
    setDARCompletedDetail('');
    setknowPostOrders('');
    setknowPostOrdersDetail('');
    setadminQuestionDetail('');
    setvehicleGoodCondition('');
    setvehicleConditionDetail('');
    setvehicleServiceRequired('');
    setvehicleServiceRequiredDetail('');
    setvehicleDocsPresent('');
    setvehicleDocsPresentDetail('');
    setmeetClient('');
    setmeetClientDetail('');
    setadditionalComments('');
    setMedia('');
    setMediatwo('');
  };

  return (
    <ScrollView style={style.MainScrollView}>
      <View style={style.viewforiconandtextindailyreport}>
        <TouchableOpacity
          style={style.lefticontouchopacity}
          onPress={() => navigation.navigate('Reports')}>
          <FontAwesomeIcon
            style={style.gobackicon}
            color="#E34234"
            size={22}
            icon={faAngleLeft}
          />
        </TouchableOpacity>
        <Text style={style.mainheadingtext}>Field Inspection</Text>
        <View style={style.viewforimageheader}>
          <View style={style.imagewidthviewforheader}>
            <Image
              style={style.reportofofficerpasge}
              source={require('../assets/images/securitybaselogo.png')}
            />
          </View>
        </View>
      </View>
      <View>
        <View style={style.officerandsitesection}>
          <View style={style.viewforbgcandtext}>
            <Text style={style.headingtextfordailyactivey}>
              Officer and Site
            </Text>
          </View>
          <View style={style.officernameandsiteandlcinwetvalue}>
            <Text>
              <Text style={style.onltfontweight}>Officer: </Text>
              {officerName}
            </Text>
            <Text>
              <Text style={style.onltfontweight}>Client: </Text>
              {clientName}
            </Text>
            <Text>
              <Text style={style.onltfontweight}>Site: </Text>
              {siteName}
            </Text>
          </View>
        </View>
        <View>
          <View style={style.viewforbgcandtext}>
            <Text style={style.headingtextfordailyactivey}>
              Field Inspection
            </Text>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Inspected Officer:</Text>
              <FontAwesomeIcon
                style={style.staricon}
                size={8}
                icon={faStarOfLife}
              />
            </View>
            <View style={style.maindropdownview}>
              <View style={style.dropdownmenuandiconview}>
                <Picker
                  selectedValue={inspectedOfficer}
                  onValueChange={itemValue => setInspectedOfficer(itemValue)}
                  style={style.dropdownheadingtext}>
                  <Picker.Item label="Select Inspection Officer" value={null} />
                  {Array.isArray(officers) &&
                    officers.map(officer => (
                      <Picker.Item
                        key={officer._id}
                        label={officer.firstName}
                        value={officer._id}
                      />
                    ))}
                </Picker>
              </View>
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>
                Inspected Officer - Other:
              </Text>
            </View>
            <View style={style.InspectedOfficerOtherview}>
              <TextInput
                style={style.inspectiontextfieldothertextinput}
                value={inspectedOfficerOther}
                onChangeText={setinspectedOfficerOther}
              />
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Photo(s) of Officer</Text>
            </View>
            <View style={style.viewforredlineandaddbutton}>
              <TouchableOpacity
                onPress={pickMedia}
                style={style.addobservationtouchopcay}>
                <FontAwesomeIcon style={{ marginLeft: 5 }} icon={faCirclePlus} />
                <Text style={style.addobservationtext}>
                  {' '}
                  Add Photo, Video, or Audio
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <View style={style.mainviewforimageanddeleticon}>
              {Array.isArray(media) &&
                media.length > 0 &&
                media.map((uri, index) => (
                  <View key={index} style={style.mediaimageview}>
                    <Image source={{ uri }} style={style.mediaimage} />
                    <TouchableOpacity
                      onPress={() => deleteImage(uri)}
                      style={style.mediaimagedeleteiocnview}>
                      <FontAwesomeIcon
                        icon={faXmark}
                        size={18}
                        color="#dc311c"
                      />
                    </TouchableOpacity>
                  </View>
                ))}
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>alert:</Text>
              <FontAwesomeIcon
                style={style.staricon}
                size={8}
                icon={faStarOfLife}
              />
            </View>
            <View style={style.alertsectionradiobutnview}>
              <View style={style.radioButtonContainer}>
                <View style={style.radioButtonContainer}>
                  <RadioButton
                    value="true"
                    status={alert === 'true' ? 'checked' : 'unchecked'}
                    onPress={() => setalert('true')}
                  />
                  <Text style={style.radioButtonText}>Yes</Text>
                </View>
                <View style={style.radioButtonContainer}>
                  <RadioButton
                    value="false"
                    status={alert === 'false' ? 'checked' : 'unchecked'}
                    onPress={() => setalert('false')}
                  />
                  <Text style={style.radioButtonText}>No</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <Text style={style.describetext}>If No, Describe:</Text>
            <View style={style.alertsectionradiobutnview}>
              <View style={style.textareaviewofdescribe}>
                <Textarea
                  placeholder={''}
                  value={alertDetail}
                  onChangeText={setalertDetail}
                />
              </View>
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Distracted:</Text>
              <FontAwesomeIcon
                style={style.staricon}
                size={8}
                icon={faStarOfLife}
              />
            </View>
            <View style={style.alertsectionradiobutnview}>
              <View style={style.radioButtonContainer}>
                <View style={style.radioButtonContainer}>
                  <RadioButton
                    value="true"
                    status={distracted === 'true' ? 'checked' : 'unchecked'}
                    onPress={() => setdistracted('true')}
                  />
                  <Text style={style.radioButtonText}>Yes</Text>
                </View>
                <View style={style.radioButtonContainer}>
                  <RadioButton
                    value="false"
                    status={distracted === 'false' ? 'checked' : 'unchecked'}
                    onPress={() => setdistracted('false')}
                  />
                  <Text style={style.radioButtonText}>No</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <Text style={style.describetext}>If Yes, Describe:</Text>
            <View style={style.alertsectionradiobutnview}>
              <View style={style.textareaviewofdescribe}>
                <Textarea
                  placeholder={''}
                  value={distractedDetail}
                  onChangeText={setdistractedDetail}
                />
              </View>
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Proper Uniform:</Text>
              <FontAwesomeIcon
                style={style.staricon}
                size={8}
                icon={faStarOfLife}
              />
            </View>
            <View style={style.alertsectionradiobutnview}>
              <View style={style.radioButtonContainer}>
                <View style={style.radioButtonContainer}>
                  <RadioButton
                    value="true"
                    status={properUniform === 'true' ? 'checked' : 'unchecked'}
                    onPress={() => setproperUniform('true')}
                  />
                  <Text style={style.radioButtonText}>Yes</Text>
                </View>
                <View style={style.radioButtonContainer}>
                  <RadioButton
                    value="false"
                    status={properUniform === 'false' ? 'checked' : 'unchecked'}
                    onPress={() => setproperUniform('false')}
                  />
                  <Text style={style.radioButtonText}>No</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <Text style={style.describetext}>If No, Describe:</Text>
            <View style={style.alertsectionradiobutnview}>
              <View style={style.textareaviewofdescribe}>
                <Textarea
                  placeholder={''}
                  value={properUniformDetail}
                  onChangeText={setproperUniformDetail}
                />
              </View>
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Properly Groomed:</Text>
              <FontAwesomeIcon
                style={style.staricon}
                size={8}
                icon={faStarOfLife}
              />
            </View>
            <View style={style.alertsectionradiobutnview}>
              <View style={style.radioButtonContainer}>
                <View style={style.radioButtonContainer}>
                  <RadioButton
                    value="true"
                    status={
                      properlyGroomed === 'true' ? 'checked' : 'unchecked'
                    }
                    onPress={() => setproperlyGroomed('true')}
                  />
                  <Text style={style.radioButtonText}>Yes</Text>
                </View>
                <View style={style.radioButtonContainer}>
                  <RadioButton
                    value="false"
                    status={
                      properlyGroomed === 'false' ? 'checked' : 'unchecked'
                    }
                    onPress={() => setproperlyGroomed('false')}
                  />
                  <Text style={style.radioButtonText}>No</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <Text style={style.describetext}>If No, Describe:</Text>
            <View style={style.alertsectionradiobutnview}>
              <View style={style.textareaviewofdescribe}>
                <Textarea
                  placeholder={''}
                  value={properlyGroomedDetail}
                  onChangeText={setproperlyGroomedDetail}
                />
              </View>
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>All Valid Licenses:</Text>
              <FontAwesomeIcon
                style={style.staricon}
                size={8}
                icon={faStarOfLife}
              />
            </View>
            <View style={style.alertsectionradiobutnview}>
              <View style={style.radioButtonContainer}>
                <View style={style.radioButtonContainer}>
                  <RadioButton
                    value="true"
                    status={validLicenses === 'true' ? 'checked' : 'unchecked'}
                    onPress={() => setvalidLicenses('true')}
                  />
                  <Text style={style.radioButtonText}>Yes</Text>
                </View>
                <View style={style.radioButtonContainer}>
                  <RadioButton
                    value="false"
                    status={validLicenses === 'false' ? 'checked' : 'unchecked'}
                    onPress={() => setvalidLicenses('false')}
                  />
                  <Text style={style.radioButtonText}>No</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <Text style={style.describetext}>If No, Describe:</Text>
            <View style={style.alertsectionradiobutnview}>
              <View style={style.textareaviewofdescribe}>
                <Textarea
                  placeholder={''}
                  value={validLicensesDetail}
                  onChangeText={setvalidLicensesDetail}
                />
              </View>
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>
                Is DAR completed Properly?:
              </Text>
              <FontAwesomeIcon
                style={style.staricon}
                size={8}
                icon={faStarOfLife}
              />
            </View>
            <View style={style.alertsectionradiobutnview}>
              <View style={style.radioButtonContainer}>
                <View style={style.radioButtonContainer}>
                  <RadioButton
                    value="true"
                    status={DARCompleted === 'true' ? 'checked' : 'unchecked'}
                    onPress={() => setDARCompleted('true')}
                  />
                  <Text style={style.radioButtonText}>Yes</Text>
                </View>
                <View style={style.radioButtonContainer}>
                  <RadioButton
                    value="false"
                    status={DARCompleted === 'false' ? 'checked' : 'unchecked'}
                    onPress={() => setDARCompleted('false')}
                  />
                  <Text style={style.radioButtonText}>No</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <Text style={style.describetext}>If No, Describe:</Text>
            <View style={style.alertsectionradiobutnview}>
              <View style={style.textareaviewofdescribe}>
                <Textarea
                  placeholder={''}
                  value={DARCompletedDetail}
                  onChangeText={setDARCompletedDetail}
                />
              </View>
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>
                Does Officer know the Post Orders?:
              </Text>
              <FontAwesomeIcon
                style={style.staricon}
                size={8}
                icon={faStarOfLife}
              />
            </View>
            <View style={style.alertsectionradiobutnview}>
              <View style={style.radioButtonContainer}>
                <View style={style.radioButtonContainer}>
                  <RadioButton
                    value="true"
                    status={knowPostOrders === 'true' ? 'checked' : 'unchecked'}
                    onPress={() => setknowPostOrders('true')}
                  />
                  <Text style={style.radioButtonText}>Yes</Text>
                </View>
                <View style={style.radioButtonContainer}>
                  <RadioButton
                    value="false"
                    status={
                      knowPostOrders === 'false' ? 'checked' : 'unchecked'
                    }
                    onPress={() => setknowPostOrders('false')}
                  />
                  <Text style={style.radioButtonText}>No</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <Text style={style.describetext}>If No, Describe:</Text>
            <View style={style.alertsectionradiobutnview}>
              <View style={style.textareaviewofdescribe}>
                <Textarea
                  placeholder={''}
                  value={knowPostOrdersDetail}
                  onChangeText={setknowPostOrdersDetail}
                />
              </View>
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>
                Does the officer have payroll or administrative questions?:
              </Text>
              <FontAwesomeIcon
                style={style.staricon}
                size={8}
                icon={faStarOfLife}
              />
            </View>
            <View style={style.alertsectionradiobutnview}>
              <View style={style.radioButtonContainer}>
                <View style={style.radioButtonContainer}>
                  <RadioButton
                    value="true"
                    status={adminQuestions === 'true' ? 'checked' : 'unchecked'}
                    onPress={() => setadminQuestions('true')}
                  />
                  <Text style={style.radioButtonText}>Yes</Text>
                </View>
                <View style={style.radioButtonContainer}>
                  <RadioButton
                    value="false"
                    status={
                      adminQuestions === 'false' ? 'checked' : 'unchecked'
                    }
                    onPress={() => setadminQuestions('false')}
                  />
                  <Text style={style.radioButtonText}>No</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <Text style={style.describetext}>If Yes, what are they:</Text>
            <View style={style.alertsectionradiobutnview}>
              <View style={style.textareaviewofdescribe}>
                <Textarea
                  placeholder={''}
                  value={adminQuestionDetail}
                  onChangeText={setadminQuestionDetail}
                />
              </View>
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>
                Is company vehicle in good condition?:{' '}
              </Text>
              <FontAwesomeIcon
                style={style.staricon}
                size={8}
                icon={faStarOfLife}
              />
            </View>
            <View style={style.alertsectionradiobutnview}>
              <View style={style.radioButtonContainer}>
                <View style={style.radioButtonContainer}>
                  <RadioButton
                    value="true"
                    status={
                      vehicleGoodCondition === 'true' ? 'checked' : 'unchecked'
                    }
                    onPress={() => setvehicleGoodCondition('true')}
                  />
                  <Text style={style.radioButtonText}>Yes</Text>
                </View>
                <View style={style.radioButtonContainer}>
                  <RadioButton
                    value="false"
                    status={
                      vehicleGoodCondition === 'false' ? 'checked' : 'unchecked'
                    }
                    onPress={() => setvehicleGoodCondition('false')}
                  />
                  <Text style={style.radioButtonText}>No</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <Text style={style.describetext}>If No, Describe:</Text>
            <View style={style.alertsectionradiobutnview}>
              <View style={style.textareaviewofdescribe}>
                <Textarea
                  placeholder={''}
                  value={vehicleConditionDetail}
                  onChangeText={setvehicleConditionDetail}
                />
              </View>
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Photo(s) of Vehicle</Text>
            </View>
            <View style={style.viewforredlineandaddbutton}>
              <TouchableOpacity
                onPress={pickMediatwo}
                style={style.addobservationtouchopcay}>
                <FontAwesomeIcon style={{ marginLeft: 5 }} icon={faCirclePlus} />
                <Text style={style.addobservationtext}>
                  {' '}
                  Add Photo, Video, or Audio
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <View style={style.mainviewforimageanddeleticon}>
              {Array.isArray(mediatwo) &&
                mediatwo.length > 0 &&
                mediatwo.map((uri, index) => (
                  <View key={index} style={style.mediaimageview}>
                    <Image source={{ uri }} style={style.mediaimage} />
                    <TouchableOpacity
                      onPress={() => deleteImagetwo(uri)}
                      style={style.mediaimagedeleteiocnview}>
                      <FontAwesomeIcon
                        icon={faXmark}
                        size={18}
                        color="#dc311c"
                      />
                    </TouchableOpacity>
                  </View>
                ))}
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>
                Does the vehicle require service?:{' '}
              </Text>
              <FontAwesomeIcon
                style={style.staricon}
                size={8}
                icon={faStarOfLife}
              />
            </View>
            <View style={style.alertsectionradiobutnview}>
              <View style={style.radioButtonContainer}>
                <View style={style.radioButtonContainer}>
                  <RadioButton
                    value="true"
                    status={
                      vehicleServiceRequired === 'true'
                        ? 'checked'
                        : 'unchecked'
                    }
                    onPress={() => setvehicleServiceRequired('true')}
                  />
                  <Text style={style.radioButtonText}>Yes</Text>
                </View>
                <View style={style.radioButtonContainer}>
                  <RadioButton
                    value="false"
                    status={
                      vehicleServiceRequired === 'false'
                        ? 'checked'
                        : 'unchecked'
                    }
                    onPress={() => setvehicleServiceRequired('false')}
                  />
                  <Text style={style.radioButtonText}>No</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <Text style={style.describetext}>If Yes, Describe:</Text>
            <View style={style.alertsectionradiobutnview}>
              <View style={style.textareaviewofdescribe}>
                <Textarea
                  placeholder={''}
                  value={vehicleServiceRequiredDetail}
                  onChangeText={setvehicleServiceRequiredDetail}
                />
              </View>
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>
                Vehicle Documents Present (Insurance, Gas, Registration, etc)?
              </Text>
              <FontAwesomeIcon
                style={style.staricon}
                size={8}
                icon={faStarOfLife}
              />
            </View>
            <View style={style.alertsectionradiobutnview}>
              <View style={style.radioButtonContainer}>
                <View style={style.radioButtonContainer}>
                  <RadioButton
                    value="true"
                    status={
                      vehicleDocsPresent === 'true' ? 'checked' : 'unchecked'
                    }
                    onPress={() => setvehicleDocsPresent('true')}
                  />
                  <Text style={style.radioButtonText}>Yes</Text>
                </View>
                <View style={style.radioButtonContainer}>
                  <RadioButton
                    value="false"
                    status={
                      vehicleDocsPresent === 'false' ? 'checked' : 'unchecked'
                    }
                    onPress={() => setvehicleDocsPresent('false')}
                  />
                  <Text style={style.radioButtonText}>No</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <Text style={style.describetext}>If Yes, what are they :</Text>
            <View style={style.alertsectionradiobutnview}>
              <View style={style.textareaviewofdescribe}>
                <Textarea
                  placeholder={''}
                  value={vehicleDocsPresentDetail}
                  onChangeText={setvehicleDocsPresentDetail}
                />
              </View>
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>
                Did you meet with the client?:
              </Text>
              <FontAwesomeIcon
                style={style.staricon}
                size={8}
                icon={faStarOfLife}
              />
            </View>
            <View style={style.alertsectionradiobutnview}>
              <View style={style.radioButtonContainer}>
                <View style={style.radioButtonContainer}>
                  <RadioButton
                    value="true"
                    status={meetClient === 'true' ? 'checked' : 'unchecked'}
                    onPress={() => setmeetClient('true')}
                  />
                  <Text style={style.radioButtonText}>Yes</Text>
                </View>
                <View style={style.radioButtonContainer}>
                  <RadioButton
                    value="false"
                    status={meetClient === 'false' ? 'checked' : 'unchecked'}
                    onPress={() => setmeetClient('false')}
                  />
                  <Text style={style.radioButtonText}>No</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <Text style={style.describetext}>If Yes, what are they :</Text>
            <View style={style.alertsectionradiobutnview}>
              <View style={style.textareaviewofdescribe}>
                <Textarea
                  placeholder={''}
                  value={meetClientDetail}
                  onChangeText={setmeetClientDetail}
                />
              </View>
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <Text style={style.describetext}>Additional Comments:</Text>
            <View style={style.alertsectionradiobutnview}>
              <View style={style.textareaviewofdescribe}>
                <Textarea
                  placeholder={''}
                  value={additionalComments}
                  onChangeText={setadditionalComments}
                />
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={style.submitandclearbutnview}>
        <TouchableOpacity style={style.submitbuttonview} onPress={handleSubmit}>
          <Text style={style.submitextindailyreport}>submit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={style.submitbuttonview}
          onPress={handleClearForm}>
          <Text style={style.submitextindailyreport}>Clear Form</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default FieldInspection;
