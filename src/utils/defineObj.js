function isLowerCaseChar(char)
{
    if (char === char.toLowerCase()) return '0';
    return '1'
}

function checkFormatString(str)
{
    let result ='';
    str.split("").forEach(element => {
        result += isLowerCaseChar(element);
    });
    return result;
}


export function defineObject(value)
{
    const formatObj = checkFormatString(value);
    if(value.length === 3) return 'angle';
    switch(formatObj){
        case '0': return 'line';
        case '1': return 'point';
        case '10': return 'ray';
        case '11': return 'segment';
        default:
            return undefined
    }
}