import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentService {
  findUserComments(userId: string) {
    return 'this are the comments of the user with id: ' + userId;
  }
}
