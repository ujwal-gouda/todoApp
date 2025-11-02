import { ref, onValue, update, remove, off } from "firebase/database";
import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import Loader from "./Loader";

export default function TaskList({ filter }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedText, setEditedText] = useState("");

  // 🔄 Fetch tasks from Firebase
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const taskRef = ref(db, `users/${user.uid}/tasks`);

    const unsubscribe = onValue(
      taskRef,
      (snapshot) => {
        const data = snapshot.val();
        const list = data
          ? Object.entries(data).map(([id, value]) => ({ id, ...value }))
          : [];
        setTasks(list);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching tasks:", error);
        setLoading(false);
      }
    );

    return () => off(taskRef);
  }, []);

  // 🟢 Show loader while fetching
  if (loading) return <Loader />;

  // 🔽 Filter tasks
  const filtered = tasks.filter((t) => {
    if (filter === "completed") return t.isCompleted;
    if (filter === "incompleted") return !t.isCompleted;
    return true;
  });

  // 🧠 Long-press support for mobile
  let pressTimer;
  const handleLongPressStart = (id, task) => {
    pressTimer = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate(40);
      setEditingTaskId(id);
      setEditedText(task);
    }, 600); // 0.6 seconds hold
  };

  const handleLongPressEnd = () => {
    clearTimeout(pressTimer);
  };

  // ✅ Render tasks
  return (
    <ul>
      {filtered.map((t) => (
        <li key={t.id}>
          <span
            onDoubleClick={() => {
              setEditingTaskId(t.id);
              setEditedText(t.task);
            }}
            onTouchStart={() => handleLongPressStart(t.id, t.task)} // 📱 for mobile
            onTouchEnd={handleLongPressEnd}
            style={{
              textDecoration: t.isCompleted ? "line-through" : "none",
              cursor: "pointer",
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <input
              type="checkbox"
              checked={t.isCompleted}
              onChange={() =>
                update(ref(db, `users/${auth.currentUser.uid}/tasks/${t.id}`), {
                  isCompleted: !t.isCompleted,
                })
              }
            />

            {editingTaskId === t.id ? (
              <input
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                onBlur={() => {
                  update(ref(db, `users/${auth.currentUser.uid}/tasks/${t.id}`), {
                    task: editedText,
                  });
                  setEditingTaskId(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    update(ref(db, `users/${auth.currentUser.uid}/tasks/${t.id}`), {
                      task: editedText,
                    });
                    setEditingTaskId(null);
                  }
                }}
                autoFocus
              />
            ) : (
              <>
                {t.task}
                {t.dueDate && (
                  <small style={{ marginLeft: "10px", color: "#777" }}>
                    (Due: {t.dueDate})
                  </small>
                )}
              </>
            )}
          </span>

          <button
            onClick={() =>
              remove(ref(db, `users/${auth.currentUser.uid}/tasks/${t.id}`))
            }
          >
            X
          </button>
        </li>
      ))}
    </ul>
  );
}
