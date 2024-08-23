import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import * as express from 'express'
import { join } from 'path'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.setGlobalPrefix('api')
	app.use(cookieParser())
	app.use('/uploads', express.static(join(__dirname, '..', 'uploads')))
	app.enableCors({
		exposedHeaders: 'set-cookie',
		credentials: true,
		origin: ['http://localhost:3000', process.env.ORIGIN],
	})

	await app.listen(process.env.PORT || 4200)
}
bootstrap()
