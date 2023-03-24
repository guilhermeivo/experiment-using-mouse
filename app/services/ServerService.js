const urlServer = 'http://127.0.0.1:8000/api'

export default (() => {
    const GetAllMazes = () => {
        const path = `${ urlServer }/maze`
        return new Promise(async (resolve, reject) => {
            const response = await fetch(path, {
                method: 'GET'
            }).then(response => response.json())

            if (response.Succeeded) {
                resolve(response.Data)
            }
            
            console.error(response.Message)
            reject([])
        })
    }

    return {
        GetAllMazes
    }
})()