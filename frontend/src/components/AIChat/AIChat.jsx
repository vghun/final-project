import React, { useState } from "react";
import { Send, Bot, User, Camera } from "lucide-react";
import "./AIChat.scss";
import * as chatService from "~/services/chatService";

export default function AIChat() {
  const [messages, setMessages] = useState([
    { id: "1", type: "ai", content: "Xin chào! Tôi là AI. Bạn hãy nhập tin nhắn hoặc tải ảnh lên 👋" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => setSelectedImage(ev.target.result);
    reader.readAsDataURL(file);
  }
};

const handleSend = async () => {
  if (loading) return; // tránh gửi khi đang gửi
  if (!inputMessage.trim() && !selectedImage) return;

  const newMsg = {
    id: Date.now().toString(),
    type: "user",
    content: inputMessage || "Đã gửi ảnh",
    image: selectedImage,
  };

  setMessages((prev) => [...prev, newMsg]);
  setInputMessage("");
  setSelectedImage(null);
  setLoading(true);

  try {
    const res = await chatService.sendMessage({
      message: newMsg.content,
      image: newMsg.image,
    });

    setMessages((prev) => [
      ...prev,
      { id: (Date.now() + 1).toString(), type: "ai", content: res.reply || "AI không trả lời gì 😅" },
    ]);
  } catch (err) {
    setMessages((prev) => [
      ...prev,
      { id: (Date.now() + 2).toString(), type: "ai", content: "Đã xảy ra lỗi, thử lại sau" },
    ]);
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="chat-card">
      <div className="chat-header">
        <Bot size={20} />
        <h3>AI Chat </h3>
      </div>

      <div className="chat-body">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-message ${msg.type}`}>
            {msg.type === "ai" && <div className="avatar"><Bot size={16} /></div>}
            <div className="bubble">
              {msg.image && <img src={msg.image} alt="upload" className="bubble-img" />}
              <p>{msg.content}</p>
            </div>
            {msg.type === "user" && <div className="avatar"><User size={16} /></div>}
          </div>
        ))}
        {loading && <p className="ai-loading">AI đang trả lời...</p>}
      </div>

      {selectedImage && (
        <div className="preview">
          <img src={selectedImage} alt="preview" />
          <button onClick={() => setSelectedImage(null)}>✕</button>
        </div>
      )}

      <div className="chat-input">
       <textarea
          placeholder="Nhập tin nhắn..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(); // sẽ gửi 1 lần duy nhất
            }
          }}
        />

        <div className="actions">
          <label htmlFor="imgUpload" className="upload-btn">
            <Camera size={20} />
          </label>
          <input id="imgUpload" type="file" accept="image/*" onChange={handleImageUpload} hidden />
          <button className="send-btn" onClick={handleSend}>
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
