import React, { Component } from 'react';
import { Button, Input } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import { columns } from './components/columns';
import TableContainer from '@components/tableContainer';
import styles from './index.less';
let Timer;

@connect(({ eating }) => ({ ...eating }))
class Index extends Component {

  componentDidMount() {
    this.getEatingList();
  }

  getEatingList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'eating/getEatingList',
      payload: {}
    });
  }

  onSearchChange = (e) => {
    const val = e.target.value;
    if (Timer) {
      clearTimeout(Timer);
      Timer = null;
    }
    Timer = setTimeout(this.saveSearchVal(val), 300);
  }
  
  saveSearchVal = (val) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'eating/save',
      payload: {
        searchContent: val
      }
    });
  }

  onQueryChange = () => {
    this.getEatingList();
  }

  edit = (record) => {
    if (!record.id) return;
    router.push(`/knowledge/eating/edit/${record.id}`);
  }

  delete = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'eating/delete',
      payload: {
        id
      }
    });
  }

  view = (record) => {
    if (!record.id) return;
    router.push(`/knowledge/eating/view/${record.id}`);
  }

  onTableChange = (pagination) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'eating/save',
      payload: {
        pagination: {
          current: pagination.current,
          total: pagination.total,
          pageSize: pagination.pageSize
        }
      }
    });
    this.getEatingList();
  }

  buildNewEating = () => {
    router.push(`/knowledge/eating/edit/new`);
  }

  render() {
    const { dataSource, rowKey, loading, pagination, searchContent } = this.props;
    return (
      <div>
        <div className={styles.eatingFilter}>
          <Input placeholder="请输入关键字" value={searchContent} style={{ width: 180 }} onChange={this.onSearchChange} allowClear/>
          <Button type="primary" style={{ margin: '0 24px' }} onClick={this.onQueryChange}>查询</Button>
          <Button type="primary" onClick={this.buildNewEating}>新增</Button>
        </div>
        <TableContainer
          columns={columns(this)}
          dataSource={dataSource}
          loading={loading}
          rowKey={rowKey}
          pagination={pagination}
          onChange={this.onTableChange}
        />
      </div>
    )
  }
}
export default Index;
