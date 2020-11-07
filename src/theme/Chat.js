import React from "react";
import styles from "./Chat.module.css";
import util_styles from "./util.module.css";
import useThemeContext from '@theme/hooks/useThemeContext';
import classnames from 'classnames';

function Chat({avatar, color, nickname, children}){
  const {isDarkTheme, setLightTheme, setDarkTheme} = useThemeContext();
  return (
    <div className={styles["chat-message"]}>
      {avatar ?
        <img className={styles.avatar} src={avatar}/> :
        <div className={styles.avatar} style={{backgroundColor: color}}>{nickname[0]}</div>
      }
      <div className={styles.nickname} style={isDarkTheme ? {"color": "#CCCCCC"} : {"color": "black"}}>{nickname}</div>
      <div className={classnames(styles["message-box"], {
        [util_styles["dark-text-box"]]: isDarkTheme
      })}>
        {children}
      </div>
    </div>
  )
}

export default Chat;