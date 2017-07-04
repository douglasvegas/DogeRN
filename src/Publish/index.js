/**
 * Created by sunxin on 2017/6/8.
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    AlertIOS,
    Text,
    TabBarIOS,
    NavigatorIOS,
    ScrollView,
    TextInput,
    ListView,
    Image,
    AsyncStorage,
    TouchableHighlight
} from 'react-native';

export default class Publish extends Component {
    removeToken () {
        AsyncStorage.removeItem('authToken')
            .then((result) => {
                console.log(result)
            })
            .catch(err => {
                console.log(err)
            })
    }
    render () {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>
                    This is the Creation Page!
                </Text>
                <TouchableHighlight
                    onPress={this.removeToken.bind(this)}
                >
                    <Text style={{color:'#FFF'}}>
                        删除cookie
                    </Text>
                </TouchableHighlight>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    text: {
        color:'#FFF',
        fontSize: 16,
        fontFamily:'Arial'
    }

})