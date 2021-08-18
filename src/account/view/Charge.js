import React,{useState, useRef} from "react";
import {textType, textCountOut, textCountIn, textTypeIcon, formatDate, typeInOut, fetchUrl} from "../../Config";
import { createForm } from 'rc-form';
import {
    Tabs,
    WhiteSpace,
    Badge,
    Icon,
    InputItem,
    List,
    ActionSheet,
    WingBlank,
    Modal,
    Button,
    Toas,
    DatePicker
} from 'antd-mobile';
import axios from "axios";



const tabs = [
    { title: <Badge >{textCountOut}</Badge> },
    { title: <Badge >{textCountIn}</Badge> },
];
const textTypeIconOut = textTypeIcon[textCountOut];

const ChargeInput = ({onCloseModal, form, initType, initTypeInOut, iconData, iconText}) => {
    const {getFieldProps} = form;
    const nowTimeStamp = Date.now();
    const now = new Date(nowTimeStamp);
    let [nowDate,setNowDate] = useState(now)
    let textInitType = iconText[iconData.indexOf(initType)]

    let {yearStr, monthStr, dayStr, dateStr} = formatDate(nowDate)

    const onSubmit = () => {
        onCloseModal();
        console.log("form")
        let formData = form.getFieldsValue()
        formData["type"] = textInitType
        formData["date"] = dateStr
        formData["dateYear"] = yearStr
        formData["dateMonth"] = monthStr
        formData["dateDay"] = dayStr
        formData["typeInOut"] = typeInOut[initTypeInOut]
        const fetchSaveData = async () => {
            try{
                const result = await axios.post(fetchUrl["save"],formData)
                console.log(result)
                console.log("result")
            }catch (e) {
                console.log(e)
            }
        }
        fetchSaveData()
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
                <InputItem
                    {...getFieldProps('description')}
                    clear
                    placeholder="输入描述"
                >描述</InputItem>
                <InputItem
                    {...getFieldProps('count')}
                    type="money"
                    // defaultValue={100}
                    placeholder="输入金额"
                    clear
                    moneyKeyboardAlign="left"
                >金额</InputItem>
            </List>
            <Button onClick={onSubmit}>确认</Button>
        </form>
    )
}
const ChargeInputWrapper = createForm()(ChargeInput);








const TextTypeOutButtonAll = ({initTypeInOut, iconData, iconText}) => {
    let [modal,setModal] = useState(false)

    const onCloseModal = () => {
        setModal(false);
    }

    let [initType,setinitType] = useState("")

    let textInitType = initType;

    const onClickIcon = (v) => {
        const iconType = v.target.getAttribute("data-icon")
        setModal(true)
        setinitType(iconType)
        console.log(initType)
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




const TextTypeInButtonAll = () => {

    let [modal2,setmodal2] = useState(false)

    const textTypeInButton = textTypeIcon[textCountIn].map((item,index) => {
        return (
                <div className="charge-content-container" >
                    <Modal visible={modal2}
                           onClose={()=>setmodal2(false)}
                           animationType="slide-up"
                           afterClose={() => { alert('afterClose'); }}
                    >
                        <div>我显示出来了</div>
                    </Modal>
                    <Icon  type={item} size="lg" className="iconfont icon-zhanweifu charge-content-icon"></Icon>
                    <div>{textType[textCountIn][index]}</div>
                </div>
        )
    })
    return (
        <div className="charge-title_button">
            {textTypeInButton}
        </div>
    )
}

const Charge = () => {
    let [initTypeInOut, setInitTypeInOut] = useState(0)

    const ChargeTitle = () => {
        return (
            <div className="charge-title_container">
                <Tabs tabs={tabs}
                      initialPage={initTypeInOut}
                      onChange={(tab, index) => { setInitTypeInOut(index);console.log('onChange', index, tab); }}
                      onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
                >
                    {typeInOut.map((item, index) =>
                        <TextTypeOutButtonAll initTypeInOut={initTypeInOut} iconData={textTypeIcon[item]} iconText={textType[item]}/>
                    )}
                    {/*<TextTypeInButtonAll/>*/}
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
