import React, { Component } from 'react';
import { observable, action, runInAction, computed, autorun } from 'mobx';
import moment from 'moment';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Platform,
    PixelRatio,
    ScrollView,
    ListView,
    Image
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import HTMLView from 'react-native-htmlview';

//import JPushModule from 'jpush-react-native';
import { Flex, WhiteSpace, Icon, Grid, Button, List, Toast, Modal, Badge } from 'antd-mobile';
import { inject, observer } from 'mobx-react/native';
import BaseComponent from '../BaseComponent'
import { format } from '../../util/tool';

const Item = List.Item;
const Brief = Item.Brief;

@inject('User', 'Common', 'Base', 'True')
@observer
export default class Index extends BaseComponent {

    static navigationOptions = {
        title: '消息中心',
        tabBarIcon: ({ tintColor }) => (
            <Image
                source={require('../../resource/tabs/message_01.png')}
                style={[{ tintColor: tintColor }]}
            />
        )
    }


    componentWillMount() {
        autorun(() => {
            if (!this.props.Base.userInfo) {
                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Login' })
                    ]
                })
                this.props.navigation.dispatch(resetAction);
            }
        })

        if (this.props.Base.userInfo) {
            this.props.User.alertsList();
        }
    }

    componentWillUnmount() {
        // JPushModule.removeReceiveCustomMsgListener();
        // JPushModule.removeReceiveNotificationListener();
    }

    render() {
        let { User, True, navigation } = this.props;
        let { data = [], unread_total = 0 } = User.alertsListData;
        return (
            <ScrollView style={{ backgroundColor: '#fff' }}>
                {
                    data.map((v, i) => {
                        return (
                            <List key={i}>
                                <Item
                                    arrow="horizontal"
                                    extra={
                                        <Text style={{ fontSize: 13 }}>
                                            {v.create_time && format(v.create_time, 'MM-dd hh:mm')}
                                        </Text>
                                    }
                                    thumb={
                                        <Badge
                                            dot={v.status == '0' ? true : false}>
                                            {
                                                v.url
                                                || <Icon type={'\ue6ab'}/>
                                            }
                                        </Badge>
                                    }
                                    multipleLine
                                    onClick={
                                        () => {
                                            Toast.loading('loading');
                                            User.alertsDetail(v);
                                            if (v.status == '0') {
                                                True.alertsSubmitApiAction(v.alert_tbl_id, User.alertsList);
                                            }
                                            navigation.navigate('MsgDetail');
                                        }
                                    }
                                >
                                    <Text style={styles.titleOnly}>
                                        {v.title}
                                    </Text>
                                    {/*<Brief style={styles.brief}>*/}
                                    {/*<Text>{v.create_time && format(v.create_time, 'hh:mm:ss')}</Text>*/}
                                    {/*</Brief>*/}
                                    {/*<Brief style={styles.brief}>*/}
                                    {/*<HTMLView style={{ width: 100, height: 20 }} value={v.description}/>*/}
                                    {/*</Brief>*/}
                                </Item>
                            </List>
                        )
                    })
                }
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    titleOnly: {
        // height: 50,
        // lineHeight: 50,
        width: 150,
        fontSize: 18,
        marginLeft: 10,
        marginTop: 15,
        marginBottom: 15,
    },
    title: {
        height: 30,
        lineHeight: 30,
        width: 150,
        fontSize: 16,
        marginLeft: 10
    },
    brief: {
        height: 18,
        width: 150,
        fontSize: 12,
        marginLeft: 10
    },
});

