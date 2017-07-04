/**
 * Created by sunxin on 2017/6/8.
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    ListView,
    AlertIOS,
    TouchableHighlight,
    Image,
    Dimensions,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Config from '../../common/Config';
import Request from '../../common/Request';

let Width = Dimensions.get('window').width;

var LoadData = {
    Page: 1,
    total: 0,
}

class RowItem extends Component {
    constructor (props){
        super(props);
        this.state = {
            isUp: false
        }
    }
    _handlePress (rowData) {
        this.props.navigation.navigate('Detail',{ rowData: rowData})
    }
    _handleUp () {
        var up = !this.state.isUp;
        var text = up ? '点赞' : '取消';

        Request.post(Config.Api.base + Config.Api.up, {
            _id: '123123',
            authToken:'123123123',
            up: up
        }).then(data => {
            if (data.success) {
                this.setState({
                    isUp: up
                })
            } else {
                AlertIOS.alert(text + '失败！稍后重试')
            }
        }).catch(err => {
            console.log(err);
            AlertIOS.alert(text + '失败！稍后重试')
        })
    }
    render () {
        var rowData = this.props.rowData;
        return (
            <TouchableHighlight
                onPress={ () => {this._handlePress(rowData)} }
            >
                <View style={styles.item}>
                    <Text style={styles.title}>{rowData._title}</Text>
                    <Image
                        source={{uri:rowData._thumb}}
                        style={styles.thumb}
                    >
                        <Icon
                            name = "ios-play"
                            size = {30}
                            color = "#ffcd32"
                            style={styles.play}
                        />
                    </Image>
                    <View style={styles.footer}>
                        <View style={styles.footerBox}>
                            <Icon
                                name = {this.state.isUp ? 'ios-heart' : 'ios-heart-outline'}
                                size = {28}
                                color = '#ccc'
                                style={this.state.isUp ? styles.up : styles.noUp}
                            />
                            <Text style={styles.boxText}
                                  onPress={this._handleUp.bind(this)}
                            >
                                喜欢
                            </Text>
                        </View>
                        <View style={styles.footerBox}>
                            <Icon
                                name = 'ios-chatboxes-outline'
                                size = {28}
                                color = '#ccc'
                                style={styles.msg}
                            />
                            <Text style={styles.boxText}>
                                评论
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
}

export default class List extends Component {

    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            isRefreshing: false,
            isLoadingMore: false,
            dataSource: ds,
            data: [
                    // {   _id: '89876676',
                    //     _title: '测试数据1',
                    //     _thumb:'https://img1.dongqiudi.com/fastdfs1/M00/82/A2/640x400/-/-/pIYBAFk2OC2AA6tsAADZAAO6l9E062.jpg',
                    //     _video:'https://o6yh618n9.qnssl.com/JFYufcog_9231396941.mp4'
                    // },
                    // {   _id: '12398989',
                    //     _title: '测试数据2',
                    //     _thumb:'https://img1.dongqiudi.com/fastdfs1/M00/82/A2/640x400/-/-/pIYBAFk2OC2AA6tsAADZAAO6l9E062.jpg',
                    //     _video:'https://o6yh618n9.qnssl.com/JFYufcog_9231396941.mp4'
                    // },
                ]
        };
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

        Request.get(Config.Api.base + Config.Api.list,{
            authToken: '123123123',
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
                    setTimeout( () => {
                        _this.setState({
                            data: newData,
                            isLoadingMore: false,
                        })
                    },500)
                }

            }
        }).catch((error) => {
            this.setState({
                isLoadingMore: true
            })
            AlertIOS.alert('获取发生错误')
        })

    }

    _renderRow(rowData) {
        return <RowItem rowData = {rowData} navigation = {this.props.navigation} />
    }
    _isEnd () {
        return LoadData.total === this.state.data.length;
    }
    _loadMore () {
        if (this._isEnd() || this.state.isLoadingMore) {
            return;
        }
        LoadData.Page++;
        console.log('12')
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
    render() {
        return (
            <View style={styles.container}>
                <ListView
                    dataSource={this.state.dataSource.cloneWithRows(this.state.data)}
                    renderRow={this._renderRow.bind(this)}
                    automaticallyAdjustContentInsets={false}
                    showsVerticalScrollIndicator={false}
                    enableEmptySections={true}

                    onEndReachedThreshold={30}
                    onEndReached={this._loadMore.bind(this)}
                    renderFooter={this._renderFooter.bind(this)}

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
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        //backgroundColor:'#ffcd32',
        marginBottom: 50
    },
    item: {
        width: Width,
        marginBottom: 10,
        backgroundColor:'#333333'
    },
    title:{
        padding: 10,
        fontSize: 16,
        color: '#FFF',
        textAlign: 'center'
    },
    thumb: {
        width: Width,
        height: Width * 0.56,
        resizeMode:'cover'
    },
    play: {
        position: 'absolute',
        bottom: 14,
        right: 14,
        width: 46,
        height:46,
        borderRadius: 23,
        paddingTop: 9,
        paddingLeft:18,
        backgroundColor:'transparent',
        borderColor: '#FFF',
        borderWidth: 1
    },
    footer: {
        flexDirection:'row',
        justifyContent: 'space-between',
        backgroundColor:'#eee'
    },
    footerBox: {
        padding: 6,
        flexDirection:'row',
        width: Width / 2,
        justifyContent:'center',
        backgroundColor:'#FFF'
    },
    noUp: {
        fontSize: 22,
        color: '#333'
    },
    up:{
        fontSize: 22,
        color: '#ffcd32'
    },
    msg:{
        fontSize: 22,
        color: '#333'
    },
    boxText: {
        color:'#333',
        paddingLeft:12,
        fontSize: 18,
    },
    header: {
        backgroundColor: '#ffcd32',
        paddingTop: 25,
        paddingBottom: 5,
    },
    headerTitle: {
        color: '#222222',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600',
        fontFamily: 'Arial'
    },
    loadFooter: {
        marginBottom: 10
    },
    loadFooterText: {
        color:'#000000',
        //color: '#ffcd32 hsla(0,0%,100%,.3)',
        textAlign:'center'
    }
})