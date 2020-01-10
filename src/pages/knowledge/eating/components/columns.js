import { getCanEating } from '@utils';
import { Popconfirm } from 'antd';

export const columns = context => ([
  {
    title: '编号',
    dataIndex: 'id',
    align: 'left',
    ellipsis: true,
    render: text => text || '-'
  },
  {
    title: '食物',
    align: 'left',
    dataIndex: 'title',
    ellipsis: true,
    render: text => text || '-'
  },
  {
    title: '分类',
    align: 'left',
    ellipsis: true,
    dataIndex: 'categoryName',
    render: text => text || '-'
  },
  {
    title: '别名/关键字',
    align: 'left',
    ellipsis: true,
    dataIndex: 'keyWord',
    render: text => text || '-'
  },
  {
    title: '排序',
    align: 'left',
    ellipsis: true,
    dataIndex: 'sort',
    render: text => text || '-'
  },
  {
    title: '孕妇',
    align: 'left',
    ellipsis: true,
    dataIndex: 'pregnantStatus',
    render: text => {
      return getCanEating(text);
    }
  },
  {
    title: '产妇',
    align: 'left',
    ellipsis: true,
    dataIndex: 'puerperaStatus',
    render: text => {
      return getCanEating(text);
    }
  },
  {
    title: '哺乳期',
    align: 'left',
    ellipsis: true,
    dataIndex: 'sucklingStatus',
    render: text => {
      return getCanEating(text);
    }
  },
  {
    title: '6个月+宝宝',
    align: 'left',
    ellipsis: true,
    dataIndex: 'babyStatus',
    render: text => {
      return getCanEating(text);
    }
  },
  {
    title: '编辑',
    align: 'center',
    dataIndex: 'options',
    width: 120,
    render: (text, record) => (
      <div>
        <span className="smart-highlight" onClick={context.view.bind(context, record)}>查看</span>
        <span className="smart-highlight" onClick={context.edit.bind(context, record)} style={{marginLeft: 10}}>编辑</span>
        <Popconfirm title="是否删除数据?" placement="leftTop" onConfirm={context.delete.bind(context, record.id)}>
          <span className="smart-highlight" style={{marginLeft: 10}}>删除</span>
        </Popconfirm>
      </div>
    )
  },
]);
