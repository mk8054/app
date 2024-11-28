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

const PassOnLog = ({navigation}) => {
  const [officerName, setOfficerName] = useState('');
  const [clientName, setClientName] = useState('');
  const [siteName, setSiteName] = useState('');
  const [logData, setLogData] = useState(null);
  const [isModalVisibletwo, setIsModalVisibletwo] = useState(false);
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

  const passonlogdata = async () => {
    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userID');
    const apiUrl = `https://officer-reports-backend.onrender.com/api/passOnLogWrite/getByUserId/${userId}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setLogData(data);
  };

  useEffect(() => {
    passonlogdata();
    getOfficerInfo();
  }, []);

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
          <Text style={style.mainheadingtext}>Pass On Log</Text>
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
              <Text style={style.headingtextfordailyactivey}>Log Entries</Text>
            </View>
            <View style={style.officerandsitesection}>
              {logData &&
                logData.data &&
                logData.data.length > 0 &&
                logData.data.map(entry => (
                  <TouchableOpacity
                    key={entry._id}
                    style={style.licensnceplacenumbeerview}
                    onPress={() => {
                      setSelectedLog(entry);
                      setIsModalVisibletwo(true);
                    }}>
                    <Text>
                      <Text style={style.onltfontweight}>Date: </Text>
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </Text>
                    <Text>
                      <Text style={style.onltfontweight}>Post/Shift: </Text>
                      {entry.postShift}
                    </Text>
                    <Text>
                      <Text style={style.onltfontweight}>Note: </Text>
                      {entry.note}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal to display selected log details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisibletwo}
        onRequestClose={() => setIsModalVisibletwo(false)}>
        <View style={style.Modalbackgroundmainview}>
          <View style={style.modalview}>
            <View style={style.optionandcrossiconview}>
              <Text style={style.optiontext}>Log Data</Text>
              <TouchableOpacity onPress={() => setIsModalVisibletwo(false)}>
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
                    <Text style={style.onltfontweight}>Post/Shift: </Text>
                    {selectedLog.postShift}
                  </Text>
                  <Text>
                    <Text style={style.onltfontweight}>Entered By: </Text>
                    {selectedLog.enteredBy}
                  </Text>
                  <Text>
                    <Text style={style.onltfontweight}>Note: </Text>
                    {selectedLog.note}
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

export default PassOnLog;
