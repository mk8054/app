import { StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../Colors/Colors';
import colors from '../Colors/Colors';
import style from '../Style';

const Style = StyleSheet.create({

    MainScrollView: {
        backgroundColor: 'white',
        width: '100%',
    },
    officerimageviewinsignup: {
        alignSelf: "center",
        marginTop: 80
    },
    officereportimageview: {

        alignSelf: "center",
        marginTop: 100
    },
    loginpagetextcontent: {
        width: '80%',
        alignSelf: 'center',
        marginTop: 20
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioButtonText: {
        marginLeft: 8, // Adjust spacing as needed
        fontSize: 16,  // Adjust font size as needed
    },
    loginpageheadingtext: {
        color: Colors.YaleBlue,
        fontWeight: 'bold',
        fontSize: 32,
        fontFamily: 'mainfont',
        textAlign: 'center',
        padding: 10
    },
    textinputview: {
        width: '100%',
        padding: 8
    },
    textfieldtext: {
        padding: 4,
        marginBottom: 4,
        fontFamily: 'mainfont'
    },
    passwordtextfield: {
        borderWidth: 1,
        borderRadius: 6,
        padding: 8,
        borderColor: 'lightgrey',
        flexDirection: 'row'
    },
    logintextfield: {
        borderWidth: 1,
        borderRadius: 6,
        padding: 8,
        borderColor: 'lightgrey'
    },
    eyeiconforlogin: {
        alignSelf: 'center',
        width: '10%'
    },
    passwordfield: {
        width: '90%'
    },
    submitbtnview: {
        width: '35%',
        backgroundColor: Colors.Vermilion,
        borderRadius: 3,
        alignSelf: 'center',
        marginTop: 30
    },
    submittextforlogin: {
        padding: 8,
        textAlign: 'center',
        fontFamily: 'mainfont',
        color: 'white'
    },
    Modalbackgroundmainview: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#E5E5E6",
    },
    modalview: {
        backgroundColor: 'white',
        borderRadius: 2,
        padding: 2,
        elevation: 10,
        width: '60%',
        borderRadius: 6
    },
    optionandcrossiconview: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        padding: 6,
        borderWidth: 1,
        borderColor: 'lightgrey',
        width: '100%'
    },
    optiontext: {
        width: '90%',
        fontFamily: 'mainfont'
    },
    selectoptiontext: {
        width: '100%',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left',
        padding: 10,
        color: Colors.YaleBlue,
        fontFamily: 'mainfont'
    },
    selectoptionview: {
        width: '100%'
    },
    modalsbutton: {
        borderWidth: 1,
        borderRadius: 3,
        padding: 8,
        borderColor: 'lightgrey',
        width: '99%',
        alignSelf: 'center',
        margin: 2
    },
    viewscheduletext: {
        textAlign: 'center',
        fontSize: 18,
        fontFamily: 'mainfont',
        padding: 6
    },
    MainscrollviewofSchedule: {
        width: '100%',
        backgroundColor: "grey",
    },
    scheduletextandcrossview: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "white",
        padding: 6,
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 8
    },
    Mainschedulemainview: {
        backgroundColor: 'white',
        borderRadius: 2,
        padding: 2,
        elevation: 10,
        width: '95%',
        alignSelf: 'center',
        marginTop: 35,
        borderRadius: 10,
        marginBottom: 20
    },
    scheduletext: {
        width: "95%",
        fontSize: 16,
        fontFamily: 'mainFont',
        color: "grey"
    },
    dateanddaymainview: {
        width: '99%',
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: "lightgrey",
        padding: 5,
        margin: 5
    },
    todaytextView: {
        flexDirection: "row",
        alignItems: 'center',
        borderColor: Colors.lightestgrey,
        borderWidth: 1,
        width: '25%',
        padding: 4,
        alignSelf: 'center',
        marginLeft: 3
    },
    todaytext: {
        fontSize: 13,
        fontFamily: 'mainFont',
        paddingRight: 10,
    },
    leftrighticon: {
        paddingLeft: 5,
        paddingRight: 5
    },
    calenderanddateview: {
        paddingLeft: 15,
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%',
        alignSelf: 'center'
    },
    dateinschedule: {
        fontSize: 13,
        fontFamily: 'mainFont',
        marginLeft: 7
    },
    dayanddownarrow: {
        width: '22%',
        flexDirection: "row",
        alignItems: 'center',
        backgroundColor: colors.lightestgrey,
        padding: 5,
        alignSelf: 'center',
        marginLeft: 3
    },
    daytext: {
        fontSize: 13,
        fontFamily: 'mainFont',
        // paddingRight: 10,
        width: '70%',
    },
    overallscheduleview: {
        borderWidth: 1,
        borderColor: 'lightgrey',
    },
    wednesdayanddate: {
        textAlign: 'center',
        padding: 5,
        borderWidth: 1,
        borderColor: 'lightgrey',
        width: "100%",
        alignSelf: 'center',

    },
    totalworkinghoursmainview: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    overall24hours: {
        padding: 3,
        borderBottomwidth: 1,
        borderBottomColor: 'lightgrey',
        width: '20%'
    },
    blankview: {
        width: '80%',
        borderWidth: 1,
        borderColor: 'lightgrey'
    },
    overall24hoursmainview: {
        flexDirection: "row",
        width: '100%'
    },
    twentyfourhours: {
        width: '20%',
        borderBottomWidth: 1,
        borderColor: 'lightgrey'
    },
    twentyfourhourstext: {
        padding: 5,
        borderRightWidth: 1,
        borderRightColor: 'lightgrey',
        height: "100%",
        fontWeight: 'bold'
    },
    borderview: {
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey',
        width: '80%',
        height: '100%',
    },
    fullworkinghours: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50
    },
    mainviewweeklycontent: {
        width: '100%'
    },
    viewfordatetimeandevent: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    datetimeandeventtext: {
        fontWeight: 'bold',
        width: '34%',
        borderWidth: 1,
        borderColor: 'lightgrey',
        textAlign: 'center',
        padding: 3,
        fontFamily: 'mainFont'
    },
    timesectionview: {
        fontWeight: 'bold',
        width: '35%',
        borderWidth: 1,
        borderColor: 'lightgrey',
        textAlign: 'center',
        padding: 3,
        fontFamily: 'mainFont'
    },
    eventtext: {
        fontWeight: 'bold',
        width: '31%',
        borderWidth: 1,
        borderColor: 'lightgrey',
        textAlign: 'center',
        padding: 3,
        fontFamily: 'mainFont'
    },
    mainviewofdateofweekly: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 80
    },
    showlargedateweekly: {
        fontFamily: 'mainFont',
        fontSize: 35,
        marginRight: 6
    },
    viewofweeklysection: {
        padding: 3,
        flexDirection: 'row',
        alignItems: "flex-start",
        borderWidth: 1,
        borderColor: 'lightgrey',
        width: '34%',
        height: '100%'
    },
    weeklysection: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    },
    weeklydatesectiontext: {
        fontSize: 11,
    },
    dayfoweeklydatesection: {
        marginTop: 5,
        marginLeft: 3,
        fontSize: 13,
    },
    timesectionofweekly: {
        width: '35%',
        borderColor: 'lightgrey',
        borderWidth: 1,
        height: "100%",
        paddingTop: 5,
    },
    timetextsectionofweekly: {
        marginTop: 4,
        fontSize: 13,
        fontFamily: 'mainFont',
        marginLeft: 3
    },
    mainviewofeventsection: {
        width: '31%',
        borderWidth: 1,
        borderColor: 'lightgrey',
        height: "100%",
        padding: 5
    },
    dropdownList: {
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 5,
        backgroundColor: 'white',
    },
    option: {
        padding: 4,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey',
    },
    optionText: {
        fontSize: 12,
        color: 'black',
        fontFamily: 'mainFont',
        padding: 4
    },
    viewofsquareandrefreshicon: {
        paddingTop: 4,
        flexDirection: "row",
        alignItems: "center"
    },
    poganfunarmedtext: {
        fontFamily: "mainFont",
        color: 'black',
        fontSize: 13
    },
    sitestextineventsection: {
        fontWeight: 'bold',
        fontFamily: 'mainfont',
        fontSize: 15
    },
    locationtext: {
        fontFamily: "mainFont",
        padding: 10,
        fontSize: 12
    },
    siteviewofevent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    officersinevent: {
        fontFamily: 'mainFont',
        fontWeight: 'bold'
    }
    ,
    optionButton: {
        backgroundColor: 'white',
        padding: 4,
        width: '100%',
        alignSelf: 'center'
    },
    selectedOption: {
        backgroundColor: Colors.lightestgrey
    },
    worksitemainview: {
        width: '100%',
        alignSelf: 'center'
    },
    selectsitetextinsites: {
        fontWeight: "bold",
        fontSize: 20,
        padding: 10,
        color: Colors.YaleBlue,
    },
    textforsitesandclient: {
        fontFamily: 'mainFont'
    },
    officereportimageforreportpageView: {
        width: 200,
        height: 200,
        alignSelf: "center",
        paddingTop: 30,
        paddingBottom: 10
    },
    officerimage: {
        width: '100%',
        height: "100%"
    },
    getallsitesmainview: {
        width: '100%',
        alignSelf: 'center'
    },
    TouchableOpacityfortextandimage: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        alignSelf: 'center',
        backgroundColor: Colors.Vermilion,
        margin: 1,
        padding: 10,

    },
    nameofreport: {
        width: '85%',
        padding: 10,
        fontFamily: 'mainFont',
        fontSize: 20,
        color: 'white',
        fontWeight: '600'
    },
    viewforimageinreport: {
        width: 40,
        height: 40
    },
    reportofofficerpasge: {
        width: '100%',
        height: '100%'
    },
    styleforclient: {
        width: '98%',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'lightgrey',
        padding: 10,
        margin: 3,
        borderRadius: 8
    },
    currentwhat: {
        fontSize: 15,
        fontFamily: 'mainFont'
    },
    cloeckedoutbigtext: {
        fontWeight: '700',
        fontSize: 22,
        paddingBottom: 5,

    },
    clockpopupview: {
        padding: 8
    },
    simpleborderline: {
        width: '95%',
        alignSelf: 'center',
        borderTopWidth: 1
    }
    ,
    clockincommenttextandtextinput: {
        width: '90%',
        alignSelf: 'center',
    },
    textareaContainer: {
        padding: 10,
        width: '100%',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'grey',
        height: 60
    },
    commmentforclockin: {
        fontFamily: 'mainFont',
        padding: 2,
        fontWeight: 'bold',
        paddingBottom: 10
    },
    viewforwidthofclockinout: {
        backgroundColor: 'white',
        borderRadius: 2,
        padding: 2,
        elevation: 10,
        width: '85%',
        borderRadius: 6
    },
    startshiftphotoview: {
        width: 100,
        height: 100,
        marginBottom: 5
    },
    viewforimageandtextforclockinandout: {
        margin: 15
    },
    touchopcatityfordisplayallclockoption: {
        backgroundColor: Colors.lightestgrey,
        width: '60%',
        borderWidth: 1,
        borderColor: 'grey'
    },
    displayallclocktimetext: {
        fontFamily: 'mainFont',
        padding: 6,
        textAlign: 'center'
    },
    viewforiconandtextindailyreport: {
        width: '100%',
        paddingTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        paddingTop: 30
    },
    lefticontouchopacity: {
        width: '10%',
        alignSelf: 'center',
    },
    gobackicon: {
        color: 'white'
    },
    securitybasegrouptext: {
        alignSelf: 'center',
        color: Colors.YaleBlue,
        fontWeight: "bold",
        fontSize: 25,
        textAlign: 'center',
        width: '75%'
    },
    mainheadingtext: {
        padding: 10,
        alignSelf: 'center',
        color: Colors.YaleBlue,
        fontWeight: "bold",
        fontSize: 25,
        textAlign: 'center',
        width: '75%'
    },
    viewforimageheader: {
        width: '15%'
    },
    imagewidthviewforheader: {
        width: 40,
        height: 30
    },
    securityimageview: {
        width: 50,
        height: 35
    },
    viewforbgcandtext: {
        width: '97%',
        alignSelf: 'center',
        backgroundColor: Colors.Vermilion,
        borderRadius: 10,
        marginBottom: 5,
        marginTop: 10
    },
    headingtextfordailyactivey: {
        color: 'white',
        fontWeight: 'bold',
        padding: 8,
        fontFamily: 'mainFont'
    },
    officernameandsiteandlcinwetvalue: {
        width: '90%',
        alignSelf: 'center',
        padding: 5
    },
    onltfontweight: {
        fontWeight: 'bold',
        fontSize: 15,
        width: '40%'
    },
    textinputtext: {
        fontWeight: 'bold',
        fontSize: 14,
        width: '90%'
    },
    officerandsitesection: {
        width: '100%',
        alignSelf: 'center',
        marginTop: 5,
        marginBottom: 10
    },
    ShiftStartNotesmainview: {
        width: '100%',
        alignSelf: 'center',
        marginTop: 5,
        marginBottom: 10
    }
    , staricon: {
        color: Colors.Vermilion,
    },
    textfieldandtextarseview: {
        width: '90%',
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'flex-start',
        margin: 5,
    },
    textandstariconview: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '28%',
        alignSelf: 'center',
        marginRight: 10
    },
    textyinputforshift: {
        width: "70%",
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 4,
        alignSelf: 'center',
        padding: 5
    }
    ,
    specialinstructiontextarea: {
        width: "98%",
        alignSelf: 'center',
        height: 100,
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 4,
        padding: 5
    },
    observationtextview: {
        width: '60%',
        padding: 5
    },
    observationtextandbuttonview: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center'
    },
    viewforeditbutandtext: {
        width: '40%',
        flexDirection: "row",
        alignItems: 'center'
    },
    removetextandiconview: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: "grey",
        borderRadius: 4,
        margin: 5,
        padding: 5,
        backgroundColor: Colors.lightestgrey,
    },
    removetextofdailyreport: {
        fontFamily: 'mainFont',
        color: 'grey',
        padding: 4
    },
    redborderindailyreport: {
        width: '100%',
        alignSelf: 'center',
        borderBottomColor: Colors.Vermilion,
        borderBottomWidth: 1
    },
    viewforredlineandaddbutton: {
        width: '90%',
        alignSelf: 'center'
    }
    ,
    addobservationtouchopcay: {
        width: '40%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.lightestgrey,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'grey',
        marginTop: 15
    },
    addobservationtext: {
        textAlign: 'center',
        padding: 10,
        width: "85%"
    },
    videoaudiophotoviewmainview: {
        width: '100%',
        alignSelf: 'center',
        marginTop: 5,
        marginBottom: 10
    },
    submitbuttonview: {
        width: '30%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.lightestgrey,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'grey',
        marginTop: 15,
        margin: 10
    },
    submitextindailyreport: {
        padding: 10,
        textAlign: 'center',
        width: '100%',
        fontFamily: 'mainFont'
    },
    viewforaddobservationmodal: {
        width: '70%',
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 8
    },
    submitandclearbutnview: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center'
    },
    mainviewforimageanddeleticon: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignSelf: 'center',
        width: '92%'
    },
    mediaimageview: {
        width: 115, padding: 5
    },
    mediaimage: {
        width: '100%',
        height: 100,
        borderRadius: 5,
    },
    mediaimagedeleteiocnview: {
        position: 'absolute',
        right: 0,
        botttom: 8
    },
    maindropdownview: {
        width: '70%',
        borderWidth: 1,
        borderColor: "lightgrey",
        borderRadius: 7
    }
    ,
    dropdownmenuandiconview: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        // padding: 8
    },
    dropdownheadingtext: {
        width: '90%'
    },
    inspectiondropdownicon: {
        fontWeight: '700',
        fontSize: 15
    },
    drpdownoutputview: {
        width: '90%', alignSelf: 'center'
    },
    dropdownoutputtext: {
        fontSize: 15,
        color: 'red'
    },
    InspectedOfficerOtherview: {
        width: '70%',
        alignSelf: "center",
    },
    inspectiontextfieldothertextinput: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 6,
        padding: 6
    },
    alertsectionradiobutnview: {
        flexDirection: 'row',
        alignSelf: 'center',
        width: '70%',
    },
    textareaviewofdescribe: {
        width: '100%',
        height: 100,
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 6,
        padding: 8
    },
    describetext: {
        fontWeight: 'bold',
        marginRight: 10,
        fontSize: 15,
        width: '28%'
    },
    licensnceplacenumbeerview: {
        width: '90%',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 8,
        margin: 5,
        padding: 6
    },
    licenseplatenumbertext: {
        fontWeight: 'bold',
        margin: 6,
        fontSize: 12
    },
    logdatamodalview: {
        padding: 10
    },
    hrcategorttouchopacity: {
        width: '90%',
        alignSelf: 'center',
        margin: 10,
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 8
    },
    hrcategorttext: {
        padding: 10,
        fontFamily: 'mainFont',
        fontSize: 16
    },
    modalforaddtrucklog: {
        backgroundColor: 'white',
        borderRadius: 2,
        padding: 2,
        elevation: 10,
        width: '70%',
        borderRadius: 6
    },
    mainviewfortru8chmodalandtext: {
        width: "100%",
        flexDirection: 'row',
        alignItems: "flex-start",
        marginTop: 4
    },
    textinputfortruckmodal: {
        width: '63%',
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 6,
        paddingLeft: 4
    },
    truckmodaltextares: {
        width: '63%',
        height: 100,
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 6,
        padding: 8
    },
    truckcheckbutview: {
        width: '30%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.lightestgrey,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'grey',
        marginTop: 15,
        margin: 10,
        alignSelf: 'center'
    },
    inoutandtimeview: {
        width: '100%',
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'lightgrey'
    },
    intext: {
        width: '40%',
        padding: 4,
        fontWeight: "700",
        borderRightWidth: 1,
        borderRightColor: "lightgrey"
    },
    timetext: {
        width: '20%',
        padding: 4,
        fontWeight: "700"
    },
    intextvalue: {
        width: '40%',
        padding: 4,
        borderRightWidth: 1,
        borderRightColor: "lightgrey",
        fontSize: 12
    },
    timetextvalue: {
        width: '20%',
        padding: 4,
        fontSize: 13
    },
    bothtextofmofdalview: {
        flexDirection: 'row', alignItems: 'center', width: '100%'
    },
    clockedbutnstyle: {
        backgroundColor: Colors.lightestgrey,
        width: '40%',
        borderWidth: 1,
        borderColor: 'grey'
    },
    shiftstartimageview: {
        width: 100,
        height: 100
    },
    visitornotestexttextInputStyle: {
        borderWidth: 1,
        borderColor: 'lightgrey',
        height: 100,
        width: "60%",
        margin: 5,
        padding: 4
        ,
        borderRadius: 7
    },
    sdhuiwghdpwjh: {
        flexDirection: 'row',
        alignItems: "flex-start",
        width: '100%'
    },
    textvaluevisitor: {
        padding: 3
    },
    signuppageview: {
        width: '100%',
        alignSelf: 'center',
        marginTop: 40
    },
    signuptextandtextinputview: {
        flexDirection: 'row',
        alignItems: "center",
        width: '80%',
        alignSelf: 'center',
        margin: 5,
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 8
    },
    signuptextview: {
        marginLeft: 6,
        marginBottom: 40,
        marginTop: 20,
        fontFamily: 'mainFont'
    },
    signuptextinput: {
        padding: 8,
    },
    loginheretext: {
        fontWeight: 'bold'
    },
    signtextforalredyaccount: {
        textAlign: 'center',
        padding: 15
    },
    fewthingtostart: {
        textAlign: "center",
        fontWeight: '700',
        fontSize: 18
    },
    signupicon: {
        color: "grey",
        marginLeft: 10
    }
})
export default Style;