import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, ScrollView, TextInput, Modal, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleLeft, faXmark } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import style from '../Component/Style';

const Visitorcheckout = ({ navigation }) => {
    const [officerName, setOfficerName] = useState('');
    const [clientName, setClientName] = useState('');
    const [siteName, setSiteName] = useState('');
    const [visitordata, setVisitordata] = useState([]);
    const [selectedLog, setSelectedLog] = useState(null);
    const [isModalVisibleTwo, setIsModalVisibleTwo] = useState(false);
    const [outNotes, setOutNotes] = useState('');

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

    const Getvisitordata = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const userID = await AsyncStorage.getItem('userID');
            const response = await fetch(`https://officer-reports-backend.onrender.com/api/visitor/getByUserId/${userID}?isCheckOut=false`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const result = await response.json();
                setVisitordata(result.data);
                console.log(result.data, "Visitor Data");
            } else {
                console.error("Failed to fetch visitor data:", response.status);
            }
        } catch (error) {
            console.error("Error fetching visitor data:", error);
        }
    };

    const handleCheckOut = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const checkOutUrl = `https://officer-reports-backend.onrender.com/api/visitor/check-out/${selectedLog._id}`;
            const payload = {
                outNotes,
                isCheckOut: true
            };

            const response = await fetch(checkOutUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                Alert.alert('Success', 'Visitor checked out successfully');
                setIsModalVisibleTwo(false);
                setOutNotes(''); // Reset notes after successful checkout
                Getvisitordata(); // Refresh visitor data
            } else {
                console.error('Failed to check out visitor:', response.status);
                Alert.alert('Error', 'Failed to check out visitor');
            }
        } catch (error) {
            console.error('Error during visitor checkout:', error);
        }
    };




    useEffect(() => {
        Getvisitordata();
        getOfficerInfo();
    }, []);

    const selectVisitorLog = (entry) => {
        setSelectedLog(entry);
        setOutNotes(entry.outNotes || ''); // Fetch previous notes
        setIsModalVisibleTwo(true);
    };

    return (
        <>
            <ScrollView style={style.MainScrollView}>
                {/* Header */}
                <View style={style.viewforiconandtextindailyreport}>
                    <TouchableOpacity style={style.lefticontouchopacity} onPress={() => navigation.navigate("Reports")}>
                        <FontAwesomeIcon style={style.gobackicon} color="#E34234" size={22} icon={faAngleLeft} />
                    </TouchableOpacity>
                    <Text style={style.mainheadingtext}>Visitor Check-Out</Text>
                    <View style={style.viewforimageheader}>
                        <View style={style.imagewidthviewforheader}>
                            <Image style={style.reportofofficerpasge} source={require('../assets/images/securitybaselogo.png')} />
                        </View>
                    </View>
                </View>

                {/* Officer and Site Info */}
                <View style={style.officerandsitesection}>
                    <View style={style.viewforbgcandtext}>
                        <Text style={style.headingtextfordailyactivey}>Officer and Site</Text>
                    </View>
                    <View style={style.officernameandsiteandlcinwetvalue}>
                        <Text><Text style={style.onltfontweight}>Officer: </Text>{officerName}</Text>
                        <Text><Text style={style.onltfontweight}>Client: </Text>{clientName}</Text>
                        <Text><Text style={style.onltfontweight}>Site: </Text>{siteName}</Text>
                    </View>
                </View>

                {/* Visitor Data */}
                <View style={style.officerandsitesection}>
                    <View style={style.viewforbgcandtext}>
                        <Text style={style.headingtextfordailyactivey}>Visitors</Text>
                    </View>
                    {visitordata.length > 0 ? (
                        visitordata.map((entry) => (
                            <TouchableOpacity key={entry._id} style={style.licensnceplacenumbeerview} onPress={() => selectVisitorLog(entry)}>
                                <Text><Text style={style.onltfontweight}>Visitor Name: </Text>{entry.visitorName}</Text>
                                <Text><Text style={style.onltfontweight}>Date: </Text>{new Date(entry.inDate).toLocaleDateString()}</Text>
                                <Text><Text style={style.onltfontweight}>Company: </Text>{entry.company}</Text>
                                <Text><Text style={style.onltfontweight}>Destination #: </Text>{entry.destination}</Text>
                                <Text><Text style={style.onltfontweight}>Notes : </Text>{entry.destination}</Text>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text>No visitor data available</Text>
                    )}
                </View>
            </ScrollView>

            {/* Modal for Visitor Check-Out */}
            {selectedLog && (
                <Modal animationType="slide" transparent={true} visible={isModalVisibleTwo} onRequestClose={() => setIsModalVisibleTwo(false)}>
                    <View style={style.Modalbackgroundmainview}>
                        <View style={style.modalforaddtrucklog}>
                            <View style={style.optionandcrossiconview}>
                                <Text style={style.optiontext}>Details</Text>
                                <TouchableOpacity onPress={() => setIsModalVisibleTwo(false)}>
                                    <FontAwesomeIcon color='grey' icon={faXmark} />
                                </TouchableOpacity>
                            </View>
                            <View style={style.logdatamodalview}>
                                <View style={style.bothtextofmofdalview}>
                                    <Text style={style.onltfontweight}>Visitor Name: </Text>
                                    <Text style={style.textvaluevisitor}>{selectedLog.visitorName}</Text>
                                </View>
                                <View style={style.bothtextofmofdalview}>
                                    <Text style={style.onltfontweight}>Date: </Text>
                                    <Text style={style.textvaluevisitor}>{new Date(selectedLog.inDate).toLocaleDateString()}</Text>
                                </View>
                                <View style={style.bothtextofmofdalview}>
                                    <Text style={style.onltfontweight}>Company: </Text>
                                    <Text style={style.textvaluevisitor}>{selectedLog.company}</Text>
                                </View>
                                <View style={style.bothtextofmofdalview}>
                                    <Text style={style.onltfontweight}>Destination: </Text>
                                    <Text style={style.textvaluevisitor}>{selectedLog.destination}</Text>
                                </View>
                                <View style={style.sdhuiwghdpwjh}>
                                    <Text style={style.onltfontweight}>In Notes: </Text>
                                    <TextInput
                                        style={style.visitornotestexttextInputStyle}
                                        value={outNotes}
                                        onChangeText={setOutNotes}
                                    />
                                </View>
                            </View>
                            <TouchableOpacity style={style.truckcheckbutview} onPress={handleCheckOut}>
                                <Text style={style.submitextindailyreport}>Check Out</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </>
    );
}

export default Visitorcheckout;
