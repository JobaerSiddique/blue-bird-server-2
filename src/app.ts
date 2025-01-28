import express from 'express';
import globalErrorHandler from './app/middleware/globalErrorhandler';
import notFound from './app/middleware/notFound';
import router from './app/routes';
import cors from 'cors'
const app = express()

app.use(express.json())
app.use(cors())
app.get('/', (req, res) => {
  res.send('Blue bird server started!')
})

app.use('/api/v1', router)

app.use(globalErrorHandler)

app.use(notFound)

export default app;