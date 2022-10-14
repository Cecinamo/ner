import {
  Flex,
  Button,
  IconButton,
  Stack,
  HStack,
  VStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Thead,
  Tbody,
  Table,
  Tr,
  Th,
  Td,
  Box
} from "@chakra-ui/react";
import { useContext } from "react";
import { CLIENT, StateContext } from "../../config/constants";
import { BaseForm } from "./BaseForm";
import { RiArrowLeftLine } from "react-icons/ri";
import { Heatmap, Bar } from '../../plots';


export function Report({ data, onClose, ...rest }) {
  console.log('report')
  const _state = useContext(StateContext);
  const chartMargins = { top: 20, right: 10, bottom: 70, left: 20 };
  if (!data) return null;
  const cm = data.test_report.confusion_matrix.values;
  const labels = data.test_report.confusion_matrix.labels;
  const creport = data.test_report.classification_report;
  const creport_cols = Object.keys(creport[0]);
  const distro = data.tdist.hist;
  console.log('QUI');
  return (
    <Stack w="100%" h="100%" spacing="1rem" color='#A9A9A9'>
    <IconButton
          align="left"
          size="sm"
          w="30px"
          h="30px"
          borderRadius={"full"}
          bg='#222222'
          icon={<RiArrowLeftLine />}
          onClick={onClose}
        />
        <HStack w="100%" h="50vh" spacing="2rem">
            <Flex bg="#222222" color='white' borderRadius={"10px"} w="100%" h="100%">
                <VStack w="100%" h="100%" spacing=".1rem">
                    <Text size="xs" color='#A9A9A9' pl="1rem" pt="1rem" w="100%"><b> Model information </b></Text>

                </VStack>
            </Flex>
            <Flex bg="#222222" color='white' borderRadius={"10px"} w="100%" h="100%">
                <VStack w="100%" h="100%" spacing=".1rem">
                    <Text size="xs" color='#A9A9A9' pl="1rem" pt="1rem" w="100%"><b> Distro </b></Text>
                    <Bar data={distro} />
                </VStack>
            </Flex>
        </HStack>
        <HStack w="100%" h="50vh" spacing="2rem">
            <Flex bg="#222222" color='white' borderRadius={"10px"} w="100%" h="100%">
                <VStack w="100%" h="100%" spacing=".1rem">
                    <Text size="xs" color='#A9A9A9' pl="1rem" pt="1rem" w="100%"><b> Confusion Matrix </b></Text>
                    <Heatmap data={cm} labels={labels} />
                </VStack>
            </Flex>

            <Flex bg="#222222" color='white' borderRadius={"10px"} w="100%" h="100%">
                <VStack w="100%" h="100%" spacing="2rem">
                    <Text size="xs" color='#A9A9A9' pl="1rem" pt="1rem" w="100%"><b> Classification report </b></Text>
                    <Table size="sm" color='#A9A9A9' w="90%" h="70%">
                        <Thead>
                            <Tr>
                                {creport_cols.map((el, i) => (
                                    <Td borderColor="gray.600" fontSize={"xs"} key={i}>
                                    <b>
                                    {el}
                                    </b>
                                    </Td>))}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {creport.map((row, i) => {
                                return(
                                    <Tr key={i+1}>
                                    {Object.values(row).map((c, j) => (<Td borderColor="gray.600" fontSize={"xs"} key={i+j+5}>
                                                            {c}
                                                       </Td>))}
                                    </Tr>)})}
                        </Tbody>
                    </Table>
                </VStack>
            </Flex>
        </HStack>
    </Stack>
  );
}