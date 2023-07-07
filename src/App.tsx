import {
  For,
  type Component,
  createSignal,
  createEffect,
  Index,
} from "solid-js";
import Cell from "./Cell";
import { Motion } from "@motionone/solid";

const App: Component = () => {
  const [grid, setGrid] = createSignal(
    new Array(25)
      .fill(0)
      .map(() => new Array(25).fill(0).map(() => Math.floor(Math.random() * 2)))
  );

  const [mode, setMode] = createSignal<"play" | "edit">("play");

  createEffect(() => {
    // when z is pressed, switch modes
    document.addEventListener("keydown", (e) => {
      if (e.key === "z") {
        setMode(mode() === "play" ? "edit" : "play");
      }
    });
  });

  return (
    <div class="w-[100vw] h-[100vh] flex flex-col items-center justify-center">
      <Motion
        class="flex flex-col"
        animate={{
          gap: mode() === "play" ? "0px" : "5px",
        }}
      >
        <Index each={grid()}>
          {(item, indexX) => (
            <Motion
              class="flex space-between"
              animate={{
                gap: mode() === "play" ? "0px" : "5px",
              }}
            >
              <Index each={item()}>
                {(item, indexY) => (
                  <Motion.span
                    animate={{
                      width: "40px",
                      height: "40px",
                      background: item() ? "black" : "white",
                    }}
                    initial={{
                      width: "0px",
                      height: "0px",
                      background: "transparent",
                    }}
                    transition={{
                      duration: 1,
                      delay: 0.2 + indexX * 0.01 + indexY * 0.01,
                    }}
                  ></Motion.span>
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
