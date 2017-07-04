/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    TabBarIOS,
    AsyncStorage
} from 'react-native';

const Icon = require('react-native-vector-icons/Ionicons');
import { StackNavigator } from 'react-navigation'
import List from './src/List/index';
import Detail from './src/List/Detail';
import Publish from './src/Publish/index';
import Setting from './src/Setting/index';
import Login from './src/Setting/Login';

List.navigationOptions = ({ navigation }) => ({
    title: '社区列表',
    headerTintColor: '#333333',
    headerStyle: {
        backgroundColor:'#ffcd32'
    }
});
Detail.navigationOptions = ({ navigation }) => ({
    title: '详情',
    headerTintColor: '#333333',
    headerBackTitle: null,
    headerStyle: {
        backgroundColor:'#ffcd32'
    }
})

const Navigator = StackNavigator(
    {
        List: {
            screen: List
        },
        Detail: {
            screen: Detail
        }
    },
    {
        initialRouteName: 'List',
        headerMode: 'float',
        mode: 'card'
    }
)

export default class Doge extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'Setting',
            noLogin: true
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('authToken')
            .then((result)=>{
                console.log(result)
                if (!result) {
                    this.setState({
                        noLogin: true
                    })
                } else {
                    this.setState({
                        noLogin: false
                    })
                }
            })
            .catch(err => {
                console.log(err)
                this.setState({
                    noLogin: true
                })
            })
    }
    handleLog (flag) {
        this.setState({
            noLogin: !flag
        })
    }
    render() {
        if(this.state.noLogin) {
            return <Login handleLog={this.handleLog.bind(this)}/>
        }
        return (
            <TabBarIOS
                barTintColor="#222222"
                tintColor="#ffcd32"
                style={styles.container}
            >
              <Icon.TabBarItem
                  title="主页"
                  iconName="ios-videocam-outline"
                  selectedIconName="ios-videocam"
                  selected = {this.state.selectedTab === 'CreateList'}
                  onPress={() => {
                      this.setState({
                          selectedTab: 'CreateList'
                      })
                  }}
              >
                <Navigator />
              </Icon.TabBarItem>
              <Icon.TabBarItem
                  title="发布"
                  iconName="ios-add-circle-outline"
                  selectedIconName="ios-add-circle"
                  selected = {this.state.selectedTab === 'Creation'}
                  onPress={() => {
                      this.setState({
                          selectedTab: 'Creation'
                      });
                  }}
              >
                <Publish />
              </Icon.TabBarItem>
              <Icon.TabBarItem
                  title="个人中心"
                  iconName="ios-person-outline"
                  selectedIconName="ios-person"
                  badge="2"
                  selected = {this.state.selectedTab === 'Setting'}
                  onPress={() => {
                      this.setState({
                          selectedTab: 'Setting'
                      })
                  }}
              >
                <Setting/>
              </Icon.TabBarItem>
            </TabBarIOS>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#222222',
    }
});

AppRegistry.registerComponent('Doge', () => Doge);
