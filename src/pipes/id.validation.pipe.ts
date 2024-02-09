import {
	ArgumentMetadata,
	BadRequestException,
	PipeTransform,
} from '@nestjs/common'
import { isNumber } from 'class-validator'

export class IdValidationPipe implements PipeTransform {
	transform(value: number, metadata: ArgumentMetadata) {
		if (metadata.type !== 'param') return value
		if (isNumber(+value) && +value >= 0) return value
		throw new BadRequestException('Invalid format id')
	}
}
