import {InternalToastProps, ToastProps, ToastTheme, Toaster} from '@gravity-ui/uikit';
import cn from 'classnames';

import {getRandomId} from '@/shared/lib';

import {DEFAULT_EXPIRED_IN_MS} from './const';

import styles from './Toaster.module.scss';

interface IOptions extends Omit<ToastProps, 'theme' | 'title'> {
    type: ToastTheme;
    text?: string;
}

class MyToaster {
    toaster = new Toaster();
    add(options: Partial<IOptions>): void {
        const {
            name = getRandomId(),
            type = 'normal',
            autoHiding = DEFAULT_EXPIRED_IN_MS,
            text: title,
            className,
            ...otherOptions
        } = options;

        this.toaster?.add?.({
            name,
            theme: type,
            autoHiding,
            title,
            className: cn(styles.toast, className),
            ...otherOptions,
        });
    }
    destroy() {
        this.toaster?.destroy();
    }
    has(name: string): boolean {
        return this.toaster?.has(name);
    }
    remove(name: string) {
        this.toaster?.remove(name);
    }
    removeAll() {
        this.toaster?.removeAll();
    }
    subscribe(listener: (toasts: InternalToastProps[]) => void) {
        return this.toaster?.subscribe(listener);
    }
    update(name: string, overrideOptions: Partial<ToastProps>) {
        this.toaster?.update(name, overrideOptions);
    }
}

const toaster = new MyToaster();
export {toaster};
