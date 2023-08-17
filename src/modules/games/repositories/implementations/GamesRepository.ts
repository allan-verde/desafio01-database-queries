import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
    .createQueryBuilder("games")
    // Complete usando query builder
    .where("games.title ilike :param", { param: `%${param}%` })
    .getMany()    
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const games = await this.repository.query(`SELECT * FROM GAMES`); // Complete usando raw query
    
    return [{ count: String(games.length) }]
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const game = await this.repository
      .createQueryBuilder("games")
      // Complete usando query builder
      .leftJoinAndSelect("games.users", "users")
      .where("games.id = :id", { id })
      .getOne()

    const users = game?.users || []

    return users
  }
}
