import React,{useState, useEffect} from 'react';
// import Footer from "./Footer";
import {fetchUrl, formatData, dataFresh, footerIcon} from "./Config"

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Detail from "./account/view/Detail";
import Charge from "./account/view/Charge";
import axios from "axios";

const types = [1,2,3,4,5,6,7]


const initMockData =
    {
        "20210807":
                    [{
                        type:"countOut",
                        sourceType:1,
                        countOut:10.23,
                        description:"晚饭",
                        order:0
                    },
                        {
                            type:"countOut",
                            sourceType:1,
                            countOut:10.23,
                            description:"晚饭",
                            order:1
                        },
                        {
                            type:"countIn",
                            sourceType:1,
                            countIn:10.23,
                            description:"晚饭",
                            order:2
                        }
                    ],
        "20210806":
            [{
                type:"countOut",
                sourceType:1,
                countOut:10.23,
                description:"晚饭",
                order:0
            },
                {
                    type:"countOut",
                    sourceType:1,
                    countOut:10.23,
                    description:"晚饭",
                    order:1
                },
            ],
    }


const Container = () => {
    const FooterText = ["明细", "图表", "记账", "其他", "我的"]
    const FooterUrl = ["/", "/graph", "/account", "/others", "/my"]



    let [mockData,setMockData] = useState({});



    let [fresh,setFresh] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(fetchUrl["data"])
            const resultData = result["data"]["data"]
            // console.log(resultData)
            console.log("触发了effect没")
            setMockData(resultData)
        }
        fetchData();
    },[])

    const Footer = () => {
        const LinkDiv = FooterUrl.map((item, index) =>
            <div className="footer-item" key={index}>
                <Link to={item}>
                    <i className={'footer-item-icon iconfont icon-'+footerIcon[index]}></i>
                    <div>
                        {FooterText[index]}
                    </div>
                </Link>
            </div>)
        return (
                <div id="footer">
                    {LinkDiv}
                </div>

        )
    }

    // const Main = () => {
    //     return (
    //
    //     )
    // }

    return (
        <div id="app">
            <dataFresh.Provider value={{fresh, setFresh, mockData}}>
            <Router>
                    <div id="main">
                    <Switch>
                        <Route path="/my">my</Route>
                        <Route path="/others">others</Route>
                        <Route path="/account"><Charge fresh={{fresh, setFresh}}/></Route>
                        <Route path="/graph">graph</Route>
                        <Route path="/"><Detail data={mockData} fresh={fresh}/></Route>
                    </Switch>
                </div>
                <Footer/>
            </Router>
            </dataFresh.Provider>
        </div>
    )
}
export default Container;
