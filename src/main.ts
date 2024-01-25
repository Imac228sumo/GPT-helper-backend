import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import * as session from 'express-session'
import * as passport from 'passport'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.setGlobalPrefix('api')

	app.use(
		session({
			secret: 'keyword',
			resave: false,
			saveUninitialized: false,
		})
	)
	app.use(passport.initialize())
	app.use(passport.session())
	app.use(cookieParser())

	app.enableCors({
		exposedHeaders: 'set-cookie',
		credentials: true,
		origin: ['http://localhost:3000', process.env.ORIGIN],
	})

	await app.listen(process.env.PORT || 4200)
}
bootstrap()
