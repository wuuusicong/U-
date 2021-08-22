import axios from "axios";

const fetchUrl = {"save": 'https://qcluj6.fn.thelarkcloud.com/hello', "data": "https://qcluj6.fn.thelarkcloud.com/getAccountData"}


const fetchData = async (setData, date) => {
    const result = await axios.post(fetchUrl["data"], date)
    const resultData = result["data"]["data"]
    console.log("fetchData")
    setData(resultData)
}
export {
    fetchData,
    fetchUrl
}
