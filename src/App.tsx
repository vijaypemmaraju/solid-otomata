import {
  For,
  type Component,
  createSignal,
  createEffect,
  Index,
  Switch,
  Match,
} from "solid-js";
import Cell from "./Cell";
import { Motion } from "@motionone/solid";
import { createStore, produce } from "solid-js/store";

const App: Component = () => {
  const [grid, setGrid] = createStore(
    new Array(10).fill(0).map(() => new Array(10).fill(0))
  );

  const [mode, setMode] = createSignal<"play" | "edit">("edit");

  createEffect(() => {
    // when z is pressed, switch modes
    document.addEventListener("keydown", (e) => {
      if (e.key === "z") {
        setMode(mode() === "play" ? "edit" : "play");
      }
    });
    console.log(grid);
  });

  setInterval(() => {
    if (mode() === "play") {
      setGrid(
        produce((grid) => {
          let processed = new Array(grid.length)
            .fill(0)
            .map(() => new Array(grid[0].length).fill(0));
          for (let i = 0; i < grid.length; i++) {
            const row = grid[i];
            for (let j = 0; j < row.length; j++) {
              if (processed[i][j] === 1) continue;
              const cell = row[j];
              if (cell === 1) {
                // move up
                if (i > 0) {
                  if (grid[i - 1][j] === 0) {
                    grid[i][j] = 0;
                    processed[i][j] = 1;
                    grid[i - 1][j] = 1;
                    processed[i - 1][j] = 1;
                  } else {
                    grid[i][j] += 1;
                    grid[i][j] %= 4;
                  }
                } else {
                  grid[i][j] = 2;
                }
              }
              if (cell === 2) {
                // move down
                if (i < grid.length - 1) {
                  if (grid[i + 1][j] === 0) {
                    grid[i][j] = 0;
                    processed[i][j] = 1;
                    grid[i + 1][j] = 2;
                    processed[i + 1][j] = 1;
                  } else {
                    grid[i][j] += 1;
                    grid[i][j] %= 4;
                  }
                } else {
                  grid[i][j] = 1;
                }
              }
              if (cell === 3) {
                // move left
                if (j > 0) {
                  if (grid[i][j - 1] === 0) {
                    grid[i][j] = 0;
                    processed[i][j] = 1;
                    grid[i][j - 1] = 3;
                    processed[i][j - 1] = 1;
                  } else {
                    grid[i][j] += 1;
                    grid[i][j] %= 4;
                  }
                } else {
                  grid[i][j] = 4;
                }
              }
              if (cell === 4) {
                // move right
                if (j < row.length - 1) {
                  if (grid[i][j + 1] === 0) {
                    grid[i][j] = 0;
                    processed[i][j] = 1;
                    grid[i][j + 1] = 4;
                    processed[i][j + 1] = 1;
                  } else {
                    grid[i][j] += 1;
                    grid[i][j] %= 4;
                  }
                } else {
                  grid[i][j] = 3;
                }
              }
            }
          }
        })
      );
    }
  }, 250);

  return (
    <div class="w-[100vw] h-[100vh] flex flex-col items-center justify-center">
      <Motion
        class="flex flex-col"
        animate={{
          gap: mode() === "play" ? "1px" : "5px",
        }}
      >
        <Index each={grid}>
          {(row, indexX) => (
            <Motion
              class="flex space-between"
              animate={{
                gap: mode() === "play" ? "1px" : "5px",
              }}
            >
              <Index each={row()}>
                {(item, indexY) => (
                  <Motion.button
                    classList={{
                      "hover:bg-gray-200 cursor-pointer active:bg-gray-300 transition-all active:scale-95 flex items-center justify-center text-black":
                        true,
                      "bg-white": item() > 0,
                      "bg-black": item() === 0,
                    }}
                    animate={{
                      width: "40px",
                      height: "40px",
                      opacity: 0.2,
                    }}
                    transition={{
                      duration: 1,
                      delay: 0.2 + indexX * 0.01 + indexY * 0.01,
                    }}
                    onClick={() => {
                      if (mode() === "edit") {
                        setGrid(
                          produce((grid) => {
                            grid[indexX][indexY] += 1;
                            grid[indexX][indexY] %= 5;
                          })
                        );
                      }
                    }}
                  >
                    <Switch>
                      <Match when={item() === 1}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          class="bi bi-chevron-up"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
                          />
                        </svg>
                      </Match>
                      <Match when={item() === 2}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          class="bi bi-chevron-down"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                          />
                        </svg>
                      </Match>
                      <Match when={item() === 3}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          class="bi bi-chevron-left"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                          />
                        </svg>
                      </Match>
                      <Match when={item() === 4}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          class="bi bi-chevron-right"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                          />
                        </svg>
                      </Match>
                    </Switch>
                  </Motion.button>
                )}
              </Index>
            </Motion>
          )}
        </Index>
      </Motion>
    </div>
  );
};

export default App;
