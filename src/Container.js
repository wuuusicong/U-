import React,{useState, useEffect} from 'react';
// import Footer from "./Footer";
import {textFooter, formatData, DataFresh, footerIcon} from "./Config"

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Detail from "./account/view/Detail";
import Charge from "./account/view/Charge";
import axios from "axios";
import Diagram from "./account/view/Diagram";

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
    const FooterText = textFooter
    const FooterUrl = ["/", "/graph", "/account", "/others", "/my"]
    let [fresh,setFresh] = useState([true]);



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
            <DataFresh.Provider value={{fresh, setFresh}}>
            <Router>
                    <div id="main">
                    <Switch>
                        <Route path="/my">my</Route>
                        <Route path="/others">others</Route>
                        <Route path="/account"><Charge/></Route>
                        <Route path="/graph"><Diagram/></Route>
                        <Route path="/"><Detail fresh={{fresh, setFresh}}/></Route>
                    </Switch>
                </div>
                <Footer/>
            </Router>
            </DataFresh.Provider>
        </div>
    )
}
export default Container;
