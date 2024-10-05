import React, { Component } from "react";
import {
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TextInput,
  I18nManager,
  Image, Dimensions
} from 'react-native';
import {
  Text, NativeBaseProvider, Button, Link,
} from 'native-base'
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import deviceStorage from "../../api/deviceStorage";
import styles from './styles';
import Icon from 'react-native-vector-icons/AntDesign';
// import IconFeather from 'react-native-vector-icons/Feather';
import Feather from 'react-native-vector-icons/Feather';
import { withTranslation } from 'react-i18next';
import { colors } from "../../config/styles";
import { normalize } from '../../utils/index'
import { t } from "i18next";
import { helpers } from '../../utils';
import { ScrollView } from "react-native-gesture-handler";
import { environment, services } from "../../api/api";
let width = Dimensions.get("window").width;
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import i18next from '../../../languages/i18n';

class SignIn extends Component {

  constructor() {
    super();
    this.state = {
      mobile: '591294838',
      country_code: "+966",
      password: '123456',
      // device_token: 'mEdNwissQIfwEaaPs67ejizJzaZTntDK8UqIDwfP2TxQvyk_mS0Q5iL9r8',
      device_type: Platform.OS,
      device_id: "",
      message: '',
      loading: false,
      data: null,
      fcmToken: ''
    }
  }

  componentDidMount() {
    try {
      if (Platform.OS == 'android') {
        DeviceInfo.getAndroidId().then((androidId) => {
          // androidId here
          this.setState({
            device_id: androidId
          })
        });
      } else {
        DeviceInfo.getUniqueId().then((uniqueId) => {
          this.setState({
            device_id: uniqueId
          })
          console.log("deviceId => ", uniqueId)
        });
      }
    } catch (error) {
      console.log("Error getting device ID", error)
    }

    this.getToken()
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log("saved_fcmToken OTP", fcmToken)

    if (!fcmToken) {
      fcmToken = await messaging().getToken();
      console.log("fcmToken OTP", fcmToken)
      if (fcmToken) {
        this.setState({
          fcmToken: fcmToken
        })
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    } else {
      this.setState({
        fcmToken: fcmToken
      })
    }

    //Update FCBTOKEN here




  }

  render() {
    btnBack = () => {
      if (this.props.route.params != null) {
        this.props.route.params.onGoBack();
      }
      this.props.navigation.goBack()
    }
    navigatetoHome = () => {
      // this.props.navigation.navigate('Home', {
      //   data: this.state.data
      // })

      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: 'Home', params:{
              data: this.state.data
            } },
          ],
        })
      );
    }

    loginPressed = () => {
      this.setState({message:''})
      if (this.state.mobile && this.state.mobile.length == 9 && this.state.mobile.startsWith("5")) {
        if (this.state.password) {
          //Call Server
          login()
        } else {
          this.setState({ message: this.props.t('pleaseEnterPassword') })
        }
      } else { this.setState({ message: this.props.t('notValidMobileNumber') }) }
    }

    login = () => {
      this.setState({ loading: true, message: '' });
      let data = {
        method: 'POST',
        body: JSON.stringify({
          mobile: this.state.mobile,
          country_code: this.state.country_code,
          password: this.state.password,
          device_token: this.state.fcmToken,
          device_type: this.state.device_type,
          device_id: this.state.device_id,
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }
      console.log("Data => ",data)
      var proceed = false;
      fetch(environment.getEnvironment + services.login, data)
        .then((response) => {
          const statusCode = response.status;
          const data = response.json();
          return Promise.all([statusCode, data]);
        })
        .then(([res, response]) => {
          console.log("res => ",res +" + "+response.error)
          if (response.error) {
            this.setState({ message: response.message, loading: false, })
          } else {
            if (res == 401) {
              //Show Dialog then sign out user
              this.setState({ message: this.props.t('unAuthorized'), loading: false, });
            } else if (res == 200) {
              
              proceed = true;
              this.setState({
                data: response,
                loading: false,
              }, () => {
                deviceStorage.saveItem("isLoggedIn", "true")
                deviceStorage.saveItem("profileData", JSON.stringify(this.state.data))
                deviceStorage.saveItem('token', this.state.data.access_token)
                navigatetoHome()
            })
            } else {
              this.setState({ message: this.props.t('errorMessageGeneral'), loading: false, });
            }
          }
        })
        .catch(error => {
          this.setState({ message: error, loading: false, });
        })
    }
    return (
      <NativeBaseProvider>
        <SafeAreaView style={styles.safeArea} >
          <StatusBar
            {
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
            <ScrollView>


              <View style={{ flex: 1 }}>
                <Image
                  style={styles.mainImage}
                  source={require('../../assets/images/main.png')} />
                <View style={styles.borderedBox}>
                  <Text style={{ marginBottom: 20 }} color={colors.black} fontSize={normalize(16)} >{this.props.t('login')}</Text>
                  {!!this.state.message && (
                  <Text style={styles.errorText}>{this.state.message}</Text>
                )}
                  <View style={styles.borderedInput}>
                    <View style={styles.iconBackgroundRound}>
                      <Icon color={colors.primary} size={16} style={{ alignSelf: 'center' }} name={'mobile1'}></Icon>
                    </View>
                    <View style={{ alignSelf: 'center' }}>
                      <Text color={colors.primary} fontSize={normalize(12)} >{this.props.t('mobileNumber')}</Text>
                      <TextInput
                        editable={!this.state.loading}
                        maxLength={9}
                        keyboardType="phone-pad"
                        style={{ textAlign: 'left' }}
                        color={colors.black}
                        fontSize={normalize(12)}
                        placeholder={this.props.t('enterYourphoneNumber')}
                        placeholderTextColor={colors.grey2}
                        onChangeText={(mobile) => this.setState({ mobile: mobile, })}
                        value={this.state.mobile}
                      />
                    </View>
                  </View>
                  <View style={styles.borderedInput}>
                    <View style={styles.iconBackgroundRound}>
                      <Feather color={colors.primary} size={16} style={{ alignSelf: 'center' }} name={'circle'}></Feather>
                    </View>
                    <View style={{ alignSelf: 'center' }}>
                      <Text color={colors.primary} fontSize={normalize(12)} >{this.props.t('password')}</Text>
                      <TextInput
                        editable={!this.state.loading}
                        style={{ textAlign: 'left' }}
                        // maxLength={4}
                        // keyboardType="phone-pad"
                        secureTextEntry={true}
                        color={colors.black}
                        fontSize={normalize(12)}
                        placeholder={this.props.t('pleaseEnterPassword')}
                        placeholderTextColor={colors.grey2}
                      onChangeText={(password) => this.setState({ password: password, })}
                      value={this.state.password}
                      />
                    </View>
                  </View>
                  <Button
                    onPress={() => {
                      loginPressed()
                    }}
                    disabled={this.state.loading}
                    isLoading={this.state.loading}
                    style={styles.drbButton}
                    size="md"
                    _text={{
                      color: colors.white,
                      fontSize: normalize(12), fontWeight: 'bold',
                    }}
                    endIcon={<Icon as={Icon} name={i18next.language == 'ar' ? 'arrowleft' : 'arrowright'} color={colors.white} size={18} />}
                  >
                    {this.props.t('login')}
                  </Button>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </NativeBaseProvider >
    );
  }
}
export default withTranslation()(SignIn);