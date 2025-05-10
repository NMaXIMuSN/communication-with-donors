import {Record} from 'immutable';
import {useUser} from '../providers/userProvider';

export enum Entity {
    SEGMENT = 'SEGMENT',
    SOURCE = 'SOURCE',
    CAMPAIGN = 'CAMPAIGN',
    USER = 'USER',
    TEMPLATE = 'TEMPLATE',
}

export enum Action {
    VIEW = 'VIEW',
    CREATE = 'CREATE',
    DELETE = 'DELETE',
    EDIT = 'EDIT',
    SEARCH = 'SEARCH',
}

export const Permissions = Object.values(Entity).reduce(
    (permission, entity) => {
        const value = Object.fromEntries(
            Object.values(Action).map((action) => [action, `${entity}_${action}`]),
        ) as Record<Action, string>;

        return {...permission, [entity]: value};
    },
    {} as Record<Entity, Record<Action, string>>,
);

export const useGetPermission = (permission: string) => {
    const user = useUser();

    if (!user) {
        return false;
    }

    return user.role.some((el) => el.permissions.some((el) => el.value === permission));
};
