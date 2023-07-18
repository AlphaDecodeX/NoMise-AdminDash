import Chart from "chart.js/auto"
import { Line } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import { useLayoutEffect, useRef, useState } from "react";

Chart.register(CategoryScale);

/**
 * @typedef {Object} SalesDataItem
 * @property {string} x - The x value as a string.
 * @property {number} y - The y value as a number.
 */

/**
 * Sales component displays sales data.
 *
 * @param {Object} props - Component props.
 * @param {SalesDataItem[]} props.data - Array of sales data items.
 * @returns {JSX.Element} Rendered component.
 */
export function Sales({data, layout}) {
    const parentRef = useRef(null)
    const [chartAspectRatio, setChartAspectRatio] = useState(null)

    useLayoutEffect(()=>{
        if(!parentRef.current)  return
        const handleChartParentResize = () =>{
            setChartAspectRatio(parentRef.current.clientWidth / parentRef.current.clientHeight)
        }
        window.addEventListener('resize', handleChartParentResize)
        handleChartParentResize()
    },[])

    const chartData = {
        datasets: [
          {
            data,
            font: "Ubuntu",
            label: 'Sales',
            borderColor: "#16ED79",
            backgroundColor: "#Afffd1",
            fill: "origin"
          },
        ],
    };

    const chartOptions = {
        aspectRatio: chartAspectRatio,
        plugins: {
            legend: {
                display: false
            },
            labels: {
                font: {
                    familty: "'Ubuntu'"
                }
            }
        }
    }

    return <div className={`grid h-full grid-rows-[auto_1fr] gap-2 ${layout === "mobile" ? "p-4 pb-2" : "p-8 pb-4"} bg-secondary rounded-lg`}>
        <span className={`${layout === "mobile" ? "" : "text-xl"}`}>Sales</span>
        <div className="h-full flex justify-center" ref={parentRef}>
            {
                chartAspectRatio ? <Line
                        data={chartData}
                        options={chartOptions}
                    /> : null   //Waiting for aspect ratio to be calculated before adding the graph
            }
        </div>
    </div>
}