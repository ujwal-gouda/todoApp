import TaskList from "../components/TaskList";
import "../style.css"

export default function IncompletedTasks() {
  return (
    <div className="displayContainer">
      <TaskList filter="incompleted" />
    </div>
  );
}
