/**
 * Created by sunxin on 2017/6/10.
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    ListView,
    AlertIOS,
    TouchableHighlight,
    Button,
    Image,
    Dimensions,
    ActivityIndicator,
    TextInput,
    RefreshControl,
    Modal
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import Config from '../../common/Config';
import Request from '../../common/Request';
const Width = Dimensions.get('window').width;
var LoadData = {
    Page: 1,
    total: 0,
}

class RowItem extends Component {
    constructor(props) {
        super(props);

    }

    render () {
        var rowData = this.props.rowData;
        return (
            <TouchableHighlight>
                <View style={styles.replyBox}>
                    <Image
                        style={styles.replyAvatar}
                        source={{uri: rowData.avatar}}
                    />
                    <View style={styles.commentBox}>
                        <Text style={styles.replyName}>
                            {rowData.name}
                        </Text>
                        { (rowData.quote.name && rowData.quote.content) ?
                            <View
                                style={styles.quote}
                            >
                                <Text>{rowData.quote.name}: </Text>
                                <Text>{rowData.quote.content}</Text>
                            </View>
                            : null
                        }

                        <Text style={styles.replyContent}>
                            {rowData.content}
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }

}

export default class Detail extends Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            rate: 1,
            muted: false,
            resizeMode: 'contain',
            repeat: false,
            paused:false,
            isRefreshing: false,
            isLoadingMore: false,
            dataSource: ds,
            data: [],

            modalVisible: false,
            text:''
        }
    }

    componentDidMount() {
        this._fetchData();
    }
    _fetchData () {
        this.setState({
            isLoadingMore: true,
        })
        var mode = 'firstLoad';
        LoadData.Page > 1 ? mode = 'loadMore':null;

        Request.get(Config.Api.base + Config.Api.comments,{
            videoId: 123,
            authToken: '123qwe',
            page: LoadData.Page,
        }).then( data => {
            if (data.success) {
                LoadData.total = data.total;
                if (mode === 'firstLoad') {
                    this.setState({
                        data: data.data,
                        isLoadingMore: false,
                    })
                } else if (mode === 'loadMore') {
                    var preData = this.state.data.slice()
                        ,newData = preData.concat(data.data)
                    var _this = this;
                    _this.setState({
                        data: newData,
                        isLoadingMore: false,
                    })
                }

            }
        }).catch((error) => {
            this.setState({
                isLoadingMore: true
            })
            AlertIOS.alert('获取发生错误')
        })

    }
    _onLoadStart() {

    }

    _onLoad() {

    }

    _onProgress() {

    }

    _onEnd() {

    }

    _onError() {

    }
    _renderRow(rowData) {
        return <RowItem rowData = {rowData} />
    }
    _isEnd () {
        return LoadData.total === this.state.data.length;
    }
    _loadMore () {
        if (this._isEnd() || this.state.isLoadingMore) {
            return;
        }
        LoadData.Page++;
        this._fetchData();

    }
    _renderFooter () {
        if (this._isEnd() && LoadData.total != 0) {
            return (
                <View style={styles.loadFooter}>
                    <Text style={styles.loadFooterText}>
                        没有更多数据了
                    </Text>
                </View>
            )
        }
        if (!this.state.isLoadingMore) {
            return <View style={styles.loadFooter} ></View>
        }
        return (
            <ActivityIndicator
                style={styles.loadFooter}
            />
        )


    }
    _onRefresh () {
        if (this.state.isRefreshing) {
            return;
        }
        LoadData.Page = 1;
        this._fetchData();
    }
    _onFocus(){
        console.log('dian')
        this._handleModal(true);
    }

    _handleModal (flag) {
        this.setState({
            modalVisible: flag
        })
    }
    _renderHeader() {
        return (
        <View style={styles.listHeader}>
            <View style={styles.author}>
                <Image
                    source={{uri: 'https://img1.dongqiudi.com/fastdfs1/M00/82/A2/640x400/-/-/pIYBAFk2OC2AA6tsAADZAAO6l9E062.jpg'}}
                    style={styles.avatar}
                />
                <View
                    style={styles.authorInfo}
                >
                    <Text
                        style={styles.authorName}
                    >
                        伊布拉希莫维奇
                    </Text>
                    <Text
                        style={styles.videoTitle}
                    >
                        伊布拉希莫维奇伊布拉希莫维奇伊布拉希莫维奇伊布拉希莫维奇伊布拉希莫维奇
                    </Text>
                </View>
            </View>
            <View style={styles.InputBox}>
                <View>
                    <TextInput
                        placeholder='评论一下吧...'
                        placeholderTextColor='#ccc'
                        style={styles.InputContent}
                        onFocus = {this._onFocus.bind(this)}
                        editable={true}
                        multiline={true}
                    />
                    <View style={styles.commentArea}>
                        <Text style={styles.commentAreaTitle}>
                            精彩评论
                        </Text>
                    </View>
                </View>
            </View>


        </View>

        )
    }
    _postComment() {
        if (!this.state.text) {
            return AlertIOS.alert('请填写留言再提交！')
        }
        Request.post(Config.Api.base + Config.Api.postComment,{
            authToken: '123123',
            quoteId  : '123909099',
            text     : this.state.text
        }).then(data => {
            if (data.success) {
                var preData = this.state.data.slice();
                var newData = [].concat(data.data).concat(preData);
                this.setState({
                    data: newData,
                    modalVisible: false
                })
            }
        }).catch(err => {
            console.log(err);
        })
    }
    render() {
        let rowData = this.props.navigation.state.params.rowData;
        let _video = rowData._video;
        return (
        <View>
            <View style={styles.videoBox}>
                <Video
                    ref='videoPlayer'
                    source={{uri: _video}}
                    volumn={15}
                    paused={this.state.paused}
                    rate={this.state.rate}
                    muted={this.state.muted}
                    resizeMode={this.state.resizeMode}
                    repeat={this.state.repeat}
                    style={styles.video}
                    onLoadStart={ () => {
                        this._onLoadStart()
                    } }
                    onLoad={ () => {
                        this._onLoad()
                    } }
                    onProgress={() => {
                        this._onProgress()
                    }}
                    onEnd={ () => {
                        this._onEnd()
                    }}
                    onError={() => {
                        this._onError()
                    }}
                />
            </View>
            <ListView
                dataSource={this.state.dataSource.cloneWithRows(this.state.data)}
                renderRow={this._renderRow.bind(this)}
                automaticallyAdjustContentInsets={false}
                showsVerticalScrollIndicator={false}
                enableEmptySections={true}

                onEndReachedThreshold={20}
                onEndReached={this._loadMore.bind(this)}
                renderFooter={this._renderFooter.bind(this)}
                renderHeader={this._renderHeader.bind(this)}
                refreshControl={
                    <RefreshControl
                       refreshing={this.state.isRefreshing}
                       onRefresh={this._onRefresh.bind(this)}
                       tintColor="#222222"
                       title="Loading..."
                       titleColor="#222222"
                    />
                 }
            />
            <View
                style={styles.ModalBox}
            >
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {alert("Modal has been closed.")}}
                    style={{paddingTop: 50}}
                >
                    <View style={styles.ModalWrap}>
                        <TouchableHighlight
                            onPress={() => {this._handleModal(false)}}
                        >
                            <Icon
                                name="ios-arrow-down"
                                size={30}
                                style={{alignSelf:'center'}}
                                onPress={() => {this._handleModal(false)}}
                            />
                        </TouchableHighlight>

                        <TextInput
                            placeholder='评论一下吧...'
                            placeholderTextColor='#ccc'
                            style={styles.InputContent}
                            autoCapitalize="none"
                            multiline={true}
                            onChangeText={(text)=>{this.setState({text})}}
                        />
                        <View style={styles.ButtonBox}>
                            <Button
                                title="提交"
                                color="#000000"
                                onPress={() => {this._postComment()}}
                            />
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    videoBox: {
        width:Width,
        height: Width * 0.56,
        backgroundColor:'#333333'
    },
    video: {
        width: Width,
        height: Width * 0.56,
        backgroundColor:'#333333',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    author: {
        width: Width ,
        flexDirection:'row',
    },
    authorName: {
        marginBottom: 6,
        fontWeight: '500',
        fontSize: 16
    },
    videoTitle: {
        //marginTop: 6
    },
    avatar: {
        width:50,
        height:50,
        borderRadius: 25,
        margin: 10
    },
    authorInfo: {
        flexDirection: 'column',
        width: Width - 70,
        marginTop: 12,
    },
    replyBox: {
        width: Width - 20,
        marginLeft: 10,
        marginRight: 10,
        marginTop:10,
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
    },
    replyAvatar: {
        width: 30,
        height: 30,
        borderRadius:15,
        marginRight:10
    },
    commentBox: {
        width: Width - 70
    },
    replyName: {
        fontSize: 16,
        fontWeight:'200',
        color: '#4169cc',
        fontWeight: '600'
    },
    replyContent: {
        marginTop: 8,
        fontSize: 14,
    },
    quote: {
        flexDirection: 'row',
        backgroundColor:'#ccc',
        marginTop: 8,
        marginBottom: 8,
        paddingTop:5,
        paddingBottom:5,
        paddingLeft: 5,
    },
    loadFooter: {
        marginBottom: 260,
        paddingTop: 12
    },
    loadFooterText: {
        color:'#000000',
        textAlign:'center'
    },
    listHeader : {
        marginTop: 10,
        width: Width
    },
    InputBox: {
        marginTop: 10
    },
    InputContent: {
        width: Width - 20,
        marginLeft: 10,
        color:'#333',
        borderWidth: 1,
        borderColor: '#ddd',
        height: 80,
        fontSize: 16
    },
    commentArea: {
        width: Width,
        borderBottomWidth: 1,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 12,
        paddingBottom: 8,
        borderBottomColor: '#ddd'
    },
    commentAreaTitle: {
        color:'#000',
        fontSize: 16,
        fontWeight: '500'
    },
    ModalBox: {
        width: Width,
        marginTop: 30,

    },
    ModalWrap: {
        //position:'absolute',
        // bottom:0,
        paddingTop:30,
        flex: 1,
        backgroundColor:'#FFF'
    },
    ButtonBox: {
        backgroundColor: '#ffcd32',
        width: Width - 20,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 20,
        borderRadius: 5,
        marginBottom: 29
    }


})