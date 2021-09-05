import React,{useState, useContext} from "react";
import {DataFresh, formatDate, typeInOut} from "../../Config";
import {useHistory} from "react-router-dom";
import {Button, DatePicker, InputItem, List, Toast} from "antd-mobile";
import axios from "axios";
import {fetchUrl} from "../FetchData";
import {createForm} from "rc-form";

const ChargeInput = ({onCloseModal, form, initType, initTypeInOut, iconData, iconText, date=""}) => {

    const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
    let moneyKeyboardWrapProps;
    if (isIPhone) {
        moneyKeyboardWrapProps = {
            onTouchStart: e => e.preventDefault(),
        };
    }
    let now;
    if(date.length===0){
        const nowTimeStamp = Date.now();
        now = new Date(nowTimeStamp);
    }else {
        console.log(date)
        console.log("date")
        now = new Date(date);
    }
    const {getFieldProps} = form;

    let [nowDate,setNowDate] = useState(now)
    console.log(nowDate)
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
    // const onErrorClick = () => {
    //     if (hasError) {
    //         Toast.info('请输入正确的数字');
    //     }
    // }
    const onSubmit = async () => {
        let formData = form.getFieldsValue()
        const count = parseFloat(formData["count"])

        let flag = 0;
        let flag1 = 0;

        const description = formData["description"]
        console.log("description")
        console.log(description)
        if (typeof(description) == "undefined"){
            flag1  = 1;
        }else {
            const descriptionRes = description.replace(/\s+/g, "");
            if(descriptionRes.length ===0 ) {
                flag1  = 1;
            }
        }


        if(count.toString() === "NaN") {
            flag = 1;
        }
        if(flag&&flag1) {
            Toast.info("请输入正确的描述和金额")
            return
        }
        if(flag1||flag) {
            if(flag1) Toast.info("请输入正确的描述")
            if(flag)  Toast.info("请输入正确的金额")
            return ;
        }

        // if(typeof(formData["description"]) == "undefined") {
        //     const inputText = document.getElementById("charge-input-des")
        //     console.log(inputText)
        //     console.log("inputText")
        //     inputText.setAttribute("class","red-border");
        //     Toast.info("描述不能为空")
        //     flag = 1;
        // }

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
                    >描述</InputItem>
                </div>
                <div  id="charge-input-num" className="non-red-border">
                    <InputItem
                        {...getFieldProps('count')}
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

export default ChargeInputWrapper;
