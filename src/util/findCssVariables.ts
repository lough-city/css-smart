import * as fs from 'fs'

const CSS_VARIABLES_REG = /(\--[^:\s]+):[\s]*([^;]+);/g

interface IVariables {
    [key: string]: string
}

/**
 * 查找文件里的css变量
 */
const findCssVariables = (path: string) => {
    const variables: IVariables = {}
    if (fs.existsSync(path)) {
        const content = fs.readFileSync(path, 'utf-8')

        let matched
        while ((matched = CSS_VARIABLES_REG.exec(content)) !== null) {
            variables[matched[1]] = matched[2]
        }

        content
    }

    return variables
}

export default findCssVariables
