import React, {useState, useEffect} from 'react';
import {ScrollView, Text, View, TouchableOpacity, Image} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAngleLeft} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import style from '../Component/Style';

const PostOrders = ({navigation}) => {
  const [officerName, setOfficerName] = useState('');
  const [clientName, setClientName] = useState('');
  const [siteName, setSiteName] = useState('');
  const [siteDetails, setSiteDetails] = useState({});

  const getOfficerInfo = async () => {
    try {
      const officer = await AsyncStorage.getItem('name');
      const selectedSite = await AsyncStorage.getItem('selectedSite');
      const parsedSelectedSite = selectedSite ? JSON.parse(selectedSite) : null;
      setOfficerName(officer || 'N/A');
      setClientName(parsedSelectedSite?.clientId?.companyName);
      setSiteName(parsedSelectedSite?.siteName);
      fetchSiteDetails(parsedSelectedSite?._id);
    } catch (error) {
      console.error('Error retrieving officer info', error);
    }
  };

  const fetchSiteDetails = async siteId => {
    try {
      const response = await fetch(
        `https://officer-reports-backend.onrender.com/api/site/get/${siteId}`,
      );
      const data = await response.json();
      if (data.success) {
        setSiteDetails(data.data);
      } else {
        console.error('Failed to fetch site details:', data.message);
      }
    } catch (error) {
      console.error('Error fetching site details', error);
    }
  };

  useEffect(() => {
    getOfficerInfo();
  }, []);

  return (
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
        <Text style={style.mainheadingtext}>Post Orders</Text>
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
            <Text style={style.headingtextfordailyactivey}>Address</Text>
          </View>
          <View style={style.officernameandsiteandlcinwetvalue}>
            <Text>
              <Text style={style.onltfontweight}>Address1: </Text>
              {siteDetails.address1}
            </Text>
            <Text>
              <Text style={style.onltfontweight}>Address2: </Text>
              {siteDetails.address2}
            </Text>
            <Text>
              <Text style={style.onltfontweight}>City/State/PostalCode: </Text>
              {`${siteDetails.city}/${siteDetails.state}/${siteDetails.postalCode}`}
            </Text>
          </View>
        </View>
        <View style={style.officerandsitesection}>
          <View style={style.viewforbgcandtext}>
            <Text style={style.headingtextfordailyactivey}>Client Contact</Text>
          </View>
          <View style={style.officernameandsiteandlcinwetvalue}>
            <Text>
              <Text style={style.onltfontweight}>ClientContact: </Text>
              {siteDetails.clientContact}
            </Text>
            <Text>
              <Text style={style.onltfontweight}>Phone: </Text>
              {siteDetails.clientPhone}
            </Text>
          </View>
        </View>
        <View style={style.officerandsitesection}>
          <View style={style.viewforbgcandtext}>
            <Text style={style.headingtextfordailyactivey}>Maintenance</Text>
          </View>
          <View style={style.officernameandsiteandlcinwetvalue}>
            <Text>
              <Text style={style.onltfontweight}>MaintenanceContact: </Text>
              {siteDetails.maintenance}
            </Text>
            <Text>
              <Text style={style.onltfontweight}>Phone: </Text>
              {siteDetails.maintenancePhone}
            </Text>
          </View>
        </View>
        <View style={style.officerandsitesection}>
          <View style={style.viewforbgcandtext}>
            <Text style={style.headingtextfordailyactivey}>Police</Text>
          </View>
          <View style={style.officernameandsiteandlcinwetvalue}>
            <Text>
              <Text style={style.onltfontweight}>PoliceContact: </Text>
              {siteDetails.policeContact}
            </Text>
            <Text>
              <Text style={style.onltfontweight}>Phone: </Text>
              {siteDetails.policePhone}
            </Text>
          </View>
        </View>
        <View style={style.officerandsitesection}>
          <View style={style.viewforbgcandtext}>
            <Text style={style.headingtextfordailyactivey}>Towing Company</Text>
          </View>
          <View style={style.officernameandsiteandlcinwetvalue}>
            <Text>
              <Text style={style.onltfontweight}>TowingContact: </Text>
              {siteDetails.towingContact}
            </Text>
            <Text>
              <Text style={style.onltfontweight}>Phone: </Text>
              {siteDetails.towingPhone}
            </Text>
          </View>
        </View>
        <View style={style.officerandsitesection}>
          <View style={style.viewforbgcandtext}>
            <Text style={style.headingtextfordailyactivey}>Comments</Text>
          </View>
          <View style={style.officernameandsiteandlcinwetvalue}>
            <Text>
              <Text style={style.onltfontweight}>PostOrderComments: </Text>
              {siteDetails.postOrderComments}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default PostOrders;
