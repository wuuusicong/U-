import axios from "axios";

const fetchUrl =
    {
        "save": 'https://qcluj6.fn.thelarkcloud.com/hello',
        "data": "https://qcluj6.fn.thelarkcloud.com/getAccountData",
        "delete": "https://qcluj6.fn.thelarkcloud.com/deleteItem",
        "edit": "https://qcluj6.fn.thelarkcloud.com/editItem",
        "allData":"https://qcluj6.fn.thelarkcloud.com/getAllData"
    }


const fetchData = async (setData, date) => {
    const result = await axios.post(fetchUrl["data"], date)
    const resultData = result["data"]["data"]
    console.log("fetchData")
    setData(resultData)
}
const fetchAllData = async (setData) => {
    const result = await axios.post(fetchUrl["data"])
    const resultData = result["data"]["data"]
    console.log("fetchData")
    setData(resultData)
}

export {
    fetchData,
    fetchUrl,
    fetchAllData
}
