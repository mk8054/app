import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
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
import Textarea from 'react-native-textarea';
import DateTimePicker from '@react-native-community/datetimepicker';
import style from '../Component/Style';
import { format } from 'date-fns';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';

const Incidentreport = ({ navigation }) => {
  const [officerName, setOfficerName] = useState('');
  const [clientName, setClientName] = useState('');
  const [siteName, setSiteName] = useState('');
  const [addedObservations, setAddedObservations] = useState([]);
  const [media, setMedia] = useState([]);

  const [showincidentDatePicker, setShowincidentDatePicker] = useState(false);
  const textareaRef = useRef(null);

  const [types, setTypes] = useState([]);
  const [incidentReportNumber, setincidentReportNumber] = useState(null);
  const [incidentDate, setIncidentDate] = useState(new Date());
  const [incidentTypeId, setincidentTypeId] = useState(null);
  const [incidentOtherType, setincidentOtherType] = useState(null);
  const [victimName, setvictimName] = useState(null);
  const [victimContactInfo, setvictimContactInfo] = useState(null);
  const [suspectNames, setsuspectNames] = useState(null);
  const [suspectContactInfo, setsuspectContactInfo] = useState(null);
  const [witnessNames, setwitnessNames] = useState(null);
  const [witnessContactInfo, setwitnessContactInfo] = useState(null);
  const [incidentLocation, setincidentLocation] = useState(null);
  const [incidentSummary, setincidentSummary] = useState(null);
  const [policeCalled, setpoliceCalled] = useState(null);
  const [whyPoliceNotCalled, setwhyPoliceNotCalled] = useState(null);
  const [policeInfo, setpoliceInfo] = useState(null);
  const [fireTruckNumber, setfireTruckNumber] = useState(null);
  const [ambulanceNumber, setambulanceNumber] = useState(null);
  const [incidentDetails, setincidentDetails] = useState(null);
  const [officerActions, setofficerActions] = useState(null);
  const [attachments, setattachments] = useState([]);

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userID');
    const clientSiteId = await AsyncStorage.getItem('siteid');

    const formData = new FormData();
    formData.append('incidentReportNumber', incidentReportNumber);
    formData.append('incidentDate', incidentDate.toISOString());
    formData.append('incidentTypeId', incidentTypeId);
    formData.append('incidentOtherType', incidentOtherType);
    formData.append('victimName', victimName);
    formData.append('victimContactInfo', victimContactInfo);
    formData.append('suspectNames', suspectNames);
    formData.append('suspectContactInfo', suspectContactInfo);
    formData.append('witnessNames', witnessNames);
    formData.append('witnessContactInfo', witnessContactInfo);
    formData.append('incidentLocation', incidentLocation);
    formData.append('incidentSummary', incidentSummary);
    formData.append('policeCalled', policeCalled);
    formData.append('whyPoliceNotCalled', whyPoliceNotCalled);
    formData.append('policeInfo', policeInfo);
    formData.append('fireTruckNumber', fireTruckNumber);
    formData.append('ambulanceNumber', ambulanceNumber);
    formData.append('incidentDetails', incidentDetails);
    formData.append('officerActions', officerActions);
    formData.append('clientSiteId', clientSiteId);
    formData.append('userId', userId);

    addedObservations.forEach((id, index) => {
      formData.append(`observations[${index}]`, id);
    });

    await Promise.all(
      media.map(async (uri, index) => {
        const fileType = uri.split('.').pop();
        const response = await fetch(uri);
        const blob = await response.blob();
        formData.append('attachments', {
          name: `media_${index}.${fileType}`,
          type: `image/${fileType}`,
          uri: uri,
        });
      }),
    );
    // await Promise.all(
    //     attachments.map(async (uri, index) => {
    //         if (uri) {
    //             const response = await fetch(uri);
    //             const blob = await response.blob();
    //             const fileType = uri.split('.').pop(); // Get the file type
    //             formData.append('attachments', blob, `media_${index}.${fileType}`);
    //         }
    //     })
    // );

    try {
      const response = await fetch(
        'https://officer-reports-backend.onrender.com/api/incedent-report/add',
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Check for response status
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Error response:', errorResponse);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response:', data);
      Alert.alert('Success', 'Incident report submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert('Error', 'Failed to submit the report. ' + error.message);
    }
  };

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

  const fetchIncident = async () => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(
      'https://officer-reports-backend.onrender.com/api/type/getAll?category=Incident',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    const data = await response.json();
    setTypes(data.data);
  };

  useEffect(() => {
    fetchIncident();
    getOfficerInfo();
  }, []);

  const handleincidentDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || incidentDate;
    setShowincidentDatePicker(false);
    setincidentDate(currentDate);
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
      console.error('Error picking media:', error);
      Alert.alert('Error', 'Something went wrong while selecting media.');
    }
  };

  const deleteImage = uri => {
    setMedia(prevMedia => prevMedia.filter(item => item !== uri));
  };

  const handleClearForm = () => {
    setincidentReportNumber('');
    setIncidentDate(new Date());
    setincidentTypeId('');
    setincidentOtherType('');
    setvictimName('');
    setvictimContactInfo('');
    setsuspectNames('');
    setsuspectContactInfo('');
    setwitnessNames('');
    setwitnessContactInfo('');
    setincidentLocation('');
    setincidentSummary('');
    setpoliceCalled(null);
    setwhyPoliceNotCalled('');
    setpoliceInfo('');
    setfireTruckNumber('');
    setambulanceNumber('');
    setincidentDetails('');
    setofficerActions('');
    setattachments([]);
    setAddedObservations('');
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
        <Text style={style.mainheadingtext}>Incident Report</Text>
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
              value={incidentReportNumber}
              onChangeText={setincidentReportNumber}
            />
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>
                Date and Time of Incident :
              </Text>
              <FontAwesomeIcon
                style={style.staricon}
                size={8}
                icon={faStarOfLife}
              />
            </View>
            <View style={style.InspectedOfficerOtherview}>
              <TouchableOpacity onPress={() => setShowincidentDatePicker(true)}>
                <TextInput
                  style={style.inspectiontextfieldothertextinput}
                  value={format(incidentDate, 'yyyy-MM-dd')}
                  editable={false}
                />
              </TouchableOpacity>
              {showincidentDatePicker && (
                <DateTimePicker
                  value={incidentDate}
                  mode="date"
                  display="default"
                  onChange={handleincidentDateChange}
                />
              )}
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Incident Type :</Text>
              <FontAwesomeIcon
                style={style.staricon}
                size={8}
                icon={faStarOfLife}
              />
            </View>
            <View style={style.maindropdownview}>
              <View style={style.dropdownmenuandiconview}>
                <Picker
                  selectedValue={incidentTypeId}
                  onValueChange={itemValue => setincidentTypeId(itemValue)}
                  style={style.dropdownheadingtext}>
                  <Picker.Item label="Select Inspection Type" value={null} />
                  {Array.isArray(types) &&
                    types.map(type => (
                      <Picker.Item
                        key={type._id}
                        label={type.typeName}
                        value={type._id}
                      />
                    ))}
                </Picker>
              </View>
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>If Other, What Type :</Text>
            </View>
            <TextInput
              style={style.textyinputforshift}
              value={incidentOtherType}
              onChangeText={setincidentOtherType}
            />
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Victim Name(s) :</Text>
            </View>
            <TextInput
              style={style.textyinputforshift}
              value={victimName}
              onChangeText={setvictimName}
            />
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Victim Contact Info :</Text>
            </View>
            <TextInput
              style={style.textyinputforshift}
              value={victimContactInfo}
              onChangeText={setvictimContactInfo}
            />
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Suspect Name(s) :</Text>
            </View>
            <TextInput
              style={style.textyinputforshift}
              value={suspectNames}
              onChangeText={setsuspectNames}
            />
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Suspect Contact Info :</Text>
            </View>
            <TextInput
              style={style.textyinputforshift}
              value={suspectContactInfo}
              onChangeText={setsuspectContactInfo}
            />
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Witness Name(s) :</Text>
            </View>
            <TextInput
              style={style.textyinputforshift}
              value={witnessNames}
              onChangeText={setwitnessNames}
            />
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Witness Contact Info :</Text>
            </View>
            <TextInput
              style={style.textyinputforshift}
              value={witnessContactInfo}
              onChangeText={setwitnessContactInfo}
            />
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Incident Location :</Text>
              <FontAwesomeIcon
                style={style.staricon}
                size={8}
                icon={faStarOfLife}
              />
            </View>
            <TextInput
              style={style.textyinputforshift}
              value={incidentLocation}
              onChangeText={setincidentLocation}
            />
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Incident Summary :</Text>
              <FontAwesomeIcon
                style={style.staricon}
                size={8}
                icon={faStarOfLife}
              />
            </View>
            <TextInput
              style={style.textyinputforshift}
              value={incidentSummary}
              onChangeText={setincidentSummary}
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
              <FontAwesomeIcon
                style={style.staricon}
                size={8}
                icon={faStarOfLife}
              />
            </View>
            <View style={style.maindropdownview}>
              <View style={style.dropdownmenuandiconview}>
                <Picker
                  selectedValue={policeCalled}
                  onValueChange={itemValue => setpoliceCalled(itemValue)}
                  style={style.dropdownheadingtext}>
                  <Picker.Item label="Select Option" value={null} />
                  <Picker.Item label="Yes" value="true" />
                  <Picker.Item label="No" value="false" />
                </Picker>
              </View>
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>If Not, Why? :</Text>
              <FontAwesomeIcon
                style={style.staricon}
                size={8}
                icon={faStarOfLife}
              />
            </View>
            <TextInput
              style={style.textyinputforshift}
              value={whyPoliceNotCalled}
              onChangeText={setwhyPoliceNotCalled}
            />
          </View>
          <View style={style.textfieldandtextarseview}>
            <Text style={style.describetext}>Police Name(s) & Badge(s) :</Text>
            <View style={style.alertsectionradiobutnview}>
              <View style={style.textareaviewofdescribe}>
                <Textarea
                  placeholder=""
                  value={policeInfo}
                  onChangeText={setpoliceInfo}
                />
              </View>
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Fire Truck Number :</Text>
              <FontAwesomeIcon
                style={style.staricon}
                size={8}
                icon={faStarOfLife}
              />
            </View>
            <TextInput
              style={style.textyinputforshift}
              value={fireTruckNumber}
              onChangeText={setfireTruckNumber}
              keyboardType="numeric"
            />
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Ambulance Number :</Text>
              <FontAwesomeIcon
                style={style.staricon}
                size={8}
                icon={faStarOfLife}
              />
            </View>
            <TextInput
              style={style.textyinputforshift}
              value={ambulanceNumber}
              onChangeText={setambulanceNumber}
              keyboardType="numeric"
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
                <Textarea
                  ref={textareaRef}
                  placeholder={''}
                  value={incidentDetails}
                  onChangeText={setincidentDetails}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={style.videoaudiophotoviewmainview}>
          <View style={style.viewforbgcandtext}>
            <Text style={style.headingtextfordailyactivey}>
              Photos, Videos, Audio
            </Text>
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
            {Array.isArray(attachments) &&
              attachments.length > 0 &&
              attachments.map((uri, index) => (
                <View key={index} style={style.mediaimageview}>
                  <Image source={{ uri }} style={style.mediaimage} />
                  <TouchableOpacity
                    onPress={() => deleteImage(uri)}
                    style={style.mediaimagedeleteiocnview}>
                    <FontAwesomeIcon icon={faXmark} size={18} color="#dc311c" />
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        </View>
        <View style={style.officerandsitesection}>
          <View style={style.viewforbgcandtext}>
            <Text style={style.headingtextfordailyactivey}>
              Officer Actions
            </Text>
          </View>
          <View style={style.textfieldandtextarseview}>
            <Text style={style.describetext}>Details :</Text>
            <View style={style.alertsectionradiobutnview}>
              <View style={style.textareaviewofdescribe}>
                <Textarea
                  ref={textareaRef}
                  placeholder={''}
                  value={officerActions}
                  onChangeText={setofficerActions}
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

export default Incidentreport;
