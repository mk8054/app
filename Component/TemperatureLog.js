import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAngleLeft, faStarOfLife} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import style from '../Component/Style';

const TemperatureLog = ({navigation}) => {
  const [officerName, setOfficerName] = useState('');
  const [clientName, setClientName] = useState('');
  const [siteName, setSiteName] = useState('');
  const [types, setTypes] = useState([]);

  const [CO2Level, setCO2Level] = useState('');
  const [equipmentId, setequipmentId] = useState('');
  const [equipmentTypeId, setequipmentTypeId] = useState('');
  const [fuelLevel, setfuelLevel] = useState('');
  const [humidity, sethumidity] = useState('');
  const [temperature, settemperature] = useState('');
  const [typeIfOther, settypeIfOther] = useState('');
  // const textareaRef = useRef(null);

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
        'https://officer-reports-backend.onrender.com/api/type/getAll?category=Equipment',
      );
      const jsonData = await response.json();
      if (jsonData.success) {
        setTypes(jsonData.data);
      }
    } catch (error) {
      console.error('Error fetching types:', error);
    }
  };

  useEffect(() => {
    fetchTypes();
    getOfficerInfo();
  }, []);

  const handlesubmit = async () => {
    if (isNaN(temperature) || isNaN(humidity)) {
      Alert.alert(
        'Invalid Input',
        'Temperature and Humidity must be numeric values.',
      );
      return;
    }

    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userID');
    const clientSiteId = await AsyncStorage.getItem('siteid');

    const payload = {
      CO2Level,
      clientSiteId,
      equipmentId,
      equipmentTypeId,
      fuelLevel,
      humidity: parseFloat(humidity),
      temperature: parseFloat(temperature),
      typeIfOther,
      userId,
    };

    const response = await fetch(
      'https://officer-reports-backend.onrender.com/api/temperatureLog/add',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await response.json();
    console.log('Response:', data);
  };

  const handleClearForm = () => {
    setCO2Level('');
    setequipmentId('');
    setequipmentTypeId('');
    setfuelLevel('');
    sethumidity('');
    settemperature('');
    settypeIfOther('');
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
        <Text style={style.mainheadingtext}>Temperature Log</Text>
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
            <Text style={style.headingtextfordailyactivey}>
              Temperature Log
            </Text>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Equipment Type :</Text>
              <FontAwesomeIcon
                style={style.staricon}
                size={8}
                icon={faStarOfLife}
              />
            </View>
            <View style={style.maindropdownview}>
              <View style={style.dropdownmenuandiconview}>
                <Picker
                  selectedValue={equipmentTypeId}
                  style={style.dropdownheadingtext}
                  onValueChange={itemValue => setequipmentTypeId(itemValue)}>
                  <Picker.Item label="Select Option" value={null} />
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
              <Text style={style.textinputtext}>If Other, What Type:</Text>
            </View>
            <View style={style.InspectedOfficerOtherview}>
              <TextInput
                style={style.inspectiontextfieldothertextinput}
                value={typeIfOther}
                onChangeText={settypeIfOther}
              />
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Equipment ID :</Text>
              <FontAwesomeIcon
                style={style.staricon}
                size={8}
                icon={faStarOfLife}
              />
            </View>
            <View style={style.InspectedOfficerOtherview}>
              <TextInput
                style={style.inspectiontextfieldothertextinput}
                value={equipmentId}
                onChangeText={setequipmentId}
              />
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Temperature :</Text>
              <FontAwesomeIcon
                style={style.staricon}
                size={8}
                icon={faStarOfLife}
              />
            </View>
            <View style={style.InspectedOfficerOtherview}>
              <TextInput
                style={style.inspectiontextfieldothertextinput}
                value={temperature}
                onChangeText={text =>
                  settemperature(text.replace(/[^0-9.-]/g, ''))
                }
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Humidity :</Text>
            </View>
            <View style={style.InspectedOfficerOtherview}>
              <TextInput
                style={style.inspectiontextfieldothertextinput}
                value={humidity}
                onChangeText={text =>
                  sethumidity(text.replace(/[^0-9.-]/g, ''))
                }
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>Fuel Level :</Text>
            </View>
            <View style={style.InspectedOfficerOtherview}>
              <TextInput
                style={style.inspectiontextfieldothertextinput}
                value={fuelLevel}
                onChangeText={setfuelLevel}
              />
            </View>
          </View>
          <View style={style.textfieldandtextarseview}>
            <View style={style.textandstariconview}>
              <Text style={style.textinputtext}>CO2 Level :</Text>
            </View>
            <View style={style.InspectedOfficerOtherview}>
              <TextInput
                style={style.inspectiontextfieldothertextinput}
                value={CO2Level}
                onChangeText={setCO2Level}
              />
            </View>
          </View>
          <View style={style.submitandclearbutnview}>
            <TouchableOpacity
              style={style.submitbuttonview}
              onPress={handlesubmit}>
              <Text style={style.submitextindailyreport}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={style.submitbuttonview}
              onPress={handleClearForm}>
              <Text style={style.submitextindailyreport}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default TemperatureLog;
