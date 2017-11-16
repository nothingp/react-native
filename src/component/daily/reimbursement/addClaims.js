
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import {RequireData} from '../../personal/common/index';
import { List,Picker, DatePicker, Flex, InputItem, Button} from 'antd-mobile';
import { inject, observer } from 'mobx-react/native';
import { createForm } from 'rc-form';
import Base from '../../../stores/Base'
import {format} from '../../../common/Tool';
// import Flex from "antd-mobile/es/flex/Flex.d";

@inject('User', 'Common')
@observer
class Index extends Component{
    static navigationOptions = ({ navigation }) => {
        return {
            title:'报销项增加',
        }
    };
    state = {
        typeValue: '',
    }
    changeType = (v) => {
        const {claimsType} = this.props.Common;
        console.log(v);
        console.log(claimsType[v].label)
        //1， 如果某个假期类型对应的alert_msg_desc字段不为空的话，选择该假期的时候需要在假期类型下面显示这个字段的内容；为空的话，则不需要显示。

        // 2，如果某个假期类型对应的user_defined_field_1不为空的话，需要在”附件“字段后面添加一个字段，字段名称为user_defined_field_1字段的值，字段的控件类型为时间选择器，格式如2017-02-01；如果为空的话，则不需要显示。
        this.setState({
            typeValue: 1
        })


    }
    componentWillMount() {
        //请求假期类型数据
        this.props.Common.getClaimsType();
        this.props.Common.getCurrencyData();

    }

    loadJob = (gl_type,i)=>{
        const {claimsJob} = this.props.Common
        this.props.Common.getClaimsJob(gl_type,i);
    }

    changeRightValue = (a,b) => {
        // console.log((b+'').subString(a.length+3));
        // console.log(a)
        console.log(b.replace(a+' - ',''));
        return b.replace(a+' - ','');
    }

    onSubmit = () => {
        const { form } = this.props;

        form.validateFields(async (err, values) => {
            console.log(values);
            if (!err) {
                const {
                    claimsType,
                    sdate,
                    money,
                    currency,
                    department,
                    group,
                    team,
                    job,
                    payment,

                } = values;

            }
        })
    }

