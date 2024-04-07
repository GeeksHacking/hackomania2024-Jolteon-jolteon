import { axiosInstance } from "../lib/axios"

function parseDate(val){
    // parse date into DD-MMM-YYYY format
    const date = new Date(val)
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()

    // if day is single digit, add a 0 in front

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = monthNames[month]
    const date_formatted = `${day < 10 ? '0' + day : day}-${monthName}-${year}`
    return date_formatted

}

const getUserRegistered = async (sessionId) => {

    try {
        let response = await getMyInfoUser(sessionId)
        if (response.status === 200){
            const data = response.data
            let user_name = data.payload.name
            let user_dob = parseDate(data.payload.dob)
            const user_registered_response = await axiosInstance.post('/personnel-registered', {
                name: user_name,
                dob: user_dob
            })
            if (user_registered_response.status === 200 && user_registered_response.data.statusCode === 200){
                return true
            }
            return false
        }
        else{
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }

}
const getMyInfoUser = async (sessionId) => {
    try {
        const response = await axiosInstance.get('/userinfo?sessionId='+sessionId)
        if (response.status === 200 && response.data){
            
            return response
        
        }
        return {}
    } catch (error) {
        console.log(error)
        return error.response
    }

}

const registerUser = async (sessionId, formData) => {
    try {
        const response = await axiosInstance.post('/submit', formData, {
            params: {
                sessionId: sessionId
            }
        })
        return response
    } catch (error) {
        console.log(error)
        return error.response
    }
}

const sendMessage = async (sessionId, message) => {

    
}

export { 
    getUserRegistered,
    getMyInfoUser,
    registerUser,
    getUserCard
 }