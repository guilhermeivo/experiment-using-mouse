export default class KeyPressListener {
    constructor(keyCode, callback) {
        let keySafe = true
        if (!Array.isArray(keyCode)) keyCode = [keyCode]
        
        this.keydownFunction = function(event) {
            if (!event.target.matches('input')) {
                keyCode.forEach(key => {
                    if (event.key === key) {
                        if (keySafe) {
                            keySafe = false
                            callback(event)
                        }  
                    }
                })
            }
        }

        this.keyupFunction = function(event) {
            if (!event.target.matches('input')) {
                keyCode.forEach(key => {
                    if (event.key === key) {
                        keySafe = true  
                    }
                })
            }         
        }

        document.addEventListener('keydown', this.keydownFunction)
        document.addEventListener('keyup', this.keyupFunction)
    }
  
    unbind() { 
        document.removeEventListener('keydown', this.keydownFunction)
        document.removeEventListener('keyup', this.keyupFunction)
    }
}