//const baseUrl = "https://virtualclass7.herokuapp.com";
const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:8080'
const websocketPort = 7777;

export {
    baseUrl,
    websocketPort
}
