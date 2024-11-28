import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAngleLeft, faXmark} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import style from '../Component/Style';

const Policymanual = ({navigation}) => {
  const [officerName, setOfficerName] = useState('');
  const [clientName, setClientName] = useState('');
  const [siteName, setSiteName] = useState('');
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

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
    passonlogdata();
    getOfficerInfo();
  }, []);

  const passonlogdata = async () => {
    const token = await AsyncStorage.getItem('token');
    const apiUrl =
      'https://officer-reports-backend.onrender.com/api/policy-manual/getAll';

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    setData(result.data); // Make sure to set the data properly
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
          <Text style={style.mainheadingtext}>Policy Manual</Text>
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
              <Text style={style.headingtextfordailyactivey}>HR</Text>
            </View>
            <View>
              {data.map(item => (
                <TouchableOpacity
                  key={item._id}
                  style={style.hrcategorttouchopacity}
                  onPress={() => {
                    setSelectedLog(item);
                    setIsModalVisible(true);
                  }}>
                  <Text style={style.hrcategorttext}>Title: {item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={style.Modalbackgroundmainview}>
          <View style={style.modalview}>
            <View style={style.optionandcrossiconview}>
              <Text style={style.optiontext}>Details</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <FontAwesomeIcon color="grey" icon={faXmark} />
              </TouchableOpacity>
            </View>
            <View style={style.logdatamodalview}>
              {selectedLog ? (
                <>
                  <Text>
                    <Text style={style.onltfontweight}>Date: </Text>
                    {new Date(selectedLog.createdAt).toLocaleDateString()}
                  </Text>
                  <Text>
                    <Text style={style.onltfontweight}>Category: </Text>
                    {selectedLog.categoryName.categoryName}
                  </Text>
                  <Text>
                    <Text style={style.onltfontweight}>Subcategory: </Text>
                    {selectedLog.subCategoryName.categoryName}
                  </Text>
                  <Text>
                    <Text style={style.onltfontweight}>Title: </Text>
                    {selectedLog.title}
                  </Text>
                  <Text>
                    <Text style={style.onltfontweight}>Details: </Text>
                    {selectedLog.details}
                  </Text>
                </>
              ) : (
                <Text>No log data available</Text>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Policymanual;
