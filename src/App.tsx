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
import * as Tone from "tone";

enum Direction {
  UP = 1,
  RIGHT = 2,
  DOWN = 4,
  LEFT = 8,
}

const GRID_SIZE = 8;

const SCALE = ["E3", "B3", "C4", "D4", "E4", "F#4", "G4", "B4", "D5"];

let synth: Tone.Synth;

const App: Component = () => {
  const [grid, setGrid] = createStore([
    new Array(10).fill(-1),
    ...new Array(GRID_SIZE)
      .fill(undefined)
      .map(() => [-1, ...new Array(GRID_SIZE).fill(0), -1]),
    new Array(10).fill(-1),
  ]);

  const feedbackDelay = new Tone.FeedbackDelay("8n", 0.5).toDestination();

  const [mode, setMode] = createSignal<"play" | "edit">("edit");

  createEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "z") {
        setMode(mode() === "play" ? "edit" : "play");
      }
    });
  });

  createEffect(() => {
    if (mode() === "play" && !synth) {
      synth = new Tone.Synth().toDestination().connect(feedbackDelay);
    }
  });

  setInterval(() => {
    if (mode() === "play") {
      let delayAmount = 0;
      setGrid(
        produce((grid) => {
          let processed = new Array(grid.length)
            .fill(0)
            .map(() => new Array(grid[0].length).fill(false));
          for (let i = 1; i < grid.length - 1; i++) {
            const row = grid[i];
            for (let j = 1; j < row.length - 1; j++) {
              if (processed[i][j]) continue;
              delayAmount += 0.000001;
              const cell = row[j];
              if (cell & Direction.UP) {
                if (i > 1) {
                  if (grid[i - 1][j] === 0) {
                    grid[i][j] = grid[i][j] & ~Direction.UP;
                    grid[i - 1][j] = grid[i - 1][j] | Direction.UP;
                    processed[i][j] = true;
                    processed[i - 1][j] = true;
                    if (i - 1 === 1) {
                      grid[i - 2][j] = -2;
                      synth.triggerAttackRelease(
                        SCALE[j],
                        "8n",
                        Tone.now() + delayAmount
                      );
                      setTimeout(() => {
                        grid[i - 2][j] = -1;
                      }, 100);
                    }
                  } else {
                    synth.triggerAttackRelease(
                      SCALE[j],
                      "8n",
                      Tone.now() + delayAmount
                    );
                    grid[i][j] = (grid[i][j] & ~Direction.UP) | Direction.RIGHT;
                  }
                } else {
                  grid[i][j] = (grid[i][j] & ~Direction.UP) | Direction.DOWN;
                }
              }
              if (cell & Direction.DOWN) {
                if (i < grid.length - 2) {
                  if (grid[i + 1][j] === 0) {
                    grid[i][j] = grid[i][j] & ~Direction.DOWN;
                    grid[i + 1][j] = grid[i + 1][j] | Direction.DOWN;
                    processed[i][j] = true;
                    processed[i + 1][j] = true;
                    if (i + 1 === grid.length - 2) {
                      grid[i + 2][j] = -2;
                      synth.triggerAttackRelease(
                        SCALE[j],
                        "8n",
                        Tone.now() + delayAmount
                      );
                      setTimeout(() => {
                        grid[i + 2][j] = -1;
                      }, 100);
                    }
                  } else {
                    synth.triggerAttackRelease(
                      SCALE[j],
                      "8n",
                      Tone.now() + delayAmount
                    );
                    grid[i][j] =
                      (grid[i][j] & ~Direction.DOWN) | Direction.LEFT;
                  }
                } else {
                  grid[i][j] = (grid[i][j] & ~Direction.DOWN) | Direction.UP;
                }
              }
              if (cell & Direction.LEFT) {
                if (j > 1) {
                  if (grid[i][j - 1] === 0) {
                    grid[i][j] = grid[i][j] & ~Direction.LEFT;
                    processed[i][j] = true;
                    grid[i][j - 1] = grid[i][j - 1] | Direction.LEFT;
                    processed[i][j - 1] = true;
                    if (j - 1 === 1) {
                      grid[i][j - 2] = -2;
                      synth.triggerAttackRelease(
                        SCALE[i],
                        "8n",
                        Tone.now() + delayAmount
                      );
                      setTimeout(() => {
                        grid[i][j - 2] = -1;
                      }, 100);
                    }
                  } else {
                    synth.triggerAttackRelease(
                      SCALE[i],
                      "8n",
                      Tone.now() + delayAmount
                    );
                    grid[i][j] = (grid[i][j] & ~Direction.LEFT) | Direction.UP;
                  }
                } else {
                  grid[i][j] = (grid[i][j] & ~Direction.LEFT) | Direction.RIGHT;
                }
              }
              if (cell & Direction.RIGHT) {
                if (j < row.length - 2) {
                  if (grid[i][j + 1] === 0) {
                    grid[i][j] = grid[i][j] & ~Direction.RIGHT;
                    processed[i][j] = true;
                    grid[i][j + 1] = grid[i][j + 1] | Direction.RIGHT;
                    processed[i][j + 1] = true;
                    if (j + 1 === row.length - 2) {
                      grid[i][j + 2] = -2;
                      synth.triggerAttackRelease(
                        SCALE[i],
                        "8n",
                        Tone.now() + delayAmount
                      );
                      setTimeout(() => {
                        grid[i][j + 2] = -1;
                      }, 100);
                    }
                  } else {
                    synth.triggerAttackRelease(
                      SCALE[i],
                      "8n",
                      Tone.now() + delayAmount
                    );
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

  const divisor = navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)
    ? 10
    : 20;

  return (
    <div class="w-[100vw] h-[100vh] flex flex-col items-between justify-between select-none overflow-hidden">
      <div class="w-full h-full flex flex-col items-center justify-center overflow-hidden">
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
                  {(item, indexY) => {
                    const isCorner =
                      (indexX === 0 && indexY === 0) ||
                      (indexX === 0 && indexY === row().length - 1) ||
                      (indexX === row().length - 1 && indexY === 0) ||
                      (indexX === row().length - 1 &&
                        indexY === row().length - 1);

                    return (
                      <Switch>
                        <Match when={item() < 0}>
                          <Motion.div
                            animate={{
                              width: `${Math.floor(
                                (window.innerWidth * 0.8) /
                                  (indexY === 0 || indexY === row().length - 1
                                    ? divisor * (item() === -2 ? 2 : 4)
                                    : divisor)
                              )}px`,
                              height: `${Math.floor(
                                (window.innerWidth * 0.8) /
                                  (indexX === 0 || indexX === row().length - 1
                                    ? divisor * (item() === -2 ? 2 : 4)
                                    : divisor)
                              )}px`,
                              position: "relative",
                              bottom:
                                indexX == 0
                                  ? `${Math.floor(item() === -2 ? 10 : 0)}px`
                                  : undefined,
                              top:
                                indexX == row().length - 1
                                  ? `${Math.floor(item() === -2 ? 10 : 0)}px`
                                  : undefined,
                              right:
                                indexY == 0
                                  ? `${Math.floor(item() === -2 ? 10 : 0)}px`
                                  : undefined,
                              left:
                                indexY == row().length - 1
                                  ? `${Math.floor(item() === -2 ? 10 : 0)}px`
                                  : undefined,
                              opacity: item() === -2 ? 0.5 : 0.2,
                              backgroundColor: isCorner
                                ? "transparent"
                                : item() === -2
                                ? "white"
                                : "black",
                            }}
                          ></Motion.div>
                        </Match>
                        <Match when={item() >= 0}>
                          <Motion.button
                            classList={{
                              "hover:bg-gray-200 cursor-pointer active:bg-gray-300 transition-all active:scale-95 flex items-center justify-center text-black transition-all":
                                true,
                              "bg-white": item() > 0,
                              "bg-black": item() === 0,
                            }}
                            style={{
                              opacity: item() > 0 ? 0.5 : 0.2,
                            }}
                            animate={{
                              width: `${Math.floor(
                                (window.innerWidth * 0.8) / divisor
                              )}px`,
                              height: `${Math.floor(
                                (window.innerWidth * 0.8) / divisor
                              )}px`,
                            }}
                            transition={{
                              duration: 0.1,
                            }}
                            onClick={() => {
                              setGrid(
                                produce((grid) => {
                                  if (grid[indexX][indexY] === 0) {
                                    grid[indexX][indexY] = 1;
                                    return;
                                  }
                                  grid[indexX][indexY] *= 2;
                                  if (grid[indexX][indexY] > 8) {
                                    grid[indexX][indexY] = 0;
                                  }
                                })
                              );
                            }}
                          >
                            <Switch>
                              <Match when={item() & Direction.UP}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  class="bi bi-chevron-up"
                                  viewBox="0 0 16 16"
                                  style={{
                                    width: `${Math.floor(
                                      (window.innerWidth * 0.8) / (divisor * 2)
                                    )}px`,
                                    height: `${Math.floor(
                                      (window.innerWidth * 0.8) / (divisor * 2)
                                    )}px`,
                                  }}
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
                                  fill="currentColor"
                                  class="bi bi-chevron-down"
                                  viewBox="0 0 16 16"
                                  style={{
                                    width: `${Math.floor(
                                      (window.innerWidth * 0.8) / (divisor * 2)
                                    )}px`,
                                    height: `${Math.floor(
                                      (window.innerWidth * 0.8) / (divisor * 2)
                                    )}px`,
                                  }}
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
                                  fill="currentColor"
                                  class="bi bi-chevron-left"
                                  viewBox="0 0 16 16"
                                  style={{
                                    width: `${Math.floor(
                                      (window.innerWidth * 0.8) / (divisor * 2)
                                    )}px`,
                                    height: `${Math.floor(
                                      (window.innerWidth * 0.8) / (divisor * 2)
                                    )}px`,
                                  }}
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
                                  fill="currentColor"
                                  class="bi bi-chevron-right"
                                  viewBox="0 0 16 16"
                                  style={{
                                    width: `${Math.floor(
                                      (window.innerWidth * 0.8) / (divisor * 2)
                                    )}px`,
                                    height: `${Math.floor(
                                      (window.innerWidth * 0.8) / (divisor * 2)
                                    )}px`,
                                  }}
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                                  />
                                </svg>
                              </Match>
                            </Switch>
                          </Motion.button>
                        </Match>
                      </Switch>
                    );
                  }}
                </Index>
              </Motion>
            )}
          </Index>
        </Motion>
      </div>
      <button
        class="btn btn-primary fixed bottom-0 right-0 w-[100vw]"
        onClick={() => setMode(mode() === "play" ? "edit" : "play")}
      >
        {mode() === "play" ? "Edit" : "Play"}
        <div>
          {!navigator.userAgent.match(/Android|iPhone|iPad|iPod/i) ? (
            <kbd class="kbd kbd-xs">Z</kbd>
          ) : null}
        </div>
      </button>
    </div>
  );
};

export default App;
