export interface ICar {
  name: string;
  color: string;
  id: string;
}

export interface IWinner {
  id: number;
  wins: number;
  time: number;
}

export interface IWinnerWithCars extends IWinner {
  color: string;
  name: string;
}

export interface IStartEngine {
  velocity: number;
  distance: number;
}

export interface IStopEngine {
  velocity: number;
  distance: number;
}

export interface IStartDrive {
  success: boolean;
}
