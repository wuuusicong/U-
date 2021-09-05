import React,{useState, useContext} from "react";
import {DataFresh, formatDate, textType, textTypeIcon} from "../../Config";
import {useHistory} from "react-router-dom";
import {Button, DatePicker, InputItem, List, Modal, Toast} from "antd-mobile";
import axios from "axios";
import {fetchUrl} from "../FetchData";
import {createForm} from "rc-form";


const ItemAll = ({onCloseModal, params, mockData, setMockData}) => {
    console.log("params")
    console.log(params)
    const {type, typeInOut, date, description, count, _id} = params
    return (
        <div>
            <ItemInputWrapper onCloseModal={onCloseModal}
                              iconType={type}
                              typeInOut={typeInOut}
                              date={date}
                              placeDes={description}
                              placeIn={count}
                              _id={_id}
                              mockData={mockData}
                              setMockData={setMockData}
            />
        </div>
    )
}
const ItemInput = ({onCloseModal, form, iconType, typeInOut, date, placeDes, placeIn, _id, mockData, setMockData}) => {

    let now = new Date(date);
    const {getFieldProps} = form;
    getFieldProps('description',{
        initialValue:placeDes
    })
    getFieldProps('count',{
        initialValue:placeIn
    })

    let [nowDate,setNowDate] = useState(now)

    console.log(nowDate)
    let textInitType = iconType

    let {yearStr, monthStr, dayStr, dateStr} = formatDate(nowDate)

    // let history = useHistory()
    // const {fresh, setFresh} = useContext(DataFresh);

    const onSubmit = () => {
        let formData = form.getFieldsValue()
        const count = parseFloat(formData["count"])



        console.log(formData)
        console.log("formData")
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

        const newMockData = mockData.map((item,index) => {
            if(item["_id"] ===_id){
                return {
                    ...item,"date":dateStr,"description":description,"count":count
                }
            }
            return item;
        })
        // console.log("date??")
        // console.log({"date":dateStr,"description":description,"count":count})
        setMockData(newMockData)


        // formData["type"] = textInitType
        formData["date"] = dateStr
        formData["_id"] = _id
        // formData["dateYear"] = yearStr
        // formData["dateMonth"] = monthStr
        // formData["dateDay"] = dayStr
        // formData["typeInOut"] = typeInOut
        const fetchSaveData = async () => {
            try{
                console.log(formData)
                console.log("formData12312")
                const result = await axios.post(fetchUrl["edit"], formData)
                console.log(result)
                console.log("result")
            }catch (e) {
                console.log(e)
            }
        }
        fetchSaveData()
        // history.push("/")
        // console.log(fresh)
        // console.log("fresh")
        // setFresh([!fresh[0]])
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
                        defaultValue={placeDes}
                    >描述</InputItem>
                </div>
                <div  id="charge-input-num" className="non-red-border">
                    <InputItem
                        {...getFieldProps('count')}
                        // type='money'
                        // error={hasError}
                        // defaultValue={100}
                        // onErrorClick={onErrorClick}
                        defaultValue={placeIn}
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
const ItemInputWrapper = createForm()(ItemInput);

export default ItemAll;
