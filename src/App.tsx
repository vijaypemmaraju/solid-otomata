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

enum Direction {
  UP = 1,
  RIGHT = 2,
  DOWN = 4,
  LEFT = 8,
}

const App: Component = () => {
  const [grid, setGrid] = createStore(
    new Array(8).fill(0).map(() => new Array(8).fill(0))
  );

  const [mode, setMode] = createSignal<"play" | "edit">("edit");

  createEffect(() => {
    // when z is pressed, switch modes
    document.addEventListener("keydown", (e) => {
      if (e.key === "z") {
        setMode(mode() === "play" ? "edit" : "play");
      }
    });
  });

  setInterval(() => {
    if (mode() === "play") {
      setGrid(
        produce((grid) => {
          let processed = new Array(grid.length)
            .fill(0)
            .map(() => new Array(grid[0].length).fill(false));
          for (let i = 0; i < grid.length; i++) {
            const row = grid[i];
            for (let j = 0; j < row.length; j++) {
              if (processed[i][j]) continue;
              const cell = row[j];
              if (cell & Direction.UP) {
                if (i > 0) {
                  if (grid[i - 1][j] === 0) {
                    grid[i][j] = grid[i][j] & ~Direction.UP;
                    grid[i - 1][j] = grid[i - 1][j] | Direction.UP;
                    processed[i][j] = true;
                    processed[i - 1][j] = true;
                  } else {
                    grid[i][j] = (grid[i][j] & ~Direction.UP) | Direction.RIGHT;
                  }
                } else {
                  grid[i][j] = (grid[i][j] & ~Direction.UP) | Direction.DOWN;
                }
              }
              if (cell & Direction.DOWN) {
                if (i < grid.length - 1) {
                  if (grid[i + 1][j] === 0) {
                    grid[i][j] = grid[i][j] & ~Direction.DOWN;
                    grid[i + 1][j] = grid[i + 1][j] | Direction.DOWN;
                    processed[i][j] = true;
                    processed[i + 1][j] = true;
                  } else {
                    grid[i][j] =
                      (grid[i][j] & ~Direction.DOWN) | Direction.LEFT;
                  }
                } else {
                  grid[i][j] = (grid[i][j] & ~Direction.DOWN) | Direction.UP;
                }
              }
              if (cell & Direction.LEFT) {
                if (j > 0) {
                  if (grid[i][j - 1] === 0) {
                    grid[i][j] = grid[i][j] & ~Direction.LEFT;
                    processed[i][j] = true;
                    grid[i][j - 1] = grid[i][j - 1] | Direction.LEFT;
                    processed[i][j - 1] = true;
                  } else {
                    grid[i][j] = (grid[i][j] & ~Direction.LEFT) | Direction.UP;
                  }
                } else {
                  grid[i][j] = (grid[i][j] & ~Direction.LEFT) | Direction.RIGHT;
                }
              }
              if (cell & Direction.RIGHT) {
                if (j < row.length - 1) {
                  if (grid[i][j + 1] === 0) {
                    grid[i][j] = grid[i][j] & ~Direction.RIGHT;
                    processed[i][j] = true;
                    grid[i][j + 1] = grid[i][j + 1] | Direction.RIGHT;
                    processed[i][j + 1] = true;
                  } else {
                    grid[i][j] =
                      (grid[i][j] & ~Direction.RIGHT) | Direction.DOWN;
                  }
                } else {
                  grid[i][j] = (grid[i][j] & ~Direction.RIGHT) | Direction.LEFT;
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
      <div class="w-[100vw] h-[80vh] flex flex-col items-center justify-center">
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
                        "hover:bg-gray-200 cursor-pointer active:bg-gray-300 transition-all active:scale-95 flex items-center justify-center text-black transition-all":
                          true,
                        "bg-white": item() > 0,
                        "bg-black": item() === 0,
                      }}
                      animate={{
                        width: "80px",
                        height: "80px",
                        opacity: item() > 0 ? 0.5 : 0.2,
                      }}
                      transition={{}}
                      onClick={() => {
                        setGrid(
                          produce((grid) => {
                            if (grid[indexX][indexY] === 0) {
                              grid[indexX][indexY] = 1;
                              return;
                            }
                            grid[indexX][indexY] = grid[indexX][indexY] << 1;
                            if (grid[indexX][indexY] > 8) {
                              grid[indexX][indexY] = 1;
                            }
                          })
                        );
                      }}
                    >
                      <Switch>
                        <Match when={item() & Direction.UP}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="50"
                            height="50"
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
                        <Match when={item() & Direction.DOWN}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="50"
                            height="50"
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
                        <Match when={item() & Direction.LEFT}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="50"
                            height="50"
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
                        <Match when={item() & Direction.RIGHT}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="50"
                            height="50"
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
      <button
        class="btn btn-primary mt-4"
        onClick={() => setMode(mode() === "play" ? "edit" : "play")}
      >
        {mode() === "play" ? "Edit" : "Play"}
        <div>
          <kbd class="kbd kbd-xs">Z</kbd>
        </div>
      </button>
    </div>
  );
};

export default App;
