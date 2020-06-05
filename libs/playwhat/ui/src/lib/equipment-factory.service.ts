import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, Subscription, Subject } from 'rxjs';
import {
  TheThing,
  TheThingCell,
  TheThingRelation,
  TheThingImitation
} from '@ygg/the-thing/core';
import { TheThingFactoryService } from '@ygg/the-thing/ui';
import { ImitationEquipment } from '@ygg/playwhat/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { tap, take, map } from 'rxjs/operators';
import { extend } from 'lodash';
import { EmceeService } from '@ygg/shared/ui/widgets';
import { AlertType } from '@ygg/shared/infra/core';

@Injectable({
  providedIn: 'root'
})
export class EquipmentFactoryService implements OnDestroy, Resolve<TheThing> {
  theThing$: BehaviorSubject<TheThing> = new BehaviorSubject(null);
  theThing: TheThing;
  cacheCreated: TheThing;
  createFor$: Subject<TheThing>;
  subscriptions: Subscription[] = [];

  constructor(
    private theThingFactory: TheThingFactoryService,
    private emcee: EmceeService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    const id = route.paramMap.get('id');
    if (id === 'create') {
      console.log(id);
      return this.create();
    } else if (id === 'edit') {
      return this.loadTheOne();
    } else if (!!id) {
      return this.load(id);
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  setMeta(value: { [key: string]: any }): void {
    extend(this.theThing, value);
  }

  async loadTheOne(): Promise<Observable<TheThing>> {
    if (!this.theThing) {
      this.theThing = await this.create();
    }
    this.theThing$.next(this.theThing);
    return this.theThing$;
  }

  async createForRelation(
    subject: TheThing,
    imitation: TheThingImitation
  ): Promise<TheThing> {
    console.log(imitation.routePath);
    const routeChange: boolean = await this.router.navigate([
      '/',
      imitation.routePath,
      'create'
    ]);
    if (!routeChange) {
      throw new Error(`Faied to route to /${imitation.routePath}/create`);
    }
    if (!this.createFor$) {
      this.createFor$ = new Subject();
    }
    return this.createFor$
      .pipe(
        take(1),
        map(object => {
          subject.addRelation(
            new TheThingRelation({
              name: imitation.name,
              subjectId: this.theThing.id,
              objectId: object.id
            })
          );
          return subject;
        })
      )
      .toPromise();
  }

  async create(): Promise<TheThing> {
    if (!this.cacheCreated) {
      this.cacheCreated = await this.theThingFactory.create({
        imitationId: ImitationEquipment.id
      });
    }
    this.theThing = this.cacheCreated;
    return this.theThing;
  }

  setCell(cell: TheThingCell): void {
    this.theThing.upsertCell(cell);
    this.theThing$.next(this.theThing);
  }

  async load(id: string): Promise<TheThing> {
    return this.load$(id)
      .pipe(take(1))
      .toPromise();
  }

  load$(id: string): Observable<TheThing> {
    return this.theThingFactory
      .load$(id)
      .pipe(tap(theThing => (this.theThing = theThing)));
  }

  async save() {
    const confirm = await this.emcee.confirm(
      `確定要儲存 ${this.theThing.name} ？`
    );
    if (!confirm) {
      return;
    }
    await this.theThingFactory.save(this.theThing, {
      requireOwner: true
    });
    await this.emcee.alert(`已成功儲存 ${this.theThing.name}`, AlertType.Info);
    // this.theThing = undefined;
    if (!!this.cacheCreated && this.theThing.id === this.cacheCreated.id) {
      this.cacheCreated = undefined;
    }
    if (this.createFor$) {
      this.createFor$.next(this.theThing);
      this.createFor$.complete();
      this.createFor$ = undefined;
      console.log('Save for relation create');
    } else {
      this.router.navigate([
        '/',
        ImitationEquipment.routePath,
        this.theThing.id
      ]);
    }
    return;
  }

  deleteCell(cellName: string) {
    this.theThing.deleteCell(cellName);
  }
}
