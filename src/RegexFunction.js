const get_key_regex = "[^{\\}]+(?=})";
const get_other_regex = "(^([^{]+(?={)))|((?<=})([^{]+)(?={))|(((?<=})[^}]+)$)"

const test_regex = '{segment} = {distance}'

export function Regex(string){
    let others = test_regex.match(new RegExp(get_other_regex,"g"));
    let params = test_regex.match(new RegExp(get_key_regex,"g"));

    let result = [];

    for(let i = 0; i < others.length; i++)
    {
        let start = others[i-1] || '';
        let end = others[i] || '';
        
        let otherParam =string.match(new RegExp( start+'(.*)'+end));

        if(otherParam)
        result[params[i]] = otherParam[1]

        if(i === others.length - 1)
        {
            let lastParam = string.match(new RegExp( end+'(.*)'));
            if(lastParam)
                result[params[i+1]] = lastParam[1];
        }

        return result;
    }
}