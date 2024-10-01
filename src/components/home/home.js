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
  FlatList, TouchableOpacity, RefreshControl, AppState, Linking,
} from 'react-native';
import {
  Text, NativeBaseProvider, Button, Link, VStack, IconButton, Badge, AlertDialog
} from 'native-base'
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from './styles';
import Icon from 'react-native-vector-icons/AntDesign';
// import IconFeather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { withTranslation } from 'react-i18next';
import { colors } from "../../config/styles";
import { normalize } from '../../utils/index'
import { t } from "i18next";
import { helpers } from '../../utils';
import { environment, services } from "../../api/api";
import { PERMISSIONS, check, RESULTS, request } from "react-native-permissions";
import Geolocation from '@react-native-community/geolocation';

let width = Dimensions.get("window").width;

function Filters({ data, selected }) {
  let isSelected = false

  if (selected != null && selected.value == data.value) {
    isSelected = true
  }
  return (
    <View style={isSelected == true ? styles.filterItemSelected : styles.filterItem} >
      <Text style={isSelected == true ? styles.filterItemTextSelected : styles.filterItemText} >{I18nManager.isRTL ? data.textar : data.text}</Text>
    </View>
  )
}

function TripItem({ data, props, type, locationPress }) {
  return (
    <View style={styles.tripListItemContainer}>

      {type == "uocomingTrip" && data.status == "PICKEDUP" && <Text style={{ marginVertical: 3 }} bold>{props.t('currentTrip')}</Text>}
      {type == "uocomingTrip" && data.status !== "PICKEDUP" && <Text style={{ marginVertical: 3 }} bold>{props.t('upcoming')}</Text>}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', }}>
          <View style={styles.iconBackgroundRound}>
            <Fontisto color={colors.primary} size={16} style={{ alignSelf: 'center' }}
              name={data.gender == "MALE" ? "mars" : 'venus'}></Fontisto>
          </View>
          {data.user && <View style={{ justifyContent: 'center', marginHorizontal: 5, flexWrap: 'wrap' }}>
            <Text>{data.user.first_name} {data.user.last_name}</Text>
            <Text bold>{data.user.mobile}</Text>
          </View>}
        </View>
        <Button
          onPress={() => locationPress(data)}
          disabled={type !== "uocomingTrip"}
          style={type !== "uocomingTrip" ? styles.drbButtonDisabled : styles.drbButton}
          size="sm"
          _text={{
            color: colors.white,
            fontSize: normalize(12), fontWeight: 'bold',
          }}>
            {type == "uocomingTrip" && data.status == "PICKEDUP" && props.t('dropoffLocation')}
            {type == "uocomingTrip" && data.status !== "PICKEDUP" && props.t('clientLocation')}
            {type != "uocomingTrip" && props.t('viewTripLocation')}
        </Button>
      </View>
      <Text color={colors.primary}>{data.date}</Text>
      <View style={{ marginTop: 16, flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <Text bold fontSize={normalize(16)}>{data.out_leave}</Text>
          <Text color={colors.grey2} fontSize={normalize(10)}>{data.s_address}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.durationBox}>
            <Text textAlign={'center'} color={colors.grey2}>{data.out_leave_hours}</Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text bold fontSize={normalize(16)}>{data.adjusted_out_leave}</Text>
          <Text color={colors.grey2} fontSize={normalize(10)} >{data.d_address}</Text>
        </View>
      </View>
      {data.service_required == "outstation" &&
        <View style={{ marginTop: 16, flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <Text bold fontSize={normalize(16)}>{data.out_return}</Text>
            <Text color={colors.grey2} fontSize={normalize(10)}>{data.d_address}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.durationBox}>
              <Text textAlign={'center'} color={colors.grey2}>{data.out_return_hours}</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text bold fontSize={normalize(16)}>{data.adjusted_out_return}</Text>
            <Text color={colors.grey2} fontSize={normalize(10)} >{data.s_address}</Text>
          </View>
        </View>}
      <View style={{ marginTop: 16, flexDirection: 'row' }}>
        <View style={{ flexDirection: 'row', flex: 2 }}>
          <View style={styles.smallTagFilled}>
            <Text>{data.assigned_nurse}</Text>
          </View>
          <View style={styles.smallTag}>
            <Text>{data.service_required == "outstation" ? props.t('roundTrip') : props.t('oneTrip')}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
          {data.paid == 1 && <View style={styles.smallTagFilledGreen}>
            <Text color={colors.white}>{props.t('paid')}</Text>
          </View>}
          <View style={styles.smallTagBlackBorder}>
            <Text>{data.payment_mode}</Text>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 16 }}>
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <View style={{ flexDirection: 'row', marginHorizontal: 10, alignItems: 'center' }}>
            <MaterialCommunityIcons color={colors.primary} size={16} style={{ alignSelf: 'center', marginHorizontal: 5 }} name={'chart-timeline-variant'}></MaterialCommunityIcons>
            <Text bold >{data.distance} km</Text>
          </View>
          <View style={{ flexDirection: 'row', marginHorizontal: 10, alignItems: 'center' }}>
            <Icon color={colors.primary} size={16} style={{ alignSelf: 'center', marginHorizontal: 5 }} name={'clockcircleo'}></Icon>
            <Text bold >{data.travel_time}</Text>
          </View>
        </View>
        <Text fontSize={normalize(16)} bold >{data.amount} {props.t('sar')}</Text>
      </View>
    </View>
  );
}

