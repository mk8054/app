import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import style from '../Component/Style';

const LocationComponent = ({ navigation }) => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [inTime, setInTime] = useState(null);
  const [outTime, setOutTime] = useState(null);
  const [minutesBetween, setMinutesBetween] = useState(null);
  const [isShiftStarted, setIsShiftStarted] = useState(false);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [getShiftData, setShiftData] = useState([]);
  const [currentShiftDuration, setCurrentShiftDuration] = useState(null);

  useEffect(() => {
    InOutData();
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
    };
    requestLocationPermission();
  }, []);

  useEffect(() => {
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [locationSubscription]);

  const lotiandlong = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const clientSiteId = await AsyncStorage.getItem('siteid');
      let { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;

      const attendanceResponse = await fetch(
        `https://officer-reports-backend.onrender.com/api/site/getForAttendence/${clientSiteId}?latitude=${latitude}&longitude=${longitude}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const attendanceData = await attendanceResponse.json();

      console.log(latitude, longitude, 'attendance data', attendanceData);

      // Then call shift start
      await handleStartShift(latitude, longitude, clientSiteId, token);
    } catch (error) {
      console.log('Error fetching attendance or starting shift:', error);
      Alert.alert('Error', error.message);
    }
  };

  const handleStartShift = async (latitude, longitude) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const siteId = await AsyncStorage.getItem('siteid');
      const userID = await AsyncStorage.getItem('userID');
      const payload = {
        clientSiteId: siteId,
        userId: userID,
        latitude,
        longitude,
      };

      const shiftStartResponse = await fetch(
        'https://officer-reports-backend.onrender.com/api/clockInOut/shift-start',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const shiftStartData = await shiftStartResponse.json();
      if (!shiftStartResponse.ok) {
        throw new Error('Failed to start shift');
      }

      // Set the data as needed
      setInTime(shiftStartData.newClockIn.inDateLocal);
      setLocation({ latitude, longitude });
      setIsShiftStarted(true);
      setOutTime(null);
      setMinutesBetween(null);
      setCurrentShiftDuration(null);

      // Handle location updates
      const locationSub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        location => {
          setLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        },
      );
      setLocationSubscription(locationSub);
    } catch (error) {
      console.log('Error starting shift:', error);
      Alert.alert('Error', error.message);
    }
  };

  const handleEndShift = async () => {
    const token = await AsyncStorage.getItem('token');
    const userID = await AsyncStorage.getItem('userID');

    const endShiftResponse = await fetch(
      'https://officer-reports-backend.onrender.com/api/clockInOut/shift-end',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: userID }),
      },
    );
    const shiftEndData = await endShiftResponse.json();
    setOutTime(shiftEndData.currentShift.outDateLocal);
    setIsShiftStarted(false);

    // Calculate duration
    const inDate = new Date(shiftEndData.currentShift.inDateLocal);
    const outDate = new Date(shiftEndData.currentShift.outDateLocal);
    const duration = Math.round((outDate - inDate) / (1000 * 60));
    setCurrentShiftDuration(duration);
    setMinutesBetween(duration);
    console.log(shiftEndData.shifts, 'Shift Data');
  };

  const InOutData = async () => {
    const token = await AsyncStorage.getItem('token');
    const clientSiteId = await AsyncStorage.getItem('siteid');
    const response = await fetch(
      `https://officer-reports-backend.onrender.com/api/clockInOut/get/${clientSiteId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const result = await response.json();
    setShiftData(result.data);
    console.log(getShiftData, 'getShiftData');
  };

  return (
    <View style={style.Modalbackgroundmainview}>
      <View style={style.viewforwidthofclockinout}>
        <View style={style.optionandcrossiconview}>
          <Text style={style.optiontext}>Clock In / Out</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Reports')}>
            <FontAwesomeIcon color="grey" icon={faXmark} />
          </TouchableOpacity>
        </View>
        <View style={style.clockpopupview}>
          <Text style={style.currentwhat}>You are Currently</Text>
          <Text style={style.cloeckedoutbigtext}>
            {isShiftStarted ? 'Clocked In' : 'Clocked Out'}
          </Text>
        </View>
        <Text style={style.simpleborderline} />

        <View style={style.viewforimageandtextforclockinandout}>
          {!isShiftStarted ? (
            <TouchableOpacity onPress={lotiandlong}>
              <View style={style.shiftstartimageview}>
                <Image
                  style={style.reportofofficerpasge}
                  source={require('../assets/images/startshiftarrival.png')}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={style.clockedbutnstyle}
              onPress={handleEndShift}>
              <Text style={style.displayallclocktimetext}>End Shift</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={style.inoutandtimeview}>
          <Text style={style.intext}>In</Text>
          <Text style={style.intext}>Out</Text>
          <Text style={style.intext}>Minutes</Text>
        </View>
        <View style={style.inoutandtimeview}>
          <Text style={style.intextvalue}>{inTime}</Text>
          <Text style={style.intextvalue}>{outTime}</Text>
          <Text style={style.intextvalue}>{minutesBetween}</Text>
        </View>

        {/* Display Previous Shifts */}
        <ScrollView style={{ height: 120 }}>
          {getShiftData.length > 0 ? (
            getShiftData.map((shift, index) => (
              <View key={index} style={style.inoutandtimeview}>
                <Text style={style.intextvalue}>{shift.inDate}</Text>
                <Text style={style.intextvalue}>{shift.outDate}</Text>
                <Text style={style.intextvalue}>{shift.minutesBetween} </Text>
              </View>
            ))
          ) : (
            <Text style={style.intextvalue}>No previous shifts found.</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default LocationComponent;