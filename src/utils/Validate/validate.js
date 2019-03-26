import { validate } from '../../configuration/define'
import { checkFormatString } from '../Define/defineObjType';

export function validateValue(value,type)
{
    const validateGeomatryType = validate.object[type];
    
    if(value.key === 'value') return true;
    if(value.key === 'angle') if(!validateAngle(value.value)) return false;
    
    if(validateGeomatryType.includes(value.key)) {
        const format = checkFormatString(value.value);
        const validateType = validate[value.key]; 
        if(validateType.format){
            if(format === validateType.format && value.value.length === validateType.length)
                return true
        }
        else if( value.value.length === validateType.length ) 
        {
            return true;
        }
    }
    return false;
}

function validateAngle(value){
    const format = checkFormatString(value);
    return format[1] === "1" ;
}

export function validateInfomation(info)
{
    const type= info.outputType;
    delete info.outputType;
    const keys = Object.keys(info);
    for(let i = 0; i < keys.length ; i++)
    {
        let array = info[keys[i]];
        let key = keys[i];
        for(let j = 0 ; j < array.length;j++)
        {
            let value = array[j]
            if(!validateValue({key,value},type)) return false;
        }

    }
    return true;
}