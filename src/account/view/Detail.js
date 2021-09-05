import React, {useState, useContext, useEffect} from 'react';
import {
    textApp,
    textType,
    textTypeIcon,
    textCountOut,
    textCountIn,
    formatInOut,
    formatDate,
    formatData,
    DataFresh,
    DetailNoData,
    fetchUrl,
    commonAxios,
} from "../../Config";
import {fetchData} from "../FetchData";
import {Button, DatePicker, InputItem, List, Modal, SwipeAction} from 'antd-mobile';
import axios from "axios";
import {createForm} from "rc-form";
import ChargeInputWrapper from "../utility/ChargeInput";
import ItemAll from "../utility/ItemInput";

const DateContext = React.createContext(null);
const DataContext = React.createContext({});

const Detail = () => {

    const nowTimeStamp = Date.now();
    const now = new Date(nowTimeStamp);
    let [detailDate, setDetailDate] = useState(now)
    let {yearStr, monthStr} = formatDate(detailDate)

    let [mockData, setMockData] = useState({});
    const {fresh, setFresh} = useContext(DataFresh);

    const dateParams = {"dateYear":yearStr, "dateMonth":monthStr}
    useEffect(() => {
        fetchData(setMockData, dateParams)
    }, fresh)

    const mockDataLength = mockData.length;
    // const dateResultLength = Object.keys(dataResult).length;/

    return (
        <DateContext.Provider value={{detailDate, setDetailDate}}>
            <DataContext.Provider value={{mockData, setMockData}}>
            <div className="detail-container">
                <DetailHeader date={{yearStr,monthStr}}/>
                {mockDataLength!==0? <DetailContent mockData={mockData} setMockData={setMockData} dateParams={dateParams}/>:<DetailNoData/>}
                {/*<DetailNoData/>*/}
            </div>
            </DataContext.Provider>
        </DateContext.Provider>
    )
}


const DetailMonthInOut = ({date}) => {

    const {fresh, setFresh} = useContext(DataFresh);

    let {yearStr,monthStr} = date

    const {detailDate, setDetailDate} = useContext(DateContext)


    console.log(useContext(DataContext))
    const {mockData, setMockData} = useContext(DataContext)

    let itemNum = {"支出":0,"收入":0};
    console.log(mockData)
    console.log("mockData")
    if (Object.keys(mockData).length!==0) {
        // let filterMockData = mockData.filter((item, index) => {
        //     if((item["dateYear"]+item["dateMonth"]) === (yearStr + monthStr)) return true;
        // })
        mockData.forEach((item, index) => {
            itemNum[item["typeInOut"]] += parseFloat(item["count"])
        })
    }


    const dateChange = (date) => {
        setDetailDate(date)
        setFresh([!fresh[0]])
    }

    return (
        <div className="detail-monthInOut_container">
            <div className="detail-monthInOut_container2">
                <DatePicker
                    mode="month"
                    title="Select Date"
                    extra="Optional"
                    value={detailDate}
                    onChange={dateChange}
                >
                    <div className="detail-monthInOut_left">
                        <div >{yearStr}</div>
                        <div className="detail-monthInOut_in">{monthStr+'月'}<i className="iconfont icon-xia"></i></div>
                    </div>
                </DatePicker>
            </div>
            <div className="detail-monthInOut_right">
                <div >
                    <div >收入</div>
                    <div>{itemNum["收入"]}</div>
                </div>
                <div>
                    <div>支出</div>
                    <div>{itemNum["支出"]}</div>
                </div>
            </div>
        </div>
    )
}

const DetailHeader = ({date}) => {
    return (
        <div className= "detail-header_container">
            <div className="detail-header_title">{textApp}</div>
            {/*<i className="detail-header_icon iconfont icon-tubiaozhizuomoban "></i>*/}
            <div className="detail-header_icon">{textApp}</div>
            <DetailMonthInOut date={date}/>
        </div>
    )
}


