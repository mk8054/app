import React, { useState, useEffect, useRef } from 'react';
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
import Textarea from 'react-native-textarea';
import style from '../Component/Style';

const Truckcheckin = ({ navigation }) => {
  const [officerName, setOfficerName] = useState('');
  const [clientName, setClientName] = useState('');
  const [siteName, setSiteName] = useState('');
  const [media, setMedia] = useState([]);

  const [company, setcompany] = useState([]);
  const [inDriver, setinDriver] = useState([]);
  const [tractorNumber, settractorNumber] = useState([]);
  const [LPNumber, setLPNumber] = useState([]);
  const [VIN, setVIN] = useState([]);
  const [inTrailerNumber, setinTrailerNumber] = useState([]);
  const [inSealNumber, setinSealNumber] = useState([]);
  const [dockBayNumber, setdockBayNumber] = useState([]);
  const [inNotes, setinNotes] = useState([]);
  const [addedObservations, setAddedObservations] = useState([]);
  const textareaRef = useRef(null);
  const [refreshKey, setRefreshKey] = useState(0);

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

  useEffect(() => {
    getOfficerInfo();
  }, []);

  const handlesubmit = async () => {
    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userID');
    const clientSiteId = await AsyncStorage.getItem('siteid');

    const formData = new FormData();
    ``;
    formData.append('company', company);
    formData.append('inDriver', inDriver);
    formData.append('tractorNumber', tractorNumber);
    formData.append('LPNumber', LPNumber);
    formData.append('VIN', VIN);
    formData.append('inTrailerNumber', inTrailerNumber);
    formData.append('dockBayNumber', dockBayNumber);
    formData.append('inNotes', inNotes);
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
    formData.append('clientSiteId', clientSiteId);
    formData.append('userId', userId);

    const submitResponse = await fetch(
      'https://officer-reports-backend.onrender.com/api/truckCheckIn/add',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    const result = await submitResponse.json();
    refreshComponent();
    console.log(result);
  };

  const handleClearForm = () => {
    setcompany('');
    setinDriver('');
    settractorNumber('');
    setLPNumber('');
    setVIN('');
    setinTrailerNumber('');
    setinSealNumber('');
    setdockBayNumber('');
    setinNotes('');
    setAddedObservations('');
    setMedia('');
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

  const refreshComponent = () => {
    setRefreshKey(prevKey => prevKey + 1);
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
        <Text style={style.mainheadingtext}>Truck Log</Text>
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
            <Text style={style.headingtextfordailyactivey}>Truck Check-In</Text>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Company :</Text>
              <FontAwesomeIcon
                style={style.staricon}
                size={8}
                icon={faStarOfLife}
              />
            </View>
            <View style={style.InspectedOfficerOtherview}>
              <TextInput
                style={style.inspectiontextfieldothertextinput}
                value={company}
                onChangeText={setcompany}
              />
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Driver :</Text>
              <FontAwesomeIcon
                style={style.staricon}
                size={8}
                icon={faStarOfLife}
              />
            </View>
            <View style={style.InspectedOfficerOtherview}>
              <TextInput
                style={style.inspectiontextfieldothertextinput}
                value={inDriver}
                onChangeText={setinDriver}
              />
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Tractor # :</Text>
              <FontAwesomeIcon
                style={style.staricon}
                size={8}
                icon={faStarOfLife}
              />
            </View>
            <View style={style.InspectedOfficerOtherview}>
              <TextInput
                style={style.inspectiontextfieldothertextinput}
                value={tractorNumber}
                onChangeText={settractorNumber}
              />
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>LP # :</Text>
            </View>
            <View style={style.InspectedOfficerOtherview}>
              <TextInput
                style={style.inspectiontextfieldothertextinput}
                value={LPNumber}
                onChangeText={setLPNumber}
              />
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>VIN :</Text>
            </View>
            <View style={style.InspectedOfficerOtherview}>
              <TextInput
                style={style.inspectiontextfieldothertextinput}
                value={VIN}
                onChangeText={setVIN}
              />
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Trailer # In :</Text>
            </View>
            <View style={style.InspectedOfficerOtherview}>
              <TextInput
                style={style.inspectiontextfieldothertextinput}
                value={inTrailerNumber}
                onChangeText={setinTrailerNumber}
              />
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Seal # :</Text>
            </View>
            <View style={style.InspectedOfficerOtherview}>
              <TextInput
                style={style.inspectiontextfieldothertextinput}
                value={inSealNumber}
                onChangeText={setinSealNumber}
              />
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Dock / Bay # :</Text>
            </View>
            <View style={style.InspectedOfficerOtherview}>
              <TextInput
                style={style.inspectiontextfieldothertextinput}
                value={dockBayNumber}
                onChangeText={setdockBayNumber}
              />
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <Text style={style.describetext}>Notes :</Text>
            <View style={style.alertsectionradiobutnview}>
              <View style={style.textareaviewofdescribe}>
                <Textarea
                  placeholder={''}
                  value={inNotes}
                  onChangeText={setinNotes}
                  ref={textareaRef}
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
            {Array.isArray(media) &&
              media.length > 0 &&
              media.map((uri, index) => (
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
      </View>
      <View style={style.submitandclearbutnview}>
        <TouchableOpacity style={style.submitbuttonview} onPress={handlesubmit}>
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

export default Truckcheckin;
