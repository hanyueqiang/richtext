import React, { Component } from 'react';
import { Button, Input, Select, Tag, Tooltip, Icon, message, Upload } from 'antd';
import router from 'umi/router';
import RichEditor from '@components/richEditor';
import { connect } from 'dva';
import styles from './index.less';

const { Option } = Select;

@connect(({ eating }) => ({ ...eating }))
class Index extends Component {
  state = {
    inputVisible: false,
    inputValue: '',
    currentId: ''
  }

  componentDidMount() {
    this.getCategoryList();
    this.getEditInfo();
  }

  getEditInfo = async () => {
    const { match, dispatch } = this.props;
    const currentId = match.params.id;
    this.setState({
      currentId
    });

    if (currentId !== 'new') {
      const result = await dispatch({
        type: 'eating/getEatingInfo',
        payload: {
          id: currentId
        }
      });
      if (result.text) {
        this.richTextRef.setEditorContent(result.text);
      }
    } else {
      dispatch({
        type: 'eating/clearAttributes',
        payload: {}
      });
    }
  }

  getCategoryList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'eating/getCategoryList',
      payload: {
        type: 1
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

  onFoodChange = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'eating/save',
      payload: {
        food: e.target.value
      }
    });
  }
  handleInputChange = e => {
    const val = e.target.value;
    this.setState({ inputValue: val });
  };

  onCategoryChange = (val) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'eating/save',
      payload: {
        categoryId: val
      }
    });
  }
  onCanEatingChange = (eatingkey, val) => {
    let { dispatch, canEatingSource } = this.props;
    const newCanEatingSource = JSON.parse(JSON.stringify(canEatingSource));
    newCanEatingSource[eatingkey] = val;
    dispatch({
      type: 'eating/save',
      payload: {
        canEatingSource: newCanEatingSource
      }
    });
  }

  onSortChange = (e) => {
    const { dispatch } = this.props;
    if (e.target.value !== '' && e.target.value < 1) {
      return;
    }
    dispatch({
      type: 'eating/save',
      payload: {
        eatingSort: e.target.value
      }
    });
  }

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { keyWordList, dispatch } = this.props;
    if (inputValue && keyWordList.indexOf(inputValue) === -1) {
      keyWordList = [...keyWordList, inputValue];
    }
    this.setState({
      inputVisible: false,
      inputValue: '',
    });
    dispatch({
      type: 'eating/save',
      payload: {
        keyWordList
      }
    });
  };

  handleClose = removedTag => {
    let { keyWordList, dispatch } = this.props;
    const newkeyWordList = keyWordList.filter(tag => tag !== removedTag);
    dispatch({
      type: 'eating/save',
      payload: {
        keyWordList: newkeyWordList
      }
    });
  }

  removeImg = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'eating/save',
      payload: {
        avator: null
      }
    });
  }

  saveInputRef = input => (this.input = input);

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  onSave = async () => {
    const { dispatch } = this.props;
    const { currentId } = this.state;
    const richText = this.richTextRef.getEditorContent();
    const result = await dispatch({
      type: 'eating/saveEatingFetch',
      payload: {
        richText,
        id: currentId
      }
    });
    if (result.code === 0) {
      message.success('保存成功');
      if (currentId === 'new') {
        router.push(`/knowledge/eating`);
      } else {
        router.push(`/knowledge/eating/view/${currentId}`);
      }
      dispatch({
        type: 'eating/clearAttributes',
        payload: {}
      });
    }
  }

  beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }
  handleChange = info => {
    const { dispatch } = this.props;
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      this.setState({ loading: false });
      let response = info.file.response;
      if (response.code === 0) {
        dispatch({
          type: 'eating/save',
          payload: {
            avator: response.data
          }
        });
      } else {
        message.error(response.msg);
      }
    }
  };
  render() {
    const { avator, food, categoryId, categoryList, eatingSort, keyWordList, canEatingList, canEatingSource } = this.props;
    const { pregnantStatus, puerperaStatus, sucklingStatus, babyStatus } = canEatingSource;
    const { inputVisible, inputValue } = this.state;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <div className={styles.eatEditFilter}>
          <Button type="primary" style={{ margin: '0 24px' }} onClick={this.onSave}>保存</Button>
          <Button onClick={this.returnPrePage}>返回</Button>
        </div>
        <div className={styles.eatEditContent}>
          <div className="flex-row">
            <div className={styles.editDistance}>
              <span>食材：</span>
              <Input maxLength={10} value={food} onChange={this.onFoodChange} style={{ width: 160 }} />
            </div>
            <div className={styles.editDistance}>
              <span>分类：</span>
              <Select value={categoryId} placeholder="请选择" style={{ width: 140 }} onChange={this.onCategoryChange}>
                {categoryList.map(item => <Option key={item.id} value={item.id}>{item.title}</Option>)}
              </Select>
            </div>
            <div>
              <span>排序：</span>
              <Input min="1" max="9999" type="number" onChange={this.onSortChange} value={eatingSort} style={{ width: 80 }} />
            </div>
          </div>
          <div className={styles.divdistance}>
            <span style={{ marginRight: 4 }}>关键字: </span>
            {keyWordList.map((tag, index) => {
              const isLongTag = tag.length > 20;
              const tagElem = (
                <Tag key={tag} closable={true} color="blue" onClose={() => this.handleClose(tag)}>
                  {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                </Tag>
              );
              return isLongTag ? (
                <Tooltip title={tag} key={tag}>
                  {tagElem}
                </Tooltip>
              ) : (
                  tagElem
                );
            })}
            {inputVisible && (
              <Input
                ref={this.saveInputRef}
                type="text"
                size="small"
                style={{ width: 78 }}
                value={inputValue}
                onChange={this.handleInputChange}
                onBlur={this.handleInputConfirm}
                onPressEnter={this.handleInputConfirm}
              />
            )}
            {!inputVisible && keyWordList.length < 10 && (
              <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
                <Icon type="plus" /> 添加关键字
              </Tag>
            )}
          </div>
          <div className={`flex-row ${styles.divdistance}`}>
            <div className={styles.editDistance}>
              <span>孕妇：</span>
              <Select value={pregnantStatus} placeholder="请选择" style={{ width: 120 }} onChange={this.onCanEatingChange.bind(this, 'pregnantStatus')}>
                {canEatingList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
              </Select>
            </div>
            <div className={styles.editDistance}>
              <span>产妇：</span>
              <Select value={puerperaStatus} placeholder="请选择" style={{ width: 120 }} onChange={this.onCanEatingChange.bind(this, 'puerperaStatus')}>
                {canEatingList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
              </Select>
            </div>
            <div className={styles.editDistance}>
              <span>哺乳期：</span>
              <Select value={sucklingStatus} placeholder="请选择" style={{ width: 120 }} onChange={this.onCanEatingChange.bind(this, 'sucklingStatus')}>
                {canEatingList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
              </Select>
            </div>
            <div>
              <span>6个月+婴儿：</span>
              <Select value={babyStatus} placeholder="请选择" style={{ width: 120 }} onChange={this.onCanEatingChange.bind(this, 'babyStatus')}>
                {canEatingList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
              </Select>
            </div>
          </div>
          <div className={`flex-row ${styles.divdistance}`}>
            <div className={styles.editDistance}>
              <span>图片: </span>
            </div>
            <div style={{ position: 'relative', width: 150 }}>
              <Upload
                name="file"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="/smart_ward_admin/restapi/v1/file/upload"
                beforeUpload={this.beforeUpload}
                onChange={this.handleChange}
              >
                {avator ? <img src={avator} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
              </Upload>
              {avator && <span style={{ position: 'absolute', right: 10, top: 0, cursor: 'pointer' }} onClick={this.removeImg}>移除</span>}
            </div>
          </div>
          <div className="flex-row nowrap">
            <div className={styles.editDistance}>
              <span>详情: </span>
            </div>
            <div style={{ flex: 1 }}>
              <RichEditor onRef={ref => this.richTextRef = ref} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Index;
