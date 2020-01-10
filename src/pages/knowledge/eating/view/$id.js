import React, { Component } from 'react';
import { Button } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import ViewContent from './components/viewContent';
import styles from './index.less';

@connect(({ eating }) => ({ ...eating }))
class Index extends Component {

  componentDidMount() {
    this.getViewInfo();
  }

  getViewInfo = () => {
    const { match, dispatch } = this.props;
    dispatch({
      type: 'eating/getEatingInfo',
      payload: {
        id: match.params.id
      }
    });
  }

  returnPrePage = () => {
    const { dispatch } = this.props;
    router.push(`/knowledge/eating`);
    dispatch({
      type: 'eating/clearAttributes',
      payload: {}
    });
  }

  goEditPage = () => {
    const { match } = this.props;
    router.push(`/knowledge/eating/edit/${match.params.id}`);
  }
  
  componentWillUnmount () {
    const { dispatch } = this.props;
    dispatch({
      type: 'eating/clearAttributes',
      payload: {}
    });
  }

  render() {
    return (
      <div>
        <div className={styles.eatViewFilter}>
          <Button type="primary" style={{ margin: '0 24px' }} onClick={this.goEditPage}>编辑</Button>
          <Button onClick={this.returnPrePage}>返回</Button>
        </div>
        <ViewContent />
      </div>
    )
  }
}
export default Index;
