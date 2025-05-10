import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import '../shared/styles/globals.scss';

export default function RootLayout({children}: {children: React.ReactNode}) {
    return <>{children}</>;
}
