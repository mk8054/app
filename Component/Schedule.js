import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSquareCaretLeft, faXmark, faSquareCaretRight, faCalendarDays, faCaretDown, faSquare, faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import style from '../Component/Style';

const Schedule = ({ navigation }) => {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [scheduleData, setScheduleData] = useState({ daily: null, weekly: null, monthly: null });
    const [currentDay, setCurrentDay] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState('Day');
    const [currentDateIndex, setCurrentDateIndex] = useState(0);
    const showDaySection = () => setSelectedOption('Day');
    const showWeeklySection = () => setSelectedOption('Weekly');
    const showMonthlySection = () => setSelectedOption('Monthly');

    useEffect(() => {
        const date = new Date();
        const day = date.toLocaleDateString('en-US', { weekday: 'long' });
        const dateString = date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
        setCurrentDay(day);
        setCurrentDate(dateString);
    }, []);

    const formatDate = (dateString) => {
        const [day, month, year] = dateString.split('/');
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        return {
            day: day,
            month: monthNames[parseInt(month) - 1],
            year: year
        };
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const hoursArray = [
        '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM', '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
        '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM',
    ];

    const fetchScheduleData = async (option) => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            const userId = await AsyncStorage.getItem('userID');
            const response = await fetch(`https://officer-reports-backend.onrender.com/api/schedule/getByUserId/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            // console.log(data, "scheduleData", JSON.stringify(data));
            setScheduleData(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScheduleData(selectedOption).then(() => {
            if (scheduleData?.data?.length > 0) {
                setCurrentDateIndex(0);
            }
        });
    }, [selectedOption]);

    useEffect(() => {
        fetchScheduleData(selectedOption);
    }, [selectedOption]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ScrollView style={style.MainscrollviewofSchedule}>
            <View style={style.Mainschedulemainview}>
                <View style={style.scheduletextandcrossview}>
                    <Text style={style.scheduletext}>Schedule</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <FontAwesomeIcon color='grey' icon={faXmark} />
                    </TouchableOpacity>
                </View>

                {selectedOption === 'Day' && scheduleData?.data && scheduleData.data.length > 0 && (
                    <>
                        <View style={style.dateanddaymainview}>
                            <View style={style.todaytextView}>
                                <Text style={style.todaytext}>Today</Text>
                                <FontAwesomeIcon color='darkgrey' style={style.leftrighticon} size={15} icon={faSquareCaretLeft} />
                                <FontAwesomeIcon color='darkgrey' size={15} icon={faSquareCaretRight} />
                            </View>
                            <View style={style.calenderanddateview}>
                                <FontAwesomeIcon color='darkgrey' size={20} icon={faCalendarDays} />
                                <View>
                                    <Text style={style.dateinschedule}>{currentDay}</Text>
                                    <Text style={style.dateinschedule}>{currentDate}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={style.dayanddownarrow} onPress={toggleDropdown}>
                                <Text style={style.daytext}>{selectedOption}</Text>
                                <FontAwesomeIcon color='grey' size={15} icon={faCaretDown} />
                            </TouchableOpacity>
                        </View>
                        <View style={style.dropdownList}>
                            <TouchableOpacity onPress={showDaySection} style={[style.optionButton, selectedOption === 'Day' && style.selectedOption]}>
                                <Text style={style.optionText}>Day</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={showWeeklySection} style={[style.optionButton, selectedOption === 'Weekly' && style.selectedOption]}>
                                <Text style={style.optionText}>Weekly</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={showMonthlySection} style={[style.optionButton, selectedOption === 'Monthly' && style.selectedOption]}>
                                <Text style={style.optionText}>Monthly</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={style.overallscheduleview}>
                            <View>
                                <Text style={style.wednesdayanddate}>{scheduleData.data[currentDateIndex]?.currentDate}</Text>
                                <View style={style.totalworkinghoursmainview}>
                                    <View style={style.overall24hoursmainview}>
                                        <Text style={style.overall24hours}>Over 24 Hr</Text>
                                        {scheduleData.data[currentDateIndex]?.dates.slice(0, 1).map((date, idx) => (
                                            <Text key={idx} style={{ textAlign: 'center', width: "80%" }}>{date.startTime} - {date.endTime}</Text>
                                        ))}
                                    </View>
                                </View>
                                {hoursArray.map((hour, idx) => {
                                    const duty = scheduleData.data[currentDateIndex]?.dates[0];
                                    const startHour = parseInt(duty.startTime.split(':')[0], 10);
                                    const endHour = parseInt(duty.endTime.split(':')[0], 10);
                                    const isDutyHour = idx >= startHour && idx < endHour;

                                    return (
                                        <View key={idx} style={style.fullworkinghours}>
                                            <View style={style.twentyfourhours}>
                                                <Text style={style.twentyfourhourstext}>{hour}</Text>
                                            </View>
                                            <View style={[style.borderview, { backgroundColor: isDutyHour ? '#ADD8E6' : 'white', }]}>
                                                <Text></Text>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>

                    </>
                )}
                <>

                    {selectedOption === 'Weekly' && scheduleData?.data && scheduleData.data.length > 0 && (
                        <>
                            <View style={style.dateanddaymainview}>
                                <View style={style.todaytextView}>
                                    <Text style={style.todaytext}>Today</Text>
                                    <FontAwesomeIcon color='darkgrey' style={style.leftrighticon} size={15} icon={faSquareCaretLeft} />
                                    <FontAwesomeIcon color='darkgrey' size={15} icon={faSquareCaretRight} />
                                </View>
                                <View style={style.calenderanddateview}>
                                    <FontAwesomeIcon color='darkgrey' size={20} icon={faCalendarDays} />
                                    <View>
                                        <Text style={style.dateinschedule}>{currentDay}</Text>
                                        <Text style={style.dateinschedule}>{currentDate}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={style.dayanddownarrow} onPress={toggleDropdown}>
                                    <Text style={style.daytext}>{selectedOption}</Text>
                                    <FontAwesomeIcon color='grey' size={15} icon={faCaretDown} />
                                </TouchableOpacity>
                            </View>
                            <View style={style.dropdownList}>
                                <TouchableOpacity onPress={showDaySection} style={[style.optionButton, selectedOption === 'Day' && style.selectedOption]}>
                                    <Text style={style.optionText}>Day</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={showWeeklySection} style={[style.optionButton, selectedOption === 'Weekly' && style.selectedOption]}>
                                    <Text style={style.optionText}>Weekly</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={showMonthlySection} style={[style.optionButton, selectedOption === 'Monthly' && style.selectedOption]}>
                                    <Text style={style.optionText}>Monthly</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={style.mainviewweeklycontent}>
                                {scheduleData?.data?.map((week, index) => (
                                    <View key={index}>
                                        {week?.dates?.slice(0, 7).map((date, dateIndex) => (
                                            <View style={style.mainviewofdateofweekly} key={dateIndex}>
                                                <View style={style.viewofweeklysection}>
                                                    <View style={style.weeklysection}>
                                                        <Text style={style.showlargedateweekly}>{formatDate(date?.date)?.day}</Text>
                                                        <View>
                                                            <Text style={style.dayfoweeklydatesection}>{date?.day}</Text>
                                                            <Text style={style.weeklydatesectiontext}>{formatDate(date?.date)?.month} {formatDate(date?.date)?.year}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={style.timesectionofweekly}>
                                                    <Text style={style.timetextsectionofweekly}>{date?.startTime} - {date?.endTime}</Text>
                                                </View>
                                                <View style={style.mainviewofeventsection}>
                                                    <View style={style.viewofsquareandrefreshicon}>
                                                        <FontAwesomeIcon color='#B2E1FF' size={14} style={{ marginRight: 4 }} icon={faSquare} />
                                                        <FontAwesomeIcon color='grey' size={12} style={{ marginRight: 4 }} icon={faArrowRotateRight} />
                                                        <Text style={style.poganfunarmedtext}>POG Unarmed</Text>
                                                    </View>
                                                    <View style={style.siteviewofevent}>
                                                        <Text style={style.sitestextineventsection}>
                                                            Site: <Text style={{ fontWeight: '400', fontSize: 15 }}>{week?.dates?.[0]?.siteName}</Text>
                                                        </Text>
                                                        <Text style={style.locationtext}>{week?.location}</Text>
                                                    </View>
                                                    <Text style={style.officersinevent}>Officers :</Text>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        </>
                    )}

                    {selectedOption === 'Monthly' && scheduleData?.data && scheduleData.data.length > 0 && (
                        <>
                            <View style={style.dateanddaymainview}>
                                <View style={style.todaytextView}>
                                    <Text style={style.todaytext}>Today</Text>
                                    <FontAwesomeIcon color='darkgrey' style={style.leftrighticon} size={15} icon={faSquareCaretLeft} />
                                    <FontAwesomeIcon color='darkgrey' size={15} icon={faSquareCaretRight} />
                                </View>
                                <View style={style.calenderanddateview}>
                                    <FontAwesomeIcon color='darkgrey' size={20} icon={faCalendarDays} />
                                    <View>
                                        <Text style={style.dateinschedule}>{currentDay}</Text>
                                        <Text style={style.dateinschedule}>{currentDate}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={style.dayanddownarrow} onPress={toggleDropdown}>
                                    <Text style={style.daytext}>{selectedOption}</Text>
                                    <FontAwesomeIcon color='grey' size={15} icon={faCaretDown} />
                                </TouchableOpacity>
                            </View>
                            <View style={style.dropdownList}>
                                <TouchableOpacity onPress={showDaySection} style={[style.optionButton, selectedOption === 'Day' && style.selectedOption]}>
                                    <Text style={style.optionText}>Day</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={showWeeklySection} style={[style.optionButton, selectedOption === 'Weekly' && style.selectedOption]}>
                                    <Text style={style.optionText}>Weekly</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={showMonthlySection} style={[style.optionButton, selectedOption === 'Monthly' && style.selectedOption]}>
                                    <Text style={style.optionText}>Monthly</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={style.mainviewweeklycontent}>
                                {scheduleData?.data?.map((week, index) => (
                                    <View key={index}>
                                        {week?.dates?.map((date, dateIndex) => (
                                            <View style={style.mainviewofdateofweekly} key={dateIndex}>
                                                <View style={style.viewofweeklysection}>
                                                    <View style={style.weeklysection}>
                                                        <Text style={style.showlargedateweekly}>{formatDate(date?.date)?.day}</Text>
                                                        <View>
                                                            <Text style={style.dayfoweeklydatesection}>{date?.day}</Text>
                                                            <Text style={style.weeklydatesectiontext}>{formatDate(date?.date)?.month} {formatDate(date?.date)?.year}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={style.timesectionofweekly}>
                                                    <Text style={style.timetextsectionofweekly}>{date?.startTime} - {date?.endTime}</Text>
                                                </View>
                                                <View style={style.mainviewofeventsection}>
                                                    <View style={style.viewofsquareandrefreshicon}>
                                                        <FontAwesomeIcon color='#B2E1FF' size={14} style={{ marginRight: 4 }} icon={faSquare} />
                                                        <FontAwesomeIcon color='grey' size={12} style={{ marginRight: 4 }} icon={faArrowRotateRight} />
                                                        <Text style={style.poganfunarmedtext}>POG Unarmed</Text>
                                                    </View>
                                                    <View style={style.siteviewofevent}>
                                                        <Text style={style.sitestextineventsection}>
                                                            Site: <Text style={{ fontWeight: '400', fontSize: 15 }}>{week?.dates?.[0]?.siteName}</Text>
                                                        </Text>
                                                        <Text style={style.locationtext}>{week?.location}</Text>
                                                    </View>
                                                    <Text style={style.officersinevent}>Officers :</Text>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        </>
                    )}
                </>
            </View>
        </ScrollView>
    );
};

export default Schedule;
