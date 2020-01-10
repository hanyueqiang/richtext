
import React, { PureComponent } from 'react';
import { Menu } from 'antd';
import { Link } from 'umi';
import { connect } from 'dva';
import { queryKeysByPath } from '@utils';

const { SubMenu, Item } = Menu;

class MainMenu extends PureComponent {
  static defaultProps = {
    mode: "inline",
    menuTheme: 'light'
  };
  renderMenu(data = []) {
    const rows = Array.isArray(data) ? data : data.rows;
    const self = this;
    const { mode } = this.props;
    return rows.map((row) => {
      if (row === undefined) return false;
      const { title: name, link = "", key = link, query, children, ...restState } = row;
      if (children && children.length > 0) {
        const subMenu = self.renderMenu(children);
        return (
          <SubMenu
            key={key}
            text={name}
            title={<span>{mode === 'inline' ? <span>{name}</span> : null}</span>}
          >
            {subMenu}
          </SubMenu>
        );
      } else {
        return (
          <Item
            key={key}
            text={name}
          >
            <Link to={{ pathname: link, query, state: { ...restState, key } }}>
              {/* <Icon type={icon} /> */}
              <span>{name}</span>
            </Link>
          </Item>
        );
      }
    });
  }
  render() {
    const { location, defaultKey, menuTheme, menusData, mode } = this.props;
    const { pathname } = location;
    const menus = this.renderMenu(menusData);
    const key= queryKeysByPath(pathname, menusData);
    return (
      <Menu
        selectedKeys={[key || defaultKey]}
        defaultOpenKeys={['knowledge']}
        mode={mode}
        theme={menuTheme}
        className="progressbar"
      >
        {menus}
      </Menu>
    );
  }
}
export default connect(({ menu: { menusData } }) => ({ menusData }))(MainMenu);
