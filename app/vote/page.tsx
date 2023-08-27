'use client'

import {
    Button,
    Box,
    Flex,
    Text,
    Image,
    useColorModeValue,
    ChakraProvider, useToast, TabPanel, TabPanels, Tab, TabList, Tabs, Center, Stack
} from '@chakra-ui/react';
import {useState} from "react";
import { sha256} from 'js-sha256';



function App() {
    interface Candidate {
        id: number;
        name: string;
        image: string;
        party: string;
        description: string;
    }

    const [isDisabled, setIsDisabled] = useState(false)
    const bg = useColorModeValue('gray.50', 'gray.700')
    const [dataJSON, setDataJSON] = useState([0, 0, 0]);
    const toast = useToast();
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate>({
        id: 0,
        name: '',
        image: '',
        party: '',
        description: ''
    })

    const candidates = [{
        id: 1,
        name: 'Dharman',
        image: 'https://yt3.googleusercontent.com/ytc/AOPolaR7NEL8EGGzbstXEZeTmGKNa9318OiCmHwkSiX5=s900-c-k-c0x00ffffff-no-rj',
        party: 'Diggers',
        description: 'I am Dharr Man'
    }, {
        id: 2,
        name: 'Song kok',
        image: 'https://i.pinimg.com/736x/08/4d/01/084d014a123f3c63df34b9a16512bc3a.jpg',
        party: 'Diggers',
        description: 'I am Abhilash'
    }, {
        id: 3,
        name: 'Ki Lian Mbappe',
        image: 'https://images2.minutemediacdn.com/image/fetch/w_736,h_485,c_fill,g_auto,f_auto/https%3A%2F%2Ftherealchamps.com%2Fwp-content%2Fuploads%2Fgetty-images%2F2017%2F07%2F1237198304-850x560.jpeg',
        party: 'Diggers',
        description: 'I am Bharat'
    }]


    const getResults = async () => {
        const data = await fetch('http://localhost:5000/decrypted_results');
        var nerding = null;
        data.json().then(r => {
            nerding = r;
            setDataJSON(r)
            console.log(r);
        });
        return nerding;
    }

    const download = async () => {
        const link = document.createElement('a');
        const data = await fetch('http://localhost:5000/chain')
        const json = await data.json();
        const file = new Blob([JSON.stringify(json)], {type: 'text/plain'});
        link.download = 'blockchain.txt';
        link.href = URL.createObjectURL(file);
        link.click();
        URL.revokeObjectURL(link.href);
    }

    const handleVote = async (candidate: any) => {
        setSelectedCandidate(candidate)
        setIsDisabled(true)
        const ip = await fetch("https://api.ipify.org?format=json");
        ip.json().then(r => {
            sendVote(r.ip, candidate.id).then(r => console.log(r));
        });
        if (!isDisabled) toast({
            title: "Voted!",
            description: `You voted for ${candidate.name}`,
            status: "success",
            duration: 3000,
            isClosable: true,
        })
    }

    const sendVote = async (ip:any, id:any) => {
        console.log("ip: " + ip);
        const res = await fetch('http://localhost:5000/vote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: sha256(ip.toString()).toString(),
                vote: id - 1
            })
        })
        if (res.status === 401) {
            toast({
                title: "Error",
                description: "You have already voted!",
                status: "error",
                duration: 3000,
                isClosable: true,
            })
        }
        const data = await res.json()
        console.log(data)
    }

    return (
        <ChakraProvider>
            <Flex
                direction="column"
                align="center"
                bg={bg}
                minH="100vh"
                justifyContent="center"
                px={4}
                className={"h-screen space-y-10 bg-slate-700 mesh"}
            >
                <Tabs className={"w-3/4 h-4/5 shadow-2xl rounded-lg bg-white mx-auto"} isFitted>
                    <TabList>
                        <Tab>Vote</Tab>
                        <Tab>Results</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            <Text fontSize="3xl" fontWeight="bold" mb={8} color="gray.700">
                                Vote for the candidate of your choice:
                            </Text>
                            <div className={"flex space-x-10"}>
                                { candidates.map((candidate) => (
                                    <Box
                                        key={candidate.id}
                                        w={['100%', '50%', '33.3%']}
                                        p={0}
                                        onClick={() => handleVote(candidate)}
                                        sx={isDisabled ? {cursor: 'not-allowed'} : {cursor: 'pointer'}}
                                        opacity={isDisabled && selectedCandidate.id !== candidate.id ? 0.5 : 1}
                                        pointerEvents={
                                            isDisabled && selectedCandidate.id !== candidate.id ? 'none' : 'auto'
                                        }
                                        bg="white"
                                        borderRadius="lg"
                                        boxShadow="md"
                                        transition="transform 0.2s"
                                        _hover={!isDisabled && {transform: 'scale(1.05)'}}
                                        className={"h-1/6"}
                                    >
                                        <Image
                                            src={candidate.image}
                                            alt={candidate.name}
                                            objectFit="cover"
                                            className={"rounded-t-lg"}
                                        />
                                        <Box p={4}>
                                            <Text fontSize="xl" fontWeight="semibold" color="gray.700">
                                                {candidate.name}
                                            </Text>
                                            <Button
                                                variant="solid"
                                                colorScheme="blue"
                                                mt={4}
                                                isDisabled={isDisabled && selectedCandidate.id !== candidate.id}
                                            >
                                                {isDisabled && selectedCandidate.id === candidate.id ? 'Voted!' : 'Vote'}
                                            </Button>
                                        </Box>
                                    </Box>
                                ))}
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <Center className={"w-full"}>
                                <Stack className={"text-center"}>
                                    {candidates.map((candidate) => (
                                        <Text key={candidate.id} fontSize="3xl" fontWeight="bold" mb={8} color="gray.700">
                                            {candidate.name}: {dataJSON[candidate.id - 1]}
                                        </Text>
                                    ))}
                                    <Button onClick={download} className={""}>Download blockchain</Button>
                                    <Button onClick={getResults} className={""}>Refresh</Button>
                                </Stack>
                            </Center>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Flex>
        </ChakraProvider>
    );
}

export default App;
