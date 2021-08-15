import React, {useState} from 'react';
import {textApp, textType,textCountOut,textCountIn, formatInOut} from "../../Config";
import {Button, DatePicker, List} from 'antd-mobile';

const Detail = ({data}) => {
    console.log(data)
    console.log("data?")
    return (
        <div className="detail-container">
            <DetailHeader/>
            <DetailContent data={data}/>
        </div>
    )
}

const DetailMonthInOut = () => {
    const nowTimeStamp = Date.now();
    const now = new Date(nowTimeStamp);
    let [nowDate,setNowDate] = useState(now)
    function formatDate(date) {
        /* eslint no-confusing-arrow: 0 */
        const pad = n => n < 10 ? `0${n}` : n;
        const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
        const yearStr = `${date.getFullYear()}`;
        const monthStr = `${pad(date.getMonth() + 1)}`;
        return {yearStr,monthStr}
    }

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
        let itemNum = {"countIn":0,"countOut":0};
        const detailContentComponentItem = data[item].map((item2,index2)=>
        {
            console.log(item2)
            console.log("item2")
            itemNum[item2["type"]] += item2[item2["type"]]
            return (
                <List.Item arrow="empty" className="detail-content_componentItem">
                    <span className="detail-content_component_icon">{item2["sourceType"]}</span>
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
                    {itemNum["countIn"]!==0?<span className="detail-content_total_inout">{textCountIn}:{itemNum["countIn"]}</span>:null}
                    {itemNum["countOut"]!==0?<span className="detail-content_total_inout">{textCountOut}:{itemNum["countOut"]}</span>:null}
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
