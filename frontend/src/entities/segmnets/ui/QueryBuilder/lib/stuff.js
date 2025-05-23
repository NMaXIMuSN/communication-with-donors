import Immutable, {Map} from 'immutable';

import {noop} from 'lodash';

export const defaultValue = (value, _default) => {
    return typeof value === 'undefined' ? _default : value;
};

export const immutableEqual = function (v1, v2) {
    if (v1 === v2) {
        return true;
    } else {
        return v1.equals(v2);
    }
};

export const deepEqual = function (v1, v2) {
    if (v1 === v2) {
        return true;
    } else if (Map.isMap(v1)) {
        return v1.equals(v2);
    } else {
        return JSON.stringify(v1) == JSON.stringify(v2);
    }
};

export const shallowEqual = (a, b, deep = false) => {
    if (a === b) {
        return true;
    } else if (Array.isArray(a)) return shallowEqualArrays(a, b, deep);
    else if (Map.isMap(a)) return a.equals(b);
    else if (typeof a === 'object') return shallowEqualObjects(a, b, deep);
    else return a === b;
};

function shallowEqualArrays(arrA, arrB, deep = false) {
    if (arrA === arrB) {
        return true;
    }

    if (!arrA || !arrB) {
        return false;
    }

    let len = arrA.length;

    if (arrB.length !== len) {
        return false;
    }

    for (let i = 0; i < len; i++) {
        let isEqual = deep ? shallowEqual(arrA[i], arrB[i], deep) : arrA[i] === arrB[i];
        if (!isEqual) {
            return false;
        }
    }

    return true;
}

function shallowEqualObjects(objA, objB, deep = false) {
    if (objA === objB) {
        return true;
    }

    if (!objA || !objB) {
        return false;
    }

    let aKeys = Object.keys(objA);
    let bKeys = Object.keys(objB);
    let len = aKeys.length;

    if (bKeys.length !== len) {
        return false;
    }

    for (let i = 0; i < len; i++) {
        let key = aKeys[i];
        let isEqual = deep ? shallowEqual(objA[key], objB[key], deep) : objA[key] === objB[key];
        if (!isEqual) {
            return false;
        }
    }

    return true;
}

const isImmutable = (v) => {
    return typeof v === 'object' && v !== null && typeof v.toJS === 'function';
};

export function toImmutableList(v) {
    return isImmutable(v) ? v : new Immutable.List(v);
}

export function applyToJS(v) {
    return isImmutable(v) ? v.toJS() : v;
}

export const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&'); // $& means the whole matched string
};

export const isJsonLogic = (logic) =>
    typeof logic === 'object' && // An object
    logic !== null && // but not null
    !Array.isArray(logic) && // and not an array
    Object.keys(logic).length === 1; // with exactly one key

export function sleep(delay) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}
export function mergeArraysSmart(arr1, arr2) {
    if (!arr1) arr1 = [];
    if (!arr2) arr2 = [];
    return arr2
        .map((op) => [op, arr1.indexOf(op)])
        .map(([op, ind], i, orig) => {
            if (ind == -1) {
                const next = orig.slice(i + 1);
                const prev = orig.slice(0, i);
                const after = prev.reverse().find(([_cop, ci]) => ci != -1);
                const before = next.find(([_cop, ci]) => ci != -1);
                if (before) return [op, 'before', before[0]];
                else if (after) return [op, 'after', after[0]];
                else return [op, 'append', null];
            } else {
                // already exists
                return null;
            }
        })
        .filter((x) => x !== null)
        .reduce((acc, [newOp, rel, relOp]) => {
            const ind = acc.indexOf(relOp);
            if (acc.indexOf(newOp) == -1) {
                if (ind > -1) {
                    // insert after or before
                    acc.splice(ind + (rel == 'after' ? 1 : 0), 0, newOp);
                } else {
                    // insert to end or start
                    acc.splice(rel == 'append' ? Infinity : 0, 0, newOp);
                }
            }
            return acc;
        }, arr1.slice());
}

const isDev = () =>
    typeof process !== 'undefined' && process.env && process.env.NODE_ENV == 'development';

export const getLogger = (devMode = false) => {
    const verbose = devMode != undefined ? devMode : isDev();
    return verbose
        ? console
        : {
              error: noop,
              log: noop,
              warn: noop,
              debug: noop,
              info: noop,
          };
};

export const getFirstDefined = (arr = []) => {
    let ret;
    for (let i = 0; i < arr.length; i++) {
        const v = arr[i];
        if (v !== undefined) {
            ret = v;
            break;
        }
    }
    return ret;
};

export const logger = getLogger();
