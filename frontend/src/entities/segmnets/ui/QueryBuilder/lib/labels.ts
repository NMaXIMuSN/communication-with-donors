import {Utils as QbUtils} from '@react-awesome-query-builder/core';

import {ItemType, TJsonGroup} from '../types';

export function addLabels(
    group: TJsonGroup,
    prefix = 'Группа ',
    counter = [1, 1],
    separator = '-',
) {
    let newGroup = {...group};

    if (newGroup.type === ItemType.group && !newGroup.label) {
        newGroup = {
            ...newGroup,
            label: `${prefix}${separator}${counter[1]}`,
        };
        counter[1] = 1;
        counter[0]++;
    }

    if (Array.isArray(newGroup.children1)) {
        let childCount = 0;

        newGroup = {
            ...newGroup,
            children1: newGroup.children1.map((child) => {
                if (child.type === ItemType.rule) {
                    return child;
                }

                const childWithLabels = addLabels({...child}, newGroup.label, [
                    counter[0],
                    (childCount += 1),
                ]);

                return childWithLabels;
            }),
        };
    } else {
        let childCount = 0;

        newGroup = {
            ...newGroup,
            children1: newGroup.children1
                ? Object.keys(newGroup.children1).map((key) => {
                      const child = (newGroup.children1 as {[key: string]: any})[key];
                      if (child.type === ItemType.rule) {
                          return child;
                      }

                      const childWithLabels = addLabels({...child}, newGroup.label, [
                          counter[0],
                          (childCount += 1),
                      ]);

                      if (!child.type) {
                          return {...child, ...childWithLabels};
                      }

                      return childWithLabels;
                  })
                : [],
        };
    }

    return newGroup;
}

export function flattenLabels(group: TJsonGroup) {
    return (function recurse(obj) {
        const output = {[obj.id || QbUtils.uuid()]: obj.label};
        if (Array.isArray(obj.children1)) {
            obj.children1.forEach((child) => {
                if (child.type === ItemType.group) {
                    Object.assign(output, recurse(child));
                }
            });
        }
        return output;
    })(group);
}
