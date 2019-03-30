import { defineObject } from './defineObjType'
import { validateInfomation } from '../Validate/validate'
import { definePointType } from './definePointType'
import { defineShapeType } from './defineShapeType'

function defineInfomation(data) {
    let result;
    console.log('data', data);
    switch (data.outputType) {
        case 'shape':
            result = defineShapeType(data);
            break;
        case 'relation':
            result = definePointType(data);
            break;
        default:
            result = data;
    }

    Object.keys(result).forEach(key => {
        if (key === 'object') {
            result[key].forEach(value => {
                const type = defineObject(value);
                if (!result[type]) result[type] = [];
                result[type].push(value);
            })
        }
    })

    delete result.object;
    const validate = validateInfomation(result);
    if (validate) {
        return result;
    }
}

export { defineInfomation };
