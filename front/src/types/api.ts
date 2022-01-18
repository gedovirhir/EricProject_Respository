import {SendRequestsToBuyDto} from "./dto";

export interface IApiService {
  sendRequestsToBuy(url: string, amountOfRequests: number): Promise<SendRequestsToBuyDto>;
}