class Home extends Component {

  constructor() {
    super();
    this.state = {
      message: '',
      loading: false,
      data: null,
      recentData: null,
      token: '',
      filters: [
        {
          id: 1,
          value: 'uocomingTrip',
          text: 'Next Trips',
          textar: "الرحلات القادمة"
        },
        {
          id: 2,
          value: 'recentTrip',
          text: 'Recent Trips',
          textar: "الرحلات الحالية"
        },
      ],
      selectedFilter: {
        id: 1,
        value: 'uocomingTrip',
        text: 'Next Trip',
        textar: "الرحلات القادمة"
      },
      tripData: [{
        id: 1
      }, {
        id: 2
      }],
      signOutDialogOpen: false,
      errorAlert: false
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
    // AppState.addEventListener('change', this.handleAppStateChange);
    try {
      const granted = await this.getLocationPermissions();
      if (Platform.OS == 'ios') {
        if (granted) {
          this.getLocationAndOpenMap()
        } else {
          this.getLocationAndOpenMap()
        }
      } else {

        if (granted) {
          this.getLocationAndOpenMap()
        } else {
          console.log("HHHHHEREER")
          this.getLocationAndOpenMap()
        }
      }
    } catch (e) {
      // error reading value
    }

    const token = await AsyncStorage.getItem("token")
    this.setState({
      token: token,
    })

    //Get Package list
    this.fetchUpcomingTrips()
    this.fetchRecentTrips()
  }

  fetchUpcomingTrips = () => {
    this.setState({ loading: true, message: '' });
    let data = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.state.token
      }
    }
    var proceed = false;
    console.log("data", data)
    fetch(environment.getEnvironment + services.upcoming, data)
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
            //Show Dialog then sign out user
            this.setState({ message: '', signOutDialogOpen: true, loading: false, });
          } else if (res == 200) {
            proceed = true;
            this.setState({
              data: [...response.data, ...response.current_trip],
              // currentData : response.current_trip,

              loading: false,
            })
            console.log("response", response)
          } else {
            this.setState({ message: this.props.t('errorMessageGeneral'), errorAlert: true, loading: false, });
          }
        }
      })
      .catch(error => {
        this.setState({ message: error, loading: false, errorAlert: true, });
      })
  }

  fetchRecentTrips = () => {
    this.setState({ loading: true, message: '' });
    let data = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.state.token
      }
    }
    var proceed = false;
    fetch(environment.getEnvironment + services.recent, data)
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
            //Show Dialog then sign out user
            this.setState({ message: '', signOutDialogOpen: true, loading: false, });
          } else if (res == 200) {
            proceed = true;
            this.setState({
              recentData: response,
              loading: false,
            })
          } else {
            this.setState({ message: this.props.t('errorMessageGeneral'), errorAlert: true, loading: false, });
          }
        }
      })
      .catch(error => {
        this.setState({ message: error, loading: false, errorAlert: true, });
      })
  }

  async getLocationPermissions() {
    let status = false
    const granted = await check(
      Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      })
    ).then((result) => {
      // console.log("GRANTED ? ", granted)
      switch (result) {
        case RESULTS.UNAVAILABLE:
          status = false
          // console.log('This feature is not available (on this device / in this context)');
          break;
        case RESULTS.DENIED:
          status = false
          // console.log('The permission has not been requested / is denied but requestable');
          break;
        case RESULTS.LIMITED:
          status = false
          // console.log('The permission is limited: some actions are possible');
          break;
        case RESULTS.GRANTED:
          status = true
          // console.log('The permission is granted');
          break;
        case RESULTS.BLOCKED:
          status = false
          // console.log('The permission is denied and not requestable anymore');
          break;
      }
    });
    // return granted === RESULTS.GRANTED;
    return status
  }

  /**
  * Get user location and navigate to to map screen
  * @return {Promise.<void>}
  */
  getLocationAndOpenMap = async () => {
    const options = { enableHighAccuracy: true, timeout: 2000, maximumAge: 3600000 };
    if (Platform.OS === 'android') {
      options.enableHighAccuracy = false;

      // check if permission granted on Android platform
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      console.log(granted)
      if (!granted) {
        try {
          await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              'title': 'DRRB App required Location permission',
              'message': 'Location services is required to deliver'
            }
          )
        } catch (err) {
          console.log(err)
        }
      }
    } else if (Platform.OS === 'ios') {
      // console.log('PLATFORM is IOS')
      Geolocation.requestAuthorization()
    }

    Geolocation.getCurrentPosition(
      (position) => {
        // console.log(position.coords)
      },
      (error) => {
        // console.log(error)
      },
      options
    );
  };

  onRefresh = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.fetchUpcomingTrips()
      this.fetchRecentTrips()
    }, 0);
  }

  render() {
    const { filters, loading, data, selectedFilter, recentData } = this.state
    btnBack = () => {
      if (this.props.route.params != null) {
        this.props.route.params.onGoBack();
      }
      this.props.navigation.goBack()
    }


    const locationPress = (data) => {

      console.log(data)
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



    const getFooter = () => {
      return <View style={{ marginBottom: 60 }}></View>
    }

    changeActiveTab = (data) => {
      if (data) {
        this.setState({
          selectedFilter: {
            id: 2,
            value: 'recentTrip',
            text: 'Recent Trips',
            textar: "الرحلات الحالية"
          },
        })
      }
    }

    return (
      <NativeBaseProvider>
        <SafeAreaView style={styles.safeArea} >
          <StatusBar {
            ...Platform.select({
              android: {
                barStyle: "dark-content"
              },
              ios: {
                barStyle: "dark-content",
              }
            })}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={styles.container}>
            <View style={{ padding: 16, }}>
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Image
                    style={{ height: 31, width: 118 }}
                    source={require('../../assets/images/drblogo.png')} />
                  <VStack space={4} alignItems="center">
                    <IconButton onPress={() => this.signOutPressed()} size="md" borderColor={colors.primary} borderRadius={10} variant="outline" _icon={{
                      as: MaterialIcons,
                      name: "power-settings-new",
                      color: colors.black,
                      // size: 22
                    }} />
                  </VStack>
                </View>
                <FlatList
                  data={filters}
                  contentContainerStyle={{ justifyContent: 'flex-end', marginTop: 40 }}
                  horizontal
                  renderItem={({ item }) =>
                    <TouchableOpacity onPress={() => {
                      this.setState({ selectedFilter: item }, () => {
                        // this.fetchVisits()
                        this.setState({
                          selectedFilter: item
                        })
                      })
                    }}
                    >
                      <Filters data={item}
                        selected={this.state.selectedFilter}
                      />
                    </TouchableOpacity>
                  }
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  extraData={this.state}
                />
              </View>
              <View style={styles.container}>
                <View style={styles.content}>
                  <FlatList
                    data={selectedFilter.value == "uocomingTrip" ? data : recentData}
                    style={{ marginTop: 20, paddingBottom: 90, }}
                    ListFooterComponent={getFooter}
                    renderItem={({ item }) => <TouchableOpacity
                      disabled={selectedFilter.value != "uocomingTrip"}
                      onPress={() => this.props.navigation.navigate('Trip', { tripData: item, clickedYes: changeActiveTab })}
                      key={item.id}>
                      <TripItem locationPress={() => locationPress(item)} type={selectedFilter.value} props={this.props} data={item}
                      />
                    </TouchableOpacity>}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={() => this.onRefresh()} />}
                    extraData={this.state}
                  />
                </View>
              </View>
            </View>
            <AlertDialog isOpen={this.state.signOutDialogOpen}>
              <AlertDialog.Content style={{ borderRadius: 10, padding: 10, backgroundColor: colors.white }}>
                <AlertDialog.Body style={{ backgroundColor: colors.white }} >
                  <Text style={{
                    fontSize: normalize(12),
                    lineHeight: 30,
                    textAlign: 'center', fontFamily: helpers.getFont()
                  }}>{this.props.t('theSessionIsEnded')}</Text>
                </AlertDialog.Body >
                <AlertDialog.Footer style={{ borderTopColor: colors.white, backgroundColor: colors.white }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                    <Button
                      style={{ flex: 1 }}
                      onPress={() => this.signOutPressed()}
                      colorScheme="danger"
                      _text={{ fontSize: normalize(12), fontFamily: helpers.getFont() }}>
                      {this.props.t("signOut")}
                    </Button>
                  </View>
                </AlertDialog.Footer>
              </AlertDialog.Content>
            </AlertDialog>
            <AlertDialog isOpen={this.state.errorAlert}>
              <AlertDialog.Content style={{ borderRadius: 10, padding: 10, backgroundColor: colors.white }}>
                <AlertDialog.Body style={{ backgroundColor: colors.white }} >
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
          </KeyboardAvoidingView>
        </SafeAreaView>
      </NativeBaseProvider >
    );
  }
}
export default withTranslation()(Home);