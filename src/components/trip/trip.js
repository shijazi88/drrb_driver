import React, { Component } from "react";
import {
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TextInput,
  I18nManager,
  Image, Dimensions, PermissionsAndroid,
  FlatList, TouchableOpacity, RefreshControl, AppState,
} from 'react-native';
import {
  Text, NativeBaseProvider, Button, Link, VStack, IconButton, Badge, AlertDialog, HStack
} from 'native-base'
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from './styles';
import Icon from 'react-native-vector-icons/AntDesign';
// import IconFeather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { TransWithoutContext, withTranslation } from 'react-i18next';
import { colors } from "../../config/styles";
import { normalize } from '../../utils/index'
import { t } from "i18next";
import { helpers } from '../../utils';
import { environment, services } from "../../api/api";
import { PERMISSIONS, check, RESULTS, request } from "react-native-permissions";
import Geolocation from '@react-native-community/geolocation';
import MapView from "react-native-maps";
let width = Dimensions.get("window").width;
let height = Dimensions.get("window").height;
import { Linking } from 'react-native'

class Trip extends Component {

  constructor() {
    super();
    this.state = {
      message: '',
      loading: false,
      data: null,
      token: '',
      signOutDialogOpen: false,
      errorAlert: false,
      selectedLocation: "none",
      successAlert: false,
      userCurrentD_longitude: null,
      userCurrentD_latitude: null,
    }
  }

