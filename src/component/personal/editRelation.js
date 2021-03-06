/**
 * 编辑联系人
 */

import React, { Component } from 'react';

import {
    Text,
    StyleSheet,
    ScrollView,
    View
} from 'react-native';

import { Flex, WingBlank, WhiteSpace, Toast, Button, List, Picker, TextareaItem } from 'antd-mobile';
import { inject, observer } from 'mobx-react/native';
import { createForm } from 'rc-form';
import TitleButton from './common/relationTitleButton';
import { RequireData } from './common/index';
import { NoticeBarMessage } from './common';
import ApprovingButton from './approvingButton';
import ShowConfirm from '../../component/ShowConfirm';
import TextAreaLike from '../TextAreaLike';
import PickerLike from '../PickerLike';
import InputItem from '../InputItem';

@inject('User', 'Common', 'True')
@observer
class Index extends Component {
    static navigationOptions = ({ navigation }) => {
        const { type } = navigation.state.params;
        if (type && type == 'edit') {
            return {
                title: '编辑联系人',
                headerRight: (
                    <TitleButton navigation={navigation}/>
                ),
            }
        } else {
            return {
                title: '添加联系人',
            }
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            pickerValue: [],
        }
        //保存, 提交联系人信息
        this.onSave = async (str) => {
            const { form, True } = this.props;
            const { selectTask, selectApprover } = True;
            form.validateFields(async (err, values) => {
                const approver_id = selectApprover.value;
                if (!err) {

                    //将对应的时间进行格式化
                    const {
                        relate_type,
                        chinese_name,
                        contact_no,
                        prc_age,
                        prc_work_unit,
                        cont_remark,
                        remark,
                    } = values;

                    //判断是保存还是修改
                    if (relate_type.length == 0) {
                        Toast.info('请选择关系类型');
                        return
                    }
                    if (relate_type == 'E' && contact_no == '') {
                        Toast.info('请填写联系电话');
                        return
                    }
                    if (!approver_id) {
                        Toast.info('请选择审批人');
                        return
                    }
                    const { type } = this.props.navigation.state.params;
                    const successFn = () => {
                        this.props.navigation.goBack()
                    }
                    if (type == 'edit') {
                        //判断是保存还是提交
                        const { relationship_tbl_id, relationship_tbl_approve_id } = this.props.User.selectPerson;

                        const obj = {
                            relationship_tbl_id,
                            relationship_tbl_approve_id,
                            relate_type: relate_type[0],
                            chinese_name,
                            contact_no,
                            prc_age,
                            prc_work_unit,
                            cont_remark,
                            remark,
                            approver_id,
                            is_save: str == 'save' ? '1' : '0',
                        }

                        this.refs.confirm.show(
                            {
                                title: str == 'save' ? '保存' : '提交',
                                massage: str == 'save' ? '您确定保存联系人信息吗？' : '您确定提交联系人信息吗？',
                                okFn: async () => {
                                    this.props.User.saveRelationFn(obj, successFn);
                                },
                            }
                        );
                    } else {
                        const obj = {
                            relate_type: relate_type[0],
                            chinese_name,
                            contact_no,
                            prc_age,
                            prc_work_unit,
                            cont_remark,
                            remark,
                            approver_id,
                            is_save: str == 'save' ? '1' : '0',
                        }

                        this.refs.confirm.show(
                            {
                                title: str == 'save' ? '保存' : '提交',
                                massage: str == 'save' ? '您确定保存联系人信息吗？' : '您确定提交联系人信息吗？',
                                okFn: async () => {
                                    this.props.User.addRelationFn(obj, successFn);
                                },
                            }
                        );
                    }
                }
                else {
                    if (err.relate_type) {
                        Toast.info('请选择关系类型');
                    }
                    else if (err.chinese_name) {
                        Toast.info('请填写联系人名字');
                    }
                }

            });
        }

    }

    componentWillMount() {
        let { True, navigation } = this.props;
        True.selectTask = { function: 'PP', function_dtl: 'EC' };
        //请求审核人列表
        //this.props.User.getApprover();
        //请求联系人关系列表
        this.props.Common.getRelationShip();
        //如果编辑联系人，则请求该联系人的详细信息
        const { type } = this.props.navigation.state.params;

        if (type == 'edit') {
            this.props.User.getSimplePersonInfo();
        }

    }