    render() {
        const { getFieldProps } = this.props.form;

        const {claimsType, claimsDetail, claimsJob, claimsDepartment, claimsGroup, claimsTeam, claimsPayment, currencyList} = this.props.Common;
        const {typeValue} = this.state;
        console.log(claimsDetail)
        console.log('');

        return(
            <View>
                <InputItem
                        {
                            ...getFieldProps(
                                'claimsType',
                                {
                                    initialValue: '',
                                    rules: [{
                                        required: true,
                                    }],
                                }
                            )
                        }

                >
                    <List.Item arrow="horizontal"><RequireData require={false} text="报销项:"/></List.Item>
                </InputItem>
                <DatePicker mode="date"
                            {
                                ...getFieldProps(
                                    'sdate',
                                    {
                                        initialValue:'',
                                        rules: [{required: true}],

                                    }
                                )
                            }
                            minDate={new Date(1900, 1, 1)}
                >
                    <List.Item arrow="horizontal"><RequireData require={true} text="生效日期:"/></List.Item>
                </DatePicker>
                <Flex>
                    <Flex.Item style={styles.inputFlex}>
                        <InputItem
                            {
                                ...getFieldProps(
                                    'money',
                                    {
                                        initialValue: '',
                                        rules: [{
                                            required: true,
                                        }],

                                    }
                                )
                            }
                            type="number"
                        ><RequireData require={true} text="金额:"/></InputItem>
                    </Flex.Item>
                    <Flex.Item>
                        <Picker data={currencyList} cols={1}
                                {
                                    ...getFieldProps(
                                        'currency',
                                        {
                                            initialValue: ['人民币'],
                                            rules: [{
                                                required: true,
                                            }],
                                        }
                                    )
                                }
                        >
                            <List.Item arrow="horizontal"><RequireData require={false} text=""/></List.Item>
                        </Picker>
                    </Flex.Item>
                </Flex>
                {
                    claimsDetail.gl_seg1_label&&
                    <Picker data={claimsDepartment} cols={1}
                            {
                                ...getFieldProps(
                                    'department',
                                    {
                                        initialValue: [{label:this.changeRightValue(claimsDetail.gl_seg1_default_code,claimsDetail.gl_seg1_default_desc),value:claimsDetail.gl_seg1_default_code}],
                                        rules: [{
                                            required: true,
                                        }],
                                    }
                                )
                            }

                    >
                        <List.Item arrow="horizontal"  onClick={()=>{this.loadJob(claimsDetail.gl_seg1_type,1)}}><RequireData require={false} text={claimsDetail.gl_seg1_label}/></List.Item>
                    </Picker>
                }
                {
                    claimsDetail.gl_seg2_label&&
                    <Picker data={claimsGroup} cols={1}
                            {
                                ...getFieldProps(
                                    'group',
                                    {
                                        initialValue: [{label:this.changeRightValue(claimsDetail.gl_seg2_default_code,claimsDetail.gl_seg2_default_desc),value:claimsDetail.gl_seg2_default_code}],
                                        rules: [{
                                            required: true,
                                        }],
                                    }
                                )
                            }
                    >
                        <List.Item arrow="horizontal" onClick={()=>{this.loadJob(claimsDetail.gl_seg2_type,2)}}><RequireData require={false} text={claimsDetail.gl_seg2_label}/></List.Item>
                    </Picker>
                }

                {
                    claimsDetail.gl_seg3_label&&
                    <Picker data={claimsTeam} cols={1}
                            {
                                ...getFieldProps(
                                    'team',
                                    {
                                        initialValue: [{label:this.changeRightValue(claimsDetail.gl_seg3_default_code,claimsDetail.gl_seg3_default_desc),value:claimsDetail.gl_seg3_default_code}],
                                        rules: [{
                                            required: true,
                                        }],
                                    }
                                )
                            }
                    >
                        <List.Item arrow="horizontal" onClick={()=>{this.loadJob(claimsDetail.gl_seg3_type,3)}}><RequireData require={false} text={claimsDetail.gl_seg3_label}/></List.Item>
                    </Picker>
                }

                {
                    claimsDetail.gl_seg4_label&&
                    <Picker data={claimsJob} cols={1}
                            {
                                ...getFieldProps(
                                    'job',
                                    {
                                        // initialValue: [{label:this.changeRightValue(claimsDetail.gl_seg4_default_code,claimsDetail.gl_seg4_default_desc),value:claimsDetail.gl_seg4_default_code}],
                                        initialValue:[claimsDetail.gl_seg4_default_code],
                                        rules: [{
                                            required: true,
                                        }],
                                    }
                                )
                            }
                    >
                        <List.Item arrow="horizontal" onClick={()=>{this.loadJob(claimsDetail.gl_seg4_type,4)}}><RequireData require={false} text={claimsDetail.gl_seg4_label}/></List.Item>
                    </Picker>
                }

                {
                    claimsDetail.gl_seg5_label&&
                    <Picker data={claimsPayment} cols={1}
                            {
                                ...getFieldProps(
                                    'payment',
                                    {
                                        // initialValue: [{label:this.changeRightValue(claimsDetail.gl_seg5_default_code,claimsDetail.gl_seg5_default_desc),value:claimsDetail.gl_seg5_default_code}],
                                        initialValue:[claimsDetail.gl_seg5_default_code],
                                        rules: [{
                                            required: true,
                                        }],
                                    }
                                )
                            }
                    >
                        <List.Item arrow="horizontal" onClick={()=>{this.loadJob(claimsDetail.gl_seg5_type,5)}}><RequireData require={false} text={claimsDetail.gl_seg5_label}/></List.Item>
                    </Picker>
                }

                <Button
                    type="primary"
                    style={styles.button}
                    // onPressIn={() => this.props.navigation.navigate('EditSelfInfo', {status:'create'})}
                    onClick={()=>{this.onSubmit()}}
                    // onPress={()=>{alert(1)}}
                >
                    确定
                </Button>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    timeTitle: {
        height: 40,
        backgroundColor: '#E3E3E3'
    },
    timeText: {
        lineHeight: 40,
        marginLeft: 15,
    },
    inputFlex: {
        backgroundColor: '#fff',
        borderRightColor: '#ccc',
    },
    button: {
        height: 50,
        borderRadius: 3,
        marginTop: 30,
        marginBottom: 10,
        marginLeft:15,
        marginRight:15,
        backgroundColor: '#58cb8c',
        borderColor: 'transparent'
    }
})

export default createForm()(Index);