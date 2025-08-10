import type { EntityId, Timestamp } from '../../../shared/types';

export class User {
  constructor(
    public readonly id: EntityId,
    public readonly username: string,
    public readonly email: string,
    public readonly createdAt: Timestamp,
    public readonly lastLoginAt?: Timestamp,
    public readonly isActive: boolean = true
  ) {
    this.validateUser();
  }

  private validateUser(): void {
    if (!this.username.trim()) {
      throw new Error('Username cannot be empty');
    }

    if (this.username.length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }

    if (!this.isValidEmail(this.email)) {
      throw new Error('Invalid email format');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public updateLastLogin(): User {
    return new User(this.id, this.username, this.email, this.createdAt, new Date(), this.isActive);
  }

  public deactivate(): User {
    return new User(this.id, this.username, this.email, this.createdAt, this.lastLoginAt, false);
  }

  public equals(other: User): boolean {
    return this.id === other.id;
  }
}