    render() {
        const { type } = this.props.navigation.state.params;

        const { getFieldProps } = this.props.form;
        const { relationShipList } = this.props.Common;
        const { approverList, selectPerson } = this.props.User;
        let relate_type,
            chinese_name,
            contact_no,
            prc_age,
            prc_work_unit,
            remark,
            cont_remark,
            status = '';
        if (selectPerson && type == 'edit') {
            relate_type = selectPerson.relate_type ? selectPerson.relate_type : '';
            chinese_name = selectPerson.chinese_name ? selectPerson.chinese_name : '';
            contact_no = selectPerson.contact_no ? selectPerson.contact_no : '';
            prc_age = selectPerson.prc_age ? selectPerson.prc_age : '';
            prc_work_unit = selectPerson.prc_work_unit ? selectPerson.prc_work_unit : '';
            remark = selectPerson.remark ? selectPerson.remark : '';
            cont_remark = selectPerson.cont_remark ? selectPerson.cont_remark : '';
            status = selectPerson.status;
        }

        let ifEdit = false; //是否允许修改
        if(status != 'P' && status != 'N'){
            ifEdit = true
        }

        return (
            <View style={{ overflow: 'scroll', height: '100%' }}>
                <ScrollView style={{ backgroundColor: '#fff' }}>
                    <NoticeBarMessage status={status}/>
                    <PickerLike
                        extra="请选择"
                        {
                            ...getFieldProps(
                                'relate_type',
                                {
                                    initialValue: relate_type ? [relate_type] : [],
                                    rules: [{ required: true }],
                                }
                            )
                        }
                        disabled = {!ifEdit}
                        cols={1}
                        data={relationShipList}
                    >
                        <List.Item arrow="horizontal"><RequireData require={true} text="关系:"/></List.Item>
                    </PickerLike>
                    <InputItem
                        {
                            ...getFieldProps(
                                'chinese_name',
                                {
                                    initialValue: chinese_name ? chinese_name : '',
                                    rules: [{ required: true }],
                                }
                            )
                        }
                        editable = {ifEdit}

                    ><RequireData require={true} text="名字:"/></InputItem>
                    <InputItem
                        {
                            ...getFieldProps(
                                'contact_no',
                                {
                                    initialValue: contact_no ? contact_no : '',
                                }
                            )
                        }
                        editable = {ifEdit}

                    ><RequireData require={false} text="电话:"/></InputItem>
                    <InputItem
                        {
                            ...getFieldProps(
                                'prc_age',
                                {
                                    initialValue: prc_age ? prc_age.toString() : '',
                                }
                            )
                        }
                        editable = {ifEdit}

                    ><RequireData require={false} text="年龄:"/></InputItem>
                    <InputItem
                        labelNumber={7}
                        {
                            ...getFieldProps(
                                'prc_work_unit',
                                {
                                    initialValue: prc_work_unit ? prc_work_unit : '',
                                }
                            )
                        }
                        editable = {ifEdit}

                    ><RequireData require={false} text="工作单位及职务:"/></InputItem>
                    <InputItem
                        labelNumber={4}
                        {
                            ...getFieldProps(
                                'cont_remark',
                                {
                                    initialValue: cont_remark ? cont_remark : '',
                                }
                            )
                        }
                        editable = {ifEdit}

                    ><RequireData require={false} text="关系描述:"/></InputItem>
                    <ApprovingButton/>
                    <TextAreaLike
                        {
                            ...getFieldProps('remark', {
                                initialValue: remark ? remark : '',
                            })
                        }
                        placeholder="备注"
                        rows={5}
                        count={100}
                        editable = {ifEdit}

                    />
                </ScrollView>
                {
                    status != 'P' && status != 'N' ?
                        <View style={{ backgroundColor: '#fff' }}>
                            <WhiteSpace size="xl"/>
                            <Flex>
                                <Flex.Item>
                                    <WingBlank>
                                        <Button type="primary" onClick={this.onSave.bind(this, 'save')}>保存</Button>
                                    </WingBlank>
                                </Flex.Item>
                                <Flex.Item>
                                    <WingBlank>
                                        <Button type="primary" onClick={this.onSave.bind(this, 'submit')}>提交</Button>
                                    </WingBlank>
                                </Flex.Item>
                            </Flex>
                            <WhiteSpace size="sm"/>
                        </View> :
                        null
                }

                <ShowConfirm ref="confirm"/>

            </View>
        )
    }
}

export default createForm()(Index);

const styles = StyleSheet.create({
    brief: {
        fontSize: 14
    }
})