const DISPLAY_HEARTBEAT_LOGS = false
const DISPLAY_LOGS = false

export class WebSocketConnection{
    constructor(){
        this._ws = null
        this._handleDataUpdate = null
        this._handleAuth = null
        this._heartbeatInterval = null
        this._heartbeatRecieved = 0
        this._heartbeatSent = 0
        this._connectionAttempts = 0
        this._status = "waiting"

        this._createConnection()
    }
    /**
     * @returns {boolean}   True if the resume token already exists in the cookies and the client can **TRY** connecting.
     */
    get canResume(){
        const resume_token = (document.cookie.split("resume_token=")[1] || "").split("=")[0]
        if (resume_token)   return true
        return false
    }

    /**
     * 
     * @param {function} func Fired when a data update is received from the server.
     */
    useDataUpdates(func){
        this._handleDataUpdate = func
    }

    /**
     * 
     * @param {function("error" | "login"} func Fired when a login update is received from the server.
     */
    useAuth(func){
        this._handleAuth = func
    }

    _createConnection(){
        if(DISPLAY_LOGS) console.log("Creating new Connection")
        try{
            this._ws = new WebSocket("ws://localhost:8080")
            this._ws.onopen = this._onOpen
            this._ws.onmessage = ({data}) => this._onMessage(JSON.parse(data))
            this._ws.onerror = () => this._onError()
            this._ws.onclose = () => {
                if(DISPLAY_LOGS) console.log("Connection closed")
                this._status = "waiting"
                this._onError()
            }
            this._status = "connected"
        }   catch{
            this._onError()
        }
    }

    _onOpen(){
        if(DISPLAY_LOGS) console.log("Connected to the Server")
    }

    _onMessage(data){
        if(DISPLAY_LOGS) console.log("Recived Message from server", data)
        
        switch(data.op){
            case 0: //Hello
                this._startHeartbeat(data.d.heartbeat_interval)
                this._identify()
                break
            case 2: //Identified
                document.cookie = "resume_token=" + data.d.resume_token
                break
            case 6: //Data Update
                if(typeof this._handleDataUpdate == "function")  this._handleDataUpdate(data.d)
                break
            case 4: //Error
                switch(data.d.code){
                    case 401:
                        if(typeof this._handleAuth == "function") this._handleAuth("error", data.d.message).then((data)=>{
                            this._send({
                                op: 1,
                                d: data
                            })
                        })
                        else console.error("Auth Update Handler hook not attached")
                        break
                    case 402:
                        document.cookie = "resume_token="
                        
                        this._onError()
                        break
                    default:
                        console.error(data.d.code)
                        break
                }
                break
            case 8: //Heartbeat recievec
                this._heartbeatRecieved++
                break
            default:
                break
        }
    }

    _onError(){
        this._removeConnection()
        this._heartbeatRecieved = 0
        this._heartbeatSent = 0

        if(this._status === "waiting")   return

        if(DISPLAY_LOGS) console.log(`Creating new connection in: ${this._connectionAttempts * 5} seconds`)

        setTimeout(()=>{
            this._createConnection()
        }, this._connectionAttempts * 5000)

        this._status = "waiting"
        this._connectionAttempts++
    }

    _removeConnection(){
        if(DISPLAY_LOGS) console.log("Removing connection")
        if(this._ws){
            try{
                this._ws.close()
            }catch {}
            this._ws = null
        }

        if(this._heartbeatInterval){
            clearInterval(this._heartbeatInterval)
        }
    }

    _send(data){
        if(this._status === "waiting")  return
        if(!this._ws)   return console.error("Tried to send a message while a ws connection doesn't exist")
        try {
            this._ws.send(JSON.stringify(data))
        }catch{
            console.error("getting error?")
            this._onError()
        }
    }

    _identify(){
        const resume_token = (document.cookie.split("resume_token=")[1] || "").split("=")[0]
        
        if (resume_token)   {
            if(DISPLAY_LOGS) console.log("Resuming Session")
            this._send({
                op: 3,
                d: {
                    resume_token: resume_token
                }
            })
            return
        }
        if(!this._handleAuth)   console.error("Auth Handle Hook not attached")
        else this._handleAuth("login").then((data)=>{
            this._send({
                op: 1,
                d: data
            })
        })
    }

    _startHeartbeat(interval){
        this._heartbeatInterval = setInterval(()=>{
            if(this._heartbeatSent > this._heartbeatRecieved){
                if(DISPLAY_LOGS) console.log("Server didn't respond to the heartbeat")
                this._onError()
                return
            }
            if(DISPLAY_HEARTBEAT_LOGS)  if(DISPLAY_LOGS) console.log("Sending heartbeat to the server\nhb dif: ",this._heartbeatSent - this._heartbeatRecieved)
            this._heartbeatSent++
            this._send({
                op: 8
            })
        }, interval)
    }
}