import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
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
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import Textarea from 'react-native-textarea';
import style from '../Component/Style';

const VisitorLog = ({ navigation }) => {
  const [officerName, setOfficerName] = useState('');
  const [clientName, setClientName] = useState('');
  const [siteName, setSiteName] = useState('');

  const [types, setTypes] = useState([]);
  const [visitorName, setVisitorName] = useState('');
  const [destination, setDestination] = useState('');
  const [visitorIdTypeId, setVisitorIdTypeId] = useState(null);
  const [typeIfOther, setTypeIfOther] = useState('');
  const [badgeNumber, setBadgeNumber] = useState('');
  const [LPNumber, setLPNumber] = useState('');
  const [temperature, setTemperature] = useState('');
  const [faceCovering, setFaceCovering] = useState(null);
  const [company, setCompany] = useState('');
  const [inNotes, setInNotes] = useState('');
  const [media, setMedia] = useState([]);
  const [addedObservations, setAddedObservations] = useState([]);

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

  const fetchTypes = async () => {
    try {
      const response = await fetch(
        'https://officer-reports-backend.onrender.com/api/type/getAll?category=Visitor_ID',
      );
      if (!response.ok) {
        throw new Error('Failed to fetch types');
      }
      const result = await response.json();
      if (result.success) {
        setTypes(result.data);
      }
    } catch (error) {
      console.error('Error fetching types:', error);
      Alert.alert('Error', 'Could not fetch ID types');
    }
  };

  useEffect(() => {
    fetchTypes();
    getOfficerInfo();
  }, []);

  const handleSubmit = async () => {
    if (!visitorName || !destination || !visitorIdTypeId) {
      Alert.alert("Error", "Please fill out all required fields.");
      return;
    }

    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userID');
    const clientSiteId = await AsyncStorage.getItem('siteid');

    const formData = new FormData();
    formData.append('visitorName', visitorName);
    formData.append('destination', destination);
    formData.append('visitorIdTypeId', visitorIdTypeId);
    formData.append('typeIfOther', typeIfOther);
    formData.append('badgeNumber', badgeNumber);
    formData.append('LPNumber', LPNumber);
    formData.append('temperature', temperature);
    formData.append('faceCovering', faceCovering);
    formData.append('company', company);
    formData.append('inNotes', inNotes);

    addedObservations.forEach((id, index) => {
      formData.append(`observations[${index}]`, id);
    });

    await Promise.all(
      media.map(async (uri, index) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        const fileType = uri.split('.').pop();

        formData.append('attachments', {
          name: `media_${index}.${fileType}`,
          type: `image/${fileType}`,
          uri: uri, // Ensure that this is the correct URI format
        });
      }),
    );

    formData.append('clientSiteId', clientSiteId);
    formData.append('userId', userId);

    try {
      const response = await fetch(
        'https://officer-reports-backend.onrender.com/api/visitor/add',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Server error');
      }

      const data = await response.json();
      Alert.alert('Success', 'Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert('Error', `Failed to submit the form: ${error.message || 'Unknown error'}`);
    }
  };

  const handleClearForm = () => {
    setVisitorName('');
    setDestination('');
    setVisitorIdTypeId(null);
    setTypeIfOther('');
    setBadgeNumber('');
    setLPNumber('');
    setTemperature('');
    setFaceCovering(null);
    setCompany('');
    setInNotes('');
    setMedia([]); // Clear media as an array
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
        <Text style={style.mainheadingtext}>Visitor Log</Text>
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
            <Text style={style.headingtextfordailyactivey}>Officer and Site</Text>
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
            <Text style={style.headingtextfordailyactivey}>Visitor Information</Text>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Visitor Name : </Text>
              <FontAwesomeIcon
                style={style.staricon}
                size={8}
                icon={faStarOfLife}
              />
            </View>
            <TextInput
              style={style.textyinputforshift}
              value={visitorName}
              onChangeText={setVisitorName}
            />
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Destination : </Text>
              <FontAwesomeIcon
                style={style.staricon}
                size={8}
                icon={faStarOfLife}
              />
            </View>
            <TextInput
              style={style.textyinputforshift}
              value={destination}
              onChangeText={setDestination}
            />
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Type of ID :</Text>
              <FontAwesomeIcon
                style={style.staricon}
                size={8}
                icon={faStarOfLife}
              />
            </View>
            <View style={style.maindropdownview}>
              <View style={style.dropdownmenuandiconview}>
                <Picker
                  selectedValue={visitorIdTypeId}
                  onValueChange={itemValue => setVisitorIdTypeId(itemValue)}
                  style={style.dropdownheadingtext}>
                  <Picker.Item label="Select Inspection Type" value={null} />
                  {types.map(type => (
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
              <Text style={style.textinputtext}>If Other, What Type : </Text>
            </View>
            <TextInput
              style={style.textyinputforshift}
              value={typeIfOther}
              onChangeText={setTypeIfOther}
            />
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Badge # : </Text>
            </View>
            <TextInput
              style={style.textyinputforshift}
              value={badgeNumber}
              onChangeText={setBadgeNumber}
            />
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>LP # : </Text>
            </View>
            <TextInput
              style={style.textyinputforshift}
              value={LPNumber}
              onChangeText={setLPNumber}
            />
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Temperature : </Text>
            </View>
            <TextInput
              style={style.textyinputforshift}
              value={temperature}
              onChangeText={setTemperature}
            />
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Face Covering :</Text>
            </View>
            <View style={style.maindropdownview}>
              <View style={style.dropdownmenuandiconview}>
                <Picker
                  selectedValue={faceCovering}
                  onValueChange={itemValue => setFaceCovering(itemValue)}
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
              <Text style={style.textinputtext}>Company : </Text>
            </View>
            <TextInput
              style={style.textyinputforshift}
              value={company}
              onChangeText={setCompany}
            />
          </View>
          <View style={style.textfieldandtextarseview}>
            <Text style={style.describetext}>Entry Notes : </Text>
            <View style={style.alertsectionradiobutnview}>
              <View style={style.textareaviewofdescribe}>
                <Textarea
                  placeholder={''}
                  value={inNotes}
                  onChangeText={setInNotes}
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
              <Text style={style.addobservationtext}>{' '}Add Photo, Video, or Audio</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <View style={style.mainviewforimageanddeleticon}>
            {Array.isArray(media) && media.length > 0 && media.map((uri, index) => (
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
      </View>
      <View style={style.submitandclearbutnview}>
        <TouchableOpacity style={style.submitbuttonview} onPress={handleSubmit}>
          <Text style={style.submitextindailyreport}>Submit</Text>
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

export default VisitorLog;