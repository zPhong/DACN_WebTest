import { defineSentences } from './configuration/define';
import { defineInformation } from './utils/definition/index';
import { analyzeResult } from './utils/analysis/analysis';
import appModel from './appModel';

const get_key_regex = '[^{\\}]+(?=})';
const get_other_regex = '(^([^{]+(?={)))|((?<=})([^{]+)(?={))|(((?<=})[^}]+)$)';

const operations = ['+', '-', '*', '<', '>', '='];

export function analyzeInput(input) {
    const data = input
        .replace(new RegExp('(\r?\n)', 'g'), '')
        .split(';')
        .filter(sentence => (!!sentence))
        .map(sentence => {
            return getInformation(sentence);
        });

    let result = {
        shapes: [],
        relations: []
    };
    for (let i = 0; i < data.length; i++) {
        let item = data[i];
        if (!item) return { Error: 'lỗi' };
        if (item.Error) return item;

        if (item.outputType === 'shape') {
            delete item.outputType;
            result.shapes.push(item);
        } else {
            result.relations.push(item);
        }
    }

    appModel.relationsResult = result;

    analyzeResult(result);

    return analyzeResult(result);
}

function getInformation(string) {
    const _string = '_ '.concat(string.concat(' _'));
    let isMatching = false;
    let preProgress = [];
    Object.keys(defineSentences).forEach(key => {
        defineSentences[key].forEach(sentence => {
            sentence = '_ '.concat(sentence.concat(' _'));

            if (isMatching) return;
            const value = regex(_string, sentence, key);
            if (Object.keys(value).length > 0) {
                isMatching = true;
                preProgress = value;
                preProgress['outputType'] = key;
            }
        });
    });
    const type = preProgress.outputType;

    const result = defineInformation(preProgress);

    if (!result) return { Error: 'Sai định dạng' };

    // add operation for define type
    if (type === 'define') {
        operations.forEach(operation => {
            if (result.operation) return;
            if (string.includes(operation)) {
                result.operation = operation;
            }
        });
    }
    return result;
}

export function regex(string, _defineSentence, type) {
    let others = _defineSentence.match(new RegExp(get_other_regex, 'g'));
    let params = _defineSentence.match(new RegExp(get_key_regex, 'g'));

    let result = {};

    params.forEach(key => {
        result[key] = [];
    });

    for (let i = 0; i < params.length; i++) {
        let start =
            others[i]
                .replace('+', '\\+')
                .replace('-', '\\-')
                .replace('*', '\\*') || '';
        let end =
            others[i + 1]
                .replace('+', '\\+')
                .replace('-', '\\-')
                .replace('*', '\\*') || '';

        let param = string.match(new RegExp(start + '(.*)' + end));

        if (param) result[params[i]].push(param[1]);

        if (i === others.length - 1) {
            let lastParam = string.match(new RegExp(end + '(.*)'));
            if (lastParam) result[params[i + 1]].push(lastParam[1]);
        }
    }

    if (getLength(result) === params.length) {
        if (type === 'relation')
            result[type] = others[1].replace('_', '').trim();
        return result;
    }

    return [];
}

function getLength(dictionary) {
    let count = 0;
    Object.keys(dictionary).forEach(key => {
        count += dictionary[key].length;
    });
    return count;
}
