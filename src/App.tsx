import { Flex } from "@chakra-ui/react";
import { Imap } from "./Imap";
import { Pop } from "./Pop";

export const App = () => {
  return (
    <Flex>
      <Imap /> <Pop />
    </Flex>
  );
};
