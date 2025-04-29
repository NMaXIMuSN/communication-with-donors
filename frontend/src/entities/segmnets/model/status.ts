import {LabelProps} from '@gravity-ui/uikit';
import {SegmentStatus} from '../api/fetchers';

export const StatusTheme: Record<SegmentStatus, LabelProps['theme']> = {
    [SegmentStatus.CALCULATED]: 'success',
    [SegmentStatus.DRAFT]: 'unknown',
    [SegmentStatus.ERROR]: 'danger',
    [SegmentStatus.PROGRESS]: 'info',
};

export const SEGMENT_STATUS_TRANSLATION: Record<SegmentStatus, string> = {
    [SegmentStatus.CALCULATED]: 'Рассчитан',
    [SegmentStatus.DRAFT]: 'Не рассчитывался',
    [SegmentStatus.ERROR]: 'Ошибка',
    [SegmentStatus.PROGRESS]: 'Рассчитывается',
};
