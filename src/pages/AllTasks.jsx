import { useState } from "react";
import AddTask from "../components/AddTask";
import TaskList from "../components/TaskList";

export default function AllTasks() {
  const [filter, setFilter] = useState("all");

  return (
    <div className="displayContainer">
  <AddTask />
  <div className="btns">
    <button className={`btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>All Tasks</button>
    <button className={`btn ${filter === "completed" ? "active" : ""}`} onClick={() => setFilter("completed")}>Completed</button>
    <button className={`btn ${filter === "incompleted" ? "active" : ""}`} onClick={() => setFilter("incompleted")}>Incompleted</button>
  </div>
  <TaskList filter={filter} />
</div>

  );
}
