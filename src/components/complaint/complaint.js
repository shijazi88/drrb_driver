import React, { Component } from "react";
import {
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import {
  Text, NativeBaseProvider, Button, VStack, IconButton, AlertDialog, Radio
} from 'native-base'
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from './styles';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { withTranslation } from 'react-i18next';
import { colors } from "../../config/styles";
import { normalize } from '../../utils/index'
import { helpers } from '../../utils';
import { environment, services } from "../../api/api";

class Complaint extends Component {

  constructor() {
    super();
    this.state = {
      message: '',
      loading: false,
      data: null,
      token: '',
      errorAlert: false,
      selectedLocation: "none",
      complaintListData: null,
      selectedComplaint: null,
      sendRequestData: null,
      successAlert: false
    }
  }

  async componentDidMount() {
    const token = await AsyncStorage.getItem("token")
    this.setState({
      token: token,
    })

    this.fetchComplaints()
  }

  fetchComplaints = () => {
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
    fetch(environment.getEnvironment + services.complaints, data)
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
            this.setState({ message: this.props.t('errorMessageGeneral') ,loading: false, });
          } else if (res == 200) {
            proceed = true;
            this.setState({
              complaintListData: response,
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

  sendRequest = (id) => {
    this.setState({ loading: true, message: '' });
    let data = {
      method: 'POST',
      body: JSON.stringify({
        complaint_id: this.state.selectedComplaint,
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.state.token
      },
    }
    var proceed = false;
    console.log("DATA : ", data)
    fetch(environment.getEnvironment + services.sendRequest + id + "/complaint", data)
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
            this.setState({ message: this.props.t('errorMessageGeneral'), loading: false, });
          } else if (res == 200) {
            proceed = true;
            this.setState({
              sendRequestData: response,
              loading: false,
            })
            this.setState({ message: response.message, loading: false, successAlert: true, });
            console.log("response : ", response)
          } else {
            this.setState({ message: this.props.t('errorMessageGeneral'), errorAlert: true, loading: false, });
          }
        }
      })
      .catch(error => {
        this.setState({ message: error, loading: false, errorAlert: true, });
      })
  }

  render() {
    const { loading, complaintListData, selectedComplaint } = this.state
    let params = this.props.route.params || {};
    const { tripData } = this.props.route.params;

    btnBack = () => {
      this.props.navigation.goBack()
    }

    return (
      <NativeBaseProvider>
        <SafeAreaView style={styles.safeArea} >
          <StatusBar {
            ...Platform.select({
              android: {
                barStyle: "light-content"
              },
              ios: {
                barStyle: "light-content",
              }
            })}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={styles.container}>
            <View style={styles.container}>
              <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                <View>
                  <View style={{
                    flexDirection: 'row',
                    marginTop: 20, marginHorizontal: 20, backgroundColor: colors.white, borderRadius: 10
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
                  <View >
                    <View style={styles.tripListItemContainer}>
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
                      </View>
                      <Text style={{ marginTop: 10 }} color={colors.primary}>{tripData.date}</Text>
                      <View style={{ marginTop: 16, flexDirection: 'row' }}>
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
                      </View>
                      {tripData.service_required == "outstation" &&
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
                          {tripData.paid == 0 && <View style={styles.smallTagFilledGreen}>
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
                        <Text fontSize={normalize(16)} bold >{tripData.amount} {this.props.t('sar')}</Text>
                      </View>
                    </View>

                    <View style={{ marginHorizontal: 20 }}>
                      <Text bold fontSize={normalize(18)}>{this.props.t('whatHappened')}</Text>
                      <Radio.Group name="compalintsGroup"
                        style={{ justifyContent: 'flex-end' }}
                        value={selectedComplaint} onChange={nextValue => {
                          this.setState({ selectedComplaint: nextValue });
                        }}>
                        {complaintListData && complaintListData.map(item => {
                          return (
                            <View key={item.id} style={styles.radioContainer}>
                              <Radio backgroundColor={colors.white} borderColor={colors.primaryLight} colorScheme="green" style={{ justifyContent: 'flex-start', }} value={item.id}>
                                <Text>
                                  {item.name}
                                </Text>
                              </Radio>
                            </View>
                          );
                        })}
                      </Radio.Group>
                      <View style={{ marginTop: 20 }}>
                        <Button
                          onPress={() => {
                            if (selectedComplaint != null) {
                              console.log("selectedComplaint : ", selectedComplaint)
                              this.sendRequest(tripData.id)
                            } else {
                              this.setState({ message: this.props.t('selectComplaint'), errorAlert: true, });
                            }
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
                          {this.props.t('sendRequest')}
                        </Button>
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
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
                        btnBack()
                      }
                      }
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
export default withTranslation()(Complaint);