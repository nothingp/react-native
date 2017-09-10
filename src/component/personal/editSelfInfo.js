/**
 * 查看地址页面
 */

import React, { Component } from 'react';

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

import { Flex, WhiteSpace, Checkbox, WingBlank, Icon,Grid,Button,List,NavBar,InputItem,Picker,TextareaItem, DatePicker } from 'antd-mobile';
import { inject, observer } from 'mobx-react/native';
import { createForm } from 'rc-form';
import { Navigation } from 'react-native-navigation';
import navigator from '../../decorators/navigator'

@navigator
@inject('User')
@observer
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pickerValue: [],
        }
    }
    componentWillMount() {

    }
    render() {
        const { getFieldProps } = this.props.form;

        const {userDetail, nationalityList, districtList, politicalList, maritalList, educationList} = this.props.User;

        let prc_former_name, sex, dob, prc_np_province_code, prc_np_city_code, prc_nationality_code, prc_political_status, mobile_no, office_no, prc_qq, home_no, comp_email, pers_email;

        if(userDetail){
            prc_former_name = userDetail.prc_former_name;
            sex = userDetail.sex;
            dob = userDetail.dob?userDetail.dob.split('T')[0]: '';
            prc_np_province_code = userDetail.prc_np_province_code;
            prc_np_city_code = userDetail.prc_np_city_code;
            prc_nationality_code = userDetail.prc_nationality_code;
            prc_political_status = userDetail.prc_political_status;
            marital_status  = userDetail.marital_status;
            prc_education = userDetail.prc_education;

            mobile_no = userDetail.mobile_no;
            office_no = userDetail.office_no;
            prc_qq = userDetail.prc_qq;
            home_no = userDetail.home_no;
            comp_email = userDetail.comp_email;
            pers_email = userDetail.pers_email;
        }

        const sexArr = [
            {
                label: '男',
                value: 'M',
            },
            {
                label: '女',
                value: 'F',
            },
        ];
        return (
            <ScrollView>
                <List>
                    <InputItem
                        {
                            ...getFieldProps(
                                'prc_former_name',
                                {
                                    initialValue: prc_former_name
                                }
                            )
                        }
                    >昵称：</InputItem>
                    <Picker data={sexArr} cols={1}
                            {
                                ...getFieldProps(
                                    'sex',
                                    {
                                        initialValue: sex
                                    }
                                )
                            }
                    >
                        <List.Item arrow="horizontal">性别：</List.Item>
                    </Picker>
                    <DatePicker mode="date"
                                {
                                    ...getFieldProps(
                                        'dob',
                                        {
                                            // initialValue: dob
                                        }
                                    )
                                }
                    >
                        <List.Item arrow="horizontal">生日：</List.Item>
                    </DatePicker>
                    <Picker
                        extra="选择地区"
                        {
                            ...getFieldProps(
                                'district',
                                {
                                    initialValue: [prc_np_province_code, prc_np_city_code]
                                }
                            )
                        }
                        data={districtList}
                    >
                        <List.Item arrow="horizontal">籍贯：</List.Item>

                    </Picker>
                    <Picker data={nationalityList} cols={1}
                            {
                                ...getFieldProps(
                                    'prc_nationality_code',
                                    {
                                        initialValue: prc_nationality_code
                                    }
                                )
                            }
                    >
                        <List.Item arrow="horizontal">民族：</List.Item>
                    </Picker>
                    <Picker data={politicalList} cols={1}
                            {
                                ...getFieldProps(
                                    'prc_political_status',
                                    {
                                        initialValue: prc_political_status
                                    }
                                )
                            }
                    >
                        <List.Item arrow="horizontal">政治面貌：</List.Item>
                    </Picker>
                    <Picker data={maritalList} cols={1}
                            {
                                ...getFieldProps(
                                    'marital_status',
                                    {
                                        initialValue: marital_status
                                    }
                                )
                            }
                    >
                        <List.Item arrow="horizontal">婚姻状况：</List.Item>
                    </Picker>
                    <Picker data={educationList} cols={1}
                            {
                                ...getFieldProps(
                                    'prc_education',
                                    {
                                        initialValue: prc_education
                                    }
                                )
                            }
                    >
                        <List.Item arrow="horizontal">教育状况：</List.Item>
                    </Picker>
                    <InputItem
                        {
                            ...getFieldProps(
                                'prc_major',
                                {
                                    initialValue: prc_former_name
                                }
                            )
                        }
                    >所学专业：</InputItem>
                    <DatePicker mode="date"
                                {
                                    ...getFieldProps(
                                        'prc_grade_gettime',
                                    )
                                }
                                onChange={this.onChange}
                    >
                        <List.Item arrow="horizontal">毕业时间：</List.Item>
                    </DatePicker>
                    <InputItem
                        {
                            ...getFieldProps(
                                'comp_email',
                            )
                        }
                    >公司邮箱：</InputItem>
                    <InputItem
                        {
                            ...getFieldProps(
                                'pers_email',
                            )
                        }
                    >私人邮箱：</InputItem>
                    <InputItem
                        {
                            ...getFieldProps(
                                'mobile_no',
                            )
                        }
                    >手机号码：</InputItem>
                    <InputItem
                        {
                            ...getFieldProps(
                                'office_no',
                            )
                        }
                    >办公号码：</InputItem>
                    <InputItem
                        {
                            ...getFieldProps(
                                'prc_qq',
                            )
                        }
                    >QQ：</InputItem>
                    <Picker data={educationList} cols={1}>
                        <List.Item arrow="horizontal">审批人：</List.Item>
                    </Picker>
                    <List renderHeader={() => '备注'}>
                        <TextareaItem
                            {...getFieldProps('count', {
                                initialValue: '计数功能,我的意见是...',
                            })}
                            rows={5}
                            count={100}
                        />
                    </List>
                    <WhiteSpace size="xl"/>
                    <WingBlank>
                        <Button type="primary">保存</Button>
                    </WingBlank>
                </List>
            </ScrollView>

        )
    }
}

const styles = StyleSheet.create({
    infoList: {
    },
    listName: {
        width: 70,
    },
    listTitle: {
        fontSize: 18
    },
    button: {
        borderColor: '#dddddd',
        borderStyle: 'solid',
        borderTopWidth: 1/PixelRatio.get(),
    },
    list: {
        height:15
    },
    radio: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderStyle: 'solid',
        marginRight: 10,
        borderRadius: 10,
        fontSize: 10,
    },
});

export default createForm()(Index);