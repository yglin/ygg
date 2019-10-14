import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactViewComponent } from './contact-view.component';
import { Contact } from '../contact';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ContactViewPageObject } from './contact-view.component.po';
import { AngularJestTester } from '@ygg/shared/test/angular-jest';

class ContactViewPageObjectAngularJest extends ContactViewPageObject {
  tester: AngularJestTester;

  constructor(parentSelector: string, tester: AngularJestTester) {
    super(parentSelector);
    this.tester = tester;
  }

  expectValue(contact: Contact) {
    this.tester.expectTextContent(this.getSelector('name'), contact.name);
    if (contact.phone) {
      this.tester.expectTextContent(this.getSelector('phone'), contact.phone);
    }
    if (contact.email) {
      this.tester.expectTextContent(this.getSelector('email'), contact.email);
    }
    if (contact.lineID) {
      this.tester.expectTextContent(this.getSelector('lineID'), contact.lineID);
    }
  }
}

describe('ContactViewComponent', () => {
  let component: ContactViewComponent;
  let fixture: ComponentFixture<ContactViewComponent>;
  let debugElement: DebugElement;
  let pageObject: ContactViewPageObjectAngularJest;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactViewComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    const tester = new AngularJestTester({fixture, debugElement});
    pageObject = new ContactViewPageObjectAngularJest('', tester);
    fixture.detectChanges();
  });

  it('should show correct data', async done => {
    const testContact = Contact.forge();
    component.contact = testContact;
    await fixture.whenStable();
    fixture.detectChanges();
    pageObject.expectValue(testContact);
    done();
  });
});
