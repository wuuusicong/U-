import React, {useState, useContext, useEffect}from "react";
import {textCountOut, textCountIn, formatDate, DataFresh, formatData, DetailNoData} from "../../Config";
import {Button, Radio, SegmentedControl} from "antd-mobile";
import {tintColor} from "./Diagram.scss"
import {fetchAllData} from "../FetchData";
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

    const [initSelectPeriod, setInitSelectPeriod] = useState(1)


    const DiagramHeader = ({typeInOut, typePeriod}) => {
        const tintColor = '#9a9a96';



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
                    selectedIndex={initSelectPeriod}
                    tintColor={tintColor}
                    className= "diagram-header_period"
                />
            </div>
        )
    }

    const dataParams = {"dateYear":yearStr, "dateMonth":monthStr}


    useEffect(() => {
        fetchAllData(setMockData)
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


const DiagramContent = ({data, mockData}) => {

    const dateToEn = {"07":"Jun","08":"Aug","09":"Sep","10":"Aug"}
    const monthData = mockData.map((item, index) => {
        return item["dateMonth"]
    })

    console.log(monthData)
    console.log("monthData")
    const dateArray = Array.from(new Set(monthData)).map((item, index) => {
        return {
            "date":item,"en":dateToEn[item]
        }
    })
    console.log(dateArray)

    const [initSelectTerm, setInitSelectTerm] = useState(dateArray.length-1)

    // const dateArray = [{"date":"8","en":"Aug"}, {"date":"8","en":"Aug"}, {"date":"8","en":"Aug"}, {"date":"8","en":"Aug"}, {"date":"8","en":"Aug"}]

    const filterData = (mockData, filter) => {
        return mockData.filter((item, index) => {
            return item[filter["type"]] === filter["value"]
        })
    }
    const onClickDiv = (v, index) => {
        setInitSelectTerm(index)
        // textInitType = textType[textTypeIconOut][textTypeIconOut.indexOf(initType)]
    }
    const barMockData = filterData(mockData, {"type":"typeInOut", "value":"支出"})
    console.log(initSelectTerm)
    console.log("initSelectTerm")
    return (
        <div className="diagram-content">
            <div className="diagram-content-date">
                    {dateArray.map((item, index) => {
                        return (
                            <div  className="diagram-content-date-item"
                                  style={{ backgroundColor: index === initSelectTerm ? "red" : "" }}
                                  onClick={(e) => onClickDiv(e, index)}
                                  data-index={index}
                            >
                                <div>{item["date"]}</div><div>{item["en"]}</div>
                            </div>
                        )
                    })}
            </div>
            <div className="diagram-content-box">
            <DiagramLineChart data={data}/>
            <DiagramBarChart data={barMockData}/>
            </div>
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
            <div className="diagram-lineChart-title">日均消费</div>
            <svg className="diagram-svg_line" id="svg-line"></svg>
        </div>
    )
}

const drawLineChart = (dataY) => {
    // d3.select("#svg-line").removeChild();
    const lineColor = '#fae46d'
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
        .attr("transform",`translate(0,${g_height+2})`);
    g.append("line")
        .attr("x1", scale_x(0))
        .attr("y1", scale_y(d3.max(dataY))-1)
        .attr("x2", g_width)
        .attr("y2", scale_y(d3.max(dataY))-1)
        .attr("class", "diagram-lineChart-line");
    g.append("text")
        .text(' ¥' + d3.max(dataY))
        .attr("transform",`translate(${g_width}, ${0})`)
        .attr("dy","-0.2em")
        .attr("dx","0em")
        .attr("text-anchor","end")
        .attr("class","diagram-lineChart-text");
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
        <div className="diagram-barChart">
            <div className="diagram-barChart-title">排行榜</div>
            <svg id="svg-bar" className="diagram-svg_bar"></svg>
        </div>
    )
}
const drawBarChart = (initData) => {
    const data = initData.sort((a, b) => b.value - a.value);
    const svgBar = document.querySelector("#svg-bar")
    const width = svgBar.clientWidth;
    const itemHeight = 10
    const paddingHeight = 50
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
    const rectRadius = 5;
    data.forEach(d => {
        g.append('rect')
            .attr('width', xScale(d.value))
            .attr('height', itemHeight)
            .attr('fill', '#f5e279')
            .attr("stroke-width", 5)
            .attr("x", margin.left)
            .attr('y', yScale(d.name))
            .attr("rx", rectRadius)
            .attr("ry", rectRadius);
        g.append("text")
            .attr("x",10)
            .attr('y', yScale(d.name))
            .attr('dy', "0.6em")
            .text(d.name)
            .attr("class","diagram-lineChart-text")
        // g.append("symbol")
        //     .attr("class","icon-icon icon-canyin")
        //     .attr("id","icon-canyin")
        //     .attr("viewBox", "0 0 20 20")
    })

}

export default Diagram;
