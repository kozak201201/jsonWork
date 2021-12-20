const DEFAULT_RECONNECT_COUNT = 3;

const axios = require("axios");
const urlsArr = [];

urlsArr.push('https://jsonbase.com/lambdajson_type1/793');
urlsArr.push('https://jsonbase.com/lambdajson_type1/955');
urlsArr.push('https://jsonbase.com/lambdajson_type1/231');
urlsArr.push('https://jsonbase.com/lambdajson_type1/931');
urlsArr.push('https://jsonbase.com/lambdajson_type1/93');
urlsArr.push('https://jsonbase.com/lambdajson_type2/342');
urlsArr.push('https://jsonbase.com/lambdajson_type2/770');
urlsArr.push('https://jsonbase.com/lambdajson_type2/491');
urlsArr.push('https://jsonbase.com/lambdajson_type2/281');
urlsArr.push('https://jsonbase.com/lambdajson_type2/718');
urlsArr.push('https://jsonbase.com/lambdajson_type3/310');
urlsArr.push('https://jsonbase.com/lambdajson_type3/806');
urlsArr.push('https://jsonbase.com/lambdajson_type3/469');
urlsArr.push('https://jsonbase.com/lambdajson_type3/258');
urlsArr.push('https://jsonbase.com/lambdajson_type3/516');
urlsArr.push('https://jsonbase.com/lambdajson_type4/79');
urlsArr.push('https://jsonbase.com/lambdajson_type4/706');
urlsArr.push('https://jsonbase.com/lambdajson_type4/521');
urlsArr.push('https://jsonbase.com/lambdajson_type4/350');
urlsArr.push('https://jsonbase.com/lambdajson_type4/64');

async function task(urlArr, propToFind) {
    const resultArr = [];
    const propsCountMap = new Map();

    for(let url of urlArr) {
        let resultJson;

        try {
            resultJson = await axios.get(url);
        } catch (err) {
            resultJson = await tryReconnect(url, DEFAULT_RECONNECT_COUNT)

            if (!resultJson) {
                console.error(`Error get data from: ${url}`);
                continue;
            }

        }
        resultJson = resultJson.data;
        let propValue = checkValueOfKeyInObj(resultJson, propToFind);

        propValue = propValue.toString();
        const firstChar = propValue.charAt(0).toUpperCase();
        propValue = firstChar + propValue.substring(1);

        resultArr.push(`${url}: ${propToFind} - ${propValue}`);

        if (!propsCountMap.has(propValue)) {
            propsCountMap.set(propValue, 1);
        } else {
            let propValueCount = propsCountMap.get(propValue);
            propsCountMap.set(propValue, ++propValueCount);
        }
    }
    return [resultArr, propsCountMap];
}

async function printTaskResult() {
    let resultArr = await task(urlsArr, 'isDone');
    resultArr[0].forEach(value => console.log(value))
    console.log()
    resultArr[1].forEach((value, key) => console.log(`Значений ${key}: ${value}`))
}

async function tryReconnect(url, reconnectCount) {
    for (let i = 0; i < reconnectCount; i++) {
        try {
            const resultJson = await axios.get(url);
            return resultJson;
        } catch (e) {
        }
    }
}

function checkValueOfKeyInObj(obj, key) {

    if (obj.hasOwnProperty(key)) {
        return obj[key];
    }

    for (const objKey in obj) {
        if (typeof obj[objKey] === 'object' && !Array.isArray(obj[objKey])) {
            return checkValueOfKeyInObj(obj[objKey], key);
        }
    }
}

(async () => {
    await printTaskResult()
})();
