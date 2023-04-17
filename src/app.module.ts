import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { FoodModule } from './food/food.module'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'

@Module({
	imports: [ConfigModule.forRoot(), FoodModule, AuthModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
