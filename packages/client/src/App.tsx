import {useQuery} from '@tanstack/react-query'
import {Button} from 'react-aria-components'
import {APP_NAME} from '@shared/sharedConstants'

export const App = () => {
  const {data, isLoading} = useQuery({
    queryKey: ['health'],
    queryFn: () => fetch('/api/health').then((res) => res.json()),
  })

  return (
    <div>
      <h1>Hello World from {APP_NAME}</h1>
      <p>Server status: {isLoading ? 'Loading...' : data?.status}</p>
      <Button onPress={() => alert('It works!')}>Click me</Button>
    </div>
  )
}
