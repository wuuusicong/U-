import React,{useState, useContext} from "react";
import {DataFresh, textType, textCountOut, textCountIn, textTypeIcon, formatDate, typeInOut} from "../../Config";
import { createForm } from 'rc-form';
import {fetchUrl} from "../FetchData";
import *as d3 from "d3";
import {
    Tabs,
    WhiteSpace,
    Badge,
    Icon,
    InputItem,
    List,
    Toast,
    WingBlank,
    Modal,
    Button,
    Toas,
    DatePicker
} from 'antd-mobile';
import axios from "axios";
import {useHistory} from "react-router-dom";


const tabs = [
    { title: <Badge >{textCountOut}</Badge> },
    { title: <Badge >{textCountIn}</Badge> },
];
/*
* ChargeInput 弹出的记账输入控件
* 主要包括时间控件、两个输入组件、提交按钮 */
const ChargeInput = ({onCloseModal, form, initType, initTypeInOut, iconData, iconText}) => {

    const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
    let moneyKeyboardWrapProps;
    if (isIPhone) {
        moneyKeyboardWrapProps = {
            onTouchStart: e => e.preventDefault(),
        };
    }

    const {getFieldProps} = form;
    const nowTimeStamp = Date.now();
    const now = new Date(nowTimeStamp);
    let [nowDate,setNowDate] = useState(now)
    let textInitType = iconText[iconData.indexOf(initType)]

    let {yearStr, monthStr, dayStr, dateStr} = formatDate(nowDate)

    let history = useHistory()
    const {fresh, setFresh} = useContext(DataFresh);
    const [hasError, setHasError] = useState(false)
    const [numberValue, setNumberValue] = useState(0);



    const isNumber = (intNumber) => {
        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if (regPos.test(intNumber) && regNeg.test(intNumber)) {
            return true
        } else {
            return false
        }
    }
    const onPhoneChange = (value) => {
        console.log(value)
        console.log("value")
        // const intNumber = parseFloat(value);
        // var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        // var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        // if(regPos.test(intNumber) && regNeg.test(intNumber)){
        //     setHasError(true)
        // }else{
        //     setHasError(false)
        // }
    }
    const onErrorClick = () => {
        if (hasError) {
            Toast.info('请输入正确的数字');
        }
    }
    const onSubmit = async () => {
        let formData = form.getFieldsValue()
        console.log("form")
        console.log(formData)
        let flag = 0;
        if(!isNumber(parseFloat(formData["count"]))) {
            const inputNum = document.querySelector("#charge-input-num")
            inputNum.setAttribute("class","red-border");
            Toast.info("请输入正确的信息")
            flag = 1;
        }
        if(typeof(formData["description"]) == "undefined") {
            const inputText = document.getElementById("charge-input-des")
            console.log(inputText)
            console.log("inputText")
            inputText.setAttribute("class","red-border");
            Toast.info("描述不能为空")
            flag = 1;
        }

        if (flag) return ;
        formData["type"] = textInitType
        formData["date"] = dateStr
        formData["dateYear"] = yearStr
        formData["dateMonth"] = monthStr
        formData["dateDay"] = dayStr
        formData["typeInOut"] = typeInOut[initTypeInOut]
        const fetchSaveData = async () => {
            try{
                const result = await axios.post(fetchUrl["save"], formData)
                console.log(result)
                console.log("result")
            }catch (e) {
                console.log(e)
            }
        }
        await fetchSaveData()
        history.push("/")
        console.log(fresh)
        console.log("fresh")
        setFresh([!fresh[0]])
        onCloseModal();
        // setFresh(!fresh)
    }

    return (
        <form className="popup-list">
            <div className="charge-input-date">
                <span>{textInitType}</span>
                <DatePicker
                    mode="date"
                    title="Select Date"
                    extra="Optional"
                    value={nowDate}
                    onChange={date => setNowDate(date)}
                >
                    <div>
                        <i className="iconfont icon-icon">{dateStr}</i>
                    </div>
                </DatePicker>
            </div>
            <List>
                <div id="charge-input-des">
                    <InputItem
                        {...getFieldProps('description')}
                        clear
                        placeholder="输入描述"
                        defaultValue=""
                    >描述</InputItem>
                </div>
                <div  id="charge-input-num" className="non-red-border">
                    <InputItem
                        {...getFieldProps('money3')}
                        // type='money'
                        // error={hasError}
                        // defaultValue={100}
                        // onErrorClick={onErrorClick}
                        placeholder="输入金额"
                        clear
                        // onChange={(v) => { console.log('onChange', v); }}
                        // moneyKeyboardAlign="left"
                        // moneyKeyboardWrapProps={moneyKeyboardWrapProps}
                    >金额</InputItem>
                </div>

            </List>
            <Button onClick={onSubmit} className="charge-input-submit">确认</Button>
        </form>
    )
}
const ChargeInputWrapper = createForm()(ChargeInput);





const TextTypeOutButtonAll = ({initTypeInOut, iconData, iconText}) => {
    let [modal,setModal] = useState(false)

    const onCloseModal = () => {
        setModal(false);
    }
    const onTurnModal = () => {
        setModal(true);
    }

    let [initType,setinitType] = useState("")

    const onClickIcon = (v) => {
        const iconType = v.target.getAttribute("data-icon")
        onTurnModal()
        setModal(true)
        console.log("onClickIncon")
        console.log(modal)
        setinitType(iconType)
        // textInitType = textType[textTypeIconOut][textTypeIconOut.indexOf(initType)]
    }


    const textTypeOutButton = iconData.map((item,index) => {
        const iconClassName = `iconfont icon-${item} text-type_icon`
        return (
                <div className="charge-content-container" >
                    <Modal
                            transparent={true}
                            popup
                            closable = {true}
                            visible={modal}
                            onClose={onCloseModal}
                            animationType="slide-up"
                            // afterClose={() => { alert('afterClose'); }}
                    >
                        <ChargeInputWrapper onCloseModal={onCloseModal}
                                            initType={initType}
                                            initTypeInOut={initTypeInOut}
                                            iconData = {iconData}
                                            iconText={iconText}
                        />
                    </Modal>
                    <i onClick={onClickIcon} className={iconClassName} data-icon={item}></i>
                    <div>{iconText[index]}</div>
                </div>

        )
    })

    return (
        <div className="charge-title_button">
            {textTypeOutButton}
        </div>
    )
}


const TabStyle = {
    "tabBarBackgroundColor":"#181c28",
    "tabBarUnderlineStyle":"#fae46d",
    "grey":"#8b8989"
}



const Charge = ({fresh}) => {
    let [initTypeInOut, setInitTypeInOut] = useState(0)

    const ChargeTitle = () => {
        return (
            <div className="charge-title_container">
                <Tabs tabs={tabs}
                      initialPage = {initTypeInOut}
                      onChange = {(tab, index) => { setInitTypeInOut(index);console.log('onChange', index, tab); }}
                      onTabClick = {(tab, index) => { console.log('onTabClick', index, tab); }}
                      tabBarBackgroundColor = "#181c28"
                      tabBarInactiveTextColor = {TabStyle["grey"]}
                      tabBarUnderlineStyle ={{"border":"2px solid #fae46d"}}
                      tabBarActiveTextColor = "#fff"
                >
                    {typeInOut.map((item, index) =>
                        <TextTypeOutButtonAll initTypeInOut={initTypeInOut} iconData={textTypeIcon[item]} iconText={textType[item]}/>
                    )}
                </Tabs>
            </div>
        )
    }


    return (
        <div className="charge-title">
            <ChargeTitle/>
        </div>
    )
}

export default Charge;
