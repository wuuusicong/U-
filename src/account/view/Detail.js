import React from 'react';

const Detail = ({data}) => {
    console.log(data)
    console.log("data?")
    return (
        <div>
            <DetailHeader/>
            <DetailContent data={data}/>
        </div>
    )
}

const DetailHeader = () => {

    const DetailHeader_title = "i生活记账"
    const DetailHeader_month = () => {}

    return (
        <div className= "detail-header_container">
            <div className="detail-header_title">{DetailHeader_title}</div>
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
            <div>
                <div>
                    <span>{item}</span>
                    {itemNum["countIn"]!==0?<span>收入:{itemNum["countIn"]}</span>:null}
                    {itemNum["countOut"]!==0?<span>支出:{itemNum["countOut"]}</span>:null}
                </div>
                {detailContentComponentItem}
            </div>
        )
    }

    )

        return (
            <div>
                {detailContentComponent}
        </div>)
}




export default Detail;
