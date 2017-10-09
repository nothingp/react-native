import React, { Component } from 'react';
import moment from 'moment';
import {
    Text,
    View,
    StyleSheet,
    PixelRatio,
    ScrollView,
    TextInput,
    Navigator,
    StatusBar
} from 'react-native';

import {
    Flex,
    WhiteSpace,
    Toast,
    WingBlank,
    Icon,
    Grid,
    Button,
    List,
    NavBar,
    InputItem,
    Picker,
    TextareaItem,
    DatePicker
} from 'antd-mobile';
import { inject, observer } from 'mobx-react/native';
import { createForm } from 'rc-form';
import { Navigation } from 'react-native-navigation';
import navigator from '../../decorators/navigator';
import ApprovingButton from './approvingButton';
import ApprovingHistory from './approvingHistory';

import { renderNameItem, renderHeadIconItem, renderRemark } from './common/index';

const Item = List.Item;
const Brief = Item.Brief;

@navigator
@inject('User', 'Common', 'True')
@observer
class Index extends Component {

    render() {
        let { True, navigator } = this.props;
        const { addressDetailData } = True;

        const {
            name,
            con_address,
            old_con_address,
            old_reg_address,
            reg_address,
            post_code,
            old_post_code,
            remark,
            message,
            comments,
            is_last_approve,
            activeKey,
            img
        } = addressDetailData || {};

        return (
            <ScrollView>
                <List>
                    {
                        renderHeadIconItem(img, name, message)
                    }

                    {
                        renderNameItem(reg_address, old_reg_address, '户籍地')
                    }

                    {
                        renderNameItem(con_address, old_con_address, '联系地址')
                    }

                    {
                        post_code &&
                        renderNameItem(post_code, old_post_code, '邮编')
                    }

                    {
                        remark && renderRemark(remark)
                    }

                    {
                        activeKey == 'PE' &&
                        <ApprovingButton navigator={navigator} is_last_approve={is_last_approve}></ApprovingButton>
                    }

                    {
                        comments && comments.length>0 && <ApprovingHistory comments={comments}></ApprovingHistory>
                    }

                </List>
            </ScrollView>

        )
    }
}

export default createForm()(Index);