const DetailContent = ({mockData, setMockData, dateParams}) => {

    const data = formatData(mockData)

    const deleteUrl = fetchUrl["delete"]
    const deleteItem = async (itemId) => {
        await commonAxios(deleteUrl,{"_id": itemId, "date": dateParams})
        const newMockData = mockData.filter((item, index) => {
            return item["_id"]!==itemId
        })
        setMockData(newMockData);
    }
    console.log(data)
    console.log("data??")



    let [modal,setModal] = useState(false)

    const onCloseModal = () => {
        setModal(false);
    }
    const onTurnModal = () => {
        setModal(true);
    }
    const onClickIcon = (v, item2) => {
        // v.stopPropagation();
        console.log(params)
        console.log("id")
        const iconType = v.target.getAttribute("data-icon")
        onTurnModal()
        setModal(true)
        setParams(item2)

        // setinitType(iconType)
        // textInitType = textType[textTypeIconOut][textTypeIconOut.indexOf(initType)]
    }
    const [params, setParams] = useState({})
    const ModalItem = ({modal, params, mockData, setMockData}) => {
        return (
            <Modal
                transparent={true}
                popup
                closable = {true}
                visible={modal}
                onClose={onCloseModal}
                animationType="slide-up"
                // afterClose={() => { alert('afterClose'); }}
            >
                <ItemAll onCloseModal={onCloseModal} params={params} mockData={mockData} setMockData={setMockData}
                />
            </Modal>
        )
    }

    const detailContentComponent = Object.keys(data).map((item,index)=>
    {
        let itemNum = {"支出":0,"收入":0};
        const detailContentComponentItem = data[item].map((item2,index2)=>
        {
            // console.log(item2)
            // console.log("item2")
            itemNum[item2["typeInOut"]] += parseFloat(item2["count"])
            // console.log(itemNum)
            const iconClassNameEn = textTypeIcon[item2["typeInOut"]][textType[item2["typeInOut"]].indexOf(item2["type"])]
            const iconClassName = `iconfont icon-${iconClassNameEn} detail-content_component_iconfont`
            console.log(item2)
            console.log("item2")
            return (
                <SwipeAction
                    style={{ backgroundColor: 'gray' }}
                    autoClose
                    right={[
                        {
                            text: 'Cancel',
                            // onPress: () => console.log('cancel'),
                            style: { backgroundColor: '#ddd', color: 'white' },
                        },
                        {
                            text: 'Delete',
                            onPress: (e) => deleteItem(item2["_id"]),
                            style: { backgroundColor: '#181c28', color: 'white' },
                        },
                    ]}
                    // onOpen={() => console.log('global open')}
                    // onClose={() => console.log('global close')}
                >

                <List.Item key={index2}
                           onClick={(e) => onClickIcon(e, item2)}
                           arrow="empty" className="detail-content_componentItem">
                    <span className="detail-content_component_icon_container">
                        <div className="detail-content_component_icon">
                            <i className={iconClassName}></i>
                        </div>
                    </span>
                    <span className="detail-content_component_description">{item2["description"]}</span>
                    <span className="detail-content_component_count">
                        {formatInOut(item2)}</span>
                    {/*<InputItem disabled={true} defaultValue={item2["description"]} className="detail-content_component_description"/>*/}
                    {/*<InputItem defaultValue={formatInOut(item2)} className="detail-content_component_count"/>*/}
                </List.Item>
                </SwipeAction>
            )
        }
            )


        return (

            <div className="detail-content_container_2">
                <div className="detail-content_total">
                    <div className="detail-content_total_month">{item}</div>
                    <div className="detail-content_total_inout">
                        {/*<span>{itemNum["收入"]!==0? textCountIn + ':'+itemNum["收入"]:""}</span>*/}
                        {/*<span>{itemNum["支出"]!==0?textCountOut + ':' + itemNum["支出"]:""}</span> */}
                        {itemNum["收入"]!==0? <span>{textCountIn + ':'+itemNum["收入"]}</span>:<span></span>}
                        {itemNum["支出"]!==0? <span>{textCountOut + ':'+itemNum["支出"]}</span>:<span></span>}
                    </div>
                </div>
                <List className="date-picker-list" style={{ backgroundColor: 'white' }}>
                    {detailContentComponentItem}
                </List>
            <ModalItem modal={modal} params={params} mockData={mockData} setMockData={setMockData}/>
            </div>
        )
    }
    )



        return (
            <div className="detail-content_container">
                {detailContentComponent}
            </div>
        )
}

const detailContentItem = ({itemData, form}) => {
    const {getFieldProps} = form;

    return (
        <InputItem
            {...getFieldProps('itemData')}
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
    )
}

const detailContentItemWrapper = createForm(detailContentItem) ;



export default Detail;
