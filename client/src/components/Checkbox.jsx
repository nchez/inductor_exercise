import { useEffect, useState } from 'react'

export default function Checkbox({
  ticker,
  idx,
  selectedTickers,
  setSelectedTickers,
}) {
  const [checked, setChecked] = useState(false)

  const handleCheck = () => {
    setChecked(!checked)
    const newArr = selectedTickers.slice()
    newArr[idx] = !newArr[idx]
    setSelectedTickers(newArr)
  }
  return (
    <label
      key={`checkbox-index-${idx}`}
      className={checked ? 'selected-stock' : ''}
    >
      <input type="checkbox" onChange={handleCheck} />
      {ticker}
    </label>
  )
}
