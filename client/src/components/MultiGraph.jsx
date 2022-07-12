import { useState, useEffect } from 'react'
import Checkbox from './Checkbox'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import data from '../dummyData'
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function MultiGraph({ tickers, start, end }) {
  const [selectedTickers, setSelectedTickers] = useState(
    new Array(tickers.length).fill(false)
  )
  const [priceData, setPriceData] = useState([])
  const [graphTitle, setGraphTitle] = useState('')

  const labels = data.dates
  tickers.sort()

  useEffect(() => {
    // create temp arr for price data and populate if ticker was selected (selectedTickers[i] = True)
    const tempArr = []
    let graphTitle = ''
    for (const key in data.prices) {
      const tempPriceObj = {}
      if (selectedTickers[tickers.indexOf(key)]) {
        tempPriceObj['id'] = key
        tempPriceObj['label'] = key
        const newPrices = []
        for (let i = 0; i < data.prices[key].length; i++) {
          newPrices.push(data.prices[key][i] / data.prices[key][0])
        }
        tempPriceObj['data'] = newPrices
        tempArr.push(tempPriceObj)
        graphTitle += `${key} `
      } else {
        continue
      }
    }
    setPriceData(tempArr)
    setGraphTitle(graphTitle)
  }, selectedTickers)

  const checkboxes = tickers.map((element, idx) => {
    return (
      <Checkbox
        ticker={element}
        idx={idx}
        selectedTickers={selectedTickers}
        setSelectedTickers={setSelectedTickers}
      />
    )
  })
  return (
    <>
      <h1>Multi-Graph</h1>
      <div className="column-box">
        <div className="checkbox-column">{checkboxes}</div>
        <div className="graph-column">
          <Line
            datasetIdKey="single"
            data={{
              labels: labels,
              datasets: priceData,
            }}
            options={{
              elements: {
                point: { pointStyle: 'rect', backgroundColor: 'black' },
              },
              plugins: {
                title: {
                  display: true,
                  text: `${graphTitle}`,
                  font: { size: 30 },
                },
              },
              scales: {
                x: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Date',
                    color: 'black',
                    font: {
                      family: 'Times',
                      size: 20,
                      weight: 'bold',
                      lineHeight: 1.2,
                    },
                  },
                },
                y: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Normalized Price',
                    color: 'black',
                    font: {
                      family: 'Times',
                      size: 20,
                      weight: 'bold',
                      lineHeight: 1.2,
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </>
  )
}
