import {
  For,
  type Component,
  createSignal,
  createEffect,
  Index,
} from "solid-js";
import Cell from "./Cell";

const App: Component = () => {
  const [big2DArray, setBig2DArray] = createSignal(
    new Array(50)
      .fill(0)
      .map(() => new Array(50).fill(Math.floor(Math.random() * 2)))
  );

  setInterval(() => {
    const array = [...big2DArray().map((row) => [...row])];
    for (let i = 0; i < array.length; i++) {
      const row = array[i];
      for (let j = 0; j < row.length; j++) {
        const cell = row[j];
        let neighbors = 0;
        if (i > 0) {
          neighbors += array[i - 1][j];
          if (j > 0) {
            neighbors += array[i - 1][j - 1];
          }
          if (j < row.length - 1) {
            neighbors += array[i - 1][j + 1];
          }
        }
        if (i < array.length - 1) {
          neighbors += array[i + 1][j];
          if (j > 0) {
            neighbors += array[i + 1][j - 1];
          }
          if (j < row.length - 1) {
            neighbors += array[i + 1][j + 1];
          }
        }
        if (j > 0) {
          neighbors += array[i][j - 1];
        }
        if (j < row.length - 1) {
          neighbors += array[i][j + 1];
        }
        if (cell === 1) {
          if (neighbors < 2 || neighbors > 3) {
            array[i][j] = 0;
          }
        } else {
          if (neighbors === 3) {
            array[i][j] = 1;
          }
        }
      }
    }

    setBig2DArray(array);
  }, 100);

  return (
    <Index each={big2DArray()}>
      {(item) => (
        <div
          style={{
            display: "flex",
            "justify-content": "space-between",
            "max-width": "25vw",
          }}
        >
          <Index each={item()}>
            {(item) => (
              <span style={{ width: "2px" }}>
                {item() === 1 ? <Cell /> : "-"}
              </span>
            )}
          </Index>
        </div>
      )}
    </Index>
  );
};

export default App;
