import { validate } from '../../configuration/define'
import { checkFormatString } from '../Define/defineObjType';
import { fromByteArray } from 'ipaddr.js';

export function validateValue(value, type) {
    const validateGeomatryType = validate.object[type];
    let validateType;
    if (value.key === 'value' || value.key === 'relation' || value.key === 'undefined') return true;
    if (value.key === 'angle') if (!validateAngle(value.value)) return false;

    if (validateGeomatryType.includes(value.key) || value.key !== 'object') {
        const format = checkFormatString(value.value);
        validateType = validate[value.key];
        if (validateType && format)
            if (validateType.format) {
                if (format === validateType.format && value.value.length === validateType.length)
                    return true
            }
            else if (value.value.length === validateType.length) {
                return true;
            }
    }
    return false;
}

function validateAngle(value) {
    const format = checkFormatString(value);
    return format[1] === "1";
}

function validateShape(shape) {
    const keys = Object.keys(shape);
    const validateShapeFormat = validate.shape[keys[0]];
    const validateShapeType = validate.shapeType[keys[0]] || [''];
    //check format of shape value
    const value = shape[keys[0]];
    const format = checkFormatString(shape[keys[0]]);
    const shapeFormatCheck = (format === validateShapeFormat.format && value.length === validateShapeFormat.length)

    //check type of shape
    const type = shape.type || '';
    const shapeTypeCheck = validateShapeType.includes(type);

    return shapeFormatCheck && shapeTypeCheck;

}

export function validateInfomation(info) {
    const type = info.outputType;
    delete info.outputType;
    const keys = Object.keys(info);
    if (type === 'shape') {
        return validateShape(info)
    }
    else {
        for (let i = 0; i < keys.length; i++) {
            let array = info[keys[i]];
            let key = keys[i];
            for (let j = 0; j < array.length; j++) {
                let value = array[j]
                const check = validateValue({ key, value }, type);

                if (!check) return check;
            }
        }
    }

    if (type === 'define') {
        if (keys.includes("value")) {
            return (keys.length === 2)
        }
        else {
            return (keys.length === 1)
        }
    }

    return true;
}