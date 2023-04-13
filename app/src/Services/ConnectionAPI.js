const urlServer = 'http://127.0.0.1:8000'

export default (() => {
    const Register = (callback) => {
        const path = `${ urlServer }/account/register`
        const client = new XMLHttpRequest()
        client.onreadystatechange = () => {
            if (client.readyState == XMLHttpRequest.DONE) {
                callback(JSON.parse(client.responseText))
            }
        }
        client.open('POST', path, false)
        client.withCredentials = true
        client.send()
    }

    const CreateMaze = (name, encodedString, description = '') => {
        const path = `${ urlServer }/api/maze?name=${ name }&description=${ description }&encodedString=${ encodedString }`
        
        return httpConnection(path, 'POST')
    }

    const UpdateMaze = (id, name, encodedString) => {
        const path = `${ urlServer }/api/maze/${ id }?name=${ name }&encodedString=${ encodedString }`
        
        return httpConnection(path, 'POST')
    }

    const GetMazeById = (id) => {
        const path = `${ urlServer }/api/maze/${ id }`
        
        return httpConnection(path, 'GET')
    }

    const httpConnection = (url, method) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(url, {
                    method: method,
                    credentials: 'include'
                })
                .then(response => response.json())
                .catch(() => { throw new Error('Error when trying to connect to the server, probably the server is off.') })

                if (response.Succeeded) {
                    resolve(response.Data)
                } else {
                    throw new Error(response.Message)
                }
            } catch (exception) {
                reject(exception.message)
            }
        })
    }
    
    return {
        Register,
        CreateMaze,
        UpdateMaze,
        GetMazeById
    }
})()