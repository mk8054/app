import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faXmark } from '@fortawesome/free-solid-svg-icons';
import style from '../Component/Style';

const Login = ({ navigation }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isModalVisibletwo, setIsModalVisibletwo] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await fetch(
        'https://officer-reports-backend.onrender.com/api/officer/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userName: name,
            password: password,
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response Error:', errorText);
        return;
      }

      const data = await response.json();
      // console.log('Response Data:', data);

      await AsyncStorage.setItem('token', data.data.accessToken);
      await AsyncStorage.setItem('name', data.data.userData.userName);
      await AsyncStorage.setItem('role', data.data.userData.role);
      await AsyncStorage.setItem('userID', data.data.userData._id);

      setIsModalVisibletwo(true);
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  const handleschedule = () => {
    navigation.navigate('Schedule');
    setIsModalVisibletwo(false);
  };

  const handleworksites = () => {
    navigation.navigate('Worksite');
    setIsModalVisibletwo(false);
  };


  return (
    <>
      <ScrollView style={style.MainScrollView}>
        <View style={style.officereportimageview}>
          <View style={{ width: 150, height: 120 }}>
            <Image
              style={{ width: '100%', height: '100%' }}
              source={require('../assets/images/securitybaselogo.png')}
            />
          </View>
        </View>
        <View style={style.loginpagetextcontent}>
          <Text style={style.loginpageheadingtext}>SBG Portal Sign In</Text>
          <View style={style.textinputview}>
            <Text style={style.textfieldtext}>User Name:</Text>
            <TextInput
              style={style.logintextfield}
              placeholder="User name"
              value={name}
              onChangeText={text => setName(text)}
              autoCapitalize="none"
              keyboardType="default"
            />
          </View>
          <View style={style.textinputview}>
            <Text style={style.textfieldtext}>Password:</Text>
            <View style={style.passwordtextfield}>
              <TextInput
                style={style.passwordfield}
                placeholder="Password"
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={style.eyeiconforlogin}
                onPress={() => setShowPassword(!showPassword)}>
                <FontAwesomeIcon icon={faEye} />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={style.submitbtnview} onPress={handleLogin}>
            <Text style={style.submittextforlogin}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisibletwo}
        onRequestClose={() => setIsModalVisibletwo(false)}>
        <View style={style.Modalbackgroundmainview}>
          <View style={style.modalview}>
            <View style={style.optionandcrossiconview}>
              <Text style={style.optiontext}>Select Option</Text>
              <TouchableOpacity onPress={() => setIsModalVisibletwo(false)}>
                <FontAwesomeIcon color="grey" icon={faXmark} />
              </TouchableOpacity>
            </View>
            <View style={style.selectoptionview}>
              <TouchableOpacity
                style={style.modalsbutton}
                onPress={handleschedule}>
                <Text style={style.viewscheduletext}>View Schedule</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={style.modalsbutton}
                onPress={handleworksites}>
                <Text style={style.viewscheduletext}>Select Work Site</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Login;
