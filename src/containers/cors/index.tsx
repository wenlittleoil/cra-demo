import axios from "axios"
import { useEffect } from "react"

const Index = () => {
  useEffect(() => {
    axios.put('http://localhost:3001/api/hello').then(console.log).catch(console.log)
  }, [])
  return (
    <div>cors跨域</div>
  )
}
export default Index