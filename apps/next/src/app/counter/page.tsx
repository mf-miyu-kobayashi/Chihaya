"use client";

import { useState } from "react";
import Link from "next/link";

function App() {
  const [count, setCount] = useState(0);

  const plus = () => {
    setCount(count + 1);
  };

  const minus = () => {
    setCount(count - 1);
  };

  const reset = () => {
    setCount(0);
  };

  const random = () => {
    setCount(Math.floor(Math.random() * 100));
  };

  const dummy = () => {
    setCount(count);
  };

  return (
    <>
      <h1>{count}</h1>

      <button onClick={plus}>カウントボタン</button>
      <button onClick={minus}>マイナスボタン</button>
      <button onClick={reset}>リセットボタン</button>
      <button onClick={random}>ランダムボタン</button>
      <button onClick={dummy}>ただのボタン</button>

      <br />

      <Link href="/new">
        新しいページへ
      </Link>
    </>
  );
}

export default App;