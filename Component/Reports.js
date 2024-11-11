import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Image, Modal, TextInput } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleLeft, faXmark } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import style from '../Component/Style';

const Reports = ({ navigation }) => {

    return (
        <>
            <ScrollView style={style.MainScrollView}>
                <View>
                    <View style={style.viewforiconandtextindailyreport}>
                        <TouchableOpacity style={style.lefticontouchopacity} onPress={() => navigation.navigate("Worksite")}>
                            <FontAwesomeIcon style={style.gobackicon} color="#E34234" size={22} icon={faAngleLeft} />
                        </TouchableOpacity>
                        <Text style={style.securitybasegrouptext}>Dummy Text</Text>
                        <View style={style.viewforimageheader}>
                            <View style={style.securityimageview}>
                                <Image style={style.reportofofficerpasge} source={require('../assets/images/securitybaselogo.png')} />
                            </View>
                        </View>
                    </View>
                    <View style={style.getallsitesmainview}>
                        <TouchableOpacity style={style.TouchableOpacityfortextandimage} onPress={() => navigation.navigate("Location")}>
                            <Text style={style.nameofreport}>Clock In / Out</Text>
                            <View style={style.viewforimageinreport}>
                                <Image style={style.reportofofficerpasge} source={require('../assets/images/icon_clock.png')} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.TouchableOpacityfortextandimage} onPress={() => navigation.navigate("Dailyreport")}>
                            <Text style={style.nameofreport}>Daily Activity Report</Text>
                            <View style={style.viewforimageinreport}>
                                <Image style={style.reportofofficerpasge} source={require('../assets/images/personandpen2.png')} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.TouchableOpacityfortextandimage} onPress={() => navigation.navigate("FieldInspection")}>
                            <Text style={style.nameofreport}>Field Inspection</Text>
                            <View style={style.viewforimageinreport}>
                                <Image style={style.reportofofficerpasge} source={require('../assets/images/personandpen2.png')} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.TouchableOpacityfortextandimage} onPress={() => navigation.navigate("Incidentreport")}>
                            <Text style={style.nameofreport}>incident Report</Text>
                            <View style={style.viewforimageinreport}>
                                <Image style={style.reportofofficerpasge} source={require('../assets/images/personminus.png')} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.TouchableOpacityfortextandimage} onPress={() => navigation.navigate("Incidentchecklist")}>
                            <Text style={style.nameofreport}>incident Checklist</Text>
                            <View style={style.viewforimageinreport}>
                                <Image style={style.reportofofficerpasge} source={require('../assets/images/redlight.png')} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.TouchableOpacityfortextandimage} onPress={() => navigation.navigate("Maintenace")}>
                            <Text style={style.nameofreport}>Maintenance Report</Text>
                            <View style={style.viewforimageinreport}>
                                <Image style={style.reportofofficerpasge} source={require('../assets/images/maintenancereport.png')} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.TouchableOpacityfortextandimage} onPress={() => navigation.navigate("ParkingViolation")}>
                            <Text style={style.nameofreport}>Parking Violation</Text>
                            <View style={style.viewforimageinreport}>
                                <Image style={style.reportofofficerpasge} source={require('../assets/images/Biggextptext.png')} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.TouchableOpacityfortextandimage} onPress={() => navigation.navigate("ParkingViolationSearch")}>
                            <Text style={style.nameofreport}>Parking Violation Search</Text>
                            <View style={style.viewforimageinreport}>
                                <Image style={style.reportofofficerpasge} source={require('../assets/images/Biggextptext.png')} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.TouchableOpacityfortextandimage} onPress={() => navigation.navigate("Passonlogentry")}>
                            <Text style={style.nameofreport}>Pass on Log - Write</Text>
                            <View style={style.viewforimageinreport}>
                                <Image style={style.reportofofficerpasge} source={require('../assets/images/passonwrite.png')} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.TouchableOpacityfortextandimage} onPress={() => navigation.navigate("PassOnLog")}>
                            <Text style={style.nameofreport}>Pass on Log - Read</Text>
                            <View style={style.viewforimageinreport}>
                                <Image style={style.reportofofficerpasge} source={require('../assets/images/logonread.png')} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.TouchableOpacityfortextandimage} onPress={() => navigation.navigate("Policymanual")}>
                            <Text style={style.nameofreport}>Policy Manual</Text>
                            <View style={style.viewforimageinreport}>
                                <Image style={style.reportofofficerpasge} source={require('../assets/images/policy-manual.png')} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.TouchableOpacityfortextandimage} onPress={() => navigation.navigate("PostOrders")}>
                            <Text style={style.nameofreport}>Post Orders</Text>
                            <View style={style.viewforimageinreport}>
                                <Image style={style.reportofofficerpasge} source={require('../assets/images/Orders.png')} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.TouchableOpacityfortextandimage} onPress={() => navigation.navigate("TemperatureLog")}>
                            <Text style={style.nameofreport}>Temperature log</Text>
                            <View style={style.viewforimageinreport}>
                                <Image style={style.reportofofficerpasge} source={require('../assets/images/temperature.png')} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.TouchableOpacityfortextandimage} onPress={() => navigation.navigate("Truckcheckin")}>
                            <Text style={style.nameofreport}>Truck Check - in</Text>
                            <View style={style.viewforimageinreport}>
                                <Image style={style.reportofofficerpasge} source={require('../assets/images/truckin.png')} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.TouchableOpacityfortextandimage} onPress={() => navigation.navigate("TruckCheckOut")}>
                            <Text style={style.nameofreport}>Truck Check - Out</Text>
                            <View style={style.viewforimageinreport}>
                                <Image style={style.reportofofficerpasge} source={require('../assets/images/truckout.png')} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.TouchableOpacityfortextandimage} onPress={() => navigation.navigate("VacationRequest")}>
                            <Text style={style.nameofreport}>Vacation Request</Text>
                            <View style={style.viewforimageinreport}>
                                <Image style={style.reportofofficerpasge} source={require('../assets/images/vacation-request.png')} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.TouchableOpacityfortextandimage} onPress={() => navigation.navigate("VacationReview")}>
                            <Text style={style.nameofreport}>Vacation Review</Text>
                            <View style={style.viewforimageinreport}>
                                <Image style={style.reportofofficerpasge} source={require('../assets/images/april.png')} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.TouchableOpacityfortextandimage} onPress={() => navigation.navigate("VisitorLog")}>
                            <Text style={style.nameofreport}>Visitors Check in</Text>
                            <View style={style.viewforimageinreport}>
                                <Image style={style.reportofofficerpasge} source={require('../assets/images/checkin.png')} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.TouchableOpacityfortextandimage} onPress={() => navigation.navigate("Visitorcheckout")}>
                            <Text style={style.nameofreport}>Visitors Check out</Text>
                            <View style={style.viewforimageinreport}>
                                <Image style={style.reportofofficerpasge} source={require('../assets/images/checkout.png')} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.TouchableOpacityfortextandimage} onPress={async () => {
                            await AsyncStorage.removeItem('token');
                            await AsyncStorage.removeItem('name');
                            await AsyncStorage.removeItem('role');
                            await AsyncStorage.removeItem('selectedSite');
                            await AsyncStorage.removeItem('siteid');
                            await AsyncStorage.removeItem('userID');
                            navigation.navigate("Login");
                        }}>
                            <Text style={style.nameofreport}>Sign Out</Text>
                            <View style={style.viewforimageinreport}>
                                <Image style={style.reportofofficerpasge} source={require('../assets/images/logout.png')} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </>
    );

};

export default Reports;
