import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import styles from './index.less';

@connect(({ eating }) => ({ ...eating }))
class Index extends Component {

  getCanEatingLabel = (key) => {
    switch(key) {
      case 1: return <span><Icon type="check-circle" theme="filled" style={{color: 'green'}} /> 能吃</span>;
      case 2: return <span><Icon type="exclamation-circle" theme="filled" style={{color: 'orange'}} /> 慎吃</span>;
      case 3: return <span><Icon type="minus-circle" theme="filled" style={{color: 'red'}} /> 禁止</span>;
      default: return '-';
    }
  }

  render() {
    const { avator, food, categoryName, eatingSort, keyWord, canEatingSource, url } = this.props;
    const { pregnantStatus, puerperaStatus, sucklingStatus, babyStatus } = canEatingSource;
    return (
      <div>
        <div className={styles.eatEditContent}>
          <div className="flex-row">
            <div className={styles.editDistance}>
              <span>食材：{food}</span>
            </div>
            <div className={styles.editDistance}>
              <span>分类：{categoryName}</span>
            </div>
            <div>
              <span>排序：{eatingSort}</span>
            </div>
          </div>
          <div className={styles.divdistance}>
            <span style={{ marginRight: 4 }}>关键字: </span>
            <span>{keyWord}</span>
          </div>
          <div className={`flex-row ${styles.divdistance}`}>
            <div className={styles.editDistance}>
              <span>孕妇：</span>
              <span>{this.getCanEatingLabel(pregnantStatus)}</span>
            </div>
            <div className={styles.editDistance}>
              <span>产妇：</span>
              <span>{this.getCanEatingLabel(puerperaStatus)}</span>
            </div>
            <div className={styles.editDistance}>
              <span>哺乳期：</span>
              <span>{this.getCanEatingLabel(sucklingStatus)}</span>
            </div>
            <div>
              <span>6个月+婴儿：</span>
              <span>{this.getCanEatingLabel(babyStatus)}</span>
            </div>
          </div>
          <div className={`flex-row ${styles.divdistance}`}>
            <div className={styles.editDistance}>
              <span>图片: </span>
            </div>
            <div style={{ position: 'relative', width: 150 }}>
              {avator ? <img src={avator} alt="avatar" style={{ height: 80, width: 80 }} /> : '-'}
            </div>
          </div>
          <div className="flex-row nowrap">
            <div className={styles.editDistance}>
              <span>详情: </span>
            </div>
            {url ? <div style={{ flex: 1, border: '1px solid #ccc' }}>
              <iframe allowFullScreen frameBorder="0" height="500px" width="100%" src={url} title="navigation"></iframe>
            </div> : <div>-</div>
            }
          </div>
        </div>
      </div>
    )
  }
}
export default Index;
