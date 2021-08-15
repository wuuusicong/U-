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
    "支出" : ['check-circle', 'check', 'check-circle-o',
        'cross-circle', 'cross', 'cross-circle-o',
        'up', 'down', 'left',
        'right', 'ellipsis',
        'loading',],
    "收入" : ['check-circle', 'check', 'check-circle-o',
        'cross-circle', 'cross', 'cross-circle-o',
        'up', 'down', 'left',
        'right', 'ellipsis',
        'loading',]

};

const iconType = [];

const formatInOut = (item) => {
    let formatInOutStr = "";
    if(item["type"]==="countOut"){
        formatInOutStr = '-' + item["countOut"]
    }else {
        formatInOutStr = '+' + item["countIn"]
    }
    return formatInOutStr
}
export {
    textApp,
    textCountIn,
    textCountOut,
    textFooter,
    textFooterUrl,
    textType,
    iconType,
    formatInOut,
    textTypeIcon
}
