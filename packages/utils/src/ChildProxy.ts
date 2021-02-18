import { ResultAsync } from "neverthrow";
import Postmate from "postmate";
import { PostmateError } from "./errors/PostmateError";

export interface IIFrameCallData<T> {
  callId: number;
  data: T;
}

class IFrameCallData<T> implements IIFrameCallData<T> {
  constructor(public callId: number, public data: T) {}
}

export abstract class ChildProxy {
  protected parent: Postmate.ChildAPI | undefined;

  protected abstract getModel(): Postmate.Model;

  protected abstract onModelActivated(parent: Postmate.ChildAPI): void;

  public activateModel(): ResultAsync<Postmate.ChildAPI, PostmateError> {
    const handshake = this.getModel();

    return ResultAsync.fromPromise(
      handshake.then((initializedParent) => {
        this.parent = initializedParent;
        this.onModelActivated(initializedParent);
        return initializedParent;
      }),
      (e) => e as PostmateError,
    );
  }

  protected returnForModel<T, E>(func: () => ResultAsync<T, E>, callId: number) {
    func().match(
      (result) => {
        if (this.parent != null) {
          this.parent.emit("callSuccess", new IFrameCallData(callId, result));
        }
      },
      (e) => {
        if (this.parent != null) {
          console.error(e);
          this.parent.emit("callError", new IFrameCallData(callId, e));
        }
      },
    );
  }
}
