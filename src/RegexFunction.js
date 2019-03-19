import defineSentences from './configuration/define'

const get_key_regex = "[^{\\}]+(?=})";
const get_other_regex = "(^([^{]+(?={)))|((?<=})([^{]+)(?={))|(((?<=})[^}]+)$)"


export function GetInfomation(string)
{
    const _string = '_ '.concat(string.concat(' _'));
    console.log(_string);
    let isMatching = false;
    let returner = [];
    Object.keys(defineSentences).forEach((key)=>{
        defineSentences[key].forEach((sentence)=>{
            sentence = '_ '.concat(sentence.concat(' _'));

            if(isMatching) return;
            const value = Regex(_string,sentence);
            
            if(Object.keys(value).length > 0)
            {
                isMatching = true;
                returner = value;
                console.log(value);
            }
        })
    })

    return returner;
}

export function Regex(string, _defineSentence){
    let others = _defineSentence.match(new RegExp(get_other_regex,"g"));
    let params = _defineSentence.match(new RegExp(get_key_regex,"g"));

    let result = [];

    params.forEach(key=>{
        result[key] = []
    })

    for(let i = 0; i < params.length; i++)
    {
        let start = others[i].replace('+','\\+').replace('-','\\-') || '';
        let end = others[i+1].replace('+','\\+').replace('-','\\-') || '';

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

    if(getLength(result) === params.length )
    {

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