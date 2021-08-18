import axios from "axios";

const textApp = "i生活记账";
const textCountIn = "收入";
const textCountOut = "支出";
const textFooter = ["明细", "图表", "记账", "其他", "我的"]
const textFooterUrl = ["/", "/graph", "/account", "/others", "/my"]
const textType = {
    "支出" : ["餐饮", "购物", "日用", "交通","餐饮", "购物", "日用", "交通","餐饮", "购物", "日用", "交通"],
    "收入" : ["工资","兼职","理财","其他","工资","兼职","理财","其他","工资","兼职","理财","其他"]
}
const textTypeIcon = {
    "支出" : ['canyin', 'shopping', 'riyongpin', 'jiaotong', 'canyin', 'shopping', 'riyongpin', 'jiaotong','canyin', 'shopping', 'riyongpin', 'jiaotong',],
    "收入" : ['gongzi', 'jianzhi', 'licai',
        'ziyuan', 'gongzi', 'jianzhi', 'licai',
        'ziyuan', 'gongzi', 'jianzhi', 'licai',
        'ziyuan']
};

const typeInOut = [textCountOut,textCountIn];


const iconType = [];

const saveData = async (url) => {
    const result = await axios(url);
    console.log("saveData成功")
}

const formatInOut = (item) => {
    let formatInOutStr = "";
    if(item["typeInOut"]==="支出"){
        formatInOutStr = '-' + item["count"]
    }else {
        formatInOutStr = '+' + item["count"]
    }
    return formatInOutStr
}

const formatDate = function (date) {
    /* eslint no-confusing-arrow: 0 */
    const pad = n => n < 10 ? `0${n}` : n;
    const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    const yearStr = `${date.getFullYear()}`;
    const monthStr = `${pad(date.getMonth() + 1)}`;
    const dayStr =  `${pad(date.getDate())}`
    return {yearStr, monthStr, dayStr, dateStr}
}

const formatData = (data) => {
    console.log(data)
    console.log("data")
    if(Object.keys(data).length===0)return {}
    let resultIndex = []
    let result = {}
    data.forEach((item, index) => {
        resultIndex.push(item["date"])
    })
    resultIndex = Array.from(new Set(resultIndex))
    for (let i=0; i<resultIndex.length; i++) {
        result[resultIndex[i]] = []
    }
    data.forEach((item, index) => {
        result[item["date"]].push(item)
    })
    return result;
}

const fetchUrl = {"save": 'https://qcluj6.fn.thelarkcloud.com/hello', "data": "https://qcluj6.fn.thelarkcloud.com/getAccountData"}
export {
    textApp,
    textCountIn,
    textCountOut,
    typeInOut,
    textFooter,
    textFooterUrl,
    textType,
    iconType,
    formatInOut,
    textTypeIcon,
    formatDate,
    saveData,
    fetchUrl,
    formatData
}
