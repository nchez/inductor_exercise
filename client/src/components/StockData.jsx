import { useState, useEffect } from 'react'

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
import LineGraph from './LineGraph'
import MultiGraph from './MultiGraph'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)
const axios = require('axios')

export default function StockData({ multi, tickers, start, end, data }) {
  const [selectedStock, setSelectedStock] = useState('')
  const [stockPrices, setStockPrices] = useState([])

  useEffect(() => {
    // if stock has been selected (via dropdown), then update state with relevant price data
    if (selectedStock) {
      setStockPrices(data.prices[selectedStock])
    }
  }, [selectedStock])
  const labels = data.dates

  tickers.sort()
  const handleChange = async (e) => {
    // update selectedstock state to show what's been selected with dropdown
    if (e.target.value === '') {
      setSelectedStock('')
    }
    setSelectedStock(e.target.value)
    // TO-DO *** Get api call working -- issue with proxy, keeps calling to localhost:3000 instead of defined proxy in package.json
    // 6:24 PM update -- finally got it working, not enough time to integrate in app
    // const response = await fetch(
    //   `http://127.0.0.1:5000/stock_data/single/${e.target.value.toLowerCase()}?start=${start}&end=${end}`,
    //   { method: 'GET', mode: 'cors' }
    // )

    // const formattedResponse = response.json()
    // console.log(formattedResponse)
  }
  const startYear = <h3>Starting year: {start}</h3>
  const endYear = <h3>Ending year: {end}</h3>

  const dropDown = (
    <label>
      Choose Stock
      <select value={selectedStock} name={'stock'} onChange={handleChange}>
        <option key={`initial-blank-index`} value={''}>
          ----
        </option>
        {tickers.map((option, idx) => (
          <option key={`dropdown-index-${idx}`} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
  return (
    <div className="stock-data-div">
      <h1>Stock Data</h1>
      {start ? startYear : null}
      {end ? endYear : null}
      {multi ? null : dropDown}
      {!multi ? (
        <LineGraph
          selectedStock={selectedStock}
          labels={labels}
          stockPrices={stockPrices}
        />
      ) : (
        <MultiGraph tickers={tickers} />
      )}
    </div>
  )
}
