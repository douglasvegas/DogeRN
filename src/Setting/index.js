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
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
let ImagePicker = require('react-native-image-picker');
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
export default class Setting extends Component {
    constructor(props){
        super(props)
        this.state = {
            user: {
                userNickname :'sun',
                time: 0,
            },
            avatar: ''
        }
    }

    componentDidMount() {
        var user = this.state.user;
        user.time++;
        var userData = JSON.stringify(user);
        var that = this;
        AsyncStorage.setItem('user',userData)
            .then(data => {
                console.log(data)
                console.log('save ok')
                that.setState({
                    user: user
                })
            }).catch(err => {
                console.log(err)
            })
        this.multiGet()
    }

    getItem() {
        AsyncStorage.getItem('user')
            .then(data => {
                console.log(data);
                var data = JSON.parse(data)
                console.log(data)
                console.log('save ok')
            }).catch(err => {
                console.log(err)
            })
    }

    removeItem (key) {
        AsyncStorage.removeItem(key)
            .then(data => {
                console.log(data)
            })
            .catch(err=>{
                console.log(err)
            })
    }
    multiGet() {
        console.log(this.state.newArr)
        AsyncStorage.multiGet(['item1','item2','item3'])
            .then(data => {
                data.map((v,i) => {
                    console.log(v[0] + ' : ' + v[1])
                })
                console.log(data)
            })
            .catch(err => {
                console.log(err)
            })
    }
    multiSet() {
        var data = [['item1','12'],['item2','23'],['item3','34']];
        AsyncStorage.multiSet(data)
            .then((resData) => {
                this.setState({
                    newArr: data
                })
                console.log(resData)
            }).catch(err => {
                console.log(err)
            })
    }
    multiRemove() {
        AsyncStorage.multiRemove(['item1','item2','item3'])
            .then(data => {
                console.log(data)
            })
            .catch(err => {
                console.log(err)
            })
    }
    handlePress() {
        var user = this.state.user;
        user.time++;
        var userData = JSON.stringify(user);
        var that = this;
        AsyncStorage.setItem('user',userData)
            .catch(err => {
                console.log(err)
            })
            .then(data => {
                console.log(data)
                console.log('save ok');
                that.setState({
                    user: user
                })
            })

    }
    handleImgUpload() {
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
                this.setState({
                    avatar: source
                });
            }
        });
    }
    render () {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View>
                        <Text>

                        </Text>
                    </View>
                    <View style={styles.headerTextWrap}>
                        <Text style={styles.headerText}>
                            个人主页
                        </Text>
                    </View>
                    <View>
                        <Text>

                        </Text>
                    </View>
                </View>

                <View style={styles.avatarWrap}>
                    {!this.state.avatar
                        ?
                        <TouchableOpacity
                            onPress={this.handleImgUpload.bind(this)}
                        >
                            <View style={styles.uploadWrap}>
                                <Icon
                                    name = "ios-cloud-upload"
                                    size = {60}
                                    color = "#000"
                                />
                                <Text>
                                    请上传头像
                                </Text>
                            </View>
                        </TouchableOpacity>
                        :
                        <Image
                            resizeMode = 'cover'
                            source = {{uri: this.state.avatar}}
                            style = {styles.avatarCover}
                        >
                            <TouchableOpacity
                                onPress={this.handleImgUpload.bind(this)}
                            >
                                <Image
                                    source = {{uri: this.state.avatar}}
                                    style = {styles.avatarLittle}
                                />
                                <Text style={styles.avatarText}>
                                    点击换头像
                                </Text>
                            </TouchableOpacity>
                        </Image>

                    }


                </View>
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
    }


})