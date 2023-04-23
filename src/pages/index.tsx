import io from "socket.io-client";
import { useState, useEffect } from "react";

let socket: any;

type Message = {
  author: string | null;
  message: string;
};

export default function Home() {
  const [username, setUsername] = useState("");
  const [chosenUsername, setChosenUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<Message>>([]);

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    // We just call it because we don't need anything else out of it
    await fetch("/api/socket");

    socket = io();

    socket.on(
      "newIncomingMessage",
      (msg: { author: string; message: string }) => {
        setMessages((currentMsg) => [
          ...currentMsg,
          { author: msg.author, message: msg.message },
        ]);
      }
    );

    socket.on("newUser", (username: string) => {
      console.log(`${username} entrou na conversa`);
      setMessages((currentMsg) => [
        ...currentMsg,
        { author: null, message: `${username} entrou na conversa` },
      ]);
    });
  };

  const defineUsername = async () => {
    socket.emit("createdUser", { username });
    setChosenUsername(username);
  };

  const sendMessage = async () => {
    socket.emit("createdMessage", { author: chosenUsername, message });
    setMessages((currentMsg) => [
      ...currentMsg,
      { author: chosenUsername, message },
    ]);
    setMessage("");
  };

  const handleKeypress = (e: any) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      if (message) {
        sendMessage();
      }
    }
  };

  return (
    <div className="flex items-center p-4 mx-auto min-h-screen justify-center bg-zinc-800">
      <main className="gap-4 flex flex-col items-center justify-center w-full h-full">
        {!chosenUsername ? (
          <form className="flex flex-col gap-3">
            <h3 className="font-bold text-white text-xl">
              Como quer ser chamado?
            </h3>
            <input
              type="text"
              placeholder="Zé da manGa"
              value={username}
              className="p-3 rounded-md outline-none"
              onChange={(e) => setUsername(e.target.value)}
            />
            <button
              onClick={defineUsername}
              className="bg-blue-500 text-white font-semibold rounded-md px-4 py-2 text-xl"
            >
              Pronto
            </button>
          </form>
        ) : (
          <>
            <p className="font-bold text-blue-500 text-xl">
              Seu Username: {username}
            </p>
            <div className="flex flex-col justify-end bg-zinc-600 h-[80vh] w-full max-w-xl rounded-md shadow-md overflow-hidden">
              <div className="h-full overflow-y-auto">
                {messages.map((msg, i) => {
                  return (
                    <div
                      className={`
                      w-fit 
                      flex  
                      flex-col
                      py-2
                      px-3
                      bg-blue-500 
                      clear-both
                      m-3
                      text-white
                      ${
                        msg.author === username
                          ? "float-right clear-both rounded-[10px_0_10px_10px]"
                          : msg.author === null
                          ? "rounded-[10px] mx-auto text-sm bg-gray-500 font-semibold"
                          : "rounded-[0_10px_10px_10px]"
                      }
                      `}
                      key={i}
                    >
                      {msg.author && msg.author !== username && (
                        <p className="text-sm font-semibold">{msg.author}</p>
                      )}
                      <p className="text-base">{msg.message}</p>
                    </div>
                  );
                })}
              </div>
              <div className="border-t w-full flex rounded-bl-md">
                <input
                  type="text"
                  placeholder="Nova messagem..."
                  value={message}
                  className="outline-none bg-zinc-400 text-zinc-800 p-3 rounded-bl-md flex-1"
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyUp={handleKeypress}
                />
                <div className="border-l  flex justify-center items-center  rounded-br-md group bg-zinc-400 hover:bg-blue-500 transition-all">
                  <button
                    className=" text-zinc-800 group-hover:text-white px-3 h-full"
                    onClick={() => {
                      sendMessage();
                    }}
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
