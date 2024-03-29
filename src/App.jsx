import { useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import * as Screens from "./screens"
import { WebSocketConnection } from "./data/ws";


//Temporary (Example / Test) code for websocket connection
const ws = new WebSocketConnection()

ws.useAuth((event)=>{
  return new Promise((resolve)=>{
    console.log("Got a request for credential")
    resolve({
      type: 0,
      username: "aoi",
      password: "pass"
    })
  })
})

ws.useDataUpdates((data)=>{
  console.log("Data updated: ", data)
})

function App() {
  const [page, setPage] = useState("home")
  const [screenSize, setScreenSize] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const layout = screenSize.height / screenSize.width > 6/5 ? "mobile" : "desktop"

  const Screen = {
    home: Screens.Home,
    products: Screens.Products,
    create: Screens.Create,
    account: Screens.Account
  }[page]

  return (
    <div className="grid grid-rows-[auto,1fr] gap-1.5 h-screen bg-background p-2">
      <Navbar layout={layout} page={page} navigateTo={setPage}/>
      <section className="h-full"><Screen layout={layout}/></section>
    </div>
  );
}

export default App;
