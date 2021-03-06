/**
 * 可调休假
 */
import React, {PureComponent} from 'react';
import {
    ScrollView,
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    PixelRatio
} from 'react-native';
import {
    Button,
    Icon,
    Flex,
    Tabs,
    List,
} from 'antd-mobile';
import {format} from '../../common/Tool';
import { inject, observer } from 'mobx-react/native';
import { gColors } from '../../common/GlobalContants';

@inject('User')
@observer
export default class Index extends PureComponent{
    static navigationOptions = ({ navigation }) => {
        return {
            title:'可调休假申报',
            headerRight: (
                <Button
                    type="primary"
                    style={styles.button}
                    onPressIn={() => {
                        navigation.navigate('DeclareHoliday', {type: 'add'})
                    }}
                >申报</Button>
            ),
        }
    };
    constructor(props) {
        super(props);
        const time = new Date().getTime()
        this.state = {
            time, //保存时间戳
            ifShowAll: false,
        }
    }
    clickAddMonth = (num) => {
        const {time} = this.state;
        const formatTime = new Date(time)
        num = parseInt(num)
        const endTime = formatTime.setMonth(formatTime.getMonth()+num);
        //进行数据请求切换
        const month = format(endTime, 'yyyy-MM')
        this.props.User.getLeaveawardList(month)
        //请求用户数据
        this.setState({
            time: endTime
        })
    }
    clickToggleShow() {
        //显示隐藏全部已通过信息
        this.setState({
            ifShowAll: !this.state.ifShowAll,
        })
    }
    renderTitle = (time) => {
        const timeStr = time? format(time, 'yyyy-MM'):format(new Date().getTime(), 'yyyy-MM')
        return(
            <Flex style={styles.titleWrap}>
                <Flex.Item></Flex.Item>
                <Flex.Item style={styles.centerContent}>
                    <Flex>
                        <Flex.Item>
                            <TouchableOpacity onPress={() => {
                                this.clickAddMonth(-1)
                            }}>
                                <Text  style={{textAlign: 'center', width: '100%'}}>
                                    <Icon type={'\ue620'} color={'#A9B7B6'} size={'xxs'}/>
                                </Text>
                            </TouchableOpacity>
                        </Flex.Item>
                        <Flex.Item style={{flex: 2}}>
                            <Text style={{textAlign: 'center'}}>
                                {timeStr}
                            </Text>
                        </Flex.Item>
                        <Flex.Item>
                            <TouchableOpacity onPress={() => {
                                this.clickAddMonth(1)
                            }}>
                                <Text  style={{textAlign: 'center', width: '100%'}}>
                                    <Icon type={'\ue61f'} color={'#A9B7B6'} size={'xxs'}/>
                                </Text>
                            </TouchableOpacity>
                        </Flex.Item>
                    </Flex>
                </Flex.Item>
                <Flex.Item>
                    <TouchableOpacity>
                        <Text>
                            {/*日历模式*/}
                        </Text>
                    </TouchableOpacity>
                </Flex.Item>
            </Flex>
        )
    }
    renderLeaveItem = (data) => {
        const {ifShowAll} = this.state;
        if(!ifShowAll){
            data = data.slice(0, 3);
        }
        return(
            <ScrollView>
                {
                    data && data.map((info, i) => {
                        //处理开始时间结束时间
                        const formatAsTime = info.as_of_date ? format(parseInt(info.as_of_date), 'yyyy-MM-dd') :'';

                        return(
                            <TouchableOpacity key={i} onPress = {() => {
                                this.props.User.selectAdjDetailFn(info);
                                //进行路由跳转
                                this.props.navigation.navigate('DeclareDetail');//"公告"

                            }}>
                                <View style={styles.infoWrap2}>
                                    <View style={styles.listName}>
                                        <Text style={styles.listText} numberOfLines={1}>
                                            {info.lv_claims_type_desc + '(' + info.lv_adj_value + '天）'}
                                        </Text>
                                    </View>
                                    <View style={styles.listPhone} numberOfLines={1}>
                                        <Text style={styles.phoneText}>
                                            {'日期：' + formatAsTime}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                }
                {
                    data && data.length > 3 ?
                        <View style={styles.toggleBtn}>
                            <TouchableOpacity style={styles.touchPlace} onPress={() => {
                                this.clickToggleShow()
                            }}>
                                <Text  style={styles.btnText}>
                                    {
                                        ifShowAll?
                                            <Icon type={'\uE61E'} color={'#A9B7B6'} size={'md'}/>:
                                            <Icon type={'\uE61D'} color={'#A9B7B6'} size={'md'}/>
                                    }
                                </Text>
                            </TouchableOpacity>
                        </View>:
                        null
                }
            </ScrollView>
        )
    }
    renderTabsList = (data) => {
        //渲染申报列表
        return(
            <ScrollView>
                {
                    data && data.map((info, i) => {
                        //处理开始时间结束时间
                        const formatAsTime = info.as_of_date ? format(parseInt(info.as_of_date), 'yyyy-MM-dd') :'';

                        return(
                            <TouchableOpacity  key={i} onPress = {() => {
                                this.props.User.selectAdjDetailFn(info);
                                //进行路由跳转
                                this.props.navigation.navigate('DeclareDetail');//"公告"

                            }}>
                                <View style={styles.listItem}>
                                    <View style={styles.infoWrap}>
                                        <View style={styles.listName}>
                                            <Text style={styles.listText} numberOfLines={1}>
                                                {info.lv_claims_type_desc + '(' + info.lv_adj_value + '天）'}
                                            </Text>
                                        </View>
                                        <View style={styles.listPhone}>
                                            <Text style={styles.phoneText} numberOfLines={1}>
                                                {'日期：' + formatAsTime}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.editWrap}>
                                        <Text style={styles.statusText}>
                                            {info.status_desc}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                }
            </ScrollView>
        )
    }
    renderNoData = (str) => {
        //暂无数据
        return(
            <View style={styles.noDataWrap}>
                <Text  style={styles.noDataIcon}>
                    <Icon type={'\uE6A8'} color={'#33CC99'} size={'lg'}/>
                </Text>
                <Text style={styles.textInfo}>
                    {str}
                </Text>
            </View>
        )
    }
    componentWillMount() {
        const time = new Date().getTime()
        //进行数据请求
        const month = format(time, 'yyyy-MM')
        this.props.User.getLeaveawardList(month)
    }
    render() {
        const {time} = this.state;
        const {passLeaveawardList, submitLeaveawardList, approveLeaveawardList, rejectLeaveawardList, cancelLeaveawardList} = this.props.User;
        const tabs = [
            { title: '已提交', sub: 'PE' },
            { title: '审批中', sub: 'PD' },
            { title: '审批不通过', sub: 'PD' },
            { title: '取消', sub: 'PD' },
        ];
        return(
            <ScrollView>
                {
                    this.renderTitle(time)
                }
                {
                    passLeaveawardList && passLeaveawardList.length?
                        this.renderLeaveItem(passLeaveawardList):
                        this.renderNoData('暂无申报审批通过信息')
                }
                <Tabs
                    tabs={tabs}
                    swipeable={false}
                    //animated={false} //TODO 取消动画居然会影响activetab切换
                    tabBarActiveTextColor={gColors.brandPrimary}
                    tabBarUnderlineStyle={{ backgroundColor: gColors.brandPrimary }}
                >
                    {
                        submitLeaveawardList && submitLeaveawardList.length?
                            this.renderTabsList(submitLeaveawardList):
                            this.renderNoData('暂无提交申报信息')
                    }
                    {
                        approveLeaveawardList && approveLeaveawardList.length?
                            this.renderTabsList(approveLeaveawardList):
                            this.renderNoData('暂无审批中申报信息')
                    }
                    {
                        rejectLeaveawardList && rejectLeaveawardList.length?
                            this.renderTabsList(rejectLeaveawardList):
                            this.renderNoData('暂无审批不通过申报信息')
                    }
                    {
                        cancelLeaveawardList && cancelLeaveawardList.length?
                            this.renderTabsList(cancelLeaveawardList):
                            this.renderNoData('暂无取消申报信息')
                    }
                </Tabs>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    listItem: {
        display: 'flex',
        flexDirection: 'row',
        height: 80,
        paddingLeft: 10,
        borderBottomWidth: 1/PixelRatio.get(),
        borderColor: '#e1e1e1',
        backgroundColor: '#fff'
    },
    infoWrap: {
        flex: 3,
    },
    button: {
        //backgroundColor:'#3ba662',
        //borderColor: '#3ba662',
        height:40
    },
    centerContent: {
        flex: 2
    },
    editWrap: {
        width: 80,
        display: 'flex',
        alignItems: 'center',
        marginRight: 10,
    },
    titleWrap: {
        height: 40,
        backgroundColor: '#E3E3E3'
    },
    statusText: {
        lineHeight: 70,
        marginTop: 5,
        color: '#F99431',
    },

    infoWrap2: {
        // display: 'flex',
        // flexDirection: 'row',
        height: 80,
        paddingLeft: 10,
        borderBottomWidth: 1/PixelRatio.get(),
        borderColor: '#e1e1e1',
        backgroundColor: '#fff'
    },
    listName: {
        height: 50,
        overflow: 'hidden',
    },
    listText: {
        lineHeight: 50,
        fontSize: 16,
    },
    listPhone: {
        marginTop: -5,
        height: 30,
    },
    phoneText: {
        lineHeight: 30,
        fontSize: 15,
        color: '#949494',
    },
    toggleBtn: {
        height: 30,
        backgroundColor: '#E3E3E3',
        borderBottomWidth: 1/PixelRatio.get(),
        borderColor: '#e1e1e1',
    },
    btnText: {
        marginTop: 5,
        textAlign: 'center',
    },
    touchPlace: {
        width: '100%',
        height: '100%',
    },
    noDataWrap: {
        height: 200,
        backgroundColor: '#fff'
    },
    noDataIcon: {
        height: 150,
        paddingTop: 60,
        // lineHeight: 180,
        textAlign: 'center'
    },
    textInfo: {
        textAlign: 'center'
    }
});