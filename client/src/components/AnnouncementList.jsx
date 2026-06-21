import React, { useEffect, useState } from "react";
import api from "../api/api";
function AnnouncementList() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get("/announcements").then(res => setItems(res.data)).catch(() => setItems([])); }, []);
  return <div className="announcement-list">{items.length === 0 ? <p>No announcements yet.</p> : items.map(item => <div className={`announcement ${item.priority}`} key={item._id}><div><b>{item.title}</b><p>{item.message}</p></div><span>{item.priority}</span></div>)}</div>;
}
export default AnnouncementList;
