import {  Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ReservationsRepository } from './reservations.repository';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PAYMENTS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map } from 'rxjs';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE)
    private readonly paymentsService: ClientProxy,
  ) {}

  async create(createReservationDto: CreateReservationDto, userId: string) {
    return this.paymentsService
    .send('create_charge', {
      ...createReservationDto.charge
    })
    .pipe(
      map((res) => {
        return this.reservationsRepository.create({
          ...createReservationDto,
          invoiceId: res.id,
          timestamp: new Date(),
          userId,
        });
      }),
    );
    
  }

  async findAll() {
    return this.reservationsRepository.find({});
  }

  async findOne(_id: string) {
    return this.reservationsRepository.findOneByFilter({ _id } as any);
  }

  async update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate(
      { _id } as any,
      { $set: updateReservationDto } as any,
    );
  }

  async remove(_id: string) {
    return this.reservationsRepository.findOneAndDelete({ _id } as any);
  }
}
