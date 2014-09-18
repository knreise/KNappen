/// <reference path="../_References.ts" />

module System.Utils {

    export class WorkQueueItem<T> {

        public work: T;

        public doWork: (work: T) => void;

        public wait: (work: T) => boolean;

        constructor(work: T, doWork: (work: T) => void, wait: (work: T) => boolean = (item) => false) {
            this.work = work;
            this.doWork = doWork;
            this.wait = wait;
        }

    }

    export class WorkQueueState {
        public aborted: boolean = false;
    }

    export class WorkHelper {

        public static processWork<T>(queue: Array<WorkQueueItem<T>>, state: WorkQueueState, callback: (finished: boolean) => void, initialTimeout: number = 35): void {
            setTimeout(() => WorkHelper.processItemsHandle<T>(queue, state, callback), initialTimeout);
        }

        private static processItemsHandle<T>(queue: Array<WorkQueueItem<T>>, state: WorkQueueState, callback: (finished: boolean) => void) {

            var wait: boolean = false;

            if (queue.length > 0 && !state.aborted) {
                var nextItem = queue[0];

                wait = nextItem.wait != null && nextItem.wait(nextItem.work);

                if (!wait) {
                    queue.shift();
                    nextItem.doWork(nextItem.work);
                }
            }

            if (!state.aborted && (wait || queue.length > 0)) {
                setTimeout(() => WorkHelper.processItemsHandle(queue, state, callback), 35);
            }
            else {
                if (callback) {
                    callback(!state.aborted);
                }
            }
        }
    }
}