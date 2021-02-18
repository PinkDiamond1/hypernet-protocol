import { IAjaxUtils } from "./IAjaxUtils";
import axios from "axios";
import {AxiosResponse} from "axios";
import { ResultAsync } from "neverthrow";

export class AxiosAjaxUtils implements IAjaxUtils {
  get<T, E>(url: URL, config?: any): ResultAsync<T, E> {
    return ResultAsync.fromPromise(axios.get(url.toString(), config), (e) => e as E)
    .map((response: AxiosResponse<T>) => {
      return response.data;
    });
  }
  post<T, E>(url: URL, data: any, config?: any): ResultAsync<T, E> {
    return ResultAsync.fromPromise(axios.post(url.toString(), data, config), (e) => e as E)
    .map((response: AxiosResponse<T>) => {
      return response.data;
    });
  }
}
