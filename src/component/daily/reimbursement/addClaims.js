import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    PixelRatio,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';

import { RequireData } from '../../personal/common/index';
import {
    List,
    Picker,
    DatePicker,
    Flex,
    InputItem,
    Button,
    Icon,
    ActionSheet,
    WhiteSpace,
    WingBlank,
    Toast
} from 'antd-mobile';
import { inject, observer } from 'mobx-react/native';
import { createForm } from 'rc-form';
import ImagePicker from 'react-native-image-picker';
import Base from '../../../stores/Base'
import { fileUploadApi } from '../../../services/baseService'
import { format } from '../../../common/Tool';

@inject('User', 'Common', 'True', 'Base')
@observer
class Index extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: '报销项增加',
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            imgInfo: '',
            doctor_certificate: '',
            select_date: new Date(),
        }
    }

    componentWillMount() {
        //请求假期类型数据
        this.props.Common.getClaimsType();
        this.props.Common.getCurrencyData();
    }

    goShowList = (gl_type, gl_seg_label, i) => {
        this.props.navigation.navigate('ShowList', { gl_type: gl_type, gl_seg_label: gl_seg_label, i: i })
    }

    imgUrl = ''

    getImgUrl = async () => {
        console.log(this.state.imgInfo)
        if (this.state.imgInfo) {
            const { session_id, company_code, empn_no, enable_ta, staff_no } = Base.userInfo;
            const resDate = await fileUploadApi({
                user_id: staff_no,
                session_id,
                pic: this.state.imgInfo.data,
                file_folder: 'Claim',
                pic_suffix: 'png'
            });
            // console.log(resDate.resultdata.url);
            return resDate.resultdata.url;
            // this.imgUrl = resDate.resultdata.url;
            // resDate.then((res) => {
            //     console.log(res)
            // })
        }else{
            // return '';
            this.imgUrl = '';
        }
    }

    onSubmit = async () => {
        const { form, Base } = this.props;
        const { imgInfo } = this.state;
        let receipt='';
            //上传图片
        if (imgInfo) {
            const { session_id, company_code, empn_no, enable_ta, staff_no } = Base.userInfo;
            const receiptData = await fileUploadApi({
                user_id: staff_no,
                session_id,
                pic: this.state.imgInfo.data,
                file_folder: 'Claim',
                pic_suffix: 'png'
            });
            receipt = receiptData.resultdata.url;
        }
        const {
            claimsType,
            claimsDetail,
            claimsJob,
            claimsDepartment,
            claimsGroup,
            claimsTeam,
            claimsPayment,
            currencyList,
            claimsImg
        } = this.props.Common;

        form.validateFields(async (err, values) => {
            // console.log(values);
            // this.getImgUrl();
            const claimitemsv2 = {
                "claim_dtl_id": "",
                "claim_item": "",
                "as_of_date": "",
                "unit": "人民币",
                "unit_code": "RMB",
                "amount": '',
                "receipt": receipt,
                // "receipt": this.getImgUrl().then((res)=>{return res}),
                "gl_seg1": claimsDepartment.value || claimsDetail.gl_seg1_default_code,
                "gl_seg2": claimsGroup.value || claimsDetail.gl_seg2_default_code,
                "gl_seg3": claimsTeam.value || claimsDetail.gl_seg3_default_code,
                "gl_seg4": claimsJob.value || claimsDetail.gl_seg4_default_code,
                "gl_seg5": claimsPayment.value || claimsDetail.gl_seg5_default_code,
                "remark": ''
            };

            if (!err) {
                const {
                    claimsType,
                    sdate,
                    money,
                    // currency,
                    // department,
                    // group,
                    // team,
                    // job,
                    // payment,
                } = values;
                claimitemsv2.claim_item = claimsType[0];
                claimitemsv2.as_of_date = new Date(sdate).getTime().toString();
                claimitemsv2.amount = money;
                console.log(claimitemsv2);
                this.props.True.addclaimsItemAction(claimitemsv2);
                this.props.navigation.navigate('ClaimsDetail', { info: { status: 'create' } });

            } else {
                if (err.claimsType) {
                    Toast.info('请选择报销类型');
                    return;
                }
                if (err.sdate) {
                    Toast.info('请选择报销日期');
                }
                if (err.money) {
                    Toast.info('请填写报销金额');
                }
            }
        })
    }

    renderUploadFile = (imgInfo, doctor_certificate) => {
        const options = {
            title: 'Select Avatar'
        };

        return (
            <List renderHeader={() => '附件'}>
                <Flex>
                    <Flex.Item>
                        <TouchableOpacity onPress={() => {
                            const BUTTONS = ['相册', '拍照', '取消'];
                            ActionSheet.showActionSheetWithOptions({
                                options: BUTTONS,
                                cancelButtonIndex: BUTTONS.length - 1
                            }, (buttonIndex) => {
                                if (buttonIndex == 0) {
                                    ImagePicker.launchImageLibrary(options, (response) => {
                                        // console.log(options);
                                        this.setState({
                                            imgInfo: response
                                        })
                                    });
                                } else if (buttonIndex == 1) {
                                    ImagePicker.launchCamera(options, (response) => {
                                        this.setState({
                                            imgInfo: response
                                        })
                                    });
                                }

                            });
                        }}>
                            {
                                imgInfo || doctor_certificate ?
                                    <View>
                                        <Image style={styles.images}
                                               source={{ uri: imgInfo.uri ? imgInfo.uri : doctor_certificate }}/>
                                    </View>
                                     :
                                    <View style={styles.image}>
                                        <Text style={styles.text}>
                                            <Icon type={'\ue910'} size="xl" color="#D2D2D2"/>
                                            {/*<Icon type="close-circle-o" />*/}
                                        </Text>
                                    </View>

                            }
                        </TouchableOpacity>
                    </Flex.Item>
                    {
                        this.state.imgInfo ?
                            <Flex.Item>
                                <View style={styles.deleBtn}>
                                    <Button onClick={this.delete} style={{ backgroundColor:'red', borderColor: "red" }}><Text style={{ color: "#fff" }}>删除</Text></Button>
                                </View>
                            </Flex.Item>
                            :null
                    }

                </Flex>
            </List>
        )
    }

    delete = () => {
        this.setState({imgInfo:''})
    }

    render() {
        const { getFieldProps } = this.props.form;
        const { imgInfo, doctor_certificate } = this.state;

        const {
            claimsType,
            claimsDetail,
            claimsJob,
            claimsDepartment,
            claimsGroup,
            claimsTeam,
            claimsPayment,
            currencyList
        } = this.props.Common;

        return (
            <View style={{ overflow: 'scroll', height: '100%' }}>
                <ScrollView style={{ backgroundColor: '#fff' }}>
                    <List>
                        <Picker data={claimsType} cols={1}
                                {
                                    ...getFieldProps(
                                        'claimsType',
                                        {
                                            rules: [{
                                                required: true,
                                            }],
                                        }
                                    )
                                }
                        >
                            <List.Item arrow="horizontal"><RequireData require={true} text="报销项:"/></List.Item>
                        </Picker>
                    </List>

                    <List>
                        <DatePicker mode="date"
                                    {
                                        ...getFieldProps(
                                            'sdate',
                                            {
                                                initialValue: new Date(),
                                                rules: [{ required: true }],

                                            }
                                        )
                                    }
                                    minDate={new Date(1900, 1, 1)}
                        >
                            <List.Item arrow="horizontal"><RequireData require={true} text="生效日期:"/></List.Item>
                        </DatePicker>
                    </List>
                    <List>
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
                            style={{ paddingLeft: 0 }}
                            extra="元"
                            placeholder="请输入报销金额"
                        ><RequireData require={true} text="金额:"/></InputItem>
                    </List>
                    {
                        claimsDetail.gl_seg1_label &&
                        <List>
                            <List.Item
                                arrow="horizontal"
                                extra={claimsDepartment.label || claimsDetail.gl_seg1_default_desc}
                                onClick={() => {
                                    this.goShowList(claimsDetail.gl_seg1_type, claimsDetail.gl_seg1_label, 1)
                                }}
                            >
                                {claimsDetail.gl_seg1_label}
                            </List.Item>
                        </List>
                    }
                    {
                        claimsDetail.gl_seg2_label &&
                        <List>
                            <List.Item
                                arrow="horizontal"
                                extra={claimsGroup.label || claimsDetail.gl_seg1_default_desc}
                                onClick={() => {
                                    this.goShowList(claimsDetail.gl_seg2_type, claimsDetail.gl_seg2_label, 2)
                                }}
                            >
                                {claimsDetail.gl_seg2_label}
                            </List.Item>
                        </List>
                    }
                    {
                        claimsDetail.gl_seg3_label &&
                        <List>
                            <List.Item
                                arrow="horizontal"
                                extra={claimsTeam.label || claimsDetail.gl_seg3_default_desc}
                                onClick={() => {
                                    this.goShowList(claimsDetail.gl_seg3_type, claimsDetail.gl_seg3_label, 3)
                                }}
                            >
                                {claimsDetail.gl_seg3_label}
                            </List.Item>
                        </List>
                    }
                    {
                        claimsDetail.gl_seg4_label &&
                        <List>
                            <List.Item
                                arrow="horizontal"
                                extra={claimsJob.label || claimsDetail.gl_seg4_default_desc}
                                onClick={() => {
                                    this.goShowList(claimsDetail.gl_seg4_type, claimsDetail.gl_seg4_label, 4)
                                }}
                            >
                                {claimsDetail.gl_seg4_label}
                            </List.Item>
                        </List>
                    }
                    {
                        claimsDetail.gl_seg5_label &&
                        <List>
                            <List.Item
                                arrow="horizontal"
                                extra={claimsPayment.label || claimsDetail.gl_seg5_default_desc}
                                onClick={() => {
                                    this.goShowList(claimsDetail.gl_seg5_type, claimsDetail.gl_seg5_label, 5)
                                }}
                                style={styles.listFontStyle}
                            >
                                {claimsDetail.gl_seg5_label}
                            </List.Item>
                        </List>
                    }
                    {
                        this.renderUploadFile(imgInfo, doctor_certificate)
                    }
                </ScrollView>
                <View style={{ backgroundColor: '#fff' }}>
                    <WhiteSpace size="sm"/>
                    <WingBlank>
                        <Button type="primary" onClick={this.onSubmit}>保存</Button>
                    </WingBlank>
                    <WhiteSpace size="sm"/>
                </View>
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
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: '#58cb8c',
        borderColor: 'transparent'
    },
    listLeftBorder: {
        borderLeftWidth: 1 / PixelRatio.get(),
        borderColor: '#e1e1e1',
        borderTopWidth: 0,
    },
    image: {
        width: 50,
        height: 100,
        marginLeft: 15,
        marginBottom: 10,
    },
    images: {
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
    descView: {
        height: 40,
        marginLeft: 15,
    },
    descText: {
        lineHeight: 40,
    },
    listFontStyle: {
        fontSize: 14,
    },
    deleBtn: {
        padding:50
    }

})

export default createForm()(Index);