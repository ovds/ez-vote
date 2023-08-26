'use client'

import {AccordionButton, Button, ChakraProvider, Input, useToast} from "@chakra-ui/react";
import {useState} from "react";
import {useRouter} from "next/navigation";
import axios from "axios"
import {Redis} from "@upstash/redis";


const App = () => {
    const [name, setName] = useState('')
    const [party, setParty] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState('')
    const [id, setId] = useState(1)

    interface Candidate {
        id: number;
        name: string;
        image: string;
        party: string;
        description: string;
    }

    const [candidates, setCandidates] = useState<Candidate[]>([])
    const toast = useToast();

    const router = useRouter()

    const startServer = async (candidates: Candidate[]) => {
        //extract names from candidates
        let names = candidates.map((c) => c.name)
        const res = await fetch('http://localhost:5000/server', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                candidates: names
            })
        })
        res.json().then(r => {
            console.log(r)
            toast({
                title: "Poll created",
                description: "Live and ready!",
                status: "success",
                duration: 3000,
                isClosable: true,
            })

            axios.post('/api/data', {
                data: candidates,
            }).then(r => {
                console.log(r)
            })
        })
    }

    return (
        <ChakraProvider>
            <div className={'w-screen- h-screen align-middle flex justify-center m-auto'}>
                <div className={'w-1/2 m-auto space-y-4'}>
                    <div className={'flex space-x-3'}>
                        <Input placeholder={'Candidate Name'} onChange={
                            (e) => {
                                setName(e.target.value)
                            }
                        }></Input>
                        <Input placeholder={'Candidate Party'} onChange={
                            (e) => {
                                setParty(e.target.value)
                            }
                        }></Input>
                    </div>
                    <div className={'flex space-x-3'}>
                        <Input placeholder={'Candidate Description'} onChange={
                            (e) => {
                                setDescription(e.target.value)
                            }
                        }></Input>
                        <Input placeholder={'Candidate Image'} onChange={
                            (e) => {
                                setImage(e.target.value)
                            }
                        }></Input>
                    </div>
                    <Button onClick={
                        () => {
                            //check that values are not empty
                            if (name === '' || party === '' || description === '' || image === '') return
                            let c = {
                                id: id,
                                name: name,
                                image: image,
                                party: party,
                                description: description
                            }
                            setId(id + 1)
                            setCandidates([...candidates, c])
                        }
                    } className={'w-full'} variant={'outline'}>Add Candidate</Button>
                    <div className={'flex space-x-4 max-w-full'}>
                        {candidates.map((candidate) => (
                            <div key={candidate.id} className={'flex space-x-3 shadow-md hover:shadow-2xl rounded-lg p-2'}>
                                <div className={"m-auto"}><p>{candidate.name}</p></div>
                                <Button onClick={
                                    () => {
                                        let newCandidates = candidates.filter((c) => c.id !== candidate.id)
                                        setCandidates(newCandidates)
                                    }
                                }>Remove</Button>
                            </div>
                        ))}
                    </div>
                    <Button onClick={() => startServer(candidates)} className={'w-full'}>Start Server</Button>
                </div>
            </div>
        </ChakraProvider>
    )
}
export default App;
