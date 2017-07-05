/**
 * Created by sunxin on 2017/6/8.
 */

import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    AsyncStorage,
    Dimensions,
    AlertIOS,
    Modal,
    TextInput,
    Button,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
let Progress = require('react-native-progress');
let sha1 = require('sha1');
let ImagePicker = require('react-native-image-picker');

import Config from '../../common/Config';
import Request from '../../common/Request';


let {cloud_name, api_key, api_secret} = Config.CLOUDINARY;
let public_id =  "sample_image";
let uploadURL = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;

let options = {
    title:'请选择',
    cancelButtonTitle:'取消',
    takePhotoButtonTitle:'拍照',
    chooseFromLibraryButtonTitle:'选择相册',
    quality:0.75,
    allowsEditing:true,
    noData:false,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

let Width = Dimensions.get('window').width;
let Height = Dimensions.get('window').height;
export default class Setting extends Component {
    constructor(props){
        super(props)
        this.state = {
            isUploading: false,
            percentComplete: 0,
            modalVisible: false,

            avatar: '',
            gender: 0,
            name  : '',
            profile: ''
        }
    }

    componentDidMount() {

    }

    handleImgUpload() {
        let that = this;
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = 'data:image/jpeg;base64,' + response.data ;

                Request.post(Config.Api.base + Config.Api.signature, {
                    authToken:'123123123',
                }).then(data => {
                    if (data.success) {
                        that._uploadImg(data.signature,source)
                    }
                }).catch(err => {
                    console.log(err);
                })

            }
        });
    }
    _uploadImg (signature,source) {
        let that = this;
        let timestamp = Date.now() + '';
        timestamp = timestamp.substr(0, timestamp.length - 3)
        let signature1 = this._getSig (timestamp);

        let formData = new FormData();
        formData.append('file',source)
        formData.append('api_key',api_key)
        formData.append('timestamp',timestamp)
        formData.append('signature',signature1)
        console.log(formData)
        this.setState({
            isUploading: true,
        })
        let xhr = new XMLHttpRequest();

        if(xhr.upload){
            xhr.upload.addEventListener('progress',function (oEvent) {
                let percentComplete = oEvent.loaded / oEvent.total;
                that.setState({
                    percentComplete
                })
            } )
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                console.log(xhr)
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                    let returnData = JSON.parse(xhr.responseText);

                    that.setState({
                        avatar: returnData.url,
                        isUploading: false
                    }, function () {
                        that._updateInfo();
                    });

                    AsyncStorage.setItem('avatar',returnData.url)
                        .then(() => {
                            console.log('头像存储成功')
                        })
                        .catch((err) => {
                            console.log(err)
                        });

                } else {
                    AlertIOS.alert(JSON.parse(xhr.responseText).error.message);
                    that.setState({
                        isUploading: false
                    })
                }
            }
        }

        xhr.open('POST',uploadURL);

        xhr.send(formData)
    }
    _updateInfo () {
        console.log('updating');
        let that = this;
        Request.post(Config.Api.base + Config.Api.updateInfo, {
            authToken: '123',
            avatar   : '123',
            gender   : 1,
            name     : 'doug',
            profile  : 'qwe',
        }).then( data => {
            if (data.success) {
                AlertIOS.alert('更新成功')
            } else {
                AlertIOS.alert('更新失败')
            }
        }).catch(err => {
            console.log(err)
        })
    }
    _getSig (timestamp) {
        let str = "timestamp=" + timestamp + api_secret;
        console.log(str)
        return sha1(str);
    }
    _edit () {
        this.setState({
            modalVisible: true
        })
    }
    _closeModal () {
        this.setState({
            modalVisible: false
        })
    }
    _makeEdit () {
        console.log(this.state)
        this._updateInfo()
    }
    _changeGender (genderNum) {
        this.setState({
            gender: genderNum
        })
    }
    changeText (key, text) {
        this.setState({
           [key]: text
        })

    }
    _logout() {
        console.log('123')
    }
    render () {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.exit}>
                            退出
                        </Text>
                    </View>
                    <View style={styles.headerTextWrap}>
                        <Text style={styles.headerText}>
                            个人主页
                        </Text>
                    </View>
                    <View>
                        <TouchableOpacity
                            onPress={this._edit.bind(this)}
                        >
                            <Text style={styles.edit}>
                                编辑
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.avatarWrap}>

                    {!this.state.avatar
                        ?
                        <TouchableOpacity
                            onPress={this.handleImgUpload.bind(this)}
                        >
                            <View style={styles.uploadWrap}>
                                { this.state.isUploading ?
                                    <Progress.Pie
                                        borderWidth={2}
                                        borderColor="#000"
                                        progress={this.state.percentComplete}
                                        size={80}
                                        color="#ffcd32"/>
                                    :
                                    <Icon
                                        name = "ios-cloud-upload"
                                        size = {60}
                                        color = "#000"
                                    />

                                }
                                <Text>
                                    { this.state.isUploading
                                        ?
                                    '请上传头像'
                                        :
                                    '正在上传...'
                                    }
                                </Text>
                            </View>
                        </TouchableOpacity>
                        :

                        <Image
                            resizeMode = 'cover'
                            source = {{uri: this.state.avatar}}
                            style = {styles.avatarCover}
                        >
                            { this.state.isUploading
                                ?
                                <Progress.Pie
                                    borderWidth={2}
                                    borderColor="#000"
                                    progress={0.8}
                                    size={80}
                                    color="#ffcd32"/>
                                :
                                <TouchableOpacity
                                    onPress={this.handleImgUpload.bind(this)}
                                >

                                    <Image
                                        source={{uri: this.state.avatar}}
                                        style={styles.avatarLittle}
                                    />
                                    <Text style={styles.avatarText}>
                                        点击换头像
                                    </Text>
                                </TouchableOpacity>
                            }
                        </Image>

                    }
                </View>
                <TouchableOpacity
                    onPress={this._logout.bind(this)}
                >
                    <View style={styles.logoutBtn}>
                        <Text>
                            退出
                        </Text>
                    </View>
                </TouchableOpacity>
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.modalVisible}
                >
                    <View style={styles.modalWrap}>

                        <View style={styles.closeModal}>
                            <TouchableOpacity
                                onPress={this._closeModal.bind(this)}
                            >
                            <Icon
                                name = "ios-close"
                                size = {60}
                                color = "#000"
                            />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.items}>
                            <Text
                                style={styles.itemsTitle}
                            >昵称： </Text>
                            <TextInput
                                placeholder='填写昵称'
                                placeholderTextColor='#9f9c96'
                                selectionColor="#ffcd32"
                                maxLength={11}
                                style={styles.itemsInput}
                                keyboardType='numeric'
                                onChangeText = {(text) => {this.changeText('name',text)}}
                                multiline={false}
                            />
                        </View>
                        <View style={styles.items}>
                            <Text
                                style={styles.itemsTitle}
                            >性别： </Text>
                            <TouchableOpacity
                                onPress={this._changeGender.bind(this, 1)}
                            >
                                <Text
                                    style={[styles.genderBtn, this.state.gender === 1 ? styles.genderChoosed: null]}>
                                    男
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={this._changeGender.bind(this, 0)}
                            >
                                <Text style={[styles.genderBtn, this.state.gender === 0 ? styles.genderChoosed: null]}>
                                    女
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.items}>
                            <Text
                                style={styles.itemsTitle}
                            >资料： </Text>
                            <TextInput
                                placeholder='填写资料'
                                placeholderTextColor='#9f9c96'
                                selectionColor="#ffcd32"
                                maxLength={55}
                                style={styles.itemsInput}
                                keyboardType='numeric'
                                onChangeText = {(text) => {this.changeText('profile',text)}}
                                multiline={true}
                            />
                        </View>
                        <View>
                            <TouchableOpacity
                                onPress={this._makeEdit.bind(this)}
                            >
                                <View style={styles.button}>
                                    <Text style={styles.buttonText}>
                                        确 定
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection: 'column',
        flexWrap:'wrap',
        backgroundColor: '#eee',
    },
    header: {
        backgroundColor:'#ffcd32',
        width:Width,
        height: 65,
        top:0,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    headerTextWrap: {
        flexDirection:'row',
        alignSelf: 'center'
    },
    headerText: {
        fontSize: 16,
        fontWeight: '500',
        paddingTop: 18,
        alignSelf: 'center'
    },
    avatarWrap: {
        width:Width,
        height: 180,
    },
    avatarCover: {
        height: 180,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        justifyContent:'center'
    },
    avatarLittle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#eee',
        alignSelf: 'center',
    },
    avatarText: {
        color: '#FFF',
        fontWeight: '600',
        shadowColor: '#ccc',
        backgroundColor: 'transparent',
    },
    uploadWrap: {
        height: 180,
        justifyContent:'center',
        alignItems: 'center',
        backgroundColor:'#fff'
    },
    exit: {
        left: 20,
        top: 33
    },
    edit : {
        right: 20,
        top: 33
    },
    modalWrap: {
        paddingTop: 20,
        flexDirection: 'column',
        backgroundColor: '#eee',
        height: Height
    },
    closeModal: {
        alignSelf: 'flex-end',
        top: 10,
        right: 10,
    },
    items: {
        flexDirection: 'row',
        width: Width - 20,
        marginLeft: 10,
        marginTop: 15,
        marginBottom: 15,
        height: 30,
    },
    itemsTitle: {
        fontSize: 18,
        fontWeight: '500',
        alignSelf:'center'
    },
    itemsInput: {
        borderBottomWidth: 1,
        borderColor: '#000',
        flex: 1,
        fontSize: 18,
        color: '#000',
        fontWeight: '800'
    },
    button: {
        width: Width - 20,
        marginLeft: 10,
        backgroundColor: '#ffcd32',
        height: 40,
        borderRadius:6,
        justifyContent:'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '500'
    },
    genderBtn: {
        marginRight: 20,
        backgroundColor: '#ccc',
        width: 80,
        height: 30,
        textAlign:'center',
        lineHeight: 30,
        borderRadius: 10,
        fontSize: 16,
        color: '#666'
    },
    genderChoosed: {
        backgroundColor: '#ffcd32',
        color: '#000'
    },
    logoutBtn : {
        margin: 10,
        width: Width - 20,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffcd32',
    }



})