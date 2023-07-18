import { Sales } from "./components/Sales";

export function Home({layout}){    
    return <div className={`grid h-full gap-1.5 ${layout === "mobile" ? "grid-rows-[3fr_2fr]" : "grid-cols-[3fr_2fr]"}`}>
        <div className="grid gap-1.5 grid-rows-[2fr_3fr]">
            <div>
                <Sales data={[{x: "17 July", y: 1},{x: "18 July", y: 8},{x: "19 July", y: 5},{x: "20 July", y: 9},{x: "21", y: 11}]} layout={layout}/>
            </div>
            <div className="bg-secondary rounded-lg">#TODO Products</div>
        </div>
        <div className="bg-secondary rounded-lg">#TODO Products</div>
    </div>
}