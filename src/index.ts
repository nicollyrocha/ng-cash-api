import express from 'express'
import { resolve } from 'path'
import { AppDataSource } from './data-source'

AppDataSource.initialize().then(()=>{
    const app = express()

    app.use(express.json())

    app.get('/', (req, res)=>{
        return res.json('TUDO OK POR AQUI')
    })

    return app.listen(process.env.PORT,  () => {
        console.log(`API started at port ${process.env.PORT}`);
    });
    
})