import React, {useState} from 'react';
import {textApp, textType, textTypeIcon, textCountOut, textCountIn, formatInOut, formatDate, formatData} from "../../Config";
import {Button, DatePicker, List} from 'antd-mobile';

const Detail = ({data}) => {
    const dataResult = formatData(data)
    console.log(dataResult)
    console.log("dataResult")
    return (
        <div className="detail-container">
            <DetailHeader/>
            <DetailContent data={dataResult}/>
        </div>
    )
}

const DetailMonthInOut = () => {
    const nowTimeStamp = Date.now();
    const now = new Date(nowTimeStamp);
    let [nowDate,setNowDate] = useState(now)

    let {yearStr,monthStr} = formatDate(nowDate)
    return (
        <div className="detail-monthInOut_container">
            <div>
                <DatePicker
                    mode="month"
                    title="Select Date"
                    extra="Optional"
                    value={nowDate}
                    onChange={date => setNowDate(date)}
                >
                    <div>
                        <div>{yearStr}</div>
                        <div>{monthStr}</div>
                    </div>
                </DatePicker>
            </div>
            <div>
                <div>收入</div>
                <div>0.00</div>
            </div>
            <div>
                <div>支出</div>
                <div>1320.99</div>
            </div>
        </div>
    )
}

const DetailHeader = () => {
    return (
        <div className= "detail-header_container">
            <div className="detail-header_title">{textApp}</div>
            <DetailMonthInOut/>
        </div>
    )
}


const DetailContent = ({data}) => {

    const detailContentComponent = Object.keys(data).map((item,index)=>
    {
        let itemNum = {"支出":0,"收入":0};
        const detailContentComponentItem = data[item].map((item2,index2)=>
        {
            console.log(item2)
            console.log("item2")
            itemNum[item2["typeInOut"]] += parseInt(item2["count"])
            console.log(itemNum)
            const iconClassNameEn = textTypeIcon[item2["typeInOut"]][textType[item2["typeInOut"]].indexOf(item2["type"])]
            const iconClassName = `iconfont icon-${iconClassNameEn} detail-content_component_icon`
            return (
                <List.Item arrow="empty" className="detail-content_componentItem">
                    <i className={iconClassName}></i>
                    <span className="detail-content_component_description">{item2["description"]}</span>
                    <span className="detail-content_component_count">{formatInOut(item2)}</span>
                </List.Item>
            )
            // return (
            //     <div className="detail-content_component">
            //         <div className="detail-content_component_icon">{item2["sourceType"]}</div>
            //         <div className="detail-content_component_description">{item2["description"]}</div>
            //         <div className="detail-content_component_count">{item2["count"]}</div>
            //     </div>
            // )
        }
            )

        return (
            <div className="detail-content_container_2">
                <div className="detail-content_total">
                    <span className="detail-content_total_month">{item}</span>
                    {itemNum["收入"]!==0?<span className="detail-content_total_inout">{textCountIn}:{itemNum["收入"]}</span>:null}
                    {itemNum["支出"]!==0?<span className="detail-content_total_inout">{textCountOut}:{itemNum["支出"]}</span>:null}
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
