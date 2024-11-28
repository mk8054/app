import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faAngleLeft,
  faStarOfLife,
  faTrash,
  faPenToSquare,
  faCirclePlus,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import RadioGroup from 'react-native-radio-buttons-group';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { format } from 'date-fns';
import style from '../Component/Style';

const Dailyreport = ({ navigation, parsedSiteData }) => {
  const [isModalVisibletwo, setIsModalVisibletwo] = useState(false);
  const [editmodal, seteditmodal] = useState(false);
  const [observation, setobservation] = useState([]);
  const [addedObservations, setAddedObservations] = useState([]);
  const [addobservation, setAddObservation] = useState({
    observationTypeId: '',
    comments: '',
  });
  const [observationTypes, setObservationTypes] = useState([]);
  const [radioButtons, setRadioButtons] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editObservation, setEditObservation] = useState({ comments: '' });
  const [selectedObservation, setSelectedObservation] = useState(null);
  const [media, setMedia] = useState([]);
  const [postShift, setPostShift] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [postItemsReceived, setPostItemsReceived] = useState('');
  const [relievingOfficerFirstName, setRelievingOfficerFirstName] =
    useState('');
  const [relievingOfficerLastName, setRelievingOfficerLastName] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const [officerName, setOfficerName] = useState('');
  const [clientName, setClientName] = useState('');
  const [siteName, setSiteName] = useState('');

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

  // const handleSubmit = async () => {
  //   try {
  //     const userId = await AsyncStorage.getItem('userID');
  //     const selectedSiteData = await AsyncStorage.getItem('selectedSite');
  //     const parsedSiteData = selectedSiteData
  //       ? JSON.parse(selectedSiteData)
  //       : null;
  //     const clientId = parsedSiteData?.clientId?._id;
  //     const token = await AsyncStorage.getItem('token');

  //     const formData = new FormData();
  //     formData.append('postShift', postShift);
  //     formData.append('specialInstructions', specialInstructions);
  //     formData.append('postItemsReceived', postItemsReceived);
  //     formData.append('relievingOfficerFirstName', relievingOfficerFirstName);
  //     formData.append('relievingOfficerLastName', relievingOfficerLastName);
  //     formData.append('additionalNotes', additionalNotes);
  //     formData.append('clientSiteId', clientId);
  //     formData.append('userId', userId);

  //     // Appending observations
  //     addedObservations.forEach((id, index) => {
  //       formData.append(`observations[${index}]`, id);
  //     });
  //     await Promise.all(
  //       media.map(async (uri, index) => {
  //         const response = await fetch(uri);
  //         const blob = await response.blob();
  //         const filename = uri.split('/').pop();
  //         const fileType = filename.split('.').pop();
  //         formData.append('attachments', blob, filename);
  //       }),
  //     );

  //     // Sending the formData
  //     const submitResponse = await fetch(
  //       'https://officer-reports-backend.onrender.com/api/daily-activity-report/add',
  //       {
  //         method: 'POST',
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: formData,
  //       },
  //     );

  //     const result = await submitResponse.json();
  //     refreshComponent();
  //     if (submitResponse.ok) {
  //       Alert.alert('Success', 'Daily Activity Report added successfully!');
  //       console.log(result);
  //     } else {
  //       throw new Error(result.message || 'Failed to add report.');
  //     }
  //   } catch (error) {
  //     console.error('Error during report submission:', error);
  //     Alert.alert(
  //       'Error',
  //       error.message || 'Something went wrong during submission.',
  //     );
  //   }
  // };
  const handleSubmit = async () => {
    try {
      const userId = await AsyncStorage.getItem('userID');
      const selectedSiteData = await AsyncStorage.getItem('selectedSite');
      const parsedSiteData = selectedSiteData ? JSON.parse(selectedSiteData) : null;
      const clientId = parsedSiteData?.clientId?._id;
      const token = await AsyncStorage.getItem('token');

      const formData = new FormData();
      formData.append('postShift', postShift);
      formData.append('specialInstructions', specialInstructions);
      formData.append('postItemsReceived', postItemsReceived);
      formData.append('relievingOfficerFirstName', relievingOfficerFirstName);
      formData.append('relievingOfficerLastName', relievingOfficerLastName);
      formData.append('additionalNotes', additionalNotes);
      formData.append('clientSiteId', clientId);
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

      // Sending the formData
      const submitResponse = await fetch(
        'https://officer-reports-backend.onrender.com/api/daily-activity-report/add',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        },
      );

      const result = await submitResponse.json();
      refreshComponent();

      if (submitResponse.ok) {
        Alert.alert('Success', 'Daily Activity Report added successfully!');
        console.log(result);
      } else {
        throw new Error(result.message || 'Failed to add report.');
      }
    } catch (error) {
      console.error('Error during report submission:', error);
      Alert.alert(
        'Error',
        error.message || 'Something went wrong during submission.',
      );
    }
  };


  const handleClearForm = () => {
    setobservation('');
    setPostShift('');
    setSpecialInstructions('');
    setPostItemsReceived('');
    setRelievingOfficerFirstName('');
    setRelievingOfficerLastName('');
    setAdditionalNotes('');
    setMedia([]);
    refreshComponent();
  };

  const handleGetObservationTypes = async () => {
    try {
      const response = await fetch(
        'https://officer-reports-backend.onrender.com/api/type/getAll?category=Observation',
      );
      const data = await response.json();
      setObservationTypes(data?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddObservation = async () => {
    if (
      !addobservation.observationTypeId ||
      addobservation.observationTypeId.trim() === ''
    ) {
      Alert.alert('Error', 'Please select a Type of Observation.');
      return;
    }
    const response = await fetch(
      'https://officer-reports-backend.onrender.com/api/observation/add',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addobservation),
      },
    );
    const responseData = await response.json();
    if (response.ok) {
      const newObservation = {
        _id: responseData.data._id,
        typeName: observationTypes.find(
          type => type._id === addobservation.observationTypeId,
        ).typeName,
        comments: addobservation.comments,
      };
      setobservation(prevObs => [...prevObs, newObservation]);
      setAddedObservations(prevAdded => [...prevAdded, newObservation._id]);
      setAddObservation({ comments: '', observationTypeId: '' });
      setIsModalVisibletwo(false);
    } else {
      console.error('Failed to add observation:', responseData.message);
      Alert.alert('Error', responseData.message);
    }
  };

  const handleGetAllObservations = async () => {
    try {
      const siteId = parsedSiteData?.clientId?._id;
      const response = await fetch(
        'https://officer-reports-backend.onrender.com/api/observation/getAll',
      );
      const data = await response.json();

      if (data.success) {
        const observations = data.data;
        const filteredObservations = observations.filter(
          observation => observation.siteId === siteId,
        );
        setobservation(filteredObservations);
      }
    } catch (error) {
      console.error('Error fetching observations:', error);
    }
  };

  const handleUpdate = async _id => {
    setLoading(true);
    const response = await fetch(
      `https://officer-reports-backend.onrender.com/api/observation/update/${_id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editObservation),
      },
    );
    const result = await response.json();
    seteditmodal(false);
  };

  const deleteobservation = async _id => {
    const response = await fetch(
      `https://officer-reports-backend.onrender.com/api/observation/delete/${_id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${_id}`,
        },
      },
    );
    handleGetAllObservations();
    console.log('Observation deleted successfully');
  };

  useEffect(() => {
    if (observationTypes && observationTypes.length > 0) {
      const formattedRadioButtons = observationTypes.map(type => ({
        id: type._id,
        label: type.typeName,
        value: type._id,
      }));
      setRadioButtons(formattedRadioButtons);
    }
  }, [observationTypes]);

  const handleSelection = id => {
    setSelectedId(id);
    setAddObservation(prevState => ({
      ...prevState,
      observationTypeId: id,
    }));
  };

  useEffect(() => {
    handleGetObservationTypes();
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

  const refreshComponent = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };
  return (
    <>
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
          <Text style={style.mainheadingtext}>Daily Activity Report</Text>
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
          {/* shift  */}
          <View style={style.ShiftStartNotesmainview}>
            <View style={style.viewforbgcandtext}>
              <Text style={style.headingtextfordailyactivey}>
                Shift Start Notes
              </Text>
            </View>
            <View style={style.textfieldandtextarseview}>
              <View style={style.textandstariconview}>
                <Text style={style.textinputtext}>Post/Shift:</Text>
                <FontAwesomeIcon
                  style={style.staricon}
                  size={8}
                  icon={faStarOfLife}
                />
              </View>
              <TextInput
                style={style.textyinputforshift}
                value={postShift}
                onChangeText={setPostShift}
              />
            </View>
            <View style={style.textfieldandtextarseview}>
              <View style={style.textandstariconview}>
                <Text style={style.textinputtext}>Special Instructions:</Text>
              </View>
              <TextInput
                style={style.specialinstructiontextarea}
                value={specialInstructions}
                onChangeText={setSpecialInstructions}
              />
            </View>
            <View style={style.textfieldandtextarseview}>
              <View style={style.textandstariconview}>
                <Text style={style.textinputtext}>Post Items Received: </Text>
                <FontAwesomeIcon
                  style={style.staricon}
                  size={8}
                  icon={faStarOfLife}
                />
              </View>
              <TextInput
                style={style.specialinstructiontextarea}
                value={postItemsReceived}
                onChangeText={setPostItemsReceived}
              />
            </View>
          </View>
          {/* observation section  */}
          <View style={style.ShiftStartNotesmainview}>
            <View style={style.viewforbgcandtext}>
              <Text style={style.headingtextfordailyactivey}>Observations</Text>
              <Text style={style.headingtextfordailyactivey}>
                For every observation, click the "Add Observation" button below.
              </Text>
            </View>
            {observation &&
              observation.map((obs, index) => (
                <View key={index} style={style.observationtextandbuttonview}>
                  <View style={style.observationtextview}>
                    <View>
                      <Text>{obs.typeName}</Text>
                      <Text>
                        {new Date(obs.observationDateDisplay).toLocaleString()}
                      </Text>
                      <Text>{obs.comments}</Text>
                    </View>
                    <Text style={style.redborderindailyreport} />
                  </View>
                  <View style={style.viewforeditbutandtext}>
                    <TouchableOpacity
                      style={style.removetextandiconview}
                      onPress={() => deleteobservation(obs._id)}>
                      <FontAwesomeIcon size={12} color="grey" icon={faTrash} />
                      <Text style={style.removetextofdailyreport}>Remove</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={style.removetextandiconview}
                      onPress={() => {
                        setEditObservation({
                          comments: obs.comments,
                          observationTypeId: obs.observationTypeId._id,
                        });
                        setSelectedObservation(obs);
                        seteditmodal(true);
                      }}>
                      <FontAwesomeIcon
                        size={12}
                        color="grey"
                        icon={faPenToSquare}
                      />
                      <Text style={style.removetextofdailyreport}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            <View style={style.viewforredlineandaddbutton}>
              <TouchableOpacity
                style={style.addobservationtouchopcay}
                onPress={() => setIsModalVisibletwo(true)}>
                <FontAwesomeIcon style={{ marginLeft: 5 }} icon={faCirclePlus} />
                <Text style={style.addobservationtext}>Add Observation</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* video and audio  */}
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
              {media.map((uri, index) => {
                return (
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
                );
              })}
            </View>
          </View>
          <View style={style.videoaudiophotoviewmainview}>
            <View style={style.viewforbgcandtext}>
              <Text style={style.headingtextfordailyactivey}>
                Relieving Officer Information
              </Text>
            </View>
            <View style={style.textfieldandtextarseview}>
              <View style={style.textandstariconview}>
                <Text style={style.textinputtext}>
                  Relieving Officer First Name :
                </Text>
                <FontAwesomeIcon
                  style={style.staricon}
                  size={8}
                  icon={faStarOfLife}
                />
              </View>
              <TextInput
                style={style.textyinputforshift}
                value={relievingOfficerFirstName}
                onChangeText={setRelievingOfficerFirstName}
              />
            </View>
            <View style={style.textfieldandtextarseview}>
              <View style={style.textandstariconview}>
                <Text style={style.textinputtext}>
                  Relieving Officer Last Name :
                </Text>
                <FontAwesomeIcon
                  style={style.staricon}
                  size={8}
                  icon={faStarOfLife}
                />
              </View>
              <TextInput
                style={style.textyinputforshift}
                value={relievingOfficerLastName}
                onChangeText={setRelievingOfficerLastName}
              />
            </View>
          </View>
          {/* Additional Notes */}
          <View style={style.videoaudiophotoviewmainview}>
            <View style={style.viewforbgcandtext}>
              <Text style={style.headingtextfordailyactivey}>
                Additional Notes
              </Text>
            </View>
            <View style={style.textfieldandtextarseview}>
              <View style={style.textandstariconview}>
                <Text style={style.textinputtext}>Special Instructions:</Text>
              </View>
              <TextInput
                style={style.specialinstructiontextarea}
                value={additionalNotes}
                onChangeText={setAdditionalNotes}
              />
            </View>
            {/* Submit and Clear Buttons */}
            <View style={style.submitandclearbutnview}>
              <TouchableOpacity
                style={style.submitbuttonview}
                onPress={handleSubmit}>
                <Text style={style.submitextindailyreport}>submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={style.submitbuttonview}
                onPress={handleClearForm}>
                <Text style={style.submitextindailyreport}>Clear Form</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* add modal  */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisibletwo}
        onRequestClose={() => setIsModalVisibletwo(false)}>
        <View style={style.Modalbackgroundmainview}>
          <View style={style.viewforaddobservationmodal}>
            <View style={style.scheduletextandcrossview}>
              <Text style={style.scheduletext}>Add Observation</Text>
              <TouchableOpacity onPress={() => setIsModalVisibletwo(false)}>
                <FontAwesomeIcon color="grey" icon={faXmark} />
              </TouchableOpacity>
            </View>
            <View style={style.textfieldandtextarseview}>
              <View style={style.textandstariconview}>
                <Text style={style.onltfontweight}>Type of Observation :</Text>
                <FontAwesomeIcon
                  style={style.staricon}
                  size={8}
                  icon={faStarOfLife}
                />
              </View>
              <View style={style.textyinputforshift}>
                {observationTypes && observationTypes.length > 0 ? (
                  <RadioGroup
                    size={10}
                    radioButtons={radioButtons}
                    onPress={handleSelection}
                    selectedId={selectedId}
                  />
                ) : (
                  <Text>No observation types found.</Text>
                )}
              </View>
            </View>
            <View style={style.textfieldandtextarseview}>
              <View style={style.textandstariconview}>
                <Text style={style.onltfontweight}>Comments :</Text>
                <FontAwesomeIcon
                  style={style.staricon}
                  size={8}
                  icon={faStarOfLife}
                />
              </View>
              <TextInput
                style={style.specialinstructiontextarea}
                value={addobservation.comments}
                onChangeText={text =>
                  setAddObservation({ ...addobservation, comments: text })
                }
              />
            </View>
            <View style={style.submitandclearbutnview}>
              <TouchableOpacity
                style={style.submitbuttonview}
                onPress={handleAddObservation}>
                <Text style={style.submitextindailyreport}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={style.submitbuttonview}
                onPress={() => setIsModalVisibletwo(false)}>
                <Text style={style.submitextindailyreport}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* modal for edit  */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editmodal}
        onRequestClose={() => seteditmodal(false)}>
        <View style={style.Modalbackgroundmainview}>
          <View style={style.viewforaddobservationmodal}>
            <View style={style.scheduletextandcrossview}>
              <Text style={style.scheduletext}>Edit Observation</Text>
              <TouchableOpacity onPress={() => seteditmodal(false)}>
                <FontAwesomeIcon color="grey" icon={faXmark} />
              </TouchableOpacity>
            </View>
            <View style={style.textfieldandtextarseview}>
              <View style={style.textandstariconview}>
                <Text style={style.onltfontweight}>Type of Observation :</Text>
                <FontAwesomeIcon
                  style={style.staricon}
                  size={8}
                  icon={faStarOfLife}
                />
              </View>
              <View style={style.textyinputforshift}>
                {observationTypes &&
                  observationTypes.map(type => (
                    <TouchableOpacity
                      key={type._id}
                      onPress={() => handleSelection(type._id)}>
                      <Text
                        style={{
                          color: selectedId === type._id ? 'blue' : 'black',
                        }}>
                        {type.typeName}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
            </View>
            <View style={style.textfieldandtextarseview}>
              <View style={style.textandstariconview}>
                <Text style={style.onltfontweight}>Comments:</Text>
              </View>
              <TextInput
                style={style.specialinstructiontextarea}
                value={editObservation.comments}
                onChangeText={text =>
                  setEditObservation(prev => ({ ...prev, comments: text }))
                }
              />
            </View>
            <View style={style.submitandclearbutnview}>
              <TouchableOpacity
                style={style.submitbuttonview}
                onPress={() => handleUpdate(selectedObservation._id)}>
                <Text style={style.submitextindailyreport}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={style.submitbuttonview}
                onPress={() => seteditmodal(false)}>
                <Text style={style.submitextindailyreport}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
export default Dailyreport;
