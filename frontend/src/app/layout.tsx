import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import '../shared/styles/globals.scss';
import {CSRFWrapper} from '@/shared/api/csrfWrapper';

export default function RootLayout({children}: {children: React.ReactNode}) {
    return <CSRFWrapper>{children}</CSRFWrapper>;
}
