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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
)

export default function LineGraph({ stockPrices, selectedStock, labels }) {
  return (
    <div className="line-graph-div">
      <Line
        datasetIdKey="single"
        data={{
          labels: labels,
          datasets: [{ id: 1, label: `${selectedStock}`, data: stockPrices }],
        }}
        options={{
          elements: {
            point: { pointStyle: 'rect', backgroundColor: 'black' },
          },
          plugins: {
            title: {
              display: true,
              text: `${selectedStock}`,
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
                text: 'Price',
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
  )
}