  signOutPressed() {
    AsyncStorage.setItem("isLoggedIn", JSON.stringify(null))
    AsyncStorage.setItem("profileData", JSON.stringify(null))
    AsyncStorage.setItem("token", JSON.stringify(null))
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'SignIn' },
        ],
      })
    );
  }

  async componentDidMount() {

    const token = await AsyncStorage.getItem("token")
    this.setState({
      token: token,
    })

    //Get Details


    this.putMarkerandLocation(false);


  }

  /**
* Get current user location and put the marker on the map
*/
  putMarkerandLocation = (forUpdate) => {

    let me = this;
    me.setState({
      loading: true
    });
    let mapOptions = {
      enableHighAccuracy: true,
      timeout: 20000
    };

    if (Platform.OS === 'ios') {
      mapOptions["maximumAge"] = 1000;
    }

    // Get current user location
    Geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          selectedLocation: {
            latitude: parseFloat(position.coords.latitude),
            longitude: parseFloat(position.coords.longitude)
          },
          userCurrentD_longitude: position.coords.longitude,
          userCurrentD_latitude: position.coords.latitude
        }, () => {
          console.log("userCurrentD_longitude", this.state.userCurrentD_longitude)
          console.log("userCurrentD_latitude", this.state.userCurrentD_latitude)
          if (forUpdate) {
            this.updateTripPressed()
          }
          return this.getAddressByLatLng(
            position.coords.latitude,
            position.coords.longitude,
          );

        });
      },
      (error) => {
        if (Platform.OS === 'ios') {
          me.setState({ selectedLocation: "none", loading: false })
          // navigate to setting ?
          // Linking.openURL('app-settings:')
        }

        if (Platform.OS === 'android') {
          Geolocation.getCurrentPosition(
            (position) => {
              me.setState({
                selectedLocation: {
                  latitude: parseFloat(position.coords.latitude),
                  longitude: parseFloat(position.coords.longitude)
                },
                userCurrentD_longitude: position.coords.longitude,
                userCurrentD_latitude: position.coords.latitude
              }, () => {
                console.log("userCurrentD_longitude", this.state.userCurrentD_longitude)
                console.log("userCurrentD_latitude", this.state.userCurrentD_latitude)
                if (forUpdate) {
                  this.updateTripPressed()
                }
                return me.getAddressByLatLng(
                  position.coords.latitude,
                  position.coords.longitude
                );
              });
            },
            (error) => {
              console.log('frerger', error)
              me.setState({ selectedLocation: "none", loading: false })
            },
            {
              enableHighAccuracy: false,
              timeout: 20000
            }
          );
        }
      },
      mapOptions
    );
  };

  /**
 * Get address by longitude and latitue
 * @param lat
 * @param lng
 * @param animate
 */
  getAddressByLatLng = (lat, lng, animate = true) => {

    if (!lat || !lng) return;

    //let city = this.checkSupported(lat, lng);

    return fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyChJtR4_riSKktUs6oGxFtk-v2ygsgpTvw`
    )
      .then(res => res.json())
      .then(res => {

        // this.updateLocationLog({
        //     lat,
        //     lng,
        //     city: city.name
        // });

        // this.props.setCity(city);
        // console.log(res)
        //this.props.setPlaceId(res.results.length > 0 ? res.results[0].place_id : null);
        this.setState({
          selectedAddressInfo: res.results.length > 0 ? res.results[0].formatted_address : null,
        })
        // console.log("Place ID : ", res.results.length > 0 ? res.results[0].formatted_address : null)
        // this.props.setCoordinates({
        //     latitude: lat,
        //     longitude: lng
        // });
        //console.log(lat+"---"+lng)

        this.setState(
          {
            // city: city,
            // city_id: city.id,
            selectedAddress: res.results.length > 0 ? res.results[0].formatted_address : null,
            loading: false,
            selectedLocation: { latitude: parseFloat(lat), longitude: parseFloat(lng) }
          },
          () => {
            animate &&
              this.map.animateToRegion(
                { latitude: parseFloat(lat), longitude: parseFloat(lng) },
                0
              );
          }
        );
      });
  };

  renderCallout({ latitude, longitude }) {
    return this.getAddressByLatLng(latitude, longitude, false);
  }
  updateTripPressed = () => {
    console.log("HERE 31")
    const { tripData } = this.props.route.params;
    if (tripData.status == "PICKEDUP") {
      console.log("HERE 32")
      if (this.state.userCurrentD_latitude == null || this.state.userCurrentD_longitude == null) {
        console.log("HERE 33")
        this.setState({ message: this.props.t('pleaseGivePermissionForLocation'), errorAlert: true, loading: false, });
        this.putMarkerandLocation(false);
      } else {
        this.updateTrip(tripData.id)
      }
    } else {
      this.updateTrip(tripData.id)
    }
  }

  updateTrip = (id) => {
    console.log("HERE 1")
    this.setState({ loading: true, message: '' });
    const { tripData } = this.props.route.params;
    let data = null
    if (tripData.status == "PICKEDUP") {
      data = {
        method: 'POST',
        body: JSON.stringify({
          status: "COMPLETED",
          d_latitude: this.state.userCurrentD_latitude,
          d_longitude: this.state.userCurrentD_longitude,
          c_lat: this.state.userCurrentD_latitude,
          c_long: this.state.userCurrentD_longitude
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.state.token
        }
      }
    } else {
      data = {
        method: 'POST',
        body: JSON.stringify({
          status: "PICKEDUP",
          c_lat: this.state.userCurrentD_latitude,
          c_long: this.state.userCurrentD_longitude
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.state.token
        }
      }
    }

    var proceed = false;
    console.log("data", data)
    fetch(environment.getEnvironment + services.sendRequest + id + "/status", data)
      .then((response) => {
        const statusCode = response.status;
        const data = response.json();
        return Promise.all([statusCode, data]);
      })
      .then(([res, response]) => {
        if (response.error) {
          this.setState({ message: response.message, errorAlert: true, loading: false, })
        } else {
          if (res == 401) {
            this.setState({ message: this.props.t('errorMessageGeneral'), errorAlert: true, loading: false, });
          } else if (res == 200) {
            proceed = true;
            this.setState({
              updateTripData: response,
              loading: false,
            })
            this.setState({ message: this.props.t('UpdateSuccess'), loading: false, successAlert: true, });
            console.log("response", response)
          } else {
            this.setState({ message: this.props.t('errorMessageGeneral'), errorAlert: true, loading: false, });
          }
        }
      })
      .catch(error => {
        this.setState({ message: JSON.stringify(error), loading: false, errorAlert: true, });
      })
  }
  locationPress = (data) => {

    console.log("HERE 2", data)
    let latitude = data.d_latitude
    let longitude = data.d_longitude

    const url = Platform.select({
      ios: `comgooglemaps://?center=${latitude},${longitude}&q=${latitude},${longitude}&zoom=14&views=traffic"`,
      android: `geo://?q=${latitude},${longitude}`,
    });
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          const browser_url = `https://www.google.com/maps/@${latitude},${longitude}`;
          return Linking.openURL(browser_url);
        }
      })
      .catch((e) => {
        console.log("found error", e)
        if (Platform.OS === 'ios') {
          Linking.openURL(
            `maps://?q=${latitude},${longitude}`,
          );
        }
      });
  };

  render() {
    const { loading, data, selectedLocation } = this.state
    let params = this.props.route.params || {};
    const { tripData } = this.props.route.params;

    btnBack = () => {
      this.props.navigation.goBack()
    }

    return (
      <NativeBaseProvider>
        <MapView
          showsMyLocationButton={true}
          userInterfaceStyle={'light'}
          mapType="terrain"
          initialRegion={
            selectedLocation === 'none'
              ? {
                latitude: tripData != null && tripData.d_latitude,
                longitude: tripData != null && tripData.d_longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }
              : {
                ...selectedLocation,
                latitudeDelta: 0.03,
                longitudeDelta: 0.03,
              }
          }
          ref={(component) => (this.map = component)}
          style={{
            flex: 1,
            // width,
            // position: 'relative',
            height,
            backgroundColor: '#f23',
          }}
          scrollEnabled={false}
          onRegionChangeComplete={(region) => this.renderCallout(region)}
          showsUserLocation={true}>

          {Platform.OS === 'ios' &&
            (!params.permDisabled || this.state.selectedAddress) ? (
            <MaterialIcons style={{
              left: '50%',
              marginLeft: -20,
              marginTop: -57,
              height: 60,
              width: 60,
              position: 'relative',
              top: '50%',
            }} color={colors.secondary} size={44} name="location-pin"></MaterialIcons>
          ) : undefined}
        </MapView>
        {Platform.OS === 'android' &&
          (!params.permDisabled || this.state.selectedAddress) ? (
          // <MaterialIcons style={{
          //   left: '50%',
          //   marginLeft: -20,
          //   marginTop: -57,
          //   height: 60,
          //   width: 60,
          //   position: 'absolute',
          //   top: '50%',
          // }} color={colors.secondary} size={44} name="location-pin"></MaterialIcons>

          <Image
            style={{
              height: 80, width: 80,
              left: '50%',
              marginLeft: -20,
              marginTop: -57,
              position: 'absolute',
              top: '30%',
            }}
            source={require('../../assets/images/pin.png')} />

        )
          : undefined}

        <View style={{
          flexDirection: 'row', justifyContent: 'space-between', position: 'absolute',
          marginVertical: 80, marginHorizontal: 20, backgroundColor: colors.white, borderRadius: 10
        }}>
          <VStack space={4} alignItems="center">
            <IconButton onPress={() => btnBack()} size="md" borderColor={colors.primary} borderRadius={10} variant="outline" _icon={{
              as: MaterialIcons,
              name: "chevron-left",
              color: colors.black,
              size: 22
            }} />
          </VStack>
        </View>
        <View style={styles.tripListItemContainer}>
          {tripData.status == "PICKEDUP" &&
            <View style={{ justifyContent: 'space-between', flexDirection: 'row', }}>
              <Text style={{
                marginVertical: 10, marginHorizontal: 5,
                flexShrink: 1,
                alignSelf: 'center'
              }} fontSize={normalize(12)} fontFamily={helpers.getFontBold()}>{this.props.t('theTripHasBeen')}</Text>
              <Button
                onPress={() => this.locationPress(tripData)}
                // disabled={type !== "uocomingTrip"}
                style={styles.drbButton}
                size="sm"
                _text={{
                  color: colors.white,
                  fontSize: normalize(12), fontWeight: 'bold',
                }}>
                {/* {this.props.t('viewTripLocation')} */}
                {tripData.status == "PICKEDUP" ? this.props.t('dropoffLocation') : this.props.t('clientLocation') }
              </Button>
            </View>
          }
          {tripData.status != "PICKEDUP" &&
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', }}>
                <View style={styles.iconBackgroundRound}>
                  <Fontisto color={colors.primary} size={16} style={{ alignSelf: 'center' }}
                    name={tripData.gender == "MALE" ? "mars" : 'venus'}></Fontisto>
                </View>
                {tripData.user && <View style={{ justifyContent: 'center', marginHorizontal: 5, flexWrap: 'wrap' }}>
                  <Text>{tripData.user.first_name} {tripData.user.last_name}</Text>
                  <Text bold>{tripData.user.mobile}</Text>
                </View>}
              </View>
              <HStack space={4} alignItems="center">
                <IconButton onPress={() => {
                  Linking.openURL(`tel:${tripData.user.mobile}`)
                }} size="md" backgroundColor={colors.primary} borderRadius={10} variant="solid" _icon={{
                  as: MaterialIcons,
                  name: "phone",
                  color: colors.white,
                  size: 22
                }} />
                <IconButton onPress={() => Linking.openURL(`mailto:${tripData.user.email}`)}
                  size="md" backgroundColor={colors.primary} borderRadius={10} variant="solid" _icon={{
                    as: MaterialIcons,
                    name: "email",
                    color: colors.white,
                    size: 22
                  }} />
              </HStack>
            </View>}

          <Text color={colors.primary}>{tripData.date}</Text>

          {tripData.status != "PICKEDUP" && <View style={{ marginTop: 16, flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Text bold fontSize={normalize(16)}>{tripData.out_leave}</Text>
              <Text color={colors.grey2} fontSize={normalize(10)}>{tripData.s_address}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.durationBox}>
                <Text textAlign={'center'} color={colors.grey2}>{tripData.out_leave_hours}</Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text bold fontSize={normalize(16)}>{tripData.adjusted_out_leave}</Text>
              <Text color={colors.grey2} fontSize={normalize(10)} >{tripData.d_address}</Text>
            </View>
          </View>}
          {tripData.service_required == "outstation" && tripData.status != "PICKEDUP" &&
            <View style={{ marginTop: 16, flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <Text bold fontSize={normalize(16)}>{tripData.out_return}</Text>
                <Text color={colors.grey2} fontSize={normalize(10)}>{tripData.d_address}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.durationBox}>
                  <Text textAlign={'center'} color={colors.grey2}>{tripData.out_return_hours}</Text>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text bold fontSize={normalize(16)}>{tripData.adjusted_out_return}</Text>
                <Text color={colors.grey2} fontSize={normalize(10)} >{tripData.s_address}</Text>
              </View>
            </View>}
          <View style={{ marginTop: 16, flexDirection: 'row' }}>
            <View style={{ flexDirection: 'row', flex: 2 }}>
              <View style={styles.smallTagFilled}>
                <Text>{tripData.assigned_nurse}</Text>
              </View>
              <View style={styles.smallTag}>
                <Text>{tripData.service_required == "outstation" ? this.props.t('roundTrip') : this.props.t('oneTrip')}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
              {tripData.paid == 1 && <View style={styles.smallTagFilledGreen}>
                <Text color={colors.white}>{this.props.t('paid')}</Text>
              </View>}
              <View style={styles.smallTagBlackBorder}>
                <Text>{tripData.payment_mode}</Text>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 16 }}>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <View style={{ flexDirection: 'row', marginHorizontal: 10, alignItems: 'center' }}>
                <MaterialCommunityIcons color={colors.primary} size={16} style={{ alignSelf: 'center', marginHorizontal: 5 }} name={'chart-timeline-variant'}></MaterialCommunityIcons>
                <Text bold >{tripData.distance} km</Text>
              </View>
              <View style={{ flexDirection: 'row', marginHorizontal: 10, alignItems: 'center' }}>
                <Icon color={colors.primary} size={16} style={{ alignSelf: 'center', marginHorizontal: 5 }} name={'clockcircleo'}></Icon>
                <Text bold >{tripData.travel_time}</Text>
              </View>
            </View>
            {tripData.status != "PICKEDUP" && <Text fontSize={normalize(16)} bold >{tripData.amount} {this.props.t('sar')}</Text>}
          </View>
          <View style={{ marginTop: 10 }}>
            <Button
              onPress={() => {
                this.updateTripPressed();
                // this.updateTrip(tripData.id)
              }}
              disabled={this.state.loading}
              isLoading={this.state.loading}
              style={styles.drbButton}
              size="md"
              _text={{
                color: colors.white,
                fontSize: normalize(12), fontWeight: 'bold',
              }}
            >
              {tripData.status == "PICKEDUP" ? this.props.t('completeTheTrip') : this.props.t('startNavigation')}
            </Button>
            {tripData.status != "PICKEDUP" &&
              <TouchableOpacity onPress={() => {
                this.props.navigation.navigate('Complaint', { tripData: tripData })
              }} style={{ padding: 10 }}>
                <Text style={{ textAlign: 'center', color: colors.red }}>{this.props.t('complaint')}</Text>
              </TouchableOpacity>}
          </View>
        </View>
        <AlertDialog isOpen={this.state.successAlert}>
          <AlertDialog.Content style={{ borderRadius: 10, padding: 10, backgroundColor: colors.white }}>
            <AlertDialog.Body style={{ backgroundColor: colors.white, }} >
              <Text style={{
                fontSize: normalize(12),
                lineHeight: 30,
                textAlign: 'center', fontFamily: helpers.getFont()
              }}>{this.state.message}</Text>
            </AlertDialog.Body >
            <AlertDialog.Footer style={{ borderTopColor: colors.white, backgroundColor: colors.white }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                <Button
                  style={{ flex: 1, backgroundColor: colors.primary }}
                  onPress={() => {
                    this.setState({ successAlert: false })

                    if (tripData.status != 'PICKEDUP') {
                      this.locationPress(tripData)
                      this.props.navigation.goBack();
                    } else {
                      if (this.props.route.params != null) {
                        this.props.route.params.clickedYes(true);
                      }
                      this.props.navigation.goBack();
                    }
                  }
                  }
                  _text={{ fontSize: normalize(12), fontFamily: helpers.getFont() }}>
                  {this.props.t("close")}
                </Button>
              </View>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
        <AlertDialog isOpen={this.state.errorAlert}>
          <AlertDialog.Content style={{ borderRadius: 10, padding: 10, backgroundColor: colors.white }}>
            <AlertDialog.Body style={{ backgroundColor: colors.white, }} >
              <Text style={{
                fontSize: normalize(12),
                lineHeight: 30,
                textAlign: 'center', fontFamily: helpers.getFont()
              }}>{this.state.message}</Text>
            </AlertDialog.Body >
            <AlertDialog.Footer style={{ borderTopColor: colors.white, backgroundColor: colors.white }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                <Button
                  style={{ flex: 1, backgroundColor: colors.secondary }}
                  onPress={() => this.setState({ errorAlert: false })}
                  _text={{ fontSize: normalize(12), fontFamily: helpers.getFont() }}>
                  {this.props.t("close")}
                </Button>
              </View>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </NativeBaseProvider >
    );
  }
}
export default withTranslation()(Trip);