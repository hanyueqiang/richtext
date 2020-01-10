
import React from 'react';
import { Layout } from 'antd';
import styles from './index.less';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: '8px 24px'}} className={styles.footer}>
    <div style={{ color: '#626d7a', textAlign: 'right' }}>智慧病房V1.0</div>
  </Footer>
);
export default FooterView;
