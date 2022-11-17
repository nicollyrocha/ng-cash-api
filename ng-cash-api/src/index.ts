import express from "express"
import {AppDataSource} from './data-source'
import 'dotenv/config'
import routes from "./routes"

AppDataSource.initialize().then(()=>{
    const app = express()

    app.use(express.json())
    app.use(routes)

    return app.listen(process.env.PORTA,(()=>console.log(`App listening on port ${process.env.PORTA}`)))
})