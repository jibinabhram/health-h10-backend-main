import { Controller, Post, Body, Get } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignCoachPodPlayerDto } from './dto/assign-coach-pod-player.dto';

@Controller('assignments')
export class AssignmentsController {
  constructor(private svc: AssignmentsService) {}

  @Post()
  assign(@Body() dto: AssignCoachPodPlayerDto) {
    return this.svc.assign(dto);
  }

  @Get()
  findAll() {
    return this.svc.findAll();
  }
}
