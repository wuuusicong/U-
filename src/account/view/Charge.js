import React,{useState} from "react";
import {textType,textCountOut,textCountIn, textTypeIcon} from "../../Config";
import { Tabs, WhiteSpace, Badge, Icon } from 'antd-mobile';


const tabs = [
    { title: <Badge >{textCountOut}</Badge> },
    { title: <Badge >{textCountIn}</Badge> },
];


const textTypeOutButton = textTypeIcon[textCountOut].map((item,index) => {
    return (
        <div className="charge-content-container">
            <Icon type={item} size="lg" className="iconfont icon-zhanweifu charge-content-icon"></Icon>
            <div>{textType[textCountOut][index]}</div>
        </div>
    )
})
const textTypeInButton = textTypeIcon[textCountIn].map((item,index) => {
    return (
        <div className="charge-content-container">
            <Icon type={item} size="lg" className="iconfont icon-zhanweifu charge-content-icon"></Icon>
            <div>{textType[textCountIn][index]}</div>
        </div>
    )
})

const Charge = () => {
    let [initInOut,setinitInOut] = useState(textCountOut)

    const ChargeTitle = () => {
        return (
            <div className="charge-title_container">
                <Tabs tabs={tabs}
                      initialPage={1}
                      onChange={(tab, index) => { console.log('onChange', index, tab); }}
                      onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
                >
                    <div className="charge-title_button">
                        {textTypeOutButton}
                    </div>
                    <div className="charge-title_button">
                        {textTypeInButton}
                    </div>
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
