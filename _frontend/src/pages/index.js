// pages/index.js
import { ChakraProvider, Container, Heading } from "@chakra-ui/react";
import PokemonSpeedTable from "../components/PokemonSpeedTable";
import PokemonList from "@/components/PokemonList";

export default function Home() {
  return (
    <ChakraProvider>
        <PokemonList />
    </ChakraProvider>
  );
}