import LoginCard from '@/widgets/login/login-card/ui/LoginCard';

import styles from './page.module.scss';

const Login = () => {
    return (
        <div className={styles.login}>
            <LoginCard />
        </div>
    );
};

export default Login;
