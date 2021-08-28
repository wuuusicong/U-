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


    useEffect(() => {
        fetchData(setMockData,{"dateYear":yearStr, "dateMonth":monthStr})
    }, [])
    const dataResult = formatData(mockData)
    const dateResultLength = Object.keys(dataResult).length;

    return (
        <div className="diagram-container">
            <DiagramHeader typeInOut={typeInOut} typePeriod={typePeriod}/>
            {dateResultLength!==0? <DiagramContent data={dataResult} mockData={mockData}/>:<DetailNoData/>}
        </div>
    )
}

const DiagramHeader = ({typeInOut, typePeriod}) => {
    const tintColor = '#fae46d';

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
const DiagramContent = ({data, mockData}) => {
    const filterData = (mockData, filter) => {
        return mockData.filter((item, index) => {
            return item[filter["type"]] === filter["value"]
        })
    }
    const barMockData = filterData(mockData, {"type":"typeInOut", "value":"支出"})
    console.log(barMockData)
    console.log("barMockData")
    return (
        <div className="diagram-content">
            <DiagramLineChart data={data}/>
            <DiagramBarChart data={barMockData}/>
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
        <div className="diagram-lineChart">
            <div className="diagram-lineChart-title">本月</div>
            <svg className="diagram-svg_line" id="svg-line"></svg>
        </div>
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
const DiagramBarChart = ({data}) => {

    const barData = (data) => {
        let dataType = [];
        let dataTypeObj = {};
        let dataResult = [];
        let sum = 0;
        data.forEach((item, index) => {
            dataType.push(item["type"])
        })
        dataType = Array.from(new Set(dataType))
        dataType.forEach((item, index) => {
            dataTypeObj[item] = 0;
        })
            data.forEach((item2, index2) => {
                dataTypeObj[item2["type"]] += parseFloat(item2["count"])
            })
        for (let key in dataTypeObj) {
            sum += dataTypeObj[key];
            dataResult.push({"name": key, "value": dataTypeObj[key]})
        }
        console.log(dataResult)
        console.log("dataResult")
        return dataResult
    }
    // console.log(data)
    // console.log("data123")
    const barDataValue = barData(data)
    useEffect(() => {
        drawBarChart(barDataValue)
    },[])
    return (
        <div>
            <div id="diagram-bar-chart-segment"></div>
            <svg id="svg-bar" className="diagram-svg_bar"></svg>
        </div>
    )
}
const drawBarChart = (initData) => {
    const data = initData.sort((a, b) => b.value - a.value);
    const svgBar = document.querySelector("#svg-bar")
    const width = svgBar.clientWidth;
    const itemHeight = 10
    const paddingHeight = 80
    const height = data.length * (itemHeight+paddingHeight);
    const height2 = data.length * itemHeight;
    d3.select("#svg-bar").attr("height", height);
    const margin = {left:50, right:30, top:20, bottom:20}
    const innerWidth = width - margin.left - margin.right;
    // const innerHeight = height - margin.top - margin.bottom;
    const g = d3.select("#svg-bar").append('g').attr('id', 'maingroup').attr('transform', `translate(0, ${margin.top})`)
    const xScale = d3.scaleLinear().domain([0, d3.max(data, d => d.value)]).range([0, innerWidth]);
    const yScale = d3.scaleBand().domain(data.map(d => d.name)).range([0, height]).padding(0.1);
    // g.append("g")
    //     .call(d3.axisBottom(xScale))
    // const yAxis = d3.axisLeft(yScale);
    data.forEach(d => {
        g.append('rect')
            .attr('width', xScale(d.value))
            .attr('height', itemHeight)
            .attr('fill', '#f5e279')
            .attr("stroke-width", 0)
            .attr("x", margin.left)
            .attr('y', yScale(d.name));
        g.append("text")
            .attr("x",10)
            .attr('y', yScale(d.name))
            .attr('dy', "0.6em")
            .text(d.name)
        // g.append("symbol")
        //     .attr("class","icon-icon icon-canyin")
        //     .attr("id","icon-canyin")
        //     .attr("viewBox", "0 0 20 20")
    })

}

export default Diagram;
