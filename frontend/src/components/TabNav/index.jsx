import React from "react";
import classNames from "classnames/bind";
import styles from "./TabNav.module.scss";

const cx = classNames.bind(styles);

function TabNav({ tabs, activeTab, setActiveTab }) {
  return (
    <div className={cx("tabNav")}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={cx("tabBtn", { active: activeTab === tab.id })}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default TabNav;
