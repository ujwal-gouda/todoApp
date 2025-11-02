import { useState } from "react";
import { ref, push, set } from "firebase/database";
import { db, auth } from "../firebase";
import "../style.css"

export default function AddTask() {
  const [task, setTask] = useState("");

  const addTask = async () => {
    const user = auth.currentUser;
    if (!task.trim() || !user) return;
    const newRef = push(ref(db, `users/${user.uid}/tasks`));
    await set(newRef, { task, isCompleted: false });
    setTask("");
  };

  return (
    
    <div className="inputContainer">
      <input
        className="enterButton"
        type="text"
        placeholder="Enter task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        style={{flex: 1}}
      />
      <button onClick={addTask}>Enter</button>
    </div>
    
  );
}
