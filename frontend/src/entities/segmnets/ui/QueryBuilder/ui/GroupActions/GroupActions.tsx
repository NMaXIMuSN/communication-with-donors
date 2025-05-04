import {PureComponent} from 'react';
import {Button, Icon} from '@gravity-ui/uikit';
import {Plus, Xmark} from '@gravity-ui/icons';
import cn from 'classnames';

import {IConfig} from '../../types';

import styles from './GroupActions.module.scss';

const groupActionsPositionList = {
    topLeft: styles.groupActionsTL,
    topCenter: styles.groupActionsTC,
    topRight: styles.groupActionsTR,
    bottomLeft: styles.groupActionsBL,
    bottomCenter: styles.groupActionsBC,
    bottomRight: styles.groupActionsBR,
};
const defaultPosition = 'topRight';

interface IGroupActions {
    config: IConfig;
    addRule: Function;
    addGroup: Function;
    removeSelf: Function;
    setLock: (newValue?: boolean | undefined) => void;
    isLocked: boolean;
    isTrueLocked: boolean;
    id: string;
    canAddGroup: boolean;
    canAddRule: boolean;
    canDeleteGroup: boolean;
}

export class GroupActions extends PureComponent<IGroupActions> {
    render() {
        const {
            config,
            addGroup,
            removeSelf,
            setLock,
            isLocked,
            isTrueLocked,
            canAddGroup,
            canAddRule,
            canDeleteGroup,
            addRule,
        } = this.props;
        const {
            immutableGroupsMode,
            addGroupLabel,
            groupActionsPosition,
            renderSwitch: Switch,
            lockLabel,
            lockedLabel,
            showLock,
            canDeleteLocked,
            addRuleLabel,
        } = config.settings;
        const position =
            groupActionsPositionList[
                (groupActionsPosition as keyof typeof groupActionsPositionList) || defaultPosition
            ];

        const setLockSwitch = Switch && showLock && !(isLocked && !isTrueLocked) && (
            // @ts-ignore
            <Switch
                value={isLocked}
                setValue={setLock}
                label={lockLabel || ''}
                checkedLabel={lockedLabel}
                config={config}
            />
        );

        const addGroupBtn = !immutableGroupsMode && canAddGroup && !isLocked && (
            <Button view="outlined" size="s" disabled={isLocked} onClick={() => addGroup()}>
                <Icon data={Plus} size={16} />
                {addGroupLabel}
            </Button>
        );

        const addRuleBtn = !immutableGroupsMode && canAddRule && !isLocked && (
            <Button view="outlined" size="s" disabled={isLocked} onClick={() => addRule()}>
                <Icon data={Plus} size={16} />
                {addRuleLabel}
            </Button>
        );

        const delGroupBtn = !immutableGroupsMode &&
            canDeleteGroup &&
            (!isLocked || (isLocked && canDeleteLocked)) && (
                <div className={styles.del} onClick={() => removeSelf()}>
                    <Icon data={Xmark} size={16} />
                </div>
            );

        return (
            <div className={cn('group--actions', styles.wrapper, styles.groupActions, position)}>
                <>
                    {setLockSwitch}
                    {addRuleBtn}
                    {addGroupBtn}
                    {delGroupBtn}
                </>
            </div>
        );
    }
}
