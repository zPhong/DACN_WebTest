import { defineObject } from './defineObjType';
import { validateInformation } from '../validation/validation';
import { definePointType } from './definePointType';
import { defineShapeType } from './defineShapeType';
import { reversedDependentObjRelation } from '../../configuration/define';

function defineInformation(data) {
    let result;
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

    if (reversedDependentObjRelation.includes(result.relation))
        result.object = result.object.reverse();
    Object.keys(result).forEach(key => {
        if (key === 'object') {
            result[key].forEach(value => {
                const type = defineObject(value);
                if (!result[type]) result[type] = [];
                if (type === 'segment') {
                    value = sortString(value);
                }
                result[type].push(value);
            });
        }
    });

    if (data.outputType === 'shape') {
        const shapeName = Object.keys(result).filter(key => key !== 'type')[0];
        result[shapeName] = sortString(result[shapeName]);
    }

    delete result.object;
    const validate = validateInformation(result);

    if (validate) {
        return result;
    }
}

function sortString(str) {
    var arr = str.split('');
    var sorted = arr.sort();
    return sorted.join('');
}

export { defineInformation };
