const baseUrl = "https://virtualclass7.herokuapp.com";
console.log("process.env.BASE_URL :: ", process.env.BASE_URL)
//const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:8080'

const websocketPort = 7777;

export {
    baseUrl,
    websocketPort
}
