import React, { Component } from 'react';
import { observable, action, runInAction, computed, autorun } from 'mobx';
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
import { startLoginScreen } from '../../../screens/index';
import { Flex, WhiteSpace, Icon, Grid, Button, List, Toast, Modal } from 'antd-mobile';
import { inject, observer } from 'mobx-react/native';
import BaseComponent from '../../BaseComponent'
import navigator from '../../../decorators/navigator'
import { format } from '../../../util/tool';

const Item = List.Item;
const Brief = Item.Brief;

@navigator
@inject('User', 'Common', 'Base')
@observer
export default class Index extends BaseComponent {
    // componentWillMount() {
    //     autorun(() => {
    //         if (!this.props.Base.userInfo) {
    //             startLoginScreen();
    //         } else {
    //             this.props.User.alertsList();
    //             Toast.loading('loading');
    //         }
    //     })
    // }

    render() {
        let { data = [], unread_total = 0 } = this.props.User.alertsListData;
        return (
            <ScrollView>
                {
                    data.map((v, i) => {
                        return (
                            <List key={i}>
                                <Item
                                    arrow="horizontal"
                                    extra={v.create_time && format(v.create_time, 'MM-dd')}
                                    thumb={
                                        v.url //|| 'https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png'
                                        || <Icon type={'\ue6ab'}/>
                                    }
                                    multipleLine
                                    onClick={
                                        () => {
                                            this.props.User.alertsDetail(v);
                                            Toast.loading('loading');
                                            this.props.navigator.push({
                                                screen: 'MsgDetail',
                                                title: v.title
                                            })
                                        }
                                    }
                                >
                                    <Text style={styles.title}>
                                        {v.title}
                                    </Text>
                                    <Brief style={styles.brief}>{v.description}</Brief>
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
    title: {
        height: 30,
        lineHeight: 30,
        width: 150,
        fontSize: 14,
        marginLeft: 10
    },
    brief: {
        height: 18,
        width: 150,
        fontSize: 12,
        marginLeft: 10
    },
});

