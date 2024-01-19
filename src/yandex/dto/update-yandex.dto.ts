import { PartialType } from '@nestjs/mapped-types'
import { YandexDto } from './create-yandex.dto'

export class UpdateYandexDto extends PartialType(YandexDto) {}
