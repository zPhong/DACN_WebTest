export function definePointType(data){
    let returner= {};
    Object.keys(data).forEach(key => {
        if(key === 'arrayPoints') {
            returner["point"] = data[key].toString().split(',');
        } else {
        returner[key] = data[key]
        }
    })
    return returner
}