import { v4 as uuid } from "uuid"

export class Task {
  public readonly id: string
  constructor(public title: string, public description: string) {
    this.id = uuid()
    this.validate()
  }

  static create(data: Omit<Task, "id">) {
    return new Task(data.title, data.description)
  }

  private validate() {
    if (!this.title) {
      throw new Error("Title is required")
    }
  }
}
