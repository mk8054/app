import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Image, Modal, TextInput } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleLeft, faXmark } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Textarea from 'react-native-textarea';
import style from '../Component/Style';

const TruckCheckOut = ({ navigation }) => {
    const [officerName, setOfficerName] = useState('');
    const [clientName, setClientName] = useState('');
    const [siteName, setSiteName] = useState('');
    const [data, setData] = useState([]);
    const [isModalVisibletwo, setIsModalVisibletwo] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);
    const [outTrailerNumber, setoutTrailerNumber] = useState('');
    const [outSealNumber, setoutSealNumber] = useState('');
    const [outNotes, setoutNotes] = useState('');
    const [outDriver, setoutDriver] = useState('');

    const getOfficerInfo = async () => {
        try {
            const officer = await AsyncStorage.getItem('name');
            const selectedSite = await AsyncStorage.getItem('selectedSite');
            const parsedSelectedSite = selectedSite ? JSON.parse(selectedSite) : null;
            setOfficerName(officer);
            setClientName(parsedSelectedSite?.clientId?.companyName);
            setSiteName(parsedSelectedSite?.siteName);
        } catch (error) {
            console.error('Error retrieving officer info', error);
        }
    };

    const passondata = async () => {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userID');
        const apiUrl = `https://officer-reports-backend.onrender.com/api/truckCheckIn/getByUserId/${userId}`;


        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const result = await response.json();
            setData(result.data || []);
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    const handleCheckOut = async () => {
        const token = await AsyncStorage.getItem('token');
        const checkOutUrl = `https://officer-reports-backend.onrender.com/api/truckCheckIn/checkOut/${selectedLog._id}`;

        const payload = {
            outDriver: outDriver,
            outNotes: outNotes,
            outSealNumber: outSealNumber,
            outTrailerNumber: outTrailerNumber
        };
        const response = await fetch(checkOutUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        const text = await response.text();
        console.log('Response text:', text);
        const result = JSON.parse(text);
        console.log('Parsed response:', result);
        setIsModalVisibletwo(false);
    };



    useEffect(() => {
        passondata();
        getOfficerInfo();
    }, []);

    return (
        <>
            <ScrollView style={style.MainScrollView}>
                <View style={style.viewforiconandtextindailyreport}>
                    <TouchableOpacity style={style.lefticontouchopacity} onPress={() => navigation.navigate("Reports")}>
                        <FontAwesomeIcon style={style.gobackicon} color="#E34234" size={22} icon={faAngleLeft} />
                    </TouchableOpacity>
                    <Text style={style.mainheadingtext}>Truck Check-Out</Text>
                    <View style={style.viewforimageheader}>
                        <View style={style.imagewidthviewforheader}>
                            <Image style={style.reportofofficerpasge} source={require('../assets/images/securitybaselogo.png')} />
                        </View>
                    </View>
                </View>

                {/* Officer and Site Information */}
                <View>
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

                    {/* Truck Information */}
                    <View style={style.officerandsitesection}>
                        <View style={style.viewforbgcandtext}>
                            <Text style={style.headingtextfordailyactivey}>Trucks</Text>
                        </View>
                        <View style={style.officerandsitesection}>
                            {data.length > 0 ? (
                                data.map((entry) => (
                                    <TouchableOpacity key={entry._id} style={style.licensnceplacenumbeerview} onPress={() => { setSelectedLog(entry); setIsModalVisibletwo(true); }}>
                                        <Text><Text style={style.onltfontweight}>Date: </Text>{new Date(entry.createdAt).toLocaleDateString()}</Text>
                                        <Text><Text style={style.onltfontweight}>Company: </Text>{entry.company}</Text>
                                        <Text><Text style={style.onltfontweight}>Driver: </Text>{entry.inDriver}</Text>
                                        <Text><Text style={style.onltfontweight}>Tractor #: </Text>{entry.tractorNumber}</Text>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text>No truck data available</Text>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Modal for Log Details */}
            <Modal animationType="slide" transparent={true} visible={isModalVisibletwo} onRequestClose={() => setIsModalVisibletwo(false)}>
                <View style={style.Modalbackgroundmainview}>
                    <View style={style.modalforaddtrucklog}>
                        <View style={style.optionandcrossiconview}>
                            <Text style={style.optiontext}>Details</Text>
                            <TouchableOpacity onPress={() => setIsModalVisibletwo(false)}>
                                <FontAwesomeIcon color='grey' icon={faXmark} />
                            </TouchableOpacity>
                        </View>
                        <View style={style.logdatamodalview}>
                            {selectedLog ? (
                                <>
                                    <Text><Text style={style.onltfontweight}>Date:                       </Text>{new Date(selectedLog.createdAt).toLocaleDateString()}</Text>
                                    <Text><Text style={style.onltfontweight}>Company:              </Text>{selectedLog.company}</Text>
                                    <Text><Text style={style.onltfontweight}>Inbound Driver:    </Text>{selectedLog.inDriver}</Text>
                                    <Text><Text style={style.onltfontweight}>Tractor :                 </Text>{selectedLog.tractorNumber}</Text>
                                    <Text><Text style={style.onltfontweight}>LP :                          </Text>{selectedLog.LPNumber}</Text>
                                    <Text><Text style={style.onltfontweight}>VIN :                        </Text>{selectedLog.VIN}</Text>

                                    <View style={style.mainviewfortru8chmodalandtext}>
                                        <View style={{ width: "37%" }}>
                                            <Text style={style.onltfontweight}>Outbound Driver : </Text>
                                        </View>
                                        <TextInput style={style.textinputfortruckmodal}
                                            value={outDriver}
                                            onChangeText={setoutDriver}
                                        />
                                    </View>
                                    <View style={style.mainviewfortru8chmodalandtext}>
                                        <View style={{ width: "37%" }}>
                                            <Text style={style.onltfontweight}>Trailer # : </Text>
                                        </View>
                                        <TextInput style={style.textinputfortruckmodal}
                                            value={outTrailerNumber}
                                            onChangeText={setoutTrailerNumber}
                                        />
                                    </View>
                                    <View style={style.mainviewfortru8chmodalandtext}>
                                        <View style={{ width: "37%" }}>
                                            <Text style={style.onltfontweight}>Seal Number : </Text>
                                        </View>
                                        <TextInput style={style.textinputfortruckmodal}
                                            value={outSealNumber}
                                            onChangeText={setoutSealNumber}
                                        />
                                    </View>
                                    <View style={style.mainviewfortru8chmodalandtext}>
                                        <View style={{ width: "37%" }}>
                                            <Text style={style.onltfontweight}>Notes on Exit : </Text>
                                        </View>
                                        <Textarea
                                            containerStyle={style.truckmodaltextares}
                                            style={style.textareamodal}
                                            maxLength={120}
                                            placeholder={'Additional notes'}
                                            value={outNotes}
                                            onChangeText={setoutNotes}
                                        />
                                    </View>
                                    <TouchableOpacity onPress={handleCheckOut} style={style.truckcheckbutview}>
                                        <Text style={style.submitextindailyreport}>Save</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <Text>No log selected</Text>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default TruckCheckOut;
