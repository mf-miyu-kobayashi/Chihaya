"use client";

import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

function App() {
  const [kimariji, setKimariji] = useState<string[]>([]);

  useEffect(() => {
    fetch("/Book1.txt")
      .then((response) => response.text())
      .then((text) => {
        const data = text.split("\n");
        setKimariji(data);
      });
  }, []);

  return (
    <Box>
      {kimariji.map((item, index) => (
  <Typography
    key={index}
    sx={{
      fontSize: `${10 + index * 2}px`,
    }}
  >
    {item}
  </Typography>
))}
    </Box>
  );
}

export default App;