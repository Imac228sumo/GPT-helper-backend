import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
// import * as session from 'express-session'
// import * as passport from 'passport'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.setGlobalPrefix('api')

	// app.use(
	// 	session({
	// 		secret: 'keyword',
	// 		resave: false,
	// 		saveUninitialized: false,
	// 	})
	// )
	// app.use(passport.initialize())
	// app.use(passport.session())

	app.use(cookieParser())

	app.enableCors({
		exposedHeaders: 'set-cookie',
		credentials: true,
		origin: [
			'http://localhost:3000',
			'https://gpt-helper-frontend-production.up.railway.app',
		],
	})

	await app.listen(process.env.PORT || 4200)
}
bootstrap()
