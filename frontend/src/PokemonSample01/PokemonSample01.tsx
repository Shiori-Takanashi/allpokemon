// PokemonSample01/PokemonSample01.tsx
import React from "react";
import { Box } from "@chakra-ui/react";

interface NameProps {
  message: string;
}

const HelloComponent: React.FC<NameProps> = ({ message }) => {
  return (
    <Box textAlign="center">
      <h1>こんにちは！</h1>
      <h2>{message}さん！</h2>
    </Box>
  );
};

export default HelloComponent;
