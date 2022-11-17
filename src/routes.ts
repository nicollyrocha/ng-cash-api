import {Router, Request, Response} from 'express'
import { AccountsController } from './controller/accountsController'

const routes = Router()

routes.get('/api/home', (request: Request, response: Response)=>{
    return response.json({message: 'Hello World!'})
})

routes.post('/account', new AccountsController().create)

export default routes