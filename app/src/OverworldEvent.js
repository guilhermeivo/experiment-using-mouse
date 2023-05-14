export default class OverworldEvent {
    constructor({ map, event }) {
        this.map = map
        this.event = event
    }
  
    textMessage(resolve) {  
        console.log(this.event.text)
        resolve()
    }
  
    addFlag(resolve) {
        window.state.flags[this.event.flag] = true
        resolve()
    }

    initialize() {
        return new Promise(resolve => {
            this[this.event.type](resolve)      
        })
    }
}