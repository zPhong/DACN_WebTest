
export function defineShapeType(data){
    let returner= {};
    Object.keys(data).forEach(key => {
        if(key.includes('type')) {
            const result = data[key].toString().split(' ');
            returner[key.split(' ')[1]] = result[1]|| result[0];
            returner["type"] = result.length > 1 ? result[0] : '';
        } else {
        returner[key] = data[key].toString();
        }
    });
    return returner
}
