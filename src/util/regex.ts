import { IObject } from '../typings'

export const execObjectByString = (REG: RegExp, str: string) => {
    const obj: IObject = {}

    let matched
    while ((matched = REG.exec(str)) !== null) {
        obj[matched[1]] = matched[2]
    }

    return obj
}
