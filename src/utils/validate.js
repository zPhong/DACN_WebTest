import {validate} from '../configuration/define'

export function validateValue(value,type)
{
    const validateGeomatryType = validate.object[type];
    console.log(validateGeomatryType)
}