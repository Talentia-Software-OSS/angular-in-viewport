import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs';
// create a symbol identify the observable I add to
// the component so it doesn't conflict with anything.
// I need this so I'm able to add the desired behaviour to the component.
export const destroy$ = Symbol('destroy$');
/**
 * An operator that takes until destroy it takes a components this a parameter
 * returns a pipeable RxJS operator.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const untilDestroy = function(component: any) {
    if (component[destroy$] === undefined) {
        // only hookup each component once.
        addDestroyObservableToComponent(component);
    }
    // pipe in the takeUntil destroy$ and return the source unaltered
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return takeUntil<any>(component[destroy$]);
};
/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function addDestroyObservableToComponent(component: any): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component[destroy$] = new Observable<any>(function(observer) {
        const originalDestroy = component.ngOnDestroy;
        if (originalDestroy == null) {
            // Angular does not support dynamic added destroy methods
            // so make sure there is one.
            throw new Error('untilDestroy operator needs the component to have an ngOnDestroy method');
        }
        // replace the ngOndestroy
        component.ngOnDestroy = function () {
            // fire off the destroy observable
            observer.next(undefined);
            // complete the observable
            observer.complete();
            // and at last, call the original destroy
            originalDestroy.call(component);            
        };
        // return cleanup function.
        return function () { return (component[destroy$] = undefined); };
    });
}
