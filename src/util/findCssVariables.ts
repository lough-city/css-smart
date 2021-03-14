import * as fs from 'fs'
import { CSS_VARIABLES_REG } from '../constants/regex'
import { execObjectByString } from './regex'

/**
 * 查找文件里的css变量
 */
const findCssVariables = (path: string) => {
    if (fs.existsSync(path)) {
        const content = fs.readFileSync(path, 'utf-8')

        return execObjectByString(CSS_VARIABLES_REG, content)
    }

    return {}
}

export default findCssVariables
