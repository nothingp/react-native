/**
 * 添加教育经历
 */

import React, { Component } from 'react';
import {merged, format} from '../../common/Tool';
import { showAlert } from '../../component/showAlert';

import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity
} from 'react-native';

import { Flex, WingBlank, WhiteSpace, Toast,Icon,Button,List,ActionSheet,InputItem,Picker,TextareaItem, DatePicker } from 'antd-mobile';
import { inject, observer } from 'mobx-react/native';
import { createForm } from 'rc-form';
import ImagePicker from 'react-native-image-picker';
import {RequireData} from './common/index';
import TitleButton from './common/educationTitleButton';
import {NoticeBarMessage} from './common';
import ApprovingButton from './approvingButton';

@inject('User', 'Common','True')
@observer
class Index extends Component {
    static navigationOptions = ({ navigation }) => {
        const {type} = navigation.state.params;
        if(type && type == 'edit'){
            return {
                title:'编辑教育经历',
                headerRight: (
                    <TitleButton navigation={navigation}/>
                ),
            }
        }else{
            return {
                title:'添加教育经历',
            }
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            imgInfo: '', //附件图片信息
        }
        //提交教育经历信息
        this.onSubmit = async (ifSave) => {
            //
            const { form,True} = this.props;
            const {imgInfo} = this.state;
            const {selectTask, selectApprover} = True;

            form.validateFields(async (err, values) => {
                const approver_id=selectApprover.value;
                if (!err) {
                    //将对应的时间进行格式化
                    const {
                        from_year,
                        to_year,
                        country_code,
                        edu_type,
                        institude_name,
                        course,
                        comment,
                        remark,
                    } = values;

                    if(country_code.length == 0){
                        Toast.info('请选择所在地区');
                        return
                    }
                    if(edu_type.length == 0){
                        Toast.info('请选择教育类型');
                        return
                    }
                    if(!approver_id){
                        Toast.info('请选择审批人');
                        return
                    }
                    const obj = {
                        from_year:from_year?format(new Date(from_year).getTime(), 'yyyy-MM-dd'):'',
                        to_year: to_year?format(new Date(to_year).getTime(), 'yyyy-MM-dd'):'',
                        country_code:country_code?country_code[0]:'',
                        edu_type: edu_type?edu_type[0]:'',
                        institude_name,
                        course,
                        comment,
                        approver_id,
                        remark,
                        is_save: ifSave,
                        imgInfo
                    }

                    const {type} = this.props.navigation.state.params;
                    const successFn = () => {
                        this.props.navigation.goBack()
                    }
                    //判断是保存还是修改
                    if(type == 'edit'){
                        //修改
                        const {selectEduItem} = this.props.User;
                        const {education_tbl_id, education_tbl_approve_id} = selectEduItem;
                        showAlert({
                            title: ifSave == '1'?'保存':'提交',
                            massage: ifSave == '1'?'您确定保存教育经历吗？':'您确定提交教育经历吗？',
                            okFn: () => {
                                this.props.User.editEduExp(merged(obj, {education_tbl_id, education_tbl_approve_id}), successFn);
                            },
                        })

                    }else{
                        //保存或者提交
                        showAlert({
                            title: ifSave == '1'?'保存':'提交',
                            massage: ifSave == '1'?'您确定保存教育经历吗？':'您确定提交教育经历吗？',
                            okFn: () => {
                                this.props.User.addEduExp(obj, successFn);
                            },
                        })
                    }
                }
                else {
                    if (err.edu_type) {
                        Toast.info('请选择教育类型');
                    }
                    else if (err.country_code) {
                        Toast.info('请选择所在地区');
                    }
                    else if(err.institude_name){
                        Toast.info('请填写学校/机构名称');
                    }
                    else if(err.course){
                        Toast.info('请填写所学专业');
                    }
                }

            });
        }

    }
    componentWillMount() {
        let { True, navigation } = this.props;
        True.selectTask = {function:'PP',function_dtl:'ED'};
        //请求审核人列表
        // this.props.User.getApprover();
        //获取教育类型
        this.props.Common.getEducationTypeList();

        //根据ID获取详细的教育信息 教育经历
        const {type} = this.props.navigation.state.params;

        if(type == 'edit'){
            this.props.User.getSimpleEduInfo();
        }
    }
    render() {
        const {type} = this.props.navigation.state.params;

        const { getFieldProps } = this.props.form;
        const {countryList, educationType} = this.props.Common;
        const {imgInfo} = this.state;

        const {approverList, selectEduItem} = this.props.User;
        let from_year,
            to_year,
            country_code,
            edu_type,
            institude_name,
            course,
            comment,
            cert_filename,
            remark,
            status = '';
        if(selectEduItem && type == 'edit'){
            from_year = selectEduItem.from_year;
            to_year = selectEduItem.to_year;
            country_code = selectEduItem.country_code;
            edu_type = selectEduItem.edu_type;
            institude_name = selectEduItem.institude_name;
            course = selectEduItem.course;
            comment = selectEduItem.comment;
            remark = selectEduItem.remark;
            cert_filename = selectEduItem.cert_filename;
            status = selectEduItem.status;

        }
        const options = {
            title: 'Select Avatar'
        };
        return (
            <View style={{overflow: 'scroll', height:'100%'}}>
                <ScrollView style={{backgroundColor:'#fff'}}>
                    <NoticeBarMessage status={status}/>
                    <DatePicker mode="date"
                                {
                                    ...getFieldProps(
                                        'from_year',
                                        {
                                            initialValue: from_year?new Date(from_year):'',

                                        }
                                    )
                                }
                                minDate={new Date(1900, 1, 1)}
                    >
                        <List.Item arrow="horizontal"><RequireData require={false} text="开始时间:"/></List.Item>
                    </DatePicker>
                    <DatePicker mode="date"
                                {
                                    ...getFieldProps(
                                        'to_year',
                                        {
                                            initialValue: to_year?new Date(to_year):'',
                                        }
                                    )
                                }
                                minDate={new Date(1900, 1, 1)}

                    >
                        <List.Item arrow="horizontal"><RequireData require={false} text="结束时间:"/></List.Item>
                    </DatePicker>
                    <Picker data={educationType} cols={1}
                            {
                                ...getFieldProps(
                                    'edu_type',
                                    {
                                        initialValue: edu_type?[edu_type]:[],
                                        rules: [{required: true}],
                                    }
                                )
                            }
                    >
                        <List.Item arrow="horizontal"><RequireData require={true} text="教育类型:"/></List.Item>
                    </Picker>
                    <Picker data={countryList} cols={1}
                            {
                                ...getFieldProps(
                                    'country_code',
                                    {
                                        initialValue: country_code?[country_code]:[],
                                        rules: [{required: true}],

                                    }
                                )
                            }
                    >
                        <List.Item arrow="horizontal"><RequireData require={true} text="所在地区:"/></List.Item>
                    </Picker>
                    <InputItem
                        {
                            ...getFieldProps(
                                'institude_name',
                                {
                                    initialValue: institude_name?institude_name:'',
                                    rules: [{required: true}],
                                }
                            )
                        }
                    ><RequireData require={true} text="学校/机构名称:"/></InputItem>
                    <InputItem
                        {
                            ...getFieldProps(
                                'course',
                                {
                                    initialValue: course?course:'',
                                    rules: [{required: true}],
                                }
                            )
                        }
                    ><RequireData require={true} text="所学专业:"/></InputItem>
                    <InputItem
                        {
                            ...getFieldProps(
                                'comment',
                                {
                                    initialValue: comment?comment:'',
                                }
                            )
                        }
                    ><RequireData require={false} text="教育成就:"/></InputItem>
                    <List renderHeader={() => '附件'}>
                        <TouchableOpacity onPress={() => {
                            const BUTTONS = ['相册', '拍照', '取消'];
                            ActionSheet.showActionSheetWithOptions({
                                options: BUTTONS,
                                cancelButtonIndex: BUTTONS.length - 1
                            },(buttonIndex) => {
                                if(buttonIndex==0){
                                    ImagePicker.launchImageLibrary(options, (response)  => {
                                        this.setState({
                                            imgInfo: response
                                        })
                                    });
                                }else if(buttonIndex==1){
                                    ImagePicker.launchCamera(options, (response)  => {
                                        this.setState({
                                            imgInfo: response
                                        })
                                    });
                                }

                            });
                        }}>
                            {
                                imgInfo || cert_filename?
                                    <Image style={styles.image} source={{uri: imgInfo.uri ? imgInfo.uri:cert_filename}}/>:
                                    <View style={styles.image}>
                                        <Text style={styles.text}>
                                            <Icon type={'\ue910'} size="xl" color="#D2D2D2"/>
                                        </Text>
                                    </View>

                            }
                        </TouchableOpacity>
                    </List>
                   <ApprovingButton/>
                    <TextareaItem
                        {
                            ...getFieldProps('remark', {
                                initialValue: remark,
                            })
                        }
                        placeholder="备注"
                        rows={5}
                        count={100}
                    />
                </ScrollView>
                {
                    status != 'P' && status != 'N'?
                        <View style={{backgroundColor: '#fff'}}>
                            <WhiteSpace size="sm"/>
                            <Flex>
                                <Flex.Item>
                                    <WingBlank>
                                        <Button type="primary" onClick={this.onSubmit.bind(this, 1)}>保存</Button>
                                    </WingBlank>
                                </Flex.Item>
                                <Flex.Item>
                                    <WingBlank>
                                        <Button type="primary" onClick={this.onSubmit.bind(this, 0)}>提交</Button>
                                    </WingBlank>
                                </Flex.Item>
                            </Flex>
                            <WhiteSpace size="sm"/>
                        </View>:
                        null
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    image: {
        width: 100,
        height: 100,
        marginLeft: 15,
        marginTop: 10,
        marginBottom: 10,
    },
    text: {
        fontSize: 50,
        lineHeight: 80,
        marginLeft: 10
    },
    brief: {
        fontSize: 14
    }
});

export default createForm()(Index);