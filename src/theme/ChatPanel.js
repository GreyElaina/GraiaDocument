import React from "react";
import styles from "./ChatPanel.module.css";
import util_styles from "./util.module.css";
import classnames from "classnames";
import useThemeContext from '@theme/hooks/useThemeContext';

function ChatPanel({controls, title, children}){
  const {isDarkTheme, setLightTheme, setDarkTheme} = useThemeContext();
  console.log(styles)
  return <>
    <div className={classnames(styles["panel-view"], {
      [styles["mini"]]: !controls && !title,
    })} style={isDarkTheme ? {"background-color": "#18191A"} : {"background-color": "#f3f6f9"}}>
      <div className={styles.controls}>
        <div className={styles.title} style={isDarkTheme ? {"color": "white"} : {"color": "#18191A"}}>{ title }</div>
      </div>

      <div className={styles.content}>{children}</div>
    </div>
  </>
}

export default ChatPanel;