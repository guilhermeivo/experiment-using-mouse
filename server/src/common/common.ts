import * as fs from 'fs'
import * as path from 'path'

export const getAllControllers = (dirName: string) => {
    const controllers: Array<any> = []

    const dirContents = fs.readdirSync(path.join(dirName, 'controllers/'), { encoding: 'utf-8' })
    dirContents.map(content => {
        if (content.includes('.ts') || content.includes('.js')) {
            const controller = require(path.join(dirName, `controllers/${ content }`)).default()
            controller.map((methods: any) => {
                let path = content.split('Controller')[0].toLowerCase()
                if (methods.method.includes('(') && methods.method.includes(')')) {
                    const subPath = methods.method.substring(
                        methods.method.indexOf(`'`) + 1, 
                        methods.method.lastIndexOf(`'`)
                    )
                    path += `/${ subPath }`
    
                    methods.method = methods.method.split('(')[0]
                }
    
                controllers.push({
                    path: `/${ path }`,
                    ...methods
                })
            })
        }
    })

    return controllers
}