import {defineSentences} from './configuration/define'
import {progressPointType,progressShapeType} from './utils/mapping'
import {defineObject} from './utils/defineObj'
import {validateValue} from './utils/validate'

const get_key_regex = "[^{\\}]+(?=})";
const get_other_regex = "(^([^{]+(?={)))|((?<=})([^{]+)(?={))|(((?<=})[^}]+)$)"


export function validateInfomation(info)
{
    const type= info.outputType;
    delete info.outputType;
    Object.keys(info).forEach(key=>{
        info[key].forEach(value=>{
            validateValue({key,value},type);
        })
    })
    
    return true;
}

export function GetInfomation(string)
{
    const _string = '_ '.concat(string.concat(' _'));
    let isMatching = false;
    let returner = [];
    Object.keys(defineSentences).forEach((key)=>{
        defineSentences[key].forEach((sentence)=>{
            sentence = '_ '.concat(sentence.concat(' _'));

            if(isMatching) return;
            const value = Regex(_string,sentence,key);
            
            if(Object.keys(value).length > 0)
            {
                isMatching = true;
                returner = value;
                returner['outputType'] = key
            }
        })
    })

    progressInfomation(returner)
    return returner;
}

export function progressInfomation(data){
    let result;
    switch (data.outputType) {
        case 'shape': 
            result = progressShapeType(data);
            break;
        case 'point':
            result = progressPointType(data);
            break;
        default:
            result = data;
    }

    Object.keys(result).forEach(key=>{
        if(key === 'object')
        {
            result[key].forEach(value => {
                const type = defineObject(value);
                if(!result[type]) result[type]=[];
                result[type].push(value);
            })
        }
    })

    delete result.object;

    const validate = validateInfomation(result);

    if(validate)
        return result;
    alert('sai định dạng');
}

export function Regex(string, _defineSentence,type){
    let others = _defineSentence.match(new RegExp(get_other_regex,"g"));
    let params = _defineSentence.match(new RegExp(get_key_regex,"g"));


    let result = [];

    params.forEach(key=>{
        result[key] = []
    })

    for(let i = 0; i < params.length; i++)
    {
        let start = others[i].replace('+','\\+').replace('-','\\-').replace('*','\\*') || '';
        let end = others[i+1].replace('+','\\+').replace('-','\\-').replace('*','\\*') || '';

        let otherParam =string.match(new RegExp(start+'(.*)'+end));   


        if(otherParam)
            result[params[i]].push(otherParam[1])

        if(i === others.length - 1)
        {
            let lastParam = string.match(new RegExp(end+'(.*)'));
            if(lastParam)
                result[params[i+1]].push(lastParam[1]);
        }
    }

    if(getLength(result) === params.length)
    {
        if(type === 'relation')
            result[type] = others[1].trim() ;

        return result;
    }

    return []
}


function getLength(dictionary){
    let count = 0;
    Object.keys(dictionary).forEach(key=>{
        count += dictionary[key].length;
    })
    return count
}