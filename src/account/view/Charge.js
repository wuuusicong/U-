import React from "react";
import {textType,textCountOut,textCountIn} from "../../Config";

const Charge = () => {

    const ChargeTitle = () => {
        return (
            <div>
                <span><button>{textCountOut}</button></span>
                <span><button>{textCountIn}</button></span>
                <span><button>取消</button></span>
            </div>
        )
    }


    const textTypeOutButton = textType[textCountOut].map((item,index) => {
        return (
            <div>
                <i className="iconfont icon-zhanweifu"></i>
                <div>{item}</div>
            </div>
        )
    })
    return (
        <div className="charge-title">
            <ChargeTitle/>
            <div className="charge-title-content">
                {textTypeOutButton}
            </div>
        </div>
    )
}

export default Charge;
