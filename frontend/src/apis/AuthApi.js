import { axiosInstance } from "../lib/axios"


const retrieveSingpassAuthUrl = async () => {
	try {
		const response = await axiosInstance.get('/auth-url')
		return response
	} catch (error) {
		console.log(error)
		return error.response
	}
}

const checkSession = async (sessionId) => {
	try {
		const response = await axiosInstance.get('/session?sessionId='+ sessionId)
		return response
	} catch (error) {
		console.log(error)
		return error.response
	}

}




export { 
	retrieveSingpassAuthUrl,
	checkSession
}