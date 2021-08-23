import React, {useState, useContext, useEffect}from "react";
import {textCountOut, textCountIn, formatDate, DataFresh, formatData, DetailNoData} from "../../Config";
import {List, SegmentedControl} from "antd-mobile";
import {tintColor} from "./Diagram.scss"
import {fetchData} from "../FetchData";
import *as d3 from "d3";



const Diagram = () => {
    const typeInOut = [textCountOut, textCountIn];
    const typePeriod = ["周", "月", "年"]
    const typeDate = {"周":["本周", "上周", "其他"], "月":["本月", "上月", "其他"]}
    const nowTimeStamp = Date.now();
    const now = new Date(nowTimeStamp);
    let [detailDate, setDetailDate] = useState(now)
    let {yearStr, monthStr} = formatDate(detailDate)

    let [mockData, setMockData] = useState({});
    const dataResult = formatData(mockData)
    const dateResultLength = Object.keys(dataResult).length;

    useEffect(() => {
        fetchData(setMockData, {"dateYear":yearStr, "dateMonth":monthStr})
    }, [])


    return (
        <div>
            <DiagramHeader typeInOut={typeInOut} typePeriod={typePeriod}/>
            {dateResultLength!==0? <DiagramContent data={dataResult}/>:<DetailNoData/>}
        </div>
    )
}

const DiagramHeader = ({typeInOut, typePeriod}) => {
    const tintColor = '#171712';

    const onChange = (e) => {
        console.log(`selectedIndex:${e.nativeEvent.selectedSegmentIndex}`);
    }
    const onValueChange = (value) => {
        console.log(value);
    }
    return (
        <div className="diagram-header">
            <SegmentedControl
                values={typeInOut}
                onChange={onChange}
                onValueChange={onValueChange}
                tintColor={tintColor}
                className= "diagram-header_inout"
            />
            <SegmentedControl
                values={typePeriod}
                onChange={onChange}
                onValueChange={onValueChange}
                selectedIndex={1}
                tintColor={tintColor}
                className= "diagram-header_period"
            />
        </div>
    )
}
const DiagramContent = ({data}) => {
    console.log(data)
    console.log("data")
    return (
        <div>
            <div>本月</div>
            <DiagramLineChart data={data}/>
            <DiagramBarChart data={data}/>
        </div>
    )
}

const DiagramLineChart = ({data}) => {
    const getDateY = (data) => {
        const nowTimeStamp = Date.now();
        let tmpDate = new Date(nowTimeStamp);
        let tmpMonthLength = new Date(tmpDate.getFullYear(), tmpDate.getMonth()+1, 0).getDate();
        // let dataX= [...new Array(tmpMonthLength).keys()]
        let dataY = new Array(tmpMonthLength).fill(0);
        Object.keys(data).forEach((item, index) => {
            let itemNum = {"支出":0,"收入":0};
            // console.log(item)
            data[item].forEach((item2, index2) => {
                itemNum[item2["typeInOut"]] += parseFloat(item2["count"])
            })
            let itemDay = parseInt(item.split("-")[2]);
            dataY[itemDay] = itemNum["支出"]
            // tmp[itemDay] = itemNum["支出"]
            // return tmp
        })
        // console.log("data")
        // console.log(dataX)
        // console.log(dataY)
        return dataY
    }
    let dataY = getDateY(data)

    useEffect(() => {
        drawLineChart(dataY)
    }, [])
    return (
        <svg className="diagram-svg_line" id="svg-line">LineChart</svg>
    )
}

const drawLineChart = (dataY) => {
    // d3.select("#svg-line").removeChild();
    const svgLine = document.querySelector("#svg-line")
    const width = svgLine.clientWidth;
    const height = svgLine.clientHeight;
    const margin = {left:10, right:10, top:20, bottom:20}
    const g_width=width-margin.left-margin.right;
    const g_height=height-margin.top-margin.bottom;
    console.log(document.querySelector("#svg-line"))
    console.log( height)
    console.log("{width, height}")
    let g = d3.select("#svg-line").append("g")
        .attr("transform","translate("+margin.left+","+margin.top+")");
    let scale_x = d3.scaleLinear()
        .domain([0,dataY.length-1])
        .range([0,g_width])
    let scale_y = d3.scaleLinear()
        .domain([-10, d3.max(dataY)])
        .range([g_height, 0]);
    var line_generator= d3.line()
        .x(function (d,i) {
            return scale_x(i);
        })
        .y(function (d) {
            return scale_y(d);
        })
        .curve(d3.curveMonotoneX);
    g.append("path")
        .attr("d",line_generator(dataY))
        .attr("class","svg-line-path")
    // g.append("g")
    //     .call(d3.axisLeft(scale_y))
    g.append("g")
        .call(d3.axisBottom(scale_x))
        .attr("transform","translate(0,"+g_height+")");
    g.append("line")
        .attr("x1", scale_x(0))
        .attr("y1", scale_y(d3.max(dataY)))
        .attr("x2", g_width)
        .attr("y2", scale_y(d3.max(dataY)))
        .attr("stroke","#000")
        .attr("stroke-width",1);
    g.append("text")
        .text(d3.max(dataY)+' ¥')
        .attr("transform",`translate(${g_width}, ${0})`)
        .attr("dy","-0.2em")
        .attr("text-anchor","end")
}
const DiagramBarChart = () => {
    return (
        <div>123</div>
    )
}

export default Diagram;
