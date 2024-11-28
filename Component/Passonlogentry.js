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

const Passonlogentry = ({ navigation }) => {
  const [officerName, setOfficerName] = useState('');
  const [clientName, setClientName] = useState('');
  const [siteName, setSiteName] = useState('');

  const [media, setMedia] = useState([]);
  const [postShift, setpostShift] = useState('');
  const [note, setnote] = useState('');
  const [addedObservations, setAddedObservations] = useState([]);
  const textareaRef = useRef(null);

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

  const handlesubmit = async () => {
    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userID');
    const clientSiteId = await AsyncStorage.getItem('siteid');

    const formData = new FormData();
    formData.append('postShift', postShift);
    formData.append('note', note);
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

    formData.append('clientSiteId', clientSiteId);
    formData.append('userId', userId);

    // console.log('Form Data:', formData);

    try {
      const response = await fetch(
        'https://officer-reports-backend.onrender.com/api/passOnLogWrite/add',
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Server error');
      }

      const data = await response.json();
      Alert.alert('Success', 'Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert(
        'Error',
        `Failed to submit the form: ${error.message || 'Unknown error'}`,
      );
    }
  };

  const handleClearForm = () => {
    setMedia('');
    setpostShift('');
    setnote('');
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
        <Text style={style.mainheadingtext}>Pass On Log Entry</Text>
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
            <Text style={style.headingtextfordailyactivey}>Write to POL</Text>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Post/Shift : </Text>
              <FontAwesomeIcon
                style={style.staricon}
                size={8}
                icon={faStarOfLife}
              />
            </View>
            <View style={style.InspectedOfficerOtherview}>
              <TextInput
                style={style.inspectiontextfieldothertextinput}
                value={postShift}
                onChangeText={setpostShift}
              />
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <Text style={style.describetext}>Note :</Text>
            <View style={style.alertsectionradiobutnview}>
              <View style={style.textareaviewofdescribe}>
                <Textarea
                  placeholder={''}
                  ref={textareaRef}
                  value={note}
                  onChangeText={setnote}
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

export default Passonlogentry;
