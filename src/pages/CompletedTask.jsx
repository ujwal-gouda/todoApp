import TaskList from "../components/TaskList";
import "../style.css"

export default function CompletedTasks() {
  return (
    <div className="displayContainer">
      <TaskList filter="completed" />
    </div>
  );
}
