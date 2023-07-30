import { User } from 'src/users/schemas/user.schema';
import { Category } from '../schemas/card.schema';

export interface CardResponse {
  name: string;
  status: boolean;
  content: string;
  category: Category;
  user: User;
}
