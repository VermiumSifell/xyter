import { IEventOptions } from "./EventOptions";

export interface IEvent {
  options: IEventOptions;
  execute: (...args: any[]) => Promise<void>;
}
