import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";



const Footer = () => {
    const FooterText = ["明细", "图表", "记账", "其他", "我的"]
    const FooterUrl = ["/", "/graph", "/account", "/others", "/my"]
    const LinkDiv = FooterUrl.map((item, index) =>
        <div className="FooterItem" key={index}>
            <Link to={item}>
                {FooterText[index]}
            </Link>
        </div>)
    const RouteDiv = FooterUrl.reverse().map((item,index) =>
        <Route path={item}>
            {item}
        </Route>
    )

    return (
        <Router>
            <div>
                {LinkDiv}
            </div>
            <Switch>
                {RouteDiv}
            </Switch>
        </Router>
    )
}



export default Footer;
// Route 中"/" 必须在最后，不然无法匹配(BUG)
