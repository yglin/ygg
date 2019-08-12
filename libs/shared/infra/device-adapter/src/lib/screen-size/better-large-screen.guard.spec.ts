import { TestBed, async, inject } from '@angular/core/testing';

import { BetterLargeScreenGuard } from './better-large-screen.guard';

describe('BetterLargeScreenGuard', () => {
  let guard: BetterLargeScreenGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BetterLargeScreenGuard]
    });
  });

  beforeEach(() => {
    guard = TestBed.get(BetterLargeScreenGuard);
  });
  

  it('canActivate() and canActivateChild() should both call naggingAboutSize()', async done => {
    jest.spyOn(guard, 'naggingAboutSize').mockImplementation(() => true);
    guard.canActivate();
    guard.canActivateChild();
    expect(guard.naggingAboutSize).toHaveBeenCalledTimes(2);
    done();
  });

  it('If window size large enough, no nagging, just return true', () => {
    // Set window size to guard's betterSize
    Object.defineProperty(window, 'innerWidth', {writable: true, configurable: true, value: guard.betterSize.width});
    Object.defineProperty(window, 'innerHeight', {writable: true, configurable: true, value: guard.betterSize.height});
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    expect(guard.naggingAboutSize()).toBe(true);
    expect(window.confirm).not.toHaveBeenCalled();
  });
  
  it('If window size not large enough, nagging user to confirm continue', () => {
    // Set window size to guard's betterSize
    Object.defineProperty(window, 'innerWidth', {writable: true, configurable: true, value: guard.betterSize.width - 1});
    Object.defineProperty(window, 'innerHeight', {writable: true, configurable: true, value: guard.betterSize.height - 1});
    jest.spyOn(window, 'confirm').mockImplementation(() => false);
    expect(guard.naggingAboutSize()).toBe(false);
    expect(window.confirm).toHaveBeenCalledWith(guard.getConfirmMessage());
  });  
});
