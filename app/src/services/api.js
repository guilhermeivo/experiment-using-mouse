// const urlServer = 'http://127.0.0.1:8000/api'
const urlServer = 'https://silly-gray-shoulder-pads.cyclic.app/api'

export default (() => {
    const GetAllMazes = () => {
        const path = `${ urlServer }/maze`
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(path, {
                    method: 'GET'
                })
                .then(response => response.json())
                .catch(() => { throw new Error('Error when trying to connect to the server, probably the server is off.') })
    
                if (response.Succeeded) {
                    resolve(response.Data)
                } else {
                    throw new Error(response.Message)
                }
            } catch (exception) {
                console.error(exception.message)
            }
        })
    }

    return {
        GetAllMazes
    }
})()