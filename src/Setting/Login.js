/**
 * Created by sunxin on 2017/6/13.
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    AsyncStorage,
    Button,
    TextInput,
    Dimensions,
    AlertIOS,
    TouchableHighlight
} from 'react-native';

const Width = Dimensions.get('window').width;
import Config from '../../common/Config';
import Request from '../../common/Request';
let timer;
export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            buttonTitle: '获取', //重新获取
            passPhone: false,
            canLogin: false,
            counting: false,
            start: '6',
            mobile: '',
            user: {
                userNickname: 'sun',
                time: 0,
            }
        }
    }

    _CheckPhone(phone) {
        if (!(/^1[34578]\d{9}$/.test(phone))) {
            return false;
        }
        return true;
    }

    _VerifyPhone(phone) {
        if (phone.length < 11) {
            this.setState({
                passPhone: false
            })
            return;
        }
        if (phone.length == 11) {
            if (this._CheckPhone(phone)) {
                this.setState({
                    passPhone: true,
                    mobile: phone
                })
            } else {
                this.setState({
                    passPhone: false
                })
            }
        }
    }

    _VerifyCode(code) {
        if (code.length == 4) {
            this.setState({
                canLogin: true,
                code: code
            })
        } else {
            this.setState({
                canLogin: false,
                code: code
            })
        }
    }

    _getCode() {
        Request.post(Config.Api.base + Config.Api.getCode, {
            mobile: this.state.mobile
        }).then(data => {
            if (data.success) {

            } else {
                AlertIOS.alert(data.msg)
            }
        }).catch(err => {
            console.log(err)
            AlertIOS.alert('稍后重试！')
        })
        this.setState({
            buttonTitle: '重新获取',
            counting: true,
            start: '6',
        }, () => {
            this._startCount()
        })
    }

    _startCount() {
        timer = setInterval(() => {
            var startTime = parseInt(this.state.start);
            startTime -= 1;
            this.setState({
                start: startTime + ''
            })
            if (startTime == 0) {
                clearInterval(timer);
                this.setState({
                    counting: false
                })
            }
        }, 1000)
    }

    _toLogin() {
        var handleLog = this.props.handleLog;
        console.log(this.state.mobile)
        console.log(this.state.code)
        Request.post(Config.Api.base + Config.Api.login, {
            mobile: this.state.mobile,
            code: this.state.code
        })
            .then(data => {
                console.log(data)
                if (data.success) {
                    AsyncStorage.setItem('authToken', data.authToken)
                        .then(() => {
                            console.log('写入token成功')
                            handleLog(true);
                        })
                        .catch((err) => {
                            handleLog(false);
                            console.log(err)
                        })
                } else {
                    AlertIOS.alert(data.msg || '检查用户名或密码')
                }
            })
            .catch(err => {
                console.log(err);
                AlertIOS.alert('出现错误，稍后重试')
            })


    }

    render() {
        return (
            <View style={styles.container}>
                <View>
                    <Text
                        style={styles.title}
                    >
                        快速登录
                    </Text>
                    <View style={styles.PhoneBox}>
                        <TextInput
                            placeholder='填写手机号'
                            placeholderTextColor='#9f9c96'
                            selectionColor="#ffcd32"
                            style={styles.PhoneInput}
                            maxLength={11}
                            keyboardType='numeric'
                            multiline={false}
                            onChangeText={(phone) => {
                                this._VerifyPhone(phone)
                            }}
                        />
                    </View>
                    <View style={styles.CodeBox}>
                        <View style={styles.CodeInputBox}>
                            <TextInput
                                placeholder='填写验证码'
                                placeholderTextColor='#9f9c96'
                                selectionColor="#ffcd32"
                                style={styles.CodeInput}
                                multiline={false}
                                autoCapitalize='none'
                                maxLength={11}
                                onChangeText={(code) => {
                                    this._VerifyCode(code)
                                }}
                            />
                        </View>

                        {
                            this.state.counting ?
                                <View style={ styles.CodeButtonBoxTrans }>
                                    <Button
                                        title={this.state.start}
                                        color="#000000"
                                        onPress={() => {
                                        }}
                                        disabled={true}
                                    />
                                </View>
                                :
                                <View style={ this.state.passPhone ? styles.CodeButtonBox : styles.CodeButtonBoxTrans}>
                                    <Button
                                        title={this.state.buttonTitle}
                                        color="#000000"
                                        disabled={!this.state.passPhone}
                                        onPress={() => {
                                            this._getCode()
                                        }}
                                    />
                                </View>
                        }


                    </View>
                    {
                        this.state.canLogin ?
                            <View style={styles.loginBox}>
                                <TouchableHighlight
                                    onPress={() => {
                                        this._toLogin()
                                    }}
                                    underlayColor="#E6B531"
                                >
                                    <Text
                                        style={styles.loginText}
                                    >
                                        登 录
                                    </Text>
                                </TouchableHighlight>
                            </View>
                            :
                            <View style={styles.loginBoxTrans}>
                                <TouchableHighlight
                                    onPress={() => {
                                    }}
                                    underlayColor="#E6B531"
                                >
                                    <Text
                                        style={styles.loginText}
                                    >
                                        登 录
                                    </Text>
                                </TouchableHighlight>
                            </View>

                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30
    },
    title: {
        color: '#000000',
        fontSize: 20,
        fontWeight: '600',
        alignSelf: 'center',
        marginBottom: 20,
        fontFamily: 'Arial'
    },
    PhoneBox: {
        width: Width - 40,
        margin: 20,
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        borderRadius: 5
    },
    PhoneInput: {
        borderBottomWidth: 1,
        borderColor: '#000',
        flex: 1,
        fontSize: 18,
        color: '#000',
        fontWeight: '800'
    },
    CodeBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: Width - 40,
        margin: 20,
    },
    CodeInputBox: {
        flex: 2,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        borderRadius: 5
    },
    CodeInput: {
        flex: 1,
        fontSize: 18,
        color: '#000',
        fontWeight: '800'
    },
    CodeButtonBox: {
        flex: 1,
        backgroundColor: '#ffcd32',
        borderRadius: 5
    },
    CodeButtonBoxTrans: {
        flex: 1,
        backgroundColor: '#ebebeb',
        borderRadius: 5
    },
    loginBox: {
        width: Width - 40,
        margin: 20,
        backgroundColor: '#ffcd32',
        marginTop: 30,
        borderRadius: 5
    },
    loginText: {
        alignSelf: 'center',
        paddingTop: 12,
        paddingBottom: 12,
        fontSize: 18,
        fontWeight: '600'
    },
    loginBoxTrans: {
        width: Width - 40,
        margin: 20,
        backgroundColor: '#c5c5c5',
        marginTop: 30,
        borderRadius: 5
    }

})