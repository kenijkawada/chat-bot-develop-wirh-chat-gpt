import { useState } from "react";

import styles from "../styles/chat.module.css";

const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSendMessage = async () => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    });
    const data = await response.json();
    const botMessage = { content: data.response, isBot: true };
    setMessages([...messages, botMessage]);
    setInput("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.chat_window}>
        {messages.map((message, index) => (
          <div key={index} className={styles.chat_window__message}>
            <div className={styles.avatar}></div>
            <div className={styles.message_body}>{message.content}</div>
          </div>
        ))}
      </div>
      <div className={styles.chat_window__input}>
        <input
          className={styles.input_box}
          type="text"
          placeholder="Type your message here"
          value={input}
          onChange={handleInputChange}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
