const express = require("express") 
import {AppDataSource} from './data-source'
import routes from "./routes"

AppDataSource.initialize().then(()=>{
    const app = express()
    const PORT = process.env.PORTA || process.env.PORTA_DB
    app.use(express.json())
    app.use(routes)

    return app.listen(PORT,(()=>console.log(`App listening on port ${process.env.PORTA}`)))
})