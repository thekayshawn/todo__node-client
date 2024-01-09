import "./App.css";
import { Todo } from "./Todo";
import { switchTheme } from "@sassywares/trunk";

switchTheme();

function App() {
  return (
    <>
      <Todo />
    </>
  );
}

export default App;
