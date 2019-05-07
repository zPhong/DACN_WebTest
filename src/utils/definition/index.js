import {defineObject} from "./defineObjType";
import {validateInformation} from "../validation/validation";
import {defineShapeType} from "./defineShapeType";
import {definePointType} from "./definePointType";


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

    Object.keys(result).forEach(key => {
        if (key === 'object') {
            result[key].forEach(value => {
                const type = defineObject(value);
                if (!result[type]) result[type] = [];
                result[type].push(value);
            });
        }
    });

    delete result.object;
    const validate = validateInformation(result);
    if (validate) {
        return result;
    }
}

export { defineInformation };
