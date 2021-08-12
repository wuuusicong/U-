import React from 'react';
import {textApp, textType,textCountOut,textCountIn} from "../../Config";

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

const DetailHeader = () => {

    return (
        <div className= "detail-header_container">
            <div className="detail-header_title">{textApp}</div>
        </div>
    )
}

const DetailContent = ({data}) => {

    const detailContentComponent = Object.keys(data).map((item,index)=>
    {
        let itemNum = {"countIn":0,"countOut":0};
        const detailContentComponentItem = data[item].map((item2,index2)=>
        {

            itemNum[item2["type"]] += item2[item2["type"]]
            return (
                <div className="detail-content_component">
                    <div className="detail-content_component_icon">{item2["sourceType"]}</div>
                    <div className="detail-content_component_description">{item2["description"]}</div>
                    <div className="detail-content_component_count">{item2["count"]}</div>
                </div>
            )
        }
            )
        return (
            <div className="detail-content_container_2">
                <div className="detail-content_total">
                    <span className="detail-content_total_month">{item}</span>
                    {itemNum["countIn"]!==0?<span className="detail-content_total_inout">{textCountIn}:{itemNum["countIn"]}</span>:null}
                    {itemNum["countOut"]!==0?<span className="detail-content_total_inout">{textCountOut}:{itemNum["countOut"]}</span>:null}
                </div>
                {detailContentComponentItem}
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
