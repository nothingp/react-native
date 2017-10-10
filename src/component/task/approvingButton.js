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
    Accordion,
    WhiteSpace,
    Toast,
    WingBlank,
    Icon,
    Tabs,
    Grid,
    Button,
    List,
    NavBar,
    InputItem,
    Picker,
    Badge,
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
const TabPane = Tabs.TabPane;

@navigator
@inject('User', 'Common', 'True')
@observer
class Index extends Component {
    onSubmit = (status) => {
        const { form, True, navigator } = this.props;
        const { selectTask } = True;

        form.validateFields(async (err, values) => {
            console.log('err', err, values);

            if (!err) {//将对应的时间进行格式化
                const {
                    remark,
                    approver_id
                } = values;
                Toast.loading('loading');
                await True.taskSubmitApiAction(
                    status, selectTask.func_id, selectTask.func_dtl, selectTask.key,
                    remark, approver_id && approver_id[0],
                    () => {
                        navigator.pop({
                            animated: false
                        });
                    });

            }
        });
    }

    render() {
        let { True, form, is_last_approve } = this.props;
        const { getFieldProps } = form;
        const { selectTaskApprovers } = True;
        return (
            <List renderHeader={() => ''}>
                {
                    is_last_approve != 1 &&
                    <Picker data={selectTaskApprovers} cols={1}
                            {
                                ...getFieldProps(
                                    'approver_id',
                                    {
                                        initialValue: [selectTaskApprovers.length ? selectTaskApprovers[0].value : ''],
                                        rules: [{ required: true }],
                                    }
                                )
                            }>
                        <List.Item arrow="horizontal">审批人：</List.Item>
                    </Picker>
                }

                {/*<Accordion defaultActiveKey="0" onChange={this.onChange}>*/}
                    {/*<Accordion.Panel*/}
                        {/*header='审批人: '>*/}
                        {/*<List>*/}
                            {/*{*/}
                                {/*selectTaskApprovers && selectTaskApprovers.map((v, i) => {*/}
                                    {/*return (*/}
                                        {/*<List.Item onClick={this.selectItem}>{v.label}</List.Item>*/}
                                    {/*)*/}
                                {/*})*/}
                            {/*}*/}
                            {/*<List.Item onClick={this.selectItem}>{'其他审批人'}</List.Item>*/}
                        {/*</List>*/}
                    {/*</Accordion.Panel>*/}
                {/*</Accordion>*/}

                {/*<Tabs defaultActiveKey="approver">*/}
                    {/*<TabPane tab={'审批人'} key="approver">*/}
                        {/*<List.Item arrow="empty">*/}
                            {/*{selectTaskApprovers.length ? selectTaskApprovers[0].label : ''}*/}
                        {/*</List.Item>*/}
                    {/*</TabPane>*/}
                    {/*<TabPane tab={'其他审批人'} key="otherApprover">*/}
                        {/*{*/}
                            {/*selectTaskApprovers && selectTaskApprovers.filter((v, i) => i != 0).map((v, i) => {*/}
                                {/*return (*/}
                                    {/*<List.Item key={i} arrow="empty" onClick={this.selectItem}>*/}
                                        {/*{v.label}*/}
                                    {/*</List.Item>*/}
                                {/*)*/}
                            {/*})*/}
                        {/*}*/}
                    {/*</TabPane>*/}
                {/*</Tabs>*/}

                <TextareaItem
                    {
                        ...getFieldProps('remark', {
                            initialValue: '',
                        })
                    }
                    rows={5}
                    placeholder="备注："
                    count={100}
                >
                </TextareaItem>

                <WhiteSpace/>

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
                <WhiteSpace/>
            </List>
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