import logo from './logo.svg'
import './App.css'
import StockData from './components/StockData'
import data from './dummyData'

function App() {
  return (
    <div className="App">
      <StockData
        multi={false}
        tickers={['GOOG', 'QQQ', 'AAPL']}
        start={'2012'}
        end={'2013'}
        data={data}
      />
    </div>
  )
}

export default App
