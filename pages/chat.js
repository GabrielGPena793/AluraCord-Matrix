import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import { createClient } from "@supabase/supabase-js";
import React from "react";
import appConfig from "../config.json";
import { useRouter } from 'next/router';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMxNjAyNCwiZXhwIjoxOTU4ODkyMDI0fQ.g6qTrlSz8OQkJ9FIjUwfY-dliK0h2iI02-5QL0tuRmc';
const SUPABASE_URL = 'https://vqleqlwtfgfncapchqrj.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY );

function escutaMensagensEmTempoReal(adicionaMensagem){
    return supabaseClient
        .from('mensagens')
        .on('INSERT', (respostaLive) => {
            adicionaMensagem(respostaLive.new);
        })
        .subscribe();
}


export default function ChatPage() {
    // Sua lógica vai aqui
    const [mensagem, setMensagem] = React.useState("");
    const [listaDeMensagens, setListaDeMensagens] = React.useState([]);
    const roteamento = useRouter();
    const usuarioLogadao = roteamento.query.username;

    React.useEffect(() => {
        supabaseClient
            .from('mensagens')
            .select('*')
            .order('id', { ascending: false })
            .then( ({ data }) => {
                console.log("Dados da consula: ", data)
                setListaDeMensagens(data)
            });

            escutaMensagensEmTempoReal( (novaMensagem) => {
                setListaDeMensagens( (valorAtualDaLista) => {
                    return [
                        novaMensagem, 
                        ...valorAtualDaLista,
                    ]
                } );

            });
    }, []);

    function handleNewMessage(newMeassage) {
        const message = {
            de: usuarioLogadao,
            texto: newMeassage,
        };

        supabaseClient
            .from('mensagens')
            .insert([
                message
            ])
            .then( ( { data } ) => {
            });
            
        setMensagem("");
    }

    // ./Sua lógica vai aqui
    return (
        <Box
            styleSheet={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundBlendMode: "multiply",
                color: appConfig.theme.colors.neutrals["000"],
            }}
        >
            <Box
                styleSheet={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
                    borderRadius: "5px",
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: "100%",
                    maxWidth: "95%",
                    maxHeight: "95vh",
                    padding: "32px",
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: "relative",
                        display: "flex",
                        flex: 1,
                        height: "80%",
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: "column",
                        borderRadius: "5px",
                        padding: "16px",
                    }}
                >
                    <MessageList mensagens={listaDeMensagens} />

                    {/* {listaDeMensagens.map( text => {
                        return (
                            <li key={text.id}>
                              {text.de}:  {text.texto}
                            </li>
                        );
                    })} */}
                    <Box
                        as="form"
                        styleSheet={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                const value = event.target.value;
                                setMensagem(value);
                            }}
                            onKeyPress={(event) => {
                                if (event.key === "Enter") {
                                    event.preventDefault();
                                    handleNewMessage(mensagem);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: "100%",
                                border: "0",
                                resize: "none",
                                borderRadius: "5px",
                                padding: "6px 8px",
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: "12px",
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <ButtonSendSticker
                            onStickerClick={(sticker) => {
                                handleNewMessage(":sticker: " + sticker);
                            }}    
                        />
                        <Box
                            tag="button"
                            onClick={ event => {
                                event.preventDefault();
                                handleNewMessage(mensagem);

                            }}
                            styleSheet={{
                                width: "10%",
                                border: "0",
                                borderRadius: "5px",
                                padding: "14px",
                                marginBottom: "8px",
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                color: appConfig.theme.colors.neutrals[200],
                                hover: {
                                    cursor: "pointer",
                                    opacity: "0.8"
                                },
                                active: {
                                    backgroundColor: "black"
                                }

                            }}
                            >
                                Enviar
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

function Header() {
    return (
        <>
            <Box
                styleSheet={{
                    width: "100%",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Text variant="heading5">Chat</Text>
                <Button
                    variant="tertiary"
                    colorVariant="neutral"
                    label="Logout"
                    href="/"
                />
            </Box>
        </>
    );
}

function MessageList(props) {
    console.log("MessageList", props);

    function deleteMeassage(message){
        props.filter( element => element.id == message.id);
    }

    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: "scroll",
                display: "flex",
                flexDirection: "column-reverse",
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: "16px",
            }}
        >
            {props.mensagens.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            position: "relative",
                            borderRadius: "5px",
                            padding: "6px",
                            marginBottom: "12px",
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            },
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: "8px",
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                    display: "inline-block",
                                    marginRight: "8px",
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                            />
                            <Text tag="strong">{mensagem.de}</Text>
                            <Text
                                styleSheet={{
                                    fontSize: "10px",
                                    marginLeft: "8px",
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {new Date().toLocaleDateString()}
                            </Text>
                            <Image 
                                onClick={ () => {
                                    deleteMeassage(mensagem);
                                    //to-do
                                }}
                                styleSheet={{
                                    position: "absolute",
                                    right: "17px",
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                    display: "inline-block",
                                    transition: "0.3s",
                                    hover: {
                                        opacity: "0.5",
                                        cursor: "pointer"
                                        
                                    }
                                }}
                             src="https://www.imagensempng.com.br/wp-content/uploads/2021/09/Icone-X-Png-1024x1024.png"  />

                        </Box>
                        {mensagem.texto.startsWith(':sticker:') 
                        ? (
                            <Image src={ mensagem.texto.replace(':sticker:', '') } />
                        )
                        : (
                            mensagem.texto
                        )}
                    </Text>
                );
            })}
        </Box>
    );
}
