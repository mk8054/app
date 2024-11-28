import React, { useState } from 'react';
import { useFonts } from 'expo-font';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faUser,
  faEnvelope,
  faLock,
  faPhone,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import style from '../Component/Style';

const Signup = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [emailAddress, setemailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [pass, setPass] = useState(true);
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});

  const [fontsLoaded] = useFonts({
    mainFont: require('../assets/fonts/Metropolis-Medium.otf'),
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  const validateForm = () => {
    let errors = {};

    if (!userName.trim()) {
      errors.userName = 'Username is required';
    }

    if (!emailAddress.trim()) {
      errors.emailAddress = 'emailAddress is required';
    } else if (!/\S+@\S+\.\S+/.test(emailAddress)) {
      errors.emailAddress = 'Invalid emailAddress address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d+$/.test(phone)) {
      errors.phone = 'Invalid phone number';
    }

    const isValid = Object.keys(errors).length === 0;

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const response = await fetch(
          'https://officer-reports-backend.onrender.com/api/officer/create',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userName: userName,
              emailAddress: emailAddress,
              password: password,
              phone: phone,
              confirmPassword: confirmPassword,
            }),
          },
        );

        if (response.ok) {
          const data = await response.json();
          console.log('Response from server:', data);

          await AsyncStorage.setItem('role', 'admin');
          navigation.navigate('Login');
        } else {
          const errorData = await response.json();
          console.warn('Signup error:', errorData);
        }
      } catch (error) {
        console.error('Signup error:', error);
      }
    }
  };

  return (
    <ScrollView style={style.MainScrollView}>
      <View style={style.officerimageviewinsignup}>
        <View style={{ width: 110, height: 80 }}>
          <Image
            style={{ width: '100%', height: '100%' }}
            source={require('../assets/images/securitybaselogo.png')}
          />
        </View>
      </View>
      <View style={style.signuptextview}>
        <Text style={style.fewthingtostart}>Sign - up</Text>
        <Text style={{ textAlign: 'center' }}>
          Just a few quick things to get started
        </Text>
      </View>
      <View style={style.signuptextandtextinputview}>
        <FontAwesomeIcon style={style.signupicon} icon={faUser} />
        <TextInput
          style={style.signuptextinput}
          placeholder="Username"
          value={userName}
          onChangeText={setUserName}
        />
      </View>
      {errors.userName && (
        <Text style={style.signuperrortext}>{errors.userName}</Text>
      )}
      <View style={style.signuptextandtextinputview}>
        <FontAwesomeIcon style={style.signupicon} icon={faEnvelope} />
        <TextInput
          style={style.signuptextinput}
          placeholder="emailAddress"
          value={emailAddress}
          onChangeText={setemailAddress}
        />
      </View>
      {errors.emailAddress && (
        <Text style={style.signuperrortext}>{errors.emailAddress}</Text>
      )}
      <View style={style.signuptextandtextinputview}>
        <FontAwesomeIcon style={style.signupicon} icon={faPhone} />
        <TextInput
          style={style.signuptextinput}
          placeholder="Phone no."
          value={phone}
          onChangeText={setPhone}
        />
      </View>
      {errors.phone && (
        <Text style={style.signuperrortext}>{errors.phone}</Text>
      )}
      <View style={style.signuptextandtextinputview}>
        <FontAwesomeIcon style={style.signupicon} icon={faLock} />
        <TextInput
          style={style.signuptextinput}
          placeholder="Password"
          secureTextEntry={pass}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={{ position: 'absolute', right: 10 }}
          onPress={() => setPass(!pass)}>
          <FontAwesomeIcon color="grey" icon={faEye} />
        </TouchableOpacity>
      </View>
      {errors.password && (
        <Text style={style.signuperrortext}>{errors.password}</Text>
      )}
      <View style={style.signuptextandtextinputview}>
        <FontAwesomeIcon style={style.signupicon} icon={faLock} />
        <TextInput
          style={style.signuptextinput}
          placeholder="Confirm Password"
          secureTextEntry={pass}
          value={confirmPassword}
          onChangeText={setconfirmPassword}
        />
      </View>
      {errors.confirmPassword && (
        <Text style={style.signuperrortext}>{errors.confirmPassword}</Text>
      )}

      <TouchableOpacity style={style.submitbtnview} onPress={handleSubmit}>
        <Text style={style.submittextforlogin}>Create account</Text>
      </TouchableOpacity>
      <Text style={style.signtextforalredyaccount}>
        Already have an account ?{' '}
        <Text
          style={style.loginheretext}
          onPress={() => navigation.navigate('Login')}>
          {' '}
          login here
        </Text>
      </Text>
    </ScrollView>
  );
};

export default Signup;
