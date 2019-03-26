
export function defineShapeType(data){
    let returner= {};
    Object.keys(data).forEach(key => {
        if(key.includes('type')) {
            const result = data[key].toString().split(' ');
            returner["type"] = result[0];
            returner[key.split(' ')[1]] = result[1];
        } else {
        returner[key] = data[key]
        }
    })
    return returner
}
