import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppRegistry } from 'react-native';

// component

import Example from './Example';
import Signup from './Component/Signup';
import Login from './Component/Login';
import Worksite from './Component/Worksite';
import Schedule from './Component/Schedule';
import Reports from './Component/Reports';
import Dailyreport from './Component/Dailyreport';
import FieldInspection from './Component/FieldInspection';
import Incidentreport from './Component/Incidentreport';
import Incidentchecklist from './Component/Incidentchecklist';
import Maintenace from './Component/Maintenace';
import ParkingViolation from './Component/ParkingViolation';
import ParkingViolationSearch from './Component/ParkingViolationSearch';
import Passonlogentry from './Component/Passonlogentry';
import PassOnLog from './Component/PassOnLog';
import Policymanual from './Component/Policymanual';
import PostOrders from './Component/PostOrders';
import TemperatureLog from './Component/TemperatureLog';
import Truckcheckin from './Component/Truckcheckin';
import TruckCheckOut from './Component/TruckCheckOut';
import VacationRequest from './Component/VacationRequest';
import VacationReview from './Component/VacationReview';
import VisitorLog from './Component/VisitorLog';
import Visitorcheckout from './Component/Visitorcheckout'
import Location from './Component/Location';

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* <Stack.Screen name='Example' component={Example} /> */}
          {/* <Stack.Screen name='Signup' component={Signup} />
          <Stack.Screen name='Login' component={Login} />
          <Stack.Screen name='Schedule' component={Schedule} />
          <Stack.Screen name='Worksite' component={Worksite} />
          <Stack.Screen name='Reports' component={Reports} />
          <Stack.Screen name='Location' component={Location} />
          <Stack.Screen name="Dailyreport" component={Dailyreport} /> */}
          <Stack.Screen name='FieldInspection' component={FieldInspection} />
          <Stack.Screen name='Incidentreport' component={Incidentreport} />
          <Stack.Screen name='Incidentchecklist' component={Incidentchecklist} />
          <Stack.Screen name='Maintenace' component={Maintenace} />
          <Stack.Screen name='ParkingViolation' component={ParkingViolation} />
          <Stack.Screen name='ParkingViolationSearch' component={ParkingViolationSearch} />
          <Stack.Screen name='Passonlogentry' component={Passonlogentry} />
          <Stack.Screen name='PassOnLog' component={PassOnLog} />
          <Stack.Screen name='Policymanual' component={Policymanual} />
          <Stack.Screen name='PostOrders' component={PostOrders} />
          <Stack.Screen name='TemperatureLog' component={TemperatureLog} />
          <Stack.Screen name='Truckcheckin' component={Truckcheckin} />
          <Stack.Screen name='TruckCheckOut' component={TruckCheckOut} />
          <Stack.Screen name='VacationRequest' component={VacationRequest} />
          <Stack.Screen name='VacationReview' component={VacationReview} />
          <Stack.Screen name='VisitorLog' component={VisitorLog} />
          <Stack.Screen name='Visitorcheckout' component={Visitorcheckout} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

// AppRegistry.registerComponent('App', () => App);