import React from 'react';
// import Footer from "./Footer";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

const types = [1,2,3,4,5,6,7]

const mockData = [
    {type:1,
    count:10.23,
    description:"晚饭",
    dateWeek: "星期三",
    dateYear: 2022,
    dateMoth: 8,
    dateDay: 4
},{
        type:1,
        count:10.23,
        description:"晚饭",
        dateWeek: "星期三",
        dateYear: 2022,
        dateMoth: 8,
        dateDay: 4,
    },
    {
        type:1,
        count:10.23,
        description:"晚饭",
        dateWeek: "星期三",
        dateYear: 2022,
        dateMoth: 8,
        dateDay: 4,
    },
]


const Container = () => {
    const FooterText = ["明细", "图表", "记账", "其他", "我的"]
    const FooterUrl = ["/", "/graph", "/account", "/others", "/my"]

    const Footer = () => {
        const LinkDiv = FooterUrl.map((item, index) =>
            <div className="footer-item" key={index}>
                <Link to={item}>
                    {FooterText[index]}
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
            <Router>
                <div id="main">
                <Switch>
                        <Route path="/my">my</Route>
                        <Route path="/others">others</Route>
                        <Route path="/account">account</Route>
                        <Route path="/graph">graph</Route>
                        <Route path="/">index</Route>
                </Switch>
                </div>
                <Footer/>
            </Router>
        </div>
    )
}
export default Container;
