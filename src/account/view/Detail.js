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
    DetailNoData
} from "../../Config";
import {fetchData} from "../FetchData";
import {Button, DatePicker, List, WingBlank} from 'antd-mobile';
import axios from "axios";

const DateContext = React.createContext(null);
const DataContext = React.createContext({});

const Detail = () => {

    const nowTimeStamp = Date.now();
    const now = new Date(nowTimeStamp);
    let [detailDate, setDetailDate] = useState(now)
    let {yearStr, monthStr} = formatDate(detailDate)

    let [mockData, setMockData] = useState({});
    const {fresh, setFresh} = useContext(DataFresh);

    useEffect(() => {
        fetchData(setMockData, {"dateYear":yearStr, "dateMonth":monthStr})
    }, fresh)


    const dataResult = formatData(mockData)
    const dateResultLength = Object.keys(dataResult).length;

    return (
        <DateContext.Provider value={{detailDate, setDetailDate}}>
            <DataContext.Provider value={{mockData, setMockData}}>
            <div className="detail-container">
                <DetailHeader date={{yearStr,monthStr}}/>
                {dateResultLength!==0? <DetailContent data={dataResult}/>:<DetailNoData/>}
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
            <DetailMonthInOut date={date}/>
        </div>
    )
}


const DetailContent = ({data}) => {

    const detailContentComponent = Object.keys(data).map((item,index)=>
    {
        let itemNum = {"支出":0,"收入":0};
        const detailContentComponentItem = data[item].map((item2,index2)=>
        {
            // console.log(item2)
            // console.log("item2")
            itemNum[item2["typeInOut"]] += parseFloat(item2["count"])
            console.log(itemNum)
            const iconClassNameEn = textTypeIcon[item2["typeInOut"]][textType[item2["typeInOut"]].indexOf(item2["type"])]
            const iconClassName = `iconfont icon-${iconClassNameEn} detail-content_component_iconfont`
            return (
                <List.Item arrow="empty" className="detail-content_componentItem">
                    <span className="detail-content_component_icon_container">
                        <div className="detail-content_component_icon">
                            <i className={iconClassName}></i>
                        </div>
                    </span>
                    <span className="detail-content_component_description">{item2["description"]}</span>
                    <span className="detail-content_component_count">{formatInOut(item2)}</span>
                </List.Item>
            )
        }
            )

        return (
            <div className="detail-content_container_2">
                <div className="detail-content_total">
                    <span className="detail-content_total_month">{item}</span>
                    <span className="detail-content_total_inout">
                        {/*<span>{itemNum["收入"]!==0? textCountIn + ':'+itemNum["收入"]:""}</span>*/}
                        {/*<span>{itemNum["支出"]!==0?textCountOut + ':' + itemNum["支出"]:""}</span> */}
                        {itemNum["收入"]!==0? <span>{textCountIn + ':'+itemNum["收入"]}</span>:null}
                        {itemNum["支出"]!==0? <span>{textCountOut + ':'+itemNum["支出"]}</span>:null}
                    </span>
                </div>
                <List className="date-picker-list" style={{ backgroundColor: 'white' }}>
                    {detailContentComponentItem}
                </List>
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




export default Detail;
