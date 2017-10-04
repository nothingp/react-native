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
import navigator from '../../decorators/navigator'

//引入第三方库
import { format } from '../../util/tool';

const Item = List.Item;
const Brief = Item.Brief;

@navigator
@inject('User', 'Common', 'True')
@observer
class Index extends Component {
    constructor(props) {
        super(props);
    }

    onSubmit = () => {
        const { form, True, navigator } = this.props;
        const { status, key } = True.addressDetailData || {};

        form.validateFields(async (err, values) => {
            console.log('err', err, values);

            if (!err) {//将对应的时间进行格式化
                const {
                    remark,
                    approver_id
                } = values;
                Toast.loading('loading');
                await True.taskSubmitApiAction(
                    status,
                    'PP',
                    'AD',
                    key,
                    remark,
                    approver_id && approver_id[0],
                    async () => {
                        await True.taskListAction();
                        navigator.push({
                            screen: 'Task',
                            title: '任务'
                        })
                    });

            }
        });
    }

    componentWillMount() {//请求审核人列表
        let { User, True } = this.props;
        let { addressDetailData } = True;
        let { activeKey } = addressDetailData || {};
        if (activeKey == 'PE') {
            User.getApprover();
        }
    }

    renderIcon = (txt, old_txt) => {
        let same = false;
        let diff = false;
        let add = false;

        if (!old_txt && txt) {
            add = true;
            return (
                <Icon type={'\ue630'} color={'#5ade00'}/>
            )
        }
        else if (old_txt && txt && old_txt != txt) {
            diff = true;
            return (
                <Text onPress={() => {
                    Toast.success('修改前：' + old_txt);
                }}>
                    <Icon type={'\ue631'} color={'#f59700'}/>
                </Text>

            )

        }
        else if (old_txt == txt) {
            same = true;
            return ''
        }
        return ''
    }

    renderNameItem = (txt, old_txt, name) => {
        return (
            <List.Item
                arrow="empty"
                extra={
                    this.renderIcon(txt, old_txt)
                }
            >
                <Text style={styles.title}>
                    {`${name} : ${txt}`}
                </Text>
            </List.Item>
        )
    }

    renderCommentsList = (comments, is_last_approve, activeKey) => {
        if (activeKey == 'PE' && is_last_approve != 1) {
            return;
        }
        return <List renderHeader={() => '审批记录'}>
            {
                comments && comments.map((v, i) => {
                    return (
                        <View key={i}>
                            <WingBlank size="lg">
                                <Flex justify="between">
                                    <Flex.Item>
                                        <Text style={styles.title}>
                                            {`${v.approver} (${v.emp_id})`}
                                        </Text>
                                    </Flex.Item>
                                    <Flex.Item>
                                        {
                                            v.status == 'A' ?
                                                <Text style={{ color: '#5ade00', textAlign: 'right' }}>
                                                    同意
                                                </Text>
                                                :
                                                <Text style={{ color: '#f00', textAlign: 'right' }}>
                                                    不同意
                                                </Text>
                                        }
                                    </Flex.Item>
                                </Flex>

                                <WhiteSpace size="lg"/>

                                <Flex justify="between">
                                    <Flex.Item>
                                        <Text>
                                            {v.comment}
                                        </Text>
                                    </Flex.Item>

                                    <Flex.Item>
                                        <Text style={{ textAlign: 'right' }}>
                                            {v.approve_date && format(v.approve_date, 'yyyy-MM-dd')}
                                        </Text>
                                    </Flex.Item>
                                </Flex>
                                <WhiteSpace size="lg"/>
                            </WingBlank>

                        </View>

                    )
                })
            }
        </List>
    }

    render() {
        let { True, form, User, } = this.props;
        const { getFieldProps } = form;
        const { approverList } = User;
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
                    <List.Item
                        arrow="empty"
                        thumb={
                            img || <Icon type={'\ue6a8'}/>
                        }
                        multipleLine
                    >
                        <Text style={styles.title}>
                            {name}
                        </Text>
                        <Brief style={styles.brief}>{message}</Brief>
                    </List.Item>

                    {
                        this.renderNameItem(reg_address, old_reg_address, '户籍地')
                    }
                    {
                        this.renderNameItem(con_address, old_con_address, '联系地址')
                    }
                    {
                        post_code &&
                        this.renderNameItem(post_code, old_post_code, '邮编')
                    }

                    {
                        activeKey == 'PE' && is_last_approve != 1 &&
                        <Picker data={approverList} cols={1}
                                {
                                    ...getFieldProps(
                                        'approver_id',
                                        {
                                            initialValue: [approverList.length ? approverList[0].value : ''],
                                            rules: [{ required: true }],
                                        }
                                    )
                                }>
                            <List.Item arrow="horizontal">审批人：</List.Item>
                        </Picker>
                    }

                    {
                        this.renderCommentsList(comments, is_last_approve, activeKey)
                    }

                    {
                        activeKey == 'PE' &&
                        <List renderHeader={() => '备注:'}>
                            <TextareaItem
                                {
                                    ...getFieldProps('remark', {
                                        initialValue: remark,
                                    })
                                }
                                rows={5}
                                count={100}
                            />
                        </List>
                    }

                    <WhiteSpace size={'lg'}/>

                    {
                        activeKey == 'PE' &&
                        <WingBlank>
                            <Flex justify="between">
                                <Button style={styles.button} type="primary" onClick={() => {
                                    this.onSubmit('A')
                                }}>
                                    同意
                                </Button>
                                <Button style={styles.button} onClick={() => {
                                    this.onSubmit('R')
                                }}>
                                    不同意
                                </Button>
                            </Flex>
                        </WingBlank>
                    }

                    <WhiteSpace size={'lg'}/>

                </List>
            </ScrollView>

        )
    }
}

const styles = StyleSheet.create({
    button: {
        width: 150,
        height: 40,
        borderRadius: 2
    },
    list: {
        height: 15
    },
    title: {
        height: 30,
        lineHeight: 30,
        width: 150,
        fontSize: 14,
        marginLeft: 10
    },
    brief: {
        height: 18,
        width: 200,
        fontSize: 10,
        marginLeft: 10
    },
});

export default createForm()(Index);