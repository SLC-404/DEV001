import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>DEV001</CardTitle>
          <CardDescription>Si ves esto bonito, todo está bien instalado 🎉</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full">Funciona</Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default